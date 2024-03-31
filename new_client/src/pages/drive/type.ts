import { FileAndFloderType } from "@/types/FileAndFloderType"

export type DriveProps = {
  width: number
  height: number
  isShowlVideo: boolean
  videoList: []
  isShowNewFileModel: boolean
  isShowRightMenu: boolean
  showRightMenuType: string
  rightMenuItem: { type: string; id: string }
  fileData: FileAndFloderType[]
}

export type DriveEmits = {}
