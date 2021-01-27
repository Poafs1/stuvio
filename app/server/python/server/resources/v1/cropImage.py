from flask import request, send_from_directory
from flask_restful import Resource

from common.utils.v2.img import Img

class CropImage(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()

        # Json data
        image_id = data['id']
        height = data['height'] # new height
        width = data['width'] # new width
        x = data['x'] # distance from x axis
        y = data['y'] # distance from y axis
        
        # Query with image size and image extension
        image_size = 'x1'
        extension = 'jpg'

        # Init Img class
        try:
            img_class = Img(image_id)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Create crop folder
        img_class.createFolder('main/crop')

        # Crop image
        try:
            img_class.crop(width, height, x, y, image_size, 'main/crop', extension)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Check is user use rotate process before
        try:
            is_rotate = data['rotate']
            angle = data['angle']

            if is_rotate == True:
                img_class.rotate(angle, 'crop', 'main/crop', 'jpeg', 'crop')
        except:
            pass

        # Generate preview file
        path_dir, filename = img_class.generatePreview('/main/crop', 'crop')

        # Return preview crop file
        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200

        # Remove crop and rotate folder if existed
        img_class.removeFolder('main/crop')

        return res