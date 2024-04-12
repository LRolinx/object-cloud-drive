import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, StreamableFile } from '@nestjs/common';
import { FilesEntity } from 'src/entity/files.entity';
import { Repository } from 'typeorm';
import { UserFilesEntity } from 'src/entity/user_files.entity';
// import * as ffmpeg from 'ffmpeg';
import * as fs from 'fs';
import * as cmd from 'child_process';
import { AjaxResult } from 'src/utils/ajax-result.classes';
import conf from 'src/config/config';
import { StringUtils } from 'src/utils/StringUtils';

/*
 * █████▒█      ██  ▄████▄   ██ ▄█▀     ██████╗ ██╗   ██╗ ██████╗
 * ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒      ██╔══██╗██║   ██║██╔════╝
 * ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░      ██████╔╝██║   ██║██║  ███╗
 * ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄      ██╔══██╗██║   ██║██║   ██║
 * ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄     ██████╔╝╚██████╔╝╚██████╔╝
 * ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒     ╚═════╝  ╚═════╝  ╚═════╝
 * ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
 * ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
 * ░     ░ ░      ░  ░
 * Copyright 2022 LRolinx.
 * <p>
 *  -
 * </p>
 * @author LRolinx
 * @create 2024-04-11 17:35
 */
@Injectable()
export class ResourcPoolService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesEntity: Repository<FilesEntity>,
    @InjectRepository(UserFilesEntity)
    private readonly userFilesEntity: Repository<UserFilesEntity>,
  ) {}

  /**
   * 播放本地视频流
   * @param id
   */
  async playLocalResourcPoolSteam(
    res: Response,
    path: string,
  ): Promise<Response> {
    const stat = fs.statSync(path);
    const fileSize = stat.size;

    const file = fs.createReadStream(path);
    const head = {
      'Accept-Ranges': 'bytes',
      'Content-Length': fileSize,
      // 'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);

    return file.pipe(res);
  }

  /**
   * 获取视频缩略图
   * @param id
   * @returns
   */
  async getResourcPoolSceenshots(
    name: string,
    ext: string,
    path: string,
  ): Promise<StreamableFile> {
    const videoshots = `${conf.preview.path}${name}.${ext}.png`;

    if (fs.existsSync(path)) {
      //视频文件存在
      if (!fs.existsSync(videoshots)) {
        //视频缩略图不存在
        const comStr = `ffmpeg -i ${path} -y -f image2 -frames 1 ${videoshots}`;
        console.log(comStr);
        const com = cmd.execSync(comStr);
        if (!com) {
          return null;
        }
      }
      const file = fs.createReadStream(videoshots);
      return new StreamableFile(file);
    }
    return null;
  }

  async getFilesAndFoldersInDir(path) {
    const items = fs.readdirSync(path);
    const result = [];
    items.forEach((item) => {
      const itemPath = String.raw`${path}/${item}`;
      //   const normalizedPath = path.normalize(itemPath);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        const data = {
          // 文件夹
          type: 'folder',
          name: item,
          path: itemPath,
        };
        // let children = getFilesAndFoldersInDir(itemPath);
        // if (children && children.length) {
        //   data.children = children;
        // }
        result.push(data);
      } else {
        // 文件
        const fileInfo = StringUtils.getFileNameAndFext(item);
        // if (
        //   fileInfo.fext != undefined &&
        //   fileInfo.fext.toUpperCase() == 'MP4'
        // ) {
        //   // 如果是视频文件则进行生成缩略图
        //   this.getResourcPoolSceenshots(
        //     fileInfo.fname,
        //     fileInfo.fext,
        //     itemPath,
        //   );
        // }

        const data = {
          type: 'file',
          name: fileInfo.fname,
          ext: fileInfo.fext,
          path: itemPath,
        };

        result.push(data);
      }
    });
    return AjaxResult.success(result, '查询成功');
  }
}
