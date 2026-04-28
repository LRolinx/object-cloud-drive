/**
 * <p>
 *  API列表
 * </p>
 * @author LRolinx
 * @create 2024-03-30 13:26
 */
export const API_LIST = {
    BASEURL: 'http://192.168.50.48:3000',
    USER: {
        GET_PUBLICKEY: '/user/getpublickey',
        LOGIN: '/user/login',
        REGISTERED: '/user/registered',
        UPDATE_AVATAR: '/user/updateAvatar',
    },
    UPDATE: {
        EXAMINE_FILE: '/upload/examineFile',
        UPLOAD_STREAMFILE: '/upload/uploadStreamFile',
        UPLOAD_SECONDPASS: '/upload/uploadSecondPass',
    },
    DRIVE: {
        GET_USERFILEANDFOLDER: '/drive/getUserFileAndFolder',
        ADD_USERFOLDER: '/drive/addUserFolder',
        BATCHADD_USERFOLDER: '/drive/batchAddUserFolder',
        GET_USERFILEFORFILEID: '/drive/getUserFileForFileId',
        DOWNLOAD_USERFOLDER: '/drive/downloadUserFolder',
        DEL_USERFILEORFOLDER: '/drive/delUserFileOrFolder',
    },
    VIDEO: {
        GET_VIDEOSCEENSHOTS: '/video/getVideoSceenshots',
        PLAY_VIDEOSTEAM: '/video/playVideoSteam',
    },
    RESOURCEPOOL: {
        PLAY_VIDEOSTEAM: '/resourcepool/playVideoSteam',
        GET_VIDEOSCEENSHOTS: '/resourcepool/getVideoSceenshots',
        GET_FOLDERANDFILE: '/resourcepool/getFolderAndFile',
    },
}
