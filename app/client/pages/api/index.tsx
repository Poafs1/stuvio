import { HOST, PORT } from '../../configs'
import fetch from 'node-fetch'
import FormData from 'form-data'

// Base domain name
const domain = `${HOST}:${PORT}/api`

interface VideoThumbnailITF {
  id: string,
  start: number,
  end: number,
  interval: number,
  duration: number,
  type: string,
  quality: string
}

interface VideoFrameThumbnailITF {
  id: string,
  frame: number
}

interface ImageThumbnailITF {
  id: string,
  type: string,
  quality: string
}

interface GetVideoByIdITF {
  id: string,
  type: string,
  extension: string,
  originalResolution: string
}

interface RotateITF {
  id: string
  angle: number
  crop?: boolean
  width?: number
  height?: number
  x?: number
  y?: number
}

interface TrimITF {
  id: string
  start: number
  end: number
}

interface CropITF {
  id: string
  width: number
  height: number
  x: number
  y: number
  trim?: boolean
  start?: number
  end?: number
  rotate?: boolean
  angle?: number
}

export interface RatePaperStyleITF {
  algorithm: string,
  style: string
}

export interface EnhancedVideoITF {
  id: string
  algorithm: string
  model: string
  modelVersion: number
  crop?: boolean
  width?: number
  height?: number
  x?: number
  y?: number
  trim?: boolean
  start?: number
  end?: number
}

export interface EnhancedImageITF {
  id: string
  algorithm: string
  model: string
  modelVersion: number
  crop?: boolean
  width?: number
  height?: number
  x?: number
  y?: number
  rotate?: boolean
  angle?: number
}

export interface EnhancedVideoFrameITF {
  id: string
  algorithm: string
  model: string
  modelVersion: number
  frameDuration: number
  crop?: boolean
  width?: number
  height?: number
  x?: number
  y?: number
}

// Files Api interface
export interface FilesITF {
  uploadVideo: (file: File) => void,
  uploadImage: (file: File) => void,
  getAllVideo: () => void, // เอา thumbnail ทุกไฟล์มาแสดง
  getAllImage: () => void,
  getVideoThumbnail: (body: VideoThumbnailITF) => void,
  getVideoFrameThumbnail: (body: VideoFrameThumbnailITF) => void,
  getImageThumbnail: (body: ImageThumbnailITF) => void,
  getVideoById: (body: GetVideoByIdITF) => void,  // เลือก video แค่อันเดียวด้วย video id
  getVideoInfoById: (id: string) => void,
  getImageById: (id: string) => void,
  removeVideoById: (id: string) => void,
  removeImageById: (id: string) => void
}

// Tools Api interface
export interface ToolsITF {
  ping: () => void, // test ping pong
  cropImage: (body: CropITF) => void,
  cropVideo: (body: CropITF) => void,
  trim: (body: TrimITF) => void // trim video ที่ server
  rotate: (body: RotateITF) => void
}

// Render Api interface
export interface RenderITF {
  enhanceVideo: (body: EnhancedVideoITF) => void, // ขยาย video
  enhanceImage: (body: EnhancedImageITF) => void, // ขยาย image
  captureVideoFrame: (body: EnhancedVideoFrameITF) => void // ขยาย video แค่ frame ที่อยากได้
  testEnhanceVideo: (id: string) => void
  downloadSuperResolutionVideo: (id: string) => void
  downloadSuperResolutionImage: (id: string) => void
  downloadSuperResolutionVideoFrame: (id: string) => void
}

export interface StyleITF {
  name: string,
  label: string,
  rate: number
}

export interface PaperInfoITF {
  algorithm: string,
  algorithmLabel: string,
  styles: StyleITF[]
  paper: string,
  link: string,
  technique: string,
  authors: string,
  type: string
}

// Paper Api interface
export interface PaperITF {
  getByType: (type: string) => void
  rate: (body: RatePaperStyleITF) => void
}

export class FilesClass implements FilesITF {

  // Upload new video
  async uploadVideo(file: File) {
    const formData: FormData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${domain}/upload/video`, {
      method: "POST",
      body: formData,
    })
    return res
  }

  // Upload new image
  async uploadImage(file: File) {
    const formData: FormData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${domain}/upload/image`, {
      method: "POST",
      body: formData
    })
    return res
  }

  // Get all video (only information)
  async getAllVideo() {
    const res = await fetch(`${domain}/files/get/all/video`)
    return res
  }

  // Get all image include base64 file
  async getAllImage() {
    const res = await fetch(`${domain}/files/get/all/image`)
    return res
  }

  // Get specific video by id
  async getVideoById(body: GetVideoByIdITF) {
    const res = await fetch(`${domain}/files/get/video`, {
      method: 'POST',
      body: JSON.stringify(body),
		  headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Get video information by specific video id
  async getVideoInfoById(id: string) {
    const res = await fetch(`${domain}/files/get/video/info`, {
      method: 'POST',
      body: JSON.stringify({"id": id}),
		  headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Get specific image by id
  async getImageById(id: string) {
    const res = await fetch(`${domain}/files/get/image`, {
      method: 'POST',
      body: JSON.stringify({"id": id}),
		  headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Get thumbnail images from video
  async getVideoThumbnail(body: VideoThumbnailITF) {
    const res = await fetch(`${domain}/files/get/thumbnail/video`, {
      method: 'POST',
      body: JSON.stringify(body),
		  headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Get thumbnail from video in specific frame
  async getVideoFrameThumbnail(body: VideoFrameThumbnailITF) {
    const res = await fetch(`${domain}/files/get/thumbnail/video/frame`, {
      method: 'POST',
      body: JSON.stringify(body),
		  headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Get thumbnail image
  async getImageThumbnail(body: ImageThumbnailITF) {
    const res = await fetch(`${domain}/files/get/thumbnail/image`, {
      method: 'POST',
      body: JSON.stringify(body),
		  headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Remove single video
  async removeVideoById(id: string) {
    const res = await fetch(`${domain}/files/remove/video`, {
      method: 'POST',
      body: JSON.stringify({"id": id}),
		  headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Remove single image
  async removeImageById(id: string) {
    const res = await fetch(`${domain}/files/remove/image`, {
      method: 'POST',
      body: JSON.stringify({"id": id}),
		  headers: {'Content-Type': 'application/json'}
    })
    return res
  }

}

export class ToolsClass implements ToolsITF {

  // Test pingpong function
  async ping() {

  }

  // Crop video and get new file
  async cropVideo(body: CropITF) {
    const res = await fetch(`${domain}/tools/crop/video`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Crop image and get new file
  async cropImage(body: CropITF) {
    const res = await fetch(`${domain}/tools/crop/image`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Trim video and get new file
  async trim(body: TrimITF) {
    const res = await fetch(`${domain}/tools/trim`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Rotate image and get new file
  async rotate(body: RotateITF) {
    const res = await fetch(`${domain}/tools/rotate`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

}

export class RenderClass implements RenderITF {

  // Enhance video file
  async enhanceVideo(body: EnhancedVideoITF) {
    const res = await fetch(`${domain}/render/enhanced/video`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Enhance image file
  async enhanceImage(body: EnhancedImageITF) {
    const res = await fetch(`${domain}/render/enhanced/image`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Capture only 1 specific frame from video and enhance
  async captureVideoFrame(body: EnhancedVideoFrameITF) {
    const res = await fetch(`${domain}/render/enhanced/video/frame`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Test enhancing video and get black & white preview
  async testEnhanceVideo(id: string) {
    const res = await fetch(`${domain}/render/enhanced/video/test`, {
      method: 'POST',
      body: JSON.stringify({ "id": id }),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Download super-resolution video
  async downloadSuperResolutionVideo(id: string) {
    const res = await fetch(`${domain}/render/enhanced/video/download`, {
      method: 'POST',
      body: JSON.stringify({ "id": id }),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Download super-resolution image
  async downloadSuperResolutionImage(id: string) {
    const res = await fetch(`${domain}/render/enhanced/image/download`, {
      method: 'POST',
      body: JSON.stringify({ "id": id }),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Download super-resolution video in specific frame [enhance with image algorithm model]
  async downloadSuperResolutionVideoFrame(id: string) {
    const res = await fetch(`${domain}/render/enhanced/video/frame/download`, {
      method: 'POST',
      body: JSON.stringify({ "id": id }),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

}

export class PaperClass implements PaperITF {

  // Get paper information by type
  async getByType(type: string) {
    const res = await fetch(`${domain}/paper/get/info`, {
      method: 'POST',
      body: JSON.stringify({ "type": type }),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

  // Rate paper algorithm style
  async rate(body: RatePaperStyleITF) {
    const res = await fetch(`${domain}/paper/rate/algostyle`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    return res
  }

}