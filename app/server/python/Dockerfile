FROM nvidia/cuda:10.1-base-ubuntu18.04

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get install -y python3.8
RUN apt-get install -y python3-pip
RUN apt-get install -y ffmpeg

COPY . .
RUN pip3 install --upgrade pip
RUN pip3 install flask
RUN pip3 install -r requirements.txt
# RUN pip install torch==1.7.1+cu101 torchvision==0.8.2+cu101 torchaudio==0.7.2 -f https://download.pytorch.org/whl/torch_stable.html
RUN pip install torch==1.7.1+cpu torchvision==0.8.2+cpu torchaudio==0.7.2 -f https://download.pytorch.org/whl/torch_stable.html
WORKDIR /
ENTRYPOINT ["python3", "server/app.py"]