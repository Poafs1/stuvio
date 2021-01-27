import os, sys, glob
from common.utils.v1.ffmpeg import FFMPEG
from common.utils.v1.img import Img
import math

ALLOWED_RESOLUTION = ['original', '4k', '2k', '1080p', '720p', '540p', '480p', '360p', '240p','144p']
ALLOWED_EXTENSIONS = { 'mp4' }

# Check video file extension with ALLOWED_EXTENSIONS
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class VideoFile:
    # Init VideoFile class variable
    def __init__(self, uuid, video_file):
        self.uuid = uuid
        self.video_file = video_file
        
        if video_file.filename == '':
            raise Exception('Filename is undefined')
        
        if video_file and allowed_file(video_file.filename) is False:
            raise Exception('Unhandle file type')

        self.full_name = video_file.filename
        self.filename = self.full_name.rsplit(".",1)[0]
        self.extension = self.full_name.rsplit(".",1)[1]

    # Create folder for storing video files
    def initFolder(self):
        cwd = os.getcwd()
        file_dir = os.path.join(cwd, 'server/common/store/upload/video', self.uuid)

        if os.path.exists(file_dir) == True:
            return
        
        os.mkdir(file_dir)
        os.mkdir(os.path.join(file_dir, 'main'))
        os.mkdir(os.path.join(file_dir, 'extracted-img'))
        for _, v in enumerate(ALLOWED_RESOLUTION):
            os.mkdir(os.path.join(file_dir, 'main', v))

        self.video_file.save(os.path.join(file_dir, 'main', 'original', f'{self.uuid}-original.{self.extension}'))

    # Extract image from video file and store in server directory
    def extractedImageFromFrame(self, export_type='jpeg'):
        try:
            ffmpeg_class = FFMPEG(self.uuid, self.extension)
        except:
            raise Exception('Init FFmpeg class error in save original and lower quality')

        cwd = os.getcwd()
        file_dir = os.path.join(cwd, 'server/common/store/upload/video', self.uuid, f'extracted-img')

        if os.path.exists(os.path.join(file_dir, 'original')) is False:
            os.mkdir(os.path.join(file_dir, 'original'))

            duration = ffmpeg_class.getDuration()
            fps = ffmpeg_class.getFps()
            find_base = int(math.log10(duration * fps)) + 1

            output_path = os.path.join(file_dir, 'original', self.uuid + '-original-' + f'%0{find_base}d' + '.' + export_type)
            ffmpeg_class.extractFrameFromVideo(output_path, 1)

        original_frame = os.path.join(file_dir, 'original-frame')
        if os.path.exists(original_frame) is False:
            os.mkdir(original_frame)

            duration = ffmpeg_class.getDuration()
            fps = ffmpeg_class.getFps()
            find_base = int(math.log10(duration * fps)) + 1

            output_path = os.path.join(original_frame, self.uuid + '-original-frame-' + f'%0{find_base}d' + '.png')
            ffmpeg_class.extractFrameFromVideo(output_path, ffmpeg_class.getFps())

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
            # print(filename)
            full_path = filename.rsplit('/')[-1]
            extract_name = full_path.split('-')
            
            img_class = Img(filename)
            img_class.downScale(1800, os.path.join(x1, extract_name[0] + '-x1-' + extract_name[2]))
            img_class.downScale(1200, os.path.join(x2, extract_name[0] + '-x2-' + extract_name[2]))
            img_class.downScale(100, os.path.join(ps, extract_name[0] + '-ps-' + extract_name[2]))

        return

    # Extract video resolution
    def saveOriginalAndLowerQuality(self, resolution):
        allow_indx = False

        try:
            ffmpeg_class = FFMPEG(self.uuid, self.extension)
        except:
            raise Exception('Init FFmpeg class error in save original and lower quality')

        for _, v in enumerate(ALLOWED_RESOLUTION):
            if v == resolution:
                allow_indx = True
            if allow_indx is True:
                ffmpeg_class.downScale(v)

        return

    # Return video extension
    def getExtension(self):
        return self.extension

    # Return video filename
    def getFilename(self):
        return self.filename