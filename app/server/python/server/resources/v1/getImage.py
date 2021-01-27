from flask import jsonify, request
from flask_restful import Resource
from common.utils.v1.mongodb import MongoDB
from bson.objectid import ObjectId
from common.utils.v1.img import Img
import os

class GetImage(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()
        # Json data [image uuid]
        image_id = data['id']

        # Init MongoDB class
        try:
            mongodb_class = MongoDB('store')
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Find image uuid document
        document = mongodb_class.find_one('upload', { "_id": ObjectId(image_id) })

        if document['type'] != 'image':
            return 'Invalid image id', 400

        # Specific image size and extension
        image_size = 'x1'
        extension = document['extension']

        # Image path by uuid
        cwd = os.getcwd()
        path_dir = os.path.join(cwd, 'server/common/store/upload/image', image_id)

        # Check image path is exist
        if os.path.exists(path_dir) is False:
            return 'File path not exist', 400

        # Image file dir
        file_dir = os.path.join(path_dir, 'main', image_size, '{}-{}.{}'.format(image_id, image_size, extension))

        # Init Img class
        try:
            img_class = Img(file_dir)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Get preview image
        preview_image = img_class.getPreview()

        # Object structure
        obj = {
            "_id": image_id,
            "originalName": document['originalName'],
            "type": document['type'],
            "extension": document['extension'],
            "fileSize": document['fileSize'],
            "dimensionWidth": document['dimensionWidth'],
            "dimensionHeight": document['dimensionHeight'],
            "preview": preview_image,
            "timestamp": document['timestamp']
        }

        # Return image informtion
        res = jsonify(obj)
        res.status_code = 200
        return res