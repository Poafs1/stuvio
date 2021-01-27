from flask import request, send_from_directory
from flask_restful import Resource

from common.utils.v1.vid import Vid

class Trim(Resource):
    def get(self):
        pass

    def post(self):
        # Get json
        data = request.get_json()
        
        # Json data
        video_id = data['id']
        start = data['start']
        end = data['end']

        # Init Vid class
        try:
            vid_class = Vid(video_id)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        video_dir = None

        # Handle crop
        try:
            is_crop = data['crop']
            width = data['width']
            height = data['height']
            x = data['x']
            y = data['y']

            if is_crop == True:
                vid_class.createFolder('main/crop')
                vid_class.crop(width, height, x, y, 'main/crop')
                video_dir = 'crop'
        except:
            pass

        # Create trim folder and trim!
        vid_class.createFolder('main/trim')
        vid_class.trim(start, end, 'main/trim', video_dir)
        
        # Specific output directory and filename
        path_dir, filename = vid_class.get('main/trim')

        # Return file to client
        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200

        # Remove trim and crop folder
        vid_class.removeFolder('main/trim')
        vid_class.removeFolder('main/crop')

        return res