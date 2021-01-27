from flask import request, send_from_directory
from flask_restful import Resource

from common.utils.v2.img import Img

class Rotate(Resource):
    def get(self):
        pass

    def post(self):
        # Get json
        data = request.get_json()

        # Json data
        image_id = data['id']
        angle = data['angle']

        # Image size and extension
        image_size = 'x1'
        extension = 'jpg'

        # Init Img class
        try:
            img_class = Img(image_id)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Handle crop image
        try:
            is_crop = data['crop']
            width = data['width']
            height = data['height']
            x = data['x']
            y = data['y']

            if is_crop == True:
                img_class.createFolder('main/crop')
                img_class.crop(width, height, x, y, image_size, 'main/crop')

                image_size = 'crop'
                extension = 'jpeg'
        except:
            pass

        # Create rotate folder and rotate!
        img_class.createFolder('main/rotate')
        img_class.rotate(angle, image_size, 'main/rotate', extension)

        # Specific rotate directory and filename
        path_dir, filename = img_class.generatePreview('/main/rotate', 'rotate')

        # Return file to client
        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200

        # Remove rotate and crop folder
        img_class.removeFolder('main/rotate')
        img_class.removeFolder('main/crop')

        return res

