from flask import request, send_from_directory
from flask_restful import Resource
from common.deepLearningModel.neuralNetwork.v1.srGans import SrGans
from common.deepLearningModel.neuralNetwork.v1.car import Car
from PIL import Image
from common.utils.v1.vid import Vid
import os

class EnhancedVideoFrame(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()

        # Json data
        video_id = data['id']
        algorithm = data['algorithm']
        model = data['model']
        model_version = data['modelVersion']
        frame_duration = data['frameDuration']

        frame_duration = frame_duration + 1

        # Init Vid class
        try:
            vid_class = Vid(video_id)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Handle algorithm and model super-resolution
        if algorithm == 'sr-gans':
            model = SrGans(video_id, model, model_version, None, False, vid_class.getDuration() * vid_class.getFps(), frame_duration)
            model.enhanceFrame()
        elif algorithm == 'car':
            model = Car(video_id, model, model_version, None, False, vid_class.getDuration() * vid_class.getFps(), frame_duration)
            model.enhanceFrame()

        # Create preview folder
        vid_class.createFolder('extracted-img/preview')
        left_dir = 'original-frame'

        # Handle crop video frame
        try:
            is_crop = data['crop']
            width = data['width']
            height = data['height']
            x = data['x']
            y = data['y']

            if is_crop == True:
                vid_class.createFolder('main/crop')
                cwd = os.getcwd()
                file_path = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img/super-resolution-frame', f'{video_id}-super-resolution.jpeg')
                image = Image.open(file_path)
                crop_image = image.crop((x*4, y*4, x*4 + width*4, y*4 + height*4))
                crop_image.save(file_path)
                
                cwd = os.getcwd()
                file_path = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img/original-frame', f'{video_id}-original-frame-%0{vid_class.getFindBase()}d' % frame_duration + '.png')
                image = Image.open(file_path)
                crop_image = image.crop((x, y, x + width, y + height))
                crop_image.save(os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img/preview', f'{video_id}-original-frame-%0{vid_class.getFindBase()}d' % frame_duration + '.png'))

                left_dir = 'preview'
        except:
            pass
            
        # Create preview image half original and super-resolution
        # Crop right super-resolution image
        cwd = os.getcwd()
        img_right_path = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img/super-resolution-frame', f'{video_id}-super-resolution.jpeg')
        img_right = Image.open(img_right_path)
        w, h = img_right.size
        img_right_crop = img_right.crop((w/2, 0, w, h))

        # Crop left original image
        img_left = Image.open(os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img', left_dir, f'{video_id}-original-frame-%0{vid_class.getFindBase()}d' % frame_duration + '.png'))
        img_left_resize = img_left.resize((w, h), resample=Image.BICUBIC)
        img_left_crop = img_left_resize.crop((0, 0, w/2, h))

        # Concatinate original and super-resolution image
        concat_img = Image.new('RGB', (img_left_crop.width+img_right_crop.width, img_right_crop.height))
        concat_img.paste(img_left_crop, (0, 0))
        concat_img.paste(img_right_crop, (img_left_crop.width, 0))
        concat_img.save(os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img/preview', f'{video_id}-preview.jpeg'))
        
        # Return preview video frame [image] in specific directory and filename
        path_dir = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'extracted-img/preview')
        filename = f'{video_id}-preview.jpeg'

        # Return to client
        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200

        vid_class.removeFolder('main/crop')

        return res