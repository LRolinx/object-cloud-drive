
export const GetFileTypeInItem = (item: any) => {
	let typeStr = {
	  type: '',
	  iconStr: 'icon-unknown',
	}
	if (item.fileType == null) {
	  //使用后缀判断
	  if (item.suffix != null) {
		switch (item.suffix.toLowerCase()) {
		  // 图片
		  case 'png': {
			typeStr.type = 'image'
			typeStr.iconStr = 'icon-pic'
			break
		  }
		  case 'jpg': {
			typeStr.type = 'image'
			typeStr.iconStr = 'icon-pic'
			break
		  }
		  case 'jpeg': {
			typeStr.type = 'image'
			typeStr.iconStr = 'icon-pic'
			break
		  }
		  case 'gif': {
			typeStr.type = 'image'
			typeStr.iconStr = 'icon-pic'
			break
		  }
		  case 'eps': {
			typeStr.type = 'image'
			typeStr.iconStr = 'icon-pic'
			break
		  }
		  case 'exr': {
			typeStr.type = 'image'
			typeStr.iconStr = 'icon-pic'
			break
		  }
		  case 'svg': {
			typeStr.type = 'image'
			typeStr.iconStr = 'icon-pic'
			break
		  }
		  case 'tga': {
			typeStr.type = 'image'
			typeStr.iconStr = 'icon-pic'
			break
		  }
		  case 'bmp': {
			typeStr.type = 'image'
			typeStr.iconStr = 'icon-pic'
			break
		  }
		  case 'tiff': {
			typeStr.type = 'image'
			typeStr.iconStr = 'icon-pic'
			break
		  }

		  // 视频
		  case 'mp4': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case 'avi': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case 'wmv': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case 'm4v': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case 'mov': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case 'asf': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case 'flv': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case 'f4v': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case 'rmvb': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case 'rm': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case '3gp': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }
		  case 'vob': {
			typeStr.type = 'video'
			typeStr.iconStr = 'icon-video'
			break
		  }

		  // 音频
		  case 'mp3': {
			typeStr.type = 'audio'
			typeStr.iconStr = 'icon-music'
			break
		  }
		  case 'aac': {
			typeStr.type = 'audio'
			typeStr.iconStr = 'icon-music'
			break
		  }
		  case 'wav': {
			typeStr.type = 'audio'
			typeStr.iconStr = 'icon-music'
			break
		  }
		  case 'ogg': {
			typeStr.type = 'audio'
			typeStr.iconStr = 'icon-music'
			break
		  }
		  case 'alac': {
			typeStr.type = 'audio'
			typeStr.iconStr = 'icon-music'
			break
		  }
		  case 'flac': {
			typeStr.type = 'audio'
			typeStr.iconStr = 'icon-music'
			break
		  }
		  case 'ape': {
			typeStr.type = 'audio'
			typeStr.iconStr = 'icon-music'
			break
		  }

		  // 文本
		  case 'txt': {
			typeStr.type = 'text'
			typeStr.iconStr = 'icon-txt'
			break
		  }
		  case 'html': {
			typeStr.type = 'text'
			typeStr.iconStr = 'icon-html'
			break
		  }
		  case 'css': {
			typeStr.type = 'text'
			typeStr.iconStr = 'icon-css'
			break
		  }
		  case 'xlsx': {
			typeStr.type = 'text'
			typeStr.iconStr = 'icon-excel'
			break
		  }
		  case 'doc': {
			typeStr.type = 'text'
			typeStr.iconStr = 'icon-word'
			break
		  }
		  case 'docx': {
			typeStr.type = 'text'
			typeStr.iconStr = 'icon-word'
			break
		  }
		  case 'pdf': {
			typeStr.type = 'text'
			typeStr.iconStr = 'icon-pdf'
			break
		  }
		  case 'ppt': {
			typeStr.type = 'text'
			typeStr.iconStr = 'icon-ppt'
			break
		  }

		  //压缩
		  case 'zip': {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-zip'
			break
		  }
		  case 'jar': {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-zip'
			break
		  }
		  case '7z': {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-zip'
			break
		  }
		  case 'rar': {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-zip'
			break
		  }

		  //其他文件
		  case 'psd': {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-unknown'
			break
		  }
		  case 'xmind': {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-xmind'
			break
		  }
		  case 'bt': {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-bt'
			break
		  }
		  case 'exe': {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-windows'
			break
		  }
		  case 'msi': {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-windows'
			break
		  }
		  case 'apk': {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-Android-hover'
			break
		  }

		  default: {
			typeStr.type = '*'
			typeStr.iconStr = 'icon-unknown'
		  }
		}
	  }
	}
	return typeStr
  }
