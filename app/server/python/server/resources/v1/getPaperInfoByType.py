from flask import jsonify, request
from flask_restful import Resource
from common.utils.v1.mongodb import MongoDB

class GetPaperInfoByType(Resource):
    def get(self):
        pass

    def post(self):
        # Get json data
        data = request.get_json()
        # Json dat
        for_type = data['type']

        # Init MongoDB class
        try:
            mongodb_class = MongoDB('paper')
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Find more than one array document
        cursor = mongodb_class.find("information", { "type": for_type })

        # Append document cursor to array
        obj = []
        for document in cursor:
            obj.append({
                "algorithm": document['algorithm'],
                "algorithmLabel": document['algorithmLabel'],
                "styles": document['styles'],
                "paper": document['paper'],
                'link': document['link'],
                'technique': document['technique'],
                'authors': document['authors'],
                'type': document['type']
            })

        # Return json array to client
        res = jsonify(obj)
        res.status_code = 200
        return res