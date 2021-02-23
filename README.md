# Stuvio.io The Web Application for Generate Super-Resolution

## Setup
### Requirements
* Git
* Docker
### Installation
`last modified: 23 Feb 2020`
```sh
git clone git@github.com:Poafs1/stuvio.git
cd stuvio
```
Create image and video directories in server-side
```sh
mkdir app/server/python/server/common/store/upload/image
mkdir app/server/python/server/common/store/upload/video
```
Download Deep Learning traning model from Google Drive [link](https://drive.google.com/file/d/1PyAJw5yg9_Jp-Q93B3BqAgv-jsRay3wB/view?usp=sharing)
Put it in directory `app/server/python/server/common/deepLearningModel/`

### Start Docker
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

## Bug Report
* Content Adaptive Resampler is not working with API

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
