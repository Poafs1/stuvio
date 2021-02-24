import os, math
import numpy as np
from tqdm import tqdm
from glob import glob
from PIL import Image

import torch
import torch.nn as nn

from common.deepLearningModel.model.car.v1.EDSR.edsr import EDSR
from common.deepLearningModel.model.car.v1.modules import DSN
from common.deepLearningModel.model.car.v1.adaptive_gridsampler.gridsampler import Downsampler
from skimage.color import rgb2ycbcr

class Car:
    def __init__(self, image_id, model, model_version, extension, is_image=True, duration=None, frame_duration=None):
        self.image_id = image_id
        self.model = model
        cwd = os.getcwd()
        self.model_dir = os.path.join(cwd, 'server/common/deepLearningModel/model/car', f'v{model_version}', model)
        self.model_version = model_version
        self.scale = 4

        if is_image is True:
            self.img_dir = os.path.join(cwd, 'server/common/store/upload/image', image_id, 'main/original', f'{image_id}-original.{extension}')
        else:
            try:
                find_base = int(math.log10(duration))+1
            except:
                pass
        
            self.img_dir = os.path.join(cwd, 'server/common/store/upload/video', image_id, 'extracted-img/original-frame', image_id + '-original-frame-' + f'%0{find_base}d' % frame_duration + '.png')

        pass

    def enhance(self):
        SCALE = self.scale
        KSIZE = 3 * SCALE + 1
        OFFSET_UNIT = SCALE

        kernel_generation_net = DSN(k_size=KSIZE, scale=4).cuda()
        downsampler_net = Downsampler(SCALE, KSIZE).cuda()
        upscale_net = EDSR(32, 256, scale=SCALE).cuda()

        kernel_generation_net = nn.DataParallel(kernel_generation_net, [0])
        downsampler_net = nn.DataParallel(downsampler_net, [0])
        upscale_net = nn.DataParallel(upscale_net, [0])

        kernel_generation_net.load_state_dict(torch.load(os.path.join(self.model_dir, 'kgn.pth')))
        upscale_net.load_state_dict(torch.load(os.path.join(self.model_dir, 'usn.pth')))
        torch.set_grad_enabled(False)

        img = Image.open(self.img_dir).convert('RGB')
        img = np.array(img)
        
        h, w, _ = img.shape
        img = img[:h // 8 * 8, :w // 8 * 8, :]
        img = np.array(img) / 255.
        img = img.transpose((2, 0, 1))
        img = torch.from_numpy(img).float().unsqueeze(0).cuda()

        kernel_generation_net.eval()
        downsampler_net.eval()
        upscale_net.eval()

        kernels, offsets_h, offsets_v = kernel_generation_net(img)
        downscaled_img = downsampler_net(img, kernels, offsets_h, offsets_v, OFFSET_UNIT)
        downscaled_img = torch.clamp(downscaled_img, 0, 1)
        downscaled_img = torch.round(downscaled_img * 255)

        reconstructed_img = upscale_net(downscaled_img / 255.0)

        img = img * 255
        img = img.data.cpu().numpy().transpose(0, 2, 3, 1)
        img = np.uint8(img)

        reconstructed_img = torch.clamp(reconstructed_img, 0, 1) * 255
        reconstructed_img = reconstructed_img.data.cpu().numpy().transpose(0, 2, 3, 1)
        reconstructed_img = np.uint8(reconstructed_img)

        downscaled_img = downscaled_img.data.cpu().numpy().transpose(0, 2, 3, 1)
        downscaled_img = np.uint8(downscaled_img)

        # orig_img = img[0, ...].squeeze()
        # downscaled_img = downscaled_img[0, ...].squeeze()
        recon_img = reconstructed_img[0, ...].squeeze()

        cwd = os.getcwd()
        save_path = os.path.join(cwd, 'server/common/store/upload/image', self.image_id, 'main/super-resolution')
        try:
            os.mkdir(save_path)
        except OSError:
            pass

        img = Image.fromarray(recon_img)
        img.save(os.path.join(save_path, f'{self.image_id}-super-resolution.jpeg'))

        return

    def enhanceFrame(self):
        SCALE = self.scale
        KSIZE = 3 * SCALE + 1
        OFFSET_UNIT = SCALE

        kernel_generation_net = DSN(k_size=KSIZE, scale=SCALE).cuda()
        downsampler_net = Downsampler(SCALE, KSIZE).cuda()
        upscale_net = EDSR(32, 256, scale=SCALE).cuda()

        kernel_generation_net = nn.DataParallel(kernel_generation_net, [0])
        downsampler_net = nn.DataParallel(downsampler_net, [0])
        upscale_net = nn.DataParallel(upscale_net, [0])

        kernel_generation_net.load_state_dict(torch.load(os.path.join(self.model_dir, 'kgn.pth')))
        upscale_net.load_state_dict(torch.load(os.path.join(self.model_dir, 'usn.pth')))
        torch.set_grad_enabled(False)

        img = Image.open(self.img_dir).convert('RGB')
        img = np.array(img)
        h, w = img.shape
        img = img[:h // 8 * 8, :w // 8 * 8, :]
        img = np.array(img) / 255.
        img = img.transpose((2, 0, 1))
        img = torch.from_numpy(img).float().unsqueeze(0).cuda()

        kernel_generation_net.eval()
        downsampler_net.eval()
        upscale_net.eval()

        kernels, offsets_h, offsets_v = kernel_generation_net(img)
        downscaled_img = downsampler_net(img, kernels, offsets_h, offsets_v, OFFSET_UNIT)
        downscaled_img = torch.clamp(downscaled_img, 0, 1)
        downscaled_img = torch.round(downscaled_img * 255)

        reconstructed_img = upscale_net(downscaled_img / 255.0)

        img = img * 255
        img = img.data.cpu().numpy().transpose(0, 2, 3, 1)
        img = np.uint8(img)

        reconstructed_img = torch.clamp(reconstructed_img, 0, 1) * 255
        reconstructed_img = reconstructed_img.data.cpu().numpy().transpose(0, 2, 3, 1)
        reconstructed_img = np.uint8(reconstructed_img)

        downscaled_img = downscaled_img.data.cpu().numpy().transpose(0, 2, 3, 1)
        downscaled_img = np.uint8(downscaled_img)

        # orig_img = img[0, ...].squeeze()
        # downscaled_img = downscaled_img[0, ...].squeeze()
        recon_img = reconstructed_img[0, ...].squeeze()

        cwd = os.getcwd()
        save_path = os.path.join(cwd, 'server/common/store/upload/video', self.image_id, 'extracted-img/super-resolution-frame')
        try:
            os.mkdir(save_path)
        except OSError:
            pass

        img = Image.fromarray(recon_img)
        img.save(os.path.join(save_path, f'{self.image_id}-super-resolution.jpeg'))

        return