from PIL import Image
import sys, os, base64
from io import BytesIO

class Img:
    # Init Img class variable [v1]
    def __init__(self, filename):
        self.filename = filename
        self.extension = self.filename.rsplit('.',1)[1]
        self.img = Image.open(self.filename)
        self.width, self.height = self.img.size
        self.file_size = os.stat(filename).st_size

    # Downscale image resolution with keep aspect ratio
    def downScale(self, ratio, output_path):
        image = self.img
        image.thumbnail((ratio, ratio), Image.ANTIALIAS)
        image.save(output_path, dpi=[72, 72], quality=75, optimize=True, progressive=True)
        return

    # Get image preview as base64
    def getPreview(self):
        buffered = BytesIO()
        if self.extension.lower() == 'png':
            self.img = self.img.convert('RGB')
        self.img.save(buffered, format='JPEG')
        img_str = base64.b64encode(buffered.getvalue())

        return "data:image/jpeg;base64," + img_str.decode('utf-8')

    # Return image width
    def getWidth(self):
        return self.width

    # Return image height
    def getHeight(self):
        return self.height

    # Return image file size
    def getFileSize(self):
        return self.file_size
