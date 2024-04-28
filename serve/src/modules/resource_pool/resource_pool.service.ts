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
   * 获取Dash播放地址
   */
  async getDashUrl(
    name: string,
    ext: string,
    path: string,
  ): Promise<AjaxResult> {
    const videoDuration = `${conf.preview.path}${name}/index.mpd`;
    return AjaxResult.success(videoDuration, 'Success');
  }

  /**
   * 播放本地视频流
   * @param id
   */
  async playLocalResourcPoolSteam(
    res: Response,
    name: string,
    ext: string,
    path: string,
  ): Promise<Response> {
    //创建对应的视频Dash目录
    if (!fs.existsSync(`${conf.preview.path}${name}`)) {
      //没临时文件夹
      fs.mkdirSync(`${conf.preview.path}${name}`, {
        recursive: true,
      });
    }

    //视频mpd路径
    const videoDuration = `${conf.preview.path}${name}/index.mpd`;
    if (!fs.existsSync(videoDuration)) {
      //视频dash文件不存在 生成
      const comStr = `ffmpeg -i ${path} -c copy -f dash ${conf.preview.path}${name}/index.mpd`;

      const com = cmd.execSync(comStr);
      if (!com) {
        return null;
      }

      //打开生成的MPD文件 进行修改路径
      // 读取文件内容
      const data = fs.readFileSync(videoDuration, 'utf8');
      // 替换指定的文本
      const updatedContent = data
        .replace(
          /init-stream\$RepresentationID\$.m4s/g,
          `playVideoSteam/${name}/init-stream$RepresentationID$.m4s`,
        )
        .replace(
          /chunk-stream\$RepresentationID\$-\$Number%05d\$.m4s/g,
          `playVideoSteam/${name}/chunk-stream$RepresentationID$-$Number%05d$.m4s`,
        );

      // 写入更新后的内容到文件
      fs.writeFileSync(videoDuration, updatedContent, 'utf8');
    }

    const stat = fs.statSync(videoDuration);
    const fileSize = stat.size;

    const file = fs.createReadStream(videoDuration);
    const head = {
      'Accept-Ranges': 'bytes',
      'Content-Length': fileSize,
      'Content-Type': 'application/dash+xml',
    };
    res.writeHead(200, head);
    return file.pipe(res);
  }

  /**
   * 播放视频流M4S
   * @param id
   */
  async playVideoSteamM4S(
    res: Response,
    name: string,
    fileName: string,
  ): Promise<Response> {
    //视频mpd路径
    const videoDuration = `${conf.preview.path}${name}/${fileName}`;

    const stat = fs.statSync(videoDuration);
    const fileSize = stat.size;

    const file = fs.createReadStream(videoDuration);
    const head = {
      'Accept-Ranges': 'bytes',
      'Content-Length': fileSize,
      'Content-Type': 'application/dash+xml',
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
    res: Response,
    name: string,
    ext: string,
    path: string,
  ): Promise<Response> {
    try {
      if (!fs.existsSync(`${conf.preview.path}${name}`)) {
        //没临时文件夹
        fs.mkdirSync(`${conf.preview.path}${name}`, {
          recursive: true,
        });
      }

      const videoshots = `${conf.preview.path}${name}/index.png`;

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

        const stat = fs.statSync(videoshots);
        const fileSize = stat.size;

        const file = fs.createReadStream(videoshots);
        const head = {
          'Accept-Ranges': 'bytes',
          'Content-Length': fileSize,
          'Content-Type': 'application/dash+xml',
        };
        res.writeHead(200, head);
        return file.pipe(res);

        // const file = fs.createReadStream(videoshots);
        // return new StreamableFile(file);
      }
      return null;
    } catch {}
  }

  async getFilesAndFoldersInDir(_path) {
    const items = fs.readdirSync(_path);
    const result = [];
    items.forEach((item) => {
      const itemPath = `${_path}/${item}`;
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
        //   (fileInfo.fext.toUpperCase() == 'MP4' ||
        //     fileInfo.fext.toUpperCase() == 'M3U8')
        // ) {
        //   // 如果是视频文件则进行生成缩略图
        //   this.getResourcPoolSceenshots(
        //     null,
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
    result.sort(
      (a, b) => (a.type == 'folder' ? 0 : 1) - (b.type == 'folder' ? 0 : 1),
    );
    return AjaxResult.success(result, '查询成功');
  }
}
