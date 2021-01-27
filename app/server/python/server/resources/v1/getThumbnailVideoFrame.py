from flask import request, send_from_directory
from flask_restful import Resource

import math

from common.utils.v1.vid import Vid

class GetThumbnailVideoFrame(Resource):
    def get(self):
        pass

    def post(self):
        # Get json
        data = request.get_json()
        # Json data
        video_id = data['id']
        frame = data['frame']

        # Init Vid class
        try:
            vid_class = Vid(video_id)
        except Exception as e:
            return "Error: {}".format(e), 400

        # Video frame thumbnail directory
        target_dir = 'extracted-img/original-frame'
        find_base = int(math.log10(vid_class.getDuration() * vid_class.getFps())) + 1
        suffix = 'original-frame-' + f'%0{find_base}d' % frame
        extension = 'png'
        
        # Get file with specific directory and filename
        path_dir, filename = vid_class.generatePreviewImage(target_dir, suffix, extension)

        # Return file to client
        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200

        return res