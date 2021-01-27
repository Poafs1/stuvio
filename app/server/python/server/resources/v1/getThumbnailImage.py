from flask import jsonify, request
from flask_restful import Resource

from common.utils.v1.img import Img

import os, glob, re

class GetThumbnailImage(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()
        # Json data
        file_id = data['id']
        file_type = data['type']
        quality = data['quality']

        # Handle check image type
        if file_type != 'image':
            return 'Invalid file type', 400

        # Image uuid
        uid = file_id

        cwd = os.getcwd()
        # Image path
        path_dir = os.path.join(cwd, 'server/common/store/upload/image', uid)

        # Check image path is exist
        if os.path.exists(path_dir) is False:
            return 'File path not exist', 400

        # Glob target directory and sort by name
        file_dir = os.path.join(path_dir, 'main', quality)
        target = sorted(glob.glob(os.path.join(file_dir, '*')), key=lambda f: int(re.sub('\D', '', f)))

        # Get preview image
        preview_image = None
        for filename in target:
            try:
                img_class = Img(filename)
            except Exception as e:
                return 'Error: {}'.format(e), 400

            preview_image = img_class.getPreview()

        # Return json of image preview [base64]
        res = jsonify({ "preview": preview_image })
        res.status_code = 200
        return res
