from flask import request, send_from_directory
from flask_restful import Resource

from common.utils.v1.vid import Vid

class CropVideo(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()
        
        # Json data
        video_id = data['id']
        height = data['height'] # new height
        width = data['width'] # new width
        x = data['x'] # distance from x axis
        y = data['y'] # distance from y axis

        # Init Vid class
        try:
            vid_class = Vid(video_id)
        except Exception as e:
            return "Error: {}".format(e), 400

        # Specific video directory
        video_dir = None

        # Check is user trim video before crop process
        try:
            is_trim = data['trim']
            start = data['start']
            end = data['end']

            if is_trim == True:
                vid_class.createFolder('main/trim')
                vid_class.trim(start, end, 'main/trim')
                video_dir = 'trim'
        except:
            pass

        # Create crop folder
        vid_class.createFolder('main/crop')
        # Crop video dimension
        vid_class.crop(width, height, x, y, 'main/crop', video_dir)
        path_dir, filename = vid_class.get('main/crop')

        # Return video file to client
        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200

        # Remove crop and trim folder if existed
        vid_class.removeFolder('main/crop')
        vid_class.removeFolder('main/trim')

        return res