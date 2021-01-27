from flask import request, send_from_directory
from flask_restful import Resource
from common.utils.v1.vid import Vid
import os

class TestEnhancedVideo(Resource):
    def get(self):
        pass

    def post(self):
        # Get json
        data = request.get_json()
        # Json data
        video_id = data['id']
        # algorithm = data['algorithm']
        # model = data['model']
        # model_version = 1
        
        # Init Vid class
        try:
            vid_class = Vid(video_id)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Create super-resolution folder
        vid_class.createFolder('main/super-resolution')
        # Generate filter black & white video
        vid_class.blackAndWhite('main/original', 'main/super-resolution')
        # Create folder super-resolution preview
        vid_class.createFolder('main/preview-super-resolution')
        # Specific output directory and filename
        path_dir, filename = vid_class.generatePreview('main/original', 'main/super-resolution', 'main/preview-super-resolution')

        # Return file to client
        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200

        return res