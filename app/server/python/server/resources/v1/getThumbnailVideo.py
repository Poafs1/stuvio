from flask import jsonify, request
from flask_restful import Resource

from common.utils.v1.img import Img

import os, re, glob

class GetThumbnailVideo(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()
        # Json data
        file_id = data['id']
        start = data['start']
        end = data['end']
        interval = data['interval']
        duration = data['duration']
        file_type = data['type']
        quality = data['quality']

        # Check file type
        if file_type != 'video':
            return 'Invalid file type', 400

        # Check duration
        if end > duration:
            start = 1
            end = 2

        # Video uuid
        uid = file_id

        # File path
        cwd = os.getcwd()
        path_dir = os.path.join(cwd, 'server/common/store/upload/video', uid)

        # Check path is exist
        if os.path.exists(path_dir) is False:
            return 'File path not exist', 400

        # File path with quality directory
        file_dir = os.path.join(path_dir, 'extracted-img', quality)
        
        # Glob video thumbnail image directory and sort by name
        target = sorted(glob.glob(os.path.join(file_dir, '*')), key=lambda f: int(re.sub('\D', '', f)))

        # Append thumbnail to array
        obj = []
        for i in range(start, end, interval):
            filename = target[i]

            try:
                img_class = Img(filename)
            except Exception as e:
                return 'Error: {}'.format(e), 400

            preview_image = img_class.getPreview()
            obj.append(preview_image)

        # Return json array to client
        res = jsonify(obj)
        res.status_code = 200
        return res