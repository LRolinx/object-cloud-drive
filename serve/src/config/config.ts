import * as path from 'path';

/**
 * █████▒█      ██  ▄████▄   ██ ▄█▀     ██████╗ ██╗   ██╗ ██████╗
 * ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒      ██╔══██╗██║   ██║██╔════╝
 * ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░      ██████╔╝██║   ██║██║  ███╗
 * ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄      ██╔══██╗██║   ██║██║   ██║
 * ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄     ██████╔╝╚██████╔╝╚██████╔╝
 * ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒     ╚═════╝  ╚═════╝  ╚═════╝
 * ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
 * ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
 * ░     ░ ░      ░  ░
 * Copyright 2021 Clover·You.
 * <p>
 *程序配置文件
 * </p>
 * @author Clover·You
 * @create 2021-11-09 10:50
 */

export type MysqlType = {
  user?: string;
  password: string;
  database: string;
  host?: string;
  port?: number;
};

export type PathType = {
  path: string; //Key保存的路径
};

export type UploadType = {
  // rootPath:string;//根目录
  temp: string; //上传的临时位置
  path: string; //上传完成后合并文件的位置
};

export interface ConfType {
  mysql?: MysqlType;
  port?: number;
  key: PathType;
  upload: UploadType;
  preview: PathType;
  resourcePool: PathType;
}

const USER_HOME = process.env.HOME || process.env.USERPROFILE;

const conf: ConfType = {
  key: {
    path: path.join(USER_HOME, '/.objectcloud/key/'),
  },
  upload: {
    // rootPath:`${USER_HOME}/.objectcloud/`,
    temp: path.join(USER_HOME, '/.objectcloud/temp/'),
    path: path.join(USER_HOME, '/.objectcloud/upload/'),
  },
  preview: {
    //预览图地址
    path: path.join(USER_HOME, '/.objectcloud/preview/'),
  },
  resourcePool: {
    //资源池路径
    path: 'F:/Videos',
  },
};

export default conf;
