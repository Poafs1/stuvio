from flask import jsonify, request
from flask_restful import Resource
from common.utils.v1.mongodb import MongoDB
from bson.objectid import ObjectId

class GetVideoInfo(Resource):
    def get(self):
        pass

    def post(self):
        # Get json
        data = request.get_json()
        # Json data
        video_id = data['id']
        
        # Init MongoDB class
        try:
            mongodb_class = MongoDB('store')
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Find one document wiht _id query
        document = mongodb_class.find_one('upload', { "_id": ObjectId(video_id) })

        # Check type is video or not
        if document['type'] != 'video':
            return "Invalid video id", 400

        # Json object structure
        obj = {
            "_id": video_id,
            "originalName": document['originalName'],
            "type": document['type'],
            "extension": document['extension'],
            "fileSize": document['fileSize'],
            "duration": document['duration'],
            "dimensionWidth": document['dimensionWidth'],
            "dimensionHeight": document['dimensionHeight'],
            "fps": document['fps'],
            "originalResolution": document['originalResolution'],
            "timestamp": document['timestamp']
        }

        # Return json to client
        res = jsonify(obj)
        res.status_code = 200
        return res