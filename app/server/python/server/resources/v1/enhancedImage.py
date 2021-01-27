from flask import request, send_from_directory
from flask_restful import Resource
from common.deepLearningModel.neuralNetwork.v1.srGans import SrGans
# from common.deepLearningModel.neuralNetwork.v1.car import Car

from common.utils.v2.img import Img
from PIL import Image
import os

class EnhancedImage(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()

        # Json data
        image_id = data['id']
        algorithm = data['algorithm']
        model = data['model']
        model_version = data['modelVersion']

        # Init Img class
        try:
            img_class = Img(image_id)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Handle algorithm model
        if algorithm == 'sr-gans':
            model = SrGans(image_id, model, model_version, img_class.getExtension())
            model.enhance()
        # elif algorithm == 'car':
        #     model = Car(image_id, model, model_version, img_class.getExtension())
        #     model.enhance()

        # Create preview folder
        img_class.createFolder('main/preview')

        left_dir = 'original'

        # Handle crop
        try:
            is_crop = data['crop']
            width = data['width']
            height = data['height']
            x = data['x']
            y = data['y']

            if is_crop == True:
                img_class.crop(width, height, x, y, 'original', 'main/preview', img_class.getExtension(), 'original')
                img_class.crop(width*4, height*4, x*4, y*4, 'super-resolution', 'main/super-resolution', 'jpeg', 'super-resolution')
                left_dir = 'preview'
        except:
            pass

        # Handle rotate
        try:
            is_rotate = data['rotate']
            angle = data['angle']

            if is_rotate == True:
                img_class.rotate(angle, 'super-resolution', 'main/super-resolution', 'jpeg', 'super-resolution')
        except:
            pass
            
        # Create preview image half original and super-resolution
        cwd = os.getcwd()
        # Super-resolution image
        img_right = Image.open(os.path.join(cwd, 'server/common/store/upload/image', image_id, 'main/super-resolution', f'{image_id}-super-resolution.jpeg'))
        w, h = img_right.size
        img_right_crop = img_right.crop((w/2, 0, w, h))

        # Original image
        img_left = Image.open(os.path.join(cwd, 'server/common/store/upload/image', image_id, 'main', left_dir, f'{image_id}-original.{img_class.getExtension()}'))
        img_left_resize = img_left.resize((w, h), resample=Image.BICUBIC)
        img_left_crop = img_left_resize.crop((0, 0, w/2, h))

        # Concatinate original and super-resolution image
        concat_img = Image.new('RGB', (img_left_crop.width+img_right_crop.width, img_right_crop.height))
        concat_img.paste(img_left_crop, (0, 0))
        concat_img.paste(img_right_crop, (img_left_crop.width, 0))
        concat_img.save(os.path.join(cwd, 'server/common/store/upload/image', image_id, 'main/preview', f'{image_id}-preview.jpeg'))

        # Return image from specific directory and filename to client
        path_dir = os.path.join(cwd, 'server/common/store/upload/image', image_id, 'main/preview')
        filename = f'{image_id}-preview.jpeg'

        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200

        return res