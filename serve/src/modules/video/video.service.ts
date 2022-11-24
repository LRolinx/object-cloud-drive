import e, { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, StreamableFile } from '@nestjs/common';
import { FilesEntity } from 'src/entity/files.entity';
import { Repository } from 'typeorm';
import { UserFilesEntity } from 'src/entity/user_files.entity';
import {DataBaseConfig} from 'src/config/orm.config';
import conf from 'src/config/config';
// import * as ffmpeg from 'ffmpeg';
import * as fs from 'fs';
import * as cmd from 'child_process';
import * as path from 'path';

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
 * @create 2021-12-15 17:35
 */
@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesEntity: Repository<FilesEntity>,
    @InjectRepository(UserFilesEntity)
    private readonly userFilesEntity: Repository<UserFilesEntity>,
  ) {}

  /**
   * 播放视频流
   * @param id
   */
  async playVideoSteam(
    res: Response,
    id: number,
    range: string,
  ): Promise<Response> {
    const userFile = await this.userFilesEntity.findOne(
      UserFilesEntity.instance({ id }),
    );
    const filepath = path.join(conf.upload.path, userFile.fileId);
    const stat = fs.statSync(filepath);
    const fileSize = stat.size;

    if (range != undefined) {
      //有range头才使用206状态码
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : start + 999999;
      // end 在最后取值为 fileSize - 1
      end = end > fileSize - 1 ? fileSize - 1 : end;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filepath, { start, end });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        // 'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);

      // return new StreamableFile(file);
      return file.pipe(res);
    } else {
      const file = fs.createReadStream(filepath);
      const head = {
        'Accept-Ranges': 'bytes',
        'Content-Length': fileSize,
        // 'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);

      return file.pipe(res);
      // return new StreamableFile(file);
    }
  }

  /**
   * 获取视频缩略图
   * @param id
   * @returns
   */
  async getVideoSceenshots(id: number): Promise<StreamableFile> {
    const userFile = await this.userFilesEntity.findOne(
      UserFilesEntity.instance({ id }),
    );
    const path = `${conf.upload.path}${userFile.fileId}`;
    const videoshots = `${path}.png`;

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
}
