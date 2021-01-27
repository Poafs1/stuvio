from flask import request, send_from_directory
from flask_restful import Resource
from common.utils.v1.vid import Vid

class DownloadEnhancedVideo(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()
        # Json data [video uuid]
        video_id = data['id']

        # Init Vid class
        try:
            vid_class = Vid(video_id)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Get super-resolution video from specific directory and filename
        path_dir, filename = vid_class.downloadSuperResolution('main/super-resolution')

        # Return file to client
        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200
        return res