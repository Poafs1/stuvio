import os, sys, glob
from common.utils.v1.img import Img

ALLOWED_EXTENSIONS = [ 'jpeg', 'jpg', 'png' ]
INIT_FOLDER = [ 'original', 'progressive-img', 'x1', 'x2' ]

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class ImageFile:
    # Init ImageFile class variable
    def __init__(self, uuid, image_file):
        self.uuid = uuid
        self.image_file = image_file 

        if image_file.filename == '':
            raise Exception('Filename is undefined')
        
        if image_file and allowed_file(image_file.filename) is False:
            raise Exception('Unhandle file type')

        self.full_name = image_file.filename
        self.filename = self.full_name.rsplit(".",1)[0]
        self.extension = self.full_name.rsplit(".",1)[1]

    # Create storing image directory
    def initFolder(self):
        cwd = os.getcwd()
        file_dir = os.path.join(cwd, 'server/common/store/upload/image', self.uuid)

        if os.path.exists(file_dir) == True:
            return

        os.mkdir(file_dir)
        os.mkdir(os.path.join(file_dir, 'main'))
        for _, v in enumerate(INIT_FOLDER):
            os.mkdir(os.path.join(file_dir, 'main', v))

        self.image_file.save(os.path.join(file_dir, 'main', 'original', f'{self.uuid}-original.{self.extension}'))

        return

    # Downscale image from original to [x1, x2, progressive image]
    def downsizeImageFromOriginal(self):
        cwd = os.getcwd()
        file_dir = os.path.join(cwd, 'server/common/store/upload/image', self.uuid, 'main')

        if os.path.exists(os.path.join(file_dir, 'original')) is False:
            os.mkdir(os.path.join(file_dir, 'original'))

        x1 = os.path.join(file_dir, 'x1')
        if os.path.exists(x1) is False:
            os.mkdir(x1)

        x2 = os.path.join(file_dir, 'x2')
        if os.path.exists(x2) is False:
            os.mkdir(x2)

        ps = os.path.join(file_dir, 'progressive-img')
        if os.path.exists(ps) is False:
            os.mkdir(ps)

        # Resize from original to x1, x2, progressive-img
        for filename in glob.glob(os.path.join(file_dir, 'original', '*')):
            full_path = filename.rsplit('/')[-1]
            extract_name = full_path.split('-')
            
            try:
                img_class = Img(filename)
            except:
                raise Exception('Image class initialize error')

            img_class.downScale(1800, os.path.join(x1, extract_name[0] + '-x1.' + self.extension))
            img_class.downScale(1200, os.path.join(x2, extract_name[0] + '-x2.' + self.extension))
            img_class.downScale(100, os.path.join(ps, extract_name[0] + '-ps.' + self.extension))

        return

    # Return image filename
    def getFilename(self):
        return self.filename

    # Return image extension
    def getExtension(self):
        return self.extension

    # Return image width
    def getWidth(self):
        cwd = os.getcwd()
        file_dir = os.path.join(cwd, 'server/common/store/upload/image', self.uuid, 'main')
        for filename in glob.glob(os.path.join(file_dir, 'original', '*')):
            img_class = Img(filename)
            width = img_class.getWidth()
        
        return width

    # Return image height
    def getHeight(self):
        cwd = os.getcwd()
        file_dir = os.path.join(cwd, 'server/common/store/upload/image', self.uuid, 'main')
        for filename in glob.glob(os.path.join(file_dir, 'original', '*')):
            img_class = Img(filename)
            height = img_class.getHeight()

        return height

    # Return image file size
    def getFileSize(self):
        cwd = os.getcwd()
        file_dir = os.path.join(cwd, 'server/common/store/upload/image', self.uuid, 'main')
        for filename in glob.glob(os.path.join(file_dir, 'original', '*')):
            img_class = Img(filename)
            file_size = img_class.getFileSize()

        return file_size