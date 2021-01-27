from flask import request, jsonify
from flask_restful import Resource
from bson.objectid import ObjectId
from common.utils.v1.videoFile import VideoFile
from common.utils.v1.ffmpeg import FFMPEG
from common.utils.v1.mongodb import MongoDB
import time

class UploadVideo(Resource):
    def get(self):
        pass

    def post(self):
        # Check file request is exist
        if 'file' not in request.files:
            return 'Incorrect file', 400

        # Get file from request
        input_file = request.files['file']

        # Generate uuid
        video_uuid = ObjectId()

        # Init VideoFile class
        try:
            video_class = VideoFile(str(video_uuid), input_file)
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Create upload folder
        video_class.initFolder()

        # Init FFMPEG class
        try:
            ffmpeg_class = FFMPEG(str(video_uuid), video_class.getExtension())
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Extract video resolution and save original and lower resolution
        try:
            video_class.saveOriginalAndLowerQuality(ffmpeg_class.getResolution())
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Extract video frame [image]
        try:
            video_class.extractedImageFromFrame()
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Insert data structure
        insert_data = {
            "_id": video_uuid,
            "originalName": video_class.getFilename(),
            "type": "video",
            "extension": video_class.getExtension(),
            "fileSize": ffmpeg_class.getFileSize(),
            "duration": ffmpeg_class.getDuration(),
            "dimensionWidth": ffmpeg_class.getWidth(),
            "dimensionHeight": ffmpeg_class.getHeight(),
            "fps": ffmpeg_class.getFps(),
            "originalResolution": ffmpeg_class.getResolution(),
            "timestamp": time.time()
        }

        # Init MongoDB class
        try:
            mongodb_class = MongoDB('store')
        except Exception as e:
            return 'Error: {}'.format(e), 400

        # Insert one document into database
        mongodb_class.insert('upload', insert_data)

        # Return json uuid [string]
        res = jsonify({ "id": str(video_uuid) })
        res.status_code = 200
        return res