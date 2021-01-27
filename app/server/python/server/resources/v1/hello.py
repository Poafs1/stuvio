from flask_restful import Resource

class Hello(Resource):
    def get(self):
        # Test Hello, World
        return 'Hello, World', 200

    def post(self):
        pass