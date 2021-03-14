# stuvio
This existing project is belong to Mahidol University, Faculty of Information Communication and Technology. We implemented for the academic Senior Porject and manipulate for non-profit purpose.

**Advisor:**
1. Akara Supratak

**Team:**
1. Prach Yothaprasert
2. Rattanavaree Muangmai
3. Waris ???

## Paper Implementation
* [Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network](https://arxiv.org/pdf/1609.04802.pdf)
* [Learned Image Downscaling For Upscaling Using Content Adaptive Resampler](https://arxiv.org/pdf/1907.12904v2.pdf)
* [Learning Temporal Coherence via Self-Supervision of GAN-based Video Generation](https://github.com/thunil/TecoGAN)

## Setup
### Requirements
* Git
* Docker
* Nvidia GPU
* Nvidia CUDA 10.1
* Python=3.6.9
### Installation
`last modified: 24 Feb 2020` \
***We include `.env` inside git for easy installation guide***
```sh
git clone git@github.com:Poafs1/stuvio.git
cd stuvio
```
Create image and video directories in server-side
```sh
mkdir app/server/python/server/common/store/upload/image
mkdir app/server/python/server/common/store/upload/video
```
Download Deep Learning traning model from Google Drive [link](https://drive.google.com/file/d/1GM1wUHowN_35f4mPQuK0ZqeEhf_lkt4x/view?usp=sharing) \
Replace it in directory `app/server/python/server/common/deepLearningModel/`

### Start Docker
#### Client + Database
```sh
cd stuvio/app
```
```sh
docker-compose up --build
```
Initialize Database
```sh
cd data/mongo/build
```
```sh
sh run.sh
```
#### Server
Server-Side need to build separately for access host GPU
```sh
cd stuvio/app/server/python
```
Build docker image from Dockerfile
```sh
docker build -t stuvio-server .
```
Run docker container at root directory
```sh
cd stuvio/app
```
```sh
docker run -p 5000:5000 -it --mount type=bind,source="$(pwd)/server/python/server",target=/server --gpus all --network app_stuvio --name server stuvio-server
```
| Command | Default | Details |
| -- | -- | -- |
| `p` | 5000 | Server running port |
| `mount` | Server directory | Bind mount |
| `gpus` | all | Specific GPU for Docker to access |
| `network` | app_stuvio | Set Docker network for Server |
| `name` | server | Container name |

## Bug Report
none

## Feature Work
* Implement queueing system

## Meeting Note
#### Meeting 001 `31 Jul 2020`
- [X] Finish lecture courses cs231n
- [X] Finalize senior project topic **[Super Resolution]**

#### Meeting 002 `04 Aug 2020`
#### :trophy: 1 month goal: implement GANs
- [X] read [twitter paper](https://arxiv.org/pdf/1609.04802.pdf)
- [X] read [wuhan university paper](https://arxiv.org/pdf/1907.12904v2.pdf)
- [github code](https://github.com/sunwj/CAR)

#### 1st week task
- [X] learn Python \
&nbsp; • basic python \
&nbsp; • numpy \
&nbsp; • scipy \
&nbsp; • [PyTorch](https://pytorch.org/get-started/locally/)
- [X] read GANs paper
- [X] try CNN (Convolutional Neural Network)

#### Meeting 003 `11 Aug 2020`
- [X] continue [twitter paper](https://arxiv.org/pdf/1609.04802.pdf)
- [X] read [wuhan university paper](https://arxiv.org/pdf/1907.12904v2.pdf)
- [X] [PyTorch](https://pytorch.org/get-started/locally/) img tutorial
- [X] [Wuhan github code](https://github.com/sunwj/CAR)

#### Meeting 004 `19 Aug 2020`
- [X] summary diff. of twitter paper & wuhan paper
- [X] PSNR measurement: how to
- [X] working notebook of SRGAN \
&nbsp; • twitter \
&nbsp; • wuhan
- [X] NSC apply

#### Meeting 005 `25 Aug 2020`
- [X] summary twitter & wuhan
- [X] working notebook of SRGAN \
&nbsp; • twitter \
&nbsp; • wuhan

#### Meeting 006 `01 Sep 2020`
- [X] PSNR - SSIM - MOS measurement, example
- [X] try to run notebook of SRGAN \
&nbsp; • twitter \
&nbsp; • wuhan
- [X] NSC draft (bullet point - gg docs)

#### Meeting 007 `08 Sep 2020`
- [X] NSC draft - in bullet
- [X] teco paper
- [X] try [teco model](https://github.com/thunil/TecoGAN)
- [X] test twitter's training model **if can't access then destoy**
- [X] try ffmpeg - extract vdo & combine w/ twitter & wuhan model

#### Meeting 008 `15 Sep 2020`
- [X] NSC proposal \
&nbsp; • SR application (paper: 10) \
&nbsp;&nbsp; • livestream idea : select SR part (ex. football highlight)
- [X] measurement table \
&nbsp; • more blur, bright, etc. \
&nbsp; • TecoGAN paper
- [X] test more vdo\
&nbsp; • game \
&nbsp; • gartoon

#### Meeting 009 `23 Sep 2020`
- [X] NSC proposal \
&nbsp; • docs \
&nbsp; • apply
- [X] vdo measurement \
&nbsp; • TecoGAN paper

#### Meeting 010 `29 Sep 2020`
- [X] client demo
- [X] api
- [X] NSC -> slide (eng.) \
&nbsp; • problem(motivation) -> objective -> slove -> li. review (ส่วนไหนใหม่ - เว็บที่เข้าถึงง่าย) \
&nbsp; • present technology (TV, ...)

#### Meeting 011 `06 Oct 2020`
- no task, midterm first

#### `13 Oct 2020` no meeting

#### Meeting 012 `20 Oct 2020`
- [X] proposal slide outline :bangbang: \
&nbsp; • summary all information (more paper in teams) \
&nbsp; • contrast and compare (literature review) 
- [X] web demo for proposal \
&nbsp; • only image \
&nbsp; • tried without GPU, only CPU (seperate docker - GPU, CPU version)

#### Proposal Presentation
---------------------------------------------------------------
#### Meeting 017 `1 Dec 2020`
- [X] finish client
- [X] Poster draft

#### Meeting 018 `5 Jan 2021`
- [X] NSC draft (outline)
- [X] demo

## Resources
1. [PyTorch Documents](https://pytorch.org/docs/stable/nn.html#convolution-layers)
2. [Wuhan github code](https://github.com/sunwj/CAR)
3. [Tutorial SRGANs coding completed, but incomplete tutorial](https://github.com/sgrvinod/a-PyTorch-Tutorial-to-Super-Resolution)
4. [SRGANs code](https://github.com/aitorzip/PyTorch-SRGAN)
5. [SREZ with TensorFlow](https://github.com/david-gpu/srez)
6. [SRGANs twitter implementation ex 01](https://github.com/leftthomas/SRGAN)
7. [SRGANs twitter implementation ex 02](https://github.com/twtygqyy/pytorch-SRResNet)
8. [All GANs](https://github.com/eriklindernoren/PyTorch-GAN)
9. [SRGANs 03](https://github.com/eriklindernoren/PyTorch-GAN/blob/master/implementations/srgan/srgan.py)
10. [SR survey](https://arxiv.org/pdf/1902.06068.pdf)
