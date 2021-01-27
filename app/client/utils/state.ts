// Set hook state
export interface StateITF {
  componentMount: boolean,
  studio: StudioITF,
  download: DownloadITF,
  usePaper: UsePaperITF,
  crop: CropStateITF,
  trim: TrimStateITF,
  rotate: RotateStateITF
}

export interface StudioITF {
  status: boolean,
  objectUrl: string,
  fileId: string,
  fileName: string,
  extension: string,
  autoPlay: boolean,
  isPlay: boolean,
  file: File|undefined,
  isVideo: boolean,
  fileType: string,
  duration: number,
  dimensionWidth: number,
  dimensionHeight: number,
  fps: number|undefined,
  originalResolution: string,
  previewFilesType: number,
  updateContainer: boolean
}

export interface DownloadITF {
  status: boolean,
  algorithm: string,
  style: string,
  paperName: string,
  link: string,
  technique: string,
  authors: string,
  mse: number,
  ssim: number,
  psnr: number
}

export interface UsePaperITF {
  algorithm: string
  algorithmLabel: string
  styleName: string
  styleLabel: string
  styleRate: number
  paper: string
  link: string
  technique: string
  authors: string
  type: string
}

export interface CropStateITF {
  status: boolean
  width: number
  height: number
  x: number
  y: number
}

export interface TrimStateITF {
  status: boolean
  start: number
  end: number
}

export interface RotateStateITF {
  status: boolean
  angle: number
}