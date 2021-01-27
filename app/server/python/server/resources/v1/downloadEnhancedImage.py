from flask import request, send_from_directory
from flask_restful import Resource
from common.utils.v2.img import Img

class DownloadEnhancedImage(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()
        # Json data [image uuid]
        image_id = data['id']

        # Init Img class
        try:
            img_class = Img(image_id)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Get super-resolution directory path and filename
        path_dir, filename = img_class.downloadSuperResolution('main/super-resolution')

        # Return file to client
        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200
        return res