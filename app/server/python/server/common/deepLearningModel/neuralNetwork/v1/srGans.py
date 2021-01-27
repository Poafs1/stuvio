import torch
from PIL import Image
from torch.autograd import Variable
from torchvision.transforms import ToTensor, ToPILImage
import math

from common.deepLearningModel.model.srGans.v1.model import Generator

from dotenv import load_dotenv
import os
load_dotenv()

class SrGans:
    # Init SrGans class variable
    def __init__(self, image_id, model, model_version, extension, is_image=True, duration=None, frame_duration=None):
        self.image_id = image_id
        self.model = model
        cwd = os.getcwd()
        self.model_path = os.path.join(cwd, 'server/common/deepLearningModel/model/srGans', f'v{model_version}', model, 'netG.pth')
        self.model_version = model_version
        self.upscale_factor = 4
        self.test_mode = os.getenv('GPU')
        if is_image is True:
            self.original_path = os.path.join(cwd, 'server/common/store/upload/image', image_id, 'main/original', f'{image_id}-original.{extension}')
        else:
            try:
                find_base = int(math.log10(duration))+1
            except:
                pass

            self.original_path = os.path.join(cwd, 'server/common/store/upload/video', image_id, 'extracted-img/original-frame', image_id + '-original-frame-' + f'%0{find_base}d' % frame_duration + '.png')

        pass

    # Enhance super-resolution image
    def enhance(self):
        model = Generator(self.upscale_factor).eval()

        if self.test_mode is True:
            model.cuda()
            model.load_state_dict(torch.load(self.model_path))
        else:
            model.load_state_dict(torch.load(self.model_path, map_location=lambda storage, loc: storage))

        with torch.no_grad():
            image = Image.open(self.original_path)
            image = ToTensor()(image).unsqueeze(0)
            image = Variable(image)

            if self.test_mode is True:
                image = image.cuda()

            out = model(image)

        cwd = os.getcwd()
        save_path = os.path.join(cwd, 'server/common/store/upload/image', self.image_id, 'main/super-resolution')
        try:
            os.mkdir(save_path)
        except OSError:
            pass

        out_img = ToPILImage()(out[0].data.cpu())
        out_img.save(os.path.join(save_path, f'{self.image_id}-super-resolution.jpeg'))

        return

    # Enhance super-resolution image on specific video frame
    def enhanceFrame(self):
        model = Generator(self.upscale_factor).eval()

        if self.test_mode is True:
            model.cuda()
            model.load_state_dict(torch.load(self.model_path))
        else:
            model.load_state_dict(torch.load(self.model_path, map_location=lambda storage, loc: storage))

        with torch.no_grad():
            image = Image.open(self.original_path)
            image = ToTensor()(image).unsqueeze(0)
            image = Variable(image)

            if self.test_mode is True:
                image = image.cuda()

            out = model(image)

        cwd = os.getcwd()
        save_path = os.path.join(cwd, 'server/common/store/upload/video', self.image_id, 'extracted-img/super-resolution-frame')
        try:
            os.mkdir(save_path)
        except OSError:
            pass

        out_img = ToPILImage()(out[0].data.cpu())
        out_img.save(os.path.join(save_path, f'{self.image_id}-super-resolution.jpeg'))

        return