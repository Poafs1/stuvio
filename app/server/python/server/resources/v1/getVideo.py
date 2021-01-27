from flask import request, send_from_directory
from flask_restful import Resource
import os

ALLOWED_RESOLUTION = ['4k', '2k', '1080p', '720p', '540p', '480p', '360p', '240p','144p']

class GetVideo(Resource):
    def get(self):
        pass

    def post(self):
        # Get json
        data = request.get_json()
        # Json data
        video_id = data['id']
        video_type = data['type']
        video_extension = data['extension']
        video_original_resolution = data['originalResolution']

        # Check type
        if video_type != 'video':
            return 'Invalid file type', 400

        # Video uuid
        uid = video_id

        # Find video resolution 720p is allow or not else use lower
        resolution = None
        for k, v in enumerate(ALLOWED_RESOLUTION):
            if video_original_resolution == v:
                if k <= 3:
                    resolution = '720p'
                else:
                    resolution = v

        # Video resolution and extension
        size = resolution
        extension = video_extension

        cwd = os.getcwd()

        # Path directory
        path_dir = os.path.join(cwd, 'server/common/store/upload/video', uid)

        # Check path is exist
        if os.path.exists(path_dir) is False:
            return 'File path not exist', 400

        # Find video in specific directory and filename
        # return send_from_directory(static_path, filename, as_attachment=True), 200
        target_dir = os.path.join(path_dir, 'main', size)
        filename = '{}-{}.{}'.format(uid, size, extension)
        
        # Return file to client
        res = send_from_directory(target_dir, filename, as_attachment=True)
        res.status_code = 200
        return res