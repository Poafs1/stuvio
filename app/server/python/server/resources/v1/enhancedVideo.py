from flask import request, send_from_directory
from flask_restful import Resource
from common.deepLearningModel.neuralNetwork.v1.tecoGans import TecoGans
from common.utils.v1.vid import Vid
import os

class EnhancedVideo(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()

        # Json data
        video_id = data['id']
        algorithms = data['algorithm']
        model = data['model']
        model_version = data['modelVersion']

        # Init Vid class
        try:
            vid_class = Vid(video_id)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        preview_left_dir = 'main/original'

        # Handle crop original
        try:
            is_crop = data['crop']
            width = data['width']
            height = data['height']
            x = data['x']
            y = data['y']

            if is_crop == True:
                vid_class.createFolder('main/original-tools')
                vid_class.crop(width, height, x, y, 'main/original-tools', 'original', 'original-crop')
                preview_left_dir = 'main/original-tools'

                cwd = os.getcwd()
                path_dir = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'main/original-tools')
                try:
                    os.remove(os.path.join(path_dir, f'{video_id}-original.mp4'))
                except:
                    pass
                os.rename(os.path.join(path_dir, f'{video_id}-original-crop.mp4'), os.path.join(path_dir, f'{video_id}-original.mp4'))
        except:
            pass

        # Handle trim original
        try:
            is_trim = data['trim']
            start = data['start']
            end = data['end']

            if is_trim == True:
                if preview_left_dir == 'main/original':
                    vid_class.createFolder('main/original-tools')
                    vid_class.trim(start, end, 'main/original-tools', 'original', 'original-trim')
                    preview_left_dir = 'main/original-tools'
                else:
                    vid_class.trim(start, end, 'main/original-tools', 'original', 'original-trim')

                cwd = os.getcwd()
                path_dir = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'main/original-tools')
                try:
                    os.remove(os.path.join(path_dir, f'{video_id}-original.mp4'))
                except:
                    pass
                os.rename(os.path.join(path_dir, f'{video_id}-original-trim.mp4'), os.path.join(path_dir, f'{video_id}-original.mp4'))
        except:
            pass

        # Handle algorithm and model
        if algorithms == 'teco-gans':
            model = TecoGans(video_id, model, model_version)
            model.enhance()

            vid_class.createFolder('main/super-resolution')
            vid_class.mergeFrame('extracted-img/super-resolution', 'main/super-resolution')

        # Handle crop super-resolution video
        try:
            is_crop = data['crop']
            width = data['width']
            height = data['height']
            x = data['x']
            y = data['y']

            if is_crop == True:
                vid_class.crop(width, height, x, y, 'main/super-resolution', 'super-resolution', 'super-resolution-crop')

                cwd = os.getcwd()
                path_dir = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'main/super-resolution')
                try:
                    os.remove(os.path.join(path_dir, f'{video_id}-super-resolution.mp4'))
                except:
                    pass
                os.rename(os.path.join(path_dir, f'{video_id}-super-resolution-crop.mp4'), os.path.join(path_dir, f'{video_id}-super-resolution.mp4'))
        except:
            pass

        # Handle trim super-resolution video
        try:
            is_trim = data['trim']
            start = data['start']
            end = data['end']

            if is_trim == True:
                vid_class.trim(start, end, 'main/super-resolution', 'super-resolution', 'super-resolution-trim')

                cwd = os.getcwd()
                path_dir = os.path.join(cwd, 'server/common/store/upload/video', video_id, 'main/super-resolution')
                try:
                    os.remove(os.path.join(path_dir, f'{video_id}-super-resolution.mp4'))
                except:
                    pass
                os.rename(os.path.join(path_dir, f'{video_id}-super-resolution-trim.mp4'), os.path.join(path_dir, f'{video_id}-super-resolution.mp4'))
        except:
            pass

        # Create preview folder
        vid_class.createFolder('main/preview-super-resolution')
        # Find preview video from specific directory and filename
        path_dir, filename = vid_class.generatePreview(preview_left_dir, 'main/super-resolution', 'main/preview-super-resolution')
        # Return to client
        res = send_from_directory(path_dir, filename, as_attachment=True)
        res.status_code = 200

        vid_class.removeFolder('main/original-tools')

        return res