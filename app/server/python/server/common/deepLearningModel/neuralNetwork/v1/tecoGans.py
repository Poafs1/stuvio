import os, math, time, collections, sys, shutil, subprocess
import numpy as np
import random as rn

from common.deepLearningModel.model.tecoGans.v1.lib.ops_v2 import *
from common.deepLearningModel.model.tecoGans.v1.lib.dataloader import inference_data_loader, frvsr_gpu_data_loader
from common.deepLearningModel.model.tecoGans.v1.lib.frvsr_v2 import generator_F, fnet
from common.deepLearningModel.model.tecoGans.v1.lib.Teco import FRVSR, TecoGAN

import tensorflow as tf
import tensorflow_addons as tfa
import tf_slim as slim
from tensorflow.python.util import deprecation
tf.compat.v1.disable_eager_execution()
deprecation._PRINT_DEPRECATION_WARNINGS = False

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['PYTHONHASHSEED'] = '0'

class TecoGans:
    # Init TecoGans class and variable
    def __init__(self, video_id, model, model_version):
        self.id = video_id
        self.model = model
        self.cudaID = 0
        self.num_resblock = 16
        self.mode = "inference"
        self.output_ext = 'png'

        cwd = os.getcwd()
        self.checkpoint = os.path.join(cwd, 'server/common/deepLearningModel/model/tecoGans', 'v{}'.format(str(model_version)), model, 'TecoGAN')
        self.input_dir_LR = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img/original-frame')
        self.input_dir_HR = None

        self.super_resolution_dir = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img/super-resolution')
        logs_dir = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img/logs')
        
        if os.path.exists(self.super_resolution_dir) is False:
            os.mkdir(self.super_resolution_dir)
        if os.path.exists(logs_dir) is False:
            os.mkdir(logs_dir)

        self.output_dir = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img')
        self.summary_dir = logs_dir
        self.output_sub_dir = 'super-resolution'

        self.rand_seed = 1
        self.input_dir_len = -1
        self.output_name = "%d"%0
        self.output_pre = 'super-resolution'
        self.pre_trained_model = False
        self.vgg_ckpt = None
        self.queue_thread = 6
        self.name_video_queue_capacity = 512
        self.video_queue_capacity = 256
        self.video_queue_batch = 2
        
        self.RNN_N = 10
        self.batch_size = 4
        self.flip = True
        self.random_crop = True
        self.movingFirstFrame = True
        self.crop_size = 32

        self.vgg_scaling = -0.002
        self.warp_scaling = 1.0
        self.pingpang = False
        self.pp_scaling = 1.0

        pass

    # Enhance super-resolution video
    def enhance(self):
        np.random.seed(42)
        rn.seed(12345)
        tf.compat.v1.set_random_seed(1234)

        os.environ["CUDA_VISIBLE_DEVICES"] = str(self.cudaID)
        my_seed = self.rand_seed
        rn.seed(my_seed)
        np.random.seed(my_seed)
        tf.compat.v1.set_random_seed(my_seed)

        inference_data = inference_data_loader(self.input_dir_LR, self.input_dir_HR, self.input_dir_len)
        input_shape = [1,] + list(inference_data.inputs[0].shape)

        output_shape = [1,input_shape[1]*4, input_shape[2]*4, 3]
        oh = input_shape[1] - input_shape[1]//8 * 8
        ow = input_shape[2] - input_shape[2]//8 * 8
        paddings = tf.constant([[0,0], [0,oh], [0,ow], [0,0]])

        # print("input shape:", input_shape, flush=True)
        # print("output shape:", output_shape, flush=True)

        inputs_raw = tf.compat.v1.placeholder(tf.float32, shape=input_shape, name='inputs_raw')

        pre_inputs = tf.Variable(tf.zeros(input_shape), trainable=False, name='pre_inputs')
        pre_gen = tf.Variable(tf.zeros(output_shape), trainable=False, name='pre_gen')
        pre_warp = tf.Variable(tf.zeros(output_shape), trainable=False, name='pre_warp')

        transpose_pre = tf.compat.v1.space_to_depth(input=pre_warp, block_size=4)
        inputs_all = tf.concat( (inputs_raw, transpose_pre), axis = -1)
        with tf.compat.v1.variable_scope('generator'):
            gen_output = generator_F(inputs_all, 3, self.num_resblock, reuse=False)
            with tf.control_dependencies([ tf.compat.v1.assign(pre_inputs, inputs_raw)]):
                outputs = tf.compat.v1.assign(pre_gen, deprocess(gen_output))

        inputs_frames = tf.concat( (pre_inputs, inputs_raw), axis = -1)
        with tf.compat.v1.variable_scope('fnet'):
            gen_flow_lr = fnet(inputs_frames, reuse=False)
            gen_flow_lr = tf.pad(tensor=gen_flow_lr, paddings=paddings, mode="SYMMETRIC") 
            gen_flow = upscale_four(gen_flow_lr*4.0)
            gen_flow.set_shape( output_shape[:-1]+[2] )

        pre_warp_hi = tfa.image.dense_image_warp(pre_gen, gen_flow)
        before_ops = tf.compat.v1.assign(pre_warp, pre_warp_hi)

        # print('Finish building the network', flush=True)

        var_list = tf.compat.v1.get_collection(tf.compat.v1.GraphKeys.MODEL_VARIABLES, scope='generator')
        var_list = var_list + tf.compat.v1.get_collection(tf.compat.v1.GraphKeys.MODEL_VARIABLES, scope='fnet')

        weight_initiallizer = tf.compat.v1.train.Saver(var_list)

        init_op = tf.compat.v1.global_variables_initializer()
        local_init_op = tf.compat.v1.local_variables_initializer()

        config = tf.compat.v1.ConfigProto()
        config.gpu_options.allow_growth = True

        if self.output_pre == "":
            image_dir = self.output_dir
        else:
            image_dir = os.path.join(self.output_dir, self.output_pre)
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)

        with tf.compat.v1.Session(config=config) as sess:
            sess.run(init_op)
            sess.run(local_init_op)

            print('Loading weights from ckpt model', flush=True)
            weight_initiallizer.restore(sess, self.checkpoint)
            if False:
                self.printVariable('generator')
                self.printVariable('fnet')
            max_iter = len(inference_data.inputs)

            srtime = 0
            print('Frame evaluation starts!!', flush=True)
            for i in range(max_iter):
                input_im = np.array([inference_data.inputs[i]]).astype(np.float32)
                feed_dict={inputs_raw: input_im}
                t0 = time.time()
                if(i != 0):
                    sess.run(before_ops, feed_dict=feed_dict)
                output_frame = sess.run(outputs, feed_dict=feed_dict)
                srtime += time.time()-t0

                if(i >= 5):
                    name, _ = os.path.splitext(os.path.basename(str(inference_data.paths_LR[i])))
                    # filename = self.output_name+'_'+name
                    filename = name
                    print('saving image %s' % filename, flush=True)
                    out_path = os.path.join(image_dir, "%s.%s"%(filename,self.output_ext))
                    save_img(out_path, output_frame[0])
                else:
                    print("Warming up %d"%(5-i), flush=True)

        print( "total time " + str(srtime) + ", frame number " + str(max_iter) , flush=True)

        return

    def printVariable(self, scope, key=tf.compat.v1.GraphKeys.MODEL_VARIABLES):
        print("Scope %s:" % scope, flush=True)
        variables_names = [ [v.name, v.get_shape().as_list()] for v in tf.compat.v1.get_collection(key, scope=scope)]
        total_sz = 0
        for k in variables_names:
            print ("Variable: " + k[0], flush=True)
            print ("Shape: " + str(k[1]), flush=True)
            total_sz += np.prod(k[1])
        print("total size: %d" %total_sz, flush=True)