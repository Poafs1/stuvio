from flask import jsonify, request
from flask_restful import Resource

class Pingpong(Resource):
    def get(self):
        pass

    def post(self):
        # Get json
        data = request.get_json()
        # Json data
        ping = data['ping']

        # Check is ping [string] or not
        if ping != 'ping':
            return 'error', 400

        # Return pong [string] to client
        return 'pong!', 200