FROM nvidia/cuda:10.1-cudnn7-devel-ubuntu18.04

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get install -y python3.8 
RUN apt-get install -y python3-pip 
RUN apt-get install -y ffmpeg 
# RUN apt-get install -y nvidia-cuda-toolkit

RUN pip3 install --upgrade pip
RUN pip3 install torch==1.7.1+cu101 torchvision==0.8.2+cu101 torchaudio==0.7.2 -f https://download.pytorch.org/whl/torch_stable.html
# RUN pip install torch==1.7.1+cpu torchvision==0.8.2+cpu torchaudio==0.7.2 -f https://download.pytorch.org/whl/torch_stable.html

RUN pip3 install flask flask-RESTful ffmpeg-python pymongo Pillow \
uuid flask-cors python-dotenv numpy scipy scikit-image matplotlib pandas \
Keras opencv-python ipython tensorflow tensorflow-addons tf_slim opencv-python \
opencv-contrib-python tqdm scikit-build cmake cppimport

RUN apt-get install nano

COPY . .
# RUN pip3 install -r requirements.txt
WORKDIR /
ENTRYPOINT ["python3", "server/app.py"]
