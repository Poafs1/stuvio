import os
from common.utils.v1.mongodb import MongoDB
from bson.objectid import ObjectId
from PIL import Image
import shutil

class Img:
    # Init Img class variable
    def __init__(self, folder_id):
        try:
            mongodb_class = MongoDB('store')
        except Exception as e:
            raise e

        document = mongodb_class.find_one('upload', { "_id": ObjectId(folder_id) })

        self.folder_id = folder_id
        cwd = os.getcwd()
        self.path = os.path.join(cwd, 'server/common/store/upload/image', folder_id)
        self.original_name = document['originalName']
        self.type = document['type']
        self.extension = document['extension']
        self.file_size = document['fileSize']
        self.dimension_width = document['dimensionWidth']
        self.dimension_height = document['dimensionHeight']

        pass

    # Create folder in store/upload/image/{uid} [Handle try cache]
    def createFolder(self, path_dir):
        try:
            os.mkdir(os.path.join(self.path, path_dir))
        except:
            pass

        return

    # Remove folder in store/upload/image/{uid} [Handle try cache]
    def removeFolder(self, path_dir):
        try:
            shutil.rmtree(os.path.join(self.path, path_dir))
        except:
            pass
            
        return

    # Handle rotate image
    def rotate(self, angle, image_size, target_dir, extension='jpg', suffix='rotate'):
        image = Image.open(os.path.join(self.path, 'main', image_size, f'{self.folder_id}-{image_size}.{extension}'))
        rotate_image = image.rotate(angle * -1)
        rotate_image.save(os.path.join(self.path, target_dir, f'{self.folder_id}-{suffix}.jpeg'))
        return

    # Handle crop image
    def crop(self, width, height, x, y, image_size, target_dir, extension='jpg', suffix='crop'):
        image = Image.open(os.path.join(self.path, 'main', image_size, f'{self.folder_id}-{image_size}.{extension}'))
        crop_image = image.crop((x, y, x + width, y + height))
        crop_image.save(os.path.join(self.path, target_dir, f'{self.folder_id}-{suffix}.jpeg'))
        return

    # Handle get image with specific directory and filename
    def generatePreview(self, target_dir, suffix='super-resolution', extension='jpeg'):        
        path_dir = self.path + '/' + target_dir
        filename = f'{self.folder_id}-{suffix}.{extension}'
        return path_dir, filename

    # Handle download image from server directory
    def downloadSuperResolution(self, target_dir):
        path_dir = os.path.join(self.path, target_dir)
        _, _, filenames = next(os.walk(path_dir))
        
        return path_dir, filenames[0]

    # Return init image extension from db
    def getExtension(self):
        return self.extension