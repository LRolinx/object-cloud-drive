/**
 * <p>
 *  API列表
 * </p>
 * @author LRolinx
 * @create 2024-03-30 13:26
 */
export const API_LIST = {
  USER: {
    GET_PUBLICKEY: '/user/getpublickey',
    LOGIN: '/user/login',
    REGISTERED: '/user/registered',
  },
  UPDATE: {
    EXAMINE_FILE: '/upload/examineFile',
    UPLOAD_STREAMFILE: '/upload/uploadStreamFile',
  },
  DRIVE: {
    GET_USERFILEANDFOLDER: '/drive/getUserFileAndFolder',
    ADD_USERFOLDER: '/drive/addUserFolder',
    GET_USERFILEFORFILEID: '/drive/getUserFileForFileId',
    DEL_USERFILEORFOLDER: '/drive/delUserFileOrFolder',
  },
  VIDEO: {
    GET_VIDEOSCEENSHOTS: '/video/getVideoSceenshots',
    PLAY_VIDEOSTEAM: '/video/playVideoSteam',
  },
}
