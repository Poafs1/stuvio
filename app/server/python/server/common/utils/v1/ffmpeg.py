import sys, os
import ffmpeg

def getResolutionPath(resolution):
    if resolution <= 144:
        return '144p'
    elif resolution > 144 and resolution <= 240:
        return '240p'
    elif resolution > 240 and resolution <= 360:
        return '360p'
    elif resolution > 360 and resolution <= 480:
        return '480p'
    elif resolution > 480 and resolution <= 540:
        return '540p'
    elif resolution > 540 and resolution <= 720:
        return '720p'
    elif resolution > 720 and resolution <= 1080:
        return '1080p'
    elif resolution > 1080 and resolution <= 1440:
        return '1440p'
    elif resolution > 1440 and resolution <= 2160:
        return '2160p'
    elif resolution > 2160 and resolution <= 4320:
        return '4320p'
    else:
        return '144p'

def getResolutionRatio(resolution):
    return {
        '8k': '7680:4320',
        '4k': '3840:2160',
        '2k': '2560:1440',
        '1080p': '1920:1080',
        '720p': '1280:720',
        '540p': '960:540',
        '480p': '854:480',
        '360p': '640:360',
        '240p': '426:240',
        '144p': '176:144'
    }.get(resolution, 'other')

class FFMPEG:
    # Init FFMPEG class variable
    def __init__(self, uuid, extension):
        cwd = os.getcwd()
        file_dir = os.path.join(cwd, 'server/common/store/upload/video', uuid, f'main/original/{uuid}-original.{extension}')
        
        try:
            probe = ffmpeg.probe(file_dir)
        except ffmpeg.Error as e:
            raise Exception(e)

        video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
        if video_stream is None:
            raise Exception('Video stream is None')
        
        self.uuid = uuid
        self.extension = extension
        self.original_path = file_dir
        self.file_size = os.stat(file_dir).st_size
        self.duration = round(float(video_stream['duration']), 2)
        self.width = int(video_stream['width'])
        self.height = int(video_stream['height'])

        avg_frame_rate = video_stream['avg_frame_rate']
        split_avg_frame_rate = avg_frame_rate.split('/')
        self.fps = round(int(split_avg_frame_rate[0]) / int(split_avg_frame_rate[1]), 2)
        self.resolution = getResolutionPath(self.height)

    # Downscale video
    def downScale(self, resolution):
        cwd = os.getcwd()
        output_dir = os.path.join(cwd, 'server/common/store/upload/video', self.uuid, f'main/{resolution}/{self.uuid}-{resolution}.{self.extension}')

        if os.path.exists(output_dir) is True:
            return
            
        os.system(f'ffmpeg -i {self.original_path} -vf scale={getResolutionRatio(resolution)} {output_dir}')
        return

    # Extract image from video
    def extractFrameFromVideo(self, output_path, fps):
        os.system(f'ffmpeg -i {self.original_path} -vf fps={fps} {output_path}')
        return

    # Return video resolution
    def getResolution(self):
        return self.resolution

    # Return video duration
    def getDuration(self):
        return self.duration

    # Return video file size
    def getFileSize(self):
        return self.file_size

    # Return video frame rate per sec
    def getFps(self):
        return self.fps

    # Return video width
    def getWidth(self):
        return self.width

    # Return video height
    def getHeight(self):
        return self.height