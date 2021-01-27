from flask import request
from flask_restful import Resource
from common.utils.v1.mongodb import MongoDB
from bson.objectid import ObjectId

import os, shutil

class RemoveVideo(Resource):
    def get(self):
        pass

    def post(self):
        # Get json
        data = request.get_json()
        # Json data [video uuid]
        video_id = data['id']

        # Init MongoDB class
        try:
            mongodb_class = MongoDB('store')
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Delete one with _id query
        mongodb_class.delete_one('upload', { "_id": ObjectId(video_id) })

        cwd = os.getcwd()
        # Video uuid path directory
        path_dir = os.path.join(cwd, 'server/common/store/upload/video', video_id)

        # Check is path exist or not
        if os.path.exists(path_dir) is False:
            return 'ok', 200

        # Remove video uuid folder and all file in directory
        try:
            shutil.rmtree(path_dir)
        except OSError as e:
            return 'Error: {}'.format(e), 400

        return 'ok', 200