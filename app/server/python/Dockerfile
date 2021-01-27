FROM python:3.8

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

WORKDIR .
ADD requirements.txt .
RUN pip3 install -r requirements.txt
RUN pip install torch==1.7.1+cpu torchvision==0.8.2+cpu torchaudio==0.7.2 -f https://download.pytorch.org/whl/torch_stable.html
ADD . /server
ENTRYPOINT ["python", "server/app.py"]