from flask import request
from flask_restful import Resource
from common.utils.v1.mongodb import MongoDB

class RateStyleEnhanced(Resource):
    def get(self):
        pass

    def post(self):
        # Get json
        data = request.get_json()
        # Json data
        algorithm = data['algorithm']
        style = data['style']

        # Init MongoDB class
        try:
            mongodb_class = MongoDB('paper')
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Find one document with algorithm query
        document = mongodb_class.find_one('information', { "algorithm": algorithm })

        index = 0

        for k, v in enumerate(document['styles']):
            if v['name'] == style:
                index = k

        new_style = document['styles']
        new_style[index]['rate'] = new_style[index]['rate'] + 1
        
        # Update rate thumbnail + 1
        mongodb_class.update_one('information', { "algorithm": algorithm }, {
            f"styles": new_style
        })
    
        return 'ok', 200