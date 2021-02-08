import os, glob, cv2, math
import numpy as np
import ffmpeg
import datetime
from common.utils.v1.mongodb import MongoDB
from bson.objectid import ObjectId
import shutil

ALLOWED_RESOLUTION = ['4k', '2k', '1080p', '720p', '540p', '480p', '360p', '240p','144p']

class Vid:
    # Init Vid class variable
    def __init__(self, folder_id):
        try:
            mongodb_class = MongoDB('store')
        except Exception as e:
            raise e

        document = mongodb_class.find_one('upload', { "_id": ObjectId(folder_id) })

        self.folder_id = folder_id
        cwd = os.getcwd()
        self.path = os.path.join(cwd, 'server/common/store/upload/video', folder_id)
        self.original_name = document['originalName']
        self.extension = document['extension']
        self.duration = document['duration']
        self.dimension_width = document['dimensionWidth']
        self.dimension_height = document['dimensionHeight']
        self.fps = document['fps']
        self.original_resolution = document['originalResolution']
        self.find_base = int(math.log10(self.duration * self.fps)) + 1

        pass

    # Create folder in store/upload/video/{uid} [Handle try cache]
    def createFolder(self, path_dir):
        try:
            os.mkdir(os.path.join(self.path, path_dir))
        except:
            pass

        return

    # Remove folder in store/upload/video/{uid} [Handle try cache]
    def removeFolder(self, path_dir):
        try:
            shutil.rmtree(os.path.join(self.path, path_dir))
        except:
            pass
            
        return

    # Merge image to video frame [Use with TecoGans model]
    def mergeFrame(self, file_dir, target_dir):
        path_dir = os.path.join(self.path, file_dir)
        output_dir = os.path.join(self.path, target_dir, f'{self.folder_id}-super-resolution.{self.extension}')
        find_base = int(math.log10(self.duration * self.fps)) + 1
        os.system(f'ffmpeg -i {path_dir}/{self.folder_id}-original-frame-%{find_base}d.png {output_dir}')

        return

    # Convert video with black and white filter
    def blackAndWhite(self, file_dir, target_dir):
        path_dir = os.path.join(self.path, file_dir)
        input_dir = os.path.join(path_dir, f'{self.folder_id}-original.{self.extension}')
        output_dir = os.path.join(self.path, target_dir, f'{self.folder_id}-super-resolution.{self.extension}')
        os.system(f'ffmpeg -i {input_dir} -vf hue=s=0 {output_dir}')
        return

    # Trim video duration
    def trim(self, start, end, target_dir, in_dir=None, suffix='trim'):
        resolution = in_dir

        if in_dir == None:
            for k, v in enumerate(ALLOWED_RESOLUTION):
                if self.original_resolution == v:
                    if k <= 3:
                        resolution = '720p'
                    else:
                        resolution = v

        if end > self.duration:
            end = self.duration

        if start < 0:
            start = 0

        s = str(datetime.timedelta(seconds=start))
        e = str(datetime.timedelta(seconds=end))

        input_dir = os.path.join(self.path, f'main/{resolution}', f'{self.folder_id}-{resolution}.{self.extension}')
        output_dir = os.path.join(self.path, target_dir, f'{self.folder_id}-{suffix}.{self.extension}')

        os.system(f'ffmpeg -y \
            -i {input_dir} -ss {s} -to {e} -async 1 {output_dir}')
                
        return

    # Crop video dimension
    def crop(self, width, height, x, y, target_dir, in_dir=None, suffix='crop'):
        resolution = in_dir

        if in_dir == None:
            for k, v in enumerate(ALLOWED_RESOLUTION):
                if self.original_resolution == v:
                    if k <= 3:
                        resolution = '720p'
                    else:
                        resolution = v

        input_dir = os.path.join(self.path, f'main/{resolution}', f'{self.folder_id}-{resolution}.{self.extension}')
        output_dir = os.path.join(self.path, target_dir, f'{self.folder_id}-{suffix}.{self.extension}')

        os.system(f'ffmpeg -y \
             -i {input_dir} -filter:v "crop={width}:{height}:{x}:{y}" {output_dir}')
        
        return

    # Get video in specific directory and filename
    def get(self, target_dir, suffix='super-resolution'):

        path_dir = os.path.join(self.path, target_dir)
        _, _, filenames = next(os.walk(path_dir))

        return path_dir, filenames[0]

    # Generate video preview with limit 10 sec
    def generatePreview(self, file_dir_left, file_dir_right, target_dir):
        left = os.path.join(self.path, file_dir_left, f'{self.folder_id}-original.{self.extension}')
        right = os.path.join(self.path, file_dir_right, f'{self.folder_id}-super-resolution.{self.extension}')
        output_dir = os.path.join(self.path, target_dir, f'{self.folder_id}-preview-super-resolution.{self.extension}')

        os.system(f'ffmpeg -y \
            -i {left} \
            -i {right} \
            -filter_complex \
            "[0:v]scale=1280:-1,crop=iw/2:ih:0:0[left]; \
            [1:v]scale=1280:-1,crop=iw/2:ih:ow:0[right]; \
            [left][right]hstack" -ss 00:00:00 -to 00:00:10 {output_dir}')
        
        return os.path.join(self.path, target_dir), f'{self.folder_id}-preview-super-resolution.{self.extension}'

    # Get video frame [Image png] in specific frame
    def generatePreviewImage(self, target_dir, suffix='super-resolution', extension='jpeg'):
        path_dir = os.path.join(self.path, target_dir)
        filename = f'{self.folder_id}-{suffix}.{extension}'
        return path_dir, filename

    # Return super-resoluton video in specific directory and filename
    def downloadSuperResolution(self, target_dir):
        path_dir = os.path.join(self.path, target_dir)
        _, _, filenames = next(os.walk(path_dir))

        return path_dir, filenames[0]

    # Return video duration
    def getDuration(self):
        return self.duration

    # Return video fps
    def getFps(self):
        return self.fps

    # Return video frame base name [0001, 0002, 0003]
    def getFindBase(self):
        return self.find_base