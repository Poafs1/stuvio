from flask import request, jsonify
from flask_restful import Resource
from bson.objectid import ObjectId
from common.utils.v1.mongodb import MongoDB
from common.utils.v1.imageFile import ImageFile
import time

class UploadImage(Resource):
    def get(self):
        pass

    def post(self):
        # Check file request is exist
        if 'file' not in request.files:
            return 'Incorrect file', 400

        # Get file from request
        input_file = request.files['file']

        # Generate uuid
        image_uuid = ObjectId()

        # Init ImageFile class
        try:
            image_class = ImageFile(str(image_uuid), input_file)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Create uplaod folder
        image_class.initFolder()

        # Downsize image from original [x1, x2, progressive image]
        try:
            image_class.downsizeImageFromOriginal()
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Insert object structure
        insert_data = {
            "_id": image_uuid,
            "originalName": image_class.getFilename(),
            "type": "image",
            "extension": image_class.getExtension(),
            "fileSize": image_class.getFileSize(),
            "dimensionWidth": image_class.getWidth(),
            "dimensionHeight": image_class.getHeight(),
            "timestamp": time.time()
        }

        # Init MongoDB class
        try:
            mongodb_class = MongoDB('store')
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Insert one document to database
        mongodb_class.insert('upload', insert_data)

        # Return json uuid [string]
        res = jsonify({ "id": str(image_uuid) })
        res.status_code = 200
        return res