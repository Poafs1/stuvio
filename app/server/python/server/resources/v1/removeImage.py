from flask import request
from flask_restful import Resource
from bson.objectid import ObjectId
from common.utils.v1.mongodb import MongoDB

import os, shutil

class RemoveImage(Resource):
    def get(self):
        pass

    def post(self):
        # Get json
        data = request.get_json()
        # Json data [image uuid]
        image_id = data['id']

        # Init MongoDB class
        try:
            mongodb_class = MongoDB('store')
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Delete one with _id query
        mongodb_class.delete_one('upload', { "_id": ObjectId(image_id) })

        cwd = os.getcwd()
        # Image id path directory
        path_dir = os.path.join(cwd, 'server/common/store/upload/image', image_id)

        # Check is path exist or not
        if os.path.exists(path_dir) is False:
            return 'ok', 200

        # Delete image uuid directory and all file in directory
        try:
            shutil.rmtree(path_dir)
        except OSError as e:
            return 'Error: {}'.format(e), 400

        return 'ok', 200