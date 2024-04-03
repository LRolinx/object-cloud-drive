import { FileAndFloderType } from "@/types/FileAndFolderType"

export type DriveProps = {
  width: number
  height: number
  isShowlVideo: boolean
  videoList: []
  isShowRightMenu: boolean
  showRightMenuType: string
  rightMenuItem: { type: string; id: string }
  fileData: FileAndFloderType[]
}

export type DriveEmits = {}
