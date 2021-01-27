from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from resources.v1.hello import Hello
from resources.v1.pingpong import Pingpong
from resources.v1.enhancedVideo import EnhancedVideo
from resources.v1.enhancedVideoFrame import EnhancedVideoFrame
from resources.v1.enhancedImage import EnhancedImage
from resources.v1.trim import Trim
from resources.v1.cropImage import CropImage
from resources.v1.cropVideo import CropVideo
from resources.v1.uploadVideo import UploadVideo
from resources.v1.uploadImage import UploadImage
from resources.v1.getAllVideo import GetAllVideo
from resources.v1.getAllImage import GetAllImage
from resources.v1.getVideoInfo import GetVideoInfo
from resources.v1.getVideo import GetVideo
from resources.v1.getImage import GetImage
from resources.v1.getThumbnailVideo import GetThumbnailVideo
from resources.v1.getThumbnailImage import GetThumbnailImage
from resources.v1.removeVideo import RemoveVideo
from resources.v1.removeImage import RemoveImage
from resources.v1.testEnhancedVideo import TestEnhancedVideo
from resources.v1.downloadEnhancedVideo import DownloadEnhancedVideo
from resources.v1.downloadEnhancedImage import DownloadEnhancedImage
from resources.v1.downloadEnhancedVideoFrame import DownloadEnhancedVideoFrame
from resources.v1.getPaperInfoByType import GetPaperInfoByType
from resources.v1.rateStyleEnhanced import RateStyleEnhanced
from resources.v1.rotate import Rotate
from resources.v1.getThumbnailVideoFrame import GetThumbnailVideoFrame

from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
api = Api(app, prefix='/api')
CORS(app, supports_credentials=True)

""" Test endpoint with get method
    return 'Hello, World!' string to client
"""
api.add_resource(Hello, '/')

""" Test endpoint with post method
    input:
        ping: string
    return json `pong`
"""
api.add_resource(Pingpong, '/ping')

""" Upload new video to server
    input:
        file: formdata
    return json `id` (uuid)
"""
api.add_resource(UploadVideo, '/upload/video')

""" Upload new image to server
    input:
        file: formdata
    return json `id` (uuid)
"""
api.add_resource(UploadImage, '/upload/image')

""" Get all preview video image
    return json
"""
api.add_resource(GetAllVideo, '/files/get/all/video')

""" Get all preview image
    return json
"""
api.add_resource(GetAllImage, '/files/get/all/image') # Get all preview image file

""" Get video information for editing process
    input:
        id: string
    return: json `video information`
"""
api.add_resource(GetVideoInfo, '/files/get/video/info') # Get video information by id

""" Get 720p or lower for editing process
    input:
        id: string
        type: string
        extension: string
        originalResolution: string
    return: file
"""
api.add_resource(GetVideo, '/files/get/video') # Get video by id

""" Get x1 image for editing process
    input:
        id: string
    return: json `image info and base64 image`
"""
api.add_resource(GetImage, '/files/get/image') # Get image by id

""" Get video preview thumbnail
    input:
        id: string
        start: number
        end: number
        interval: number
        duration: number
        fileType: string
        quality: string
    return: json `array of preview image`
"""
api.add_resource(GetThumbnailVideo, '/files/get/thumbnail/video') # Get video thumbnail

""" Get video thumbnail in specific frame
    input:
        id: string
        frame: number
    return: file
"""
api.add_resource(GetThumbnailVideoFrame, '/files/get/thumbnail/video/frame')

""" Get image preview thumbnail
    input:
        id: string
        type: string
        quality: string [x1, x2, ps, original]
    return: json `base64 preview image`
"""
api.add_resource(GetThumbnailImage, '/files/get/thumbnail/image') # Get image thumbnail

""" Remove video from server directory and database
    input:
        id: string
"""
api.add_resource(RemoveVideo, '/files/remove/video') # Remove video by id

""" Remove image from server directory and database
    input:
        id: string
"""
api.add_resource(RemoveImage, '/files/remove/image') # Remove image by id

""" Test enhance api endpoint
    input:
        id: string
    return: file [black and white filter preview]
"""
api.add_resource(TestEnhancedVideo, '/render/enhanced/video/test')

""" Get paper information from database
    input:
        type: string
    return json `paper info`
"""
api.add_resource(GetPaperInfoByType, '/paper/get/info')

""" Rate thumb up and thumb down for enhanced algorithm and style
    input:
        algorithm: string
        style: string
"""
api.add_resource(RateStyleEnhanced, '/paper/rate/algostyle')

""" Download super-resolution video
    input:
        id: string
    return: file [super-resolution]
"""
api.add_resource(DownloadEnhancedVideo, '/render/enhanced/video/download') # Download super resolution video

""" Downlod super-resolution image
    input:
        id: string
    return: file [super-resolution]
"""
api.add_resource(DownloadEnhancedImage, '/render/enhanced/image/download')

""" Downlod super-resolution image from specific video frame
    input:
        id: string
    return: file [super-resolution]
"""
api.add_resource(DownloadEnhancedVideoFrame, '/render/enhanced/video/frame/download')

""" Enhance video super-resolution
    input:
        id: string
        algorithm: string
        model: string
        modelVersion: number
    return: file [preview]
"""
api.add_resource(EnhancedVideo, '/render/enhanced/video') # Enhance video

""" Enhance image super-resolution
    input:
        id: string
        algorithm: string
        model: string
        modelVersion: number
    return: file [preview]
"""
api.add_resource(EnhancedImage, '/render/enhanced/image') # Enhance image

""" Enhance video in specific frame [image super-resolution]
    input:
        id: string
        algorithm: string
        model: string
        modelVersion: number
        frameDuration: number
    return: file [preview]
"""
api.add_resource(EnhancedVideoFrame, '/render/enhanced/video/frame') # Enhance video on specific frame

""" Rotate image file
    input:
        id: string
        angle: number
    return: file
"""
api.add_resource(Rotate, '/tools/rotate') # Rotate image

""" Trim video file
    input:
        id: string
        start: number
        end: number
    return: file
"""
api.add_resource(Trim, '/tools/trim') # Trim video

""" Crop video file
    input:
        id: string
        width: number
        height: number
        x: number
        y: number
    return: file
"""
api.add_resource(CropVideo, '/tools/crop/video')

""" Crop image file
    input:
        id: string
        width: number
        height: number
        x: number
        y: number
    return: file
"""
api.add_resource(CropImage, '/tools/crop/image')

if __name__ == '__main__':
    app.run(debug=os.getenv('DEBUG'), host=os.getenv('HOST'), port=os.getenv('PORT'))