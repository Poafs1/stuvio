from flask import jsonify
from flask_restful import Resource
from common.utils.v1.mongodb import MongoDB

class GetAllImage(Resource):
    def get(self):
        # Init MongoDB class
        try:
            mongodb_class = MongoDB('store')
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Query data
        data = { "type": "image" }
        cursor = mongodb_class.find("upload", data)

        # Loop array of document
        obj = []
        for document in cursor:
            uid = str(document['_id'])
            obj.append({
                "_id": uid,
                "originalName": document['originalName'],
                "type": document['type'],
                "extension": document['extension'],
                "fileSize": document['fileSize'],
                "dimensionWidth": document['dimensionWidth'],
                "dimensionHeight": document['dimensionHeight'],
                "timestamp": document['timestamp']
            })

        # Return array of document [image info]
        res = jsonify(obj)
        res.status_code = 200
        return res

    def post(self):
        pass