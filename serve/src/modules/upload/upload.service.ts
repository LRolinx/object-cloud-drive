import { FolderEntity } from 'src/entity/folder.entity';
import { Request } from 'express';
import { AjaxResult } from 'src/utils/ajax-result.classes';
import { Injectable } from '@nestjs/common';
import conf from 'src/config/config';
import {DataBaseConfig} from 'src/config/orm.config';
import * as fs from 'fs';
import { UserFilesEntity } from 'src/entity/user_files.entity';
import { FilesEntity } from 'src/entity/files.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DateUtils from 'src/utils/DateUtils';
import { format } from 'date-fns';
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
 *  -上传Service
 * </p>
 * @author LRolinx
 * @create 2021-12-12 15:08
 */
@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesEntity: Repository<FilesEntity>,
    @InjectRepository(UserFilesEntity)
    private readonly userFilesEntity: Repository<UserFilesEntity>,
    @InjectRepository(FolderEntity)
    private readonly folderEntity: Repository<FolderEntity>,
  ) {}

  /**
   * 检查文件
   * @param userid
   * @param folderid
   * @param sha256Id
   * @param filename
   * @param fileext
   * @returns
   */
  async examineFile(
    userid: number,
    folderid: number,
    sha256Id: string,
    filename: string,
    fileext: string,
  ): Promise<AjaxResult> {
    const enres = { userFileExist: false, fileExist: false };
    const file = await this.filesEntity.findOne(
      FilesEntity.instance({ sha256: sha256Id }),
    );
    const folder = await this.folderEntity.findOne(
      FolderEntity.instance({ id: folderid, del: false }),
    );

    const userfile = await this.userFilesEntity.findOne(
      UserFilesEntity.instance({
        userId: userid,
        folderId: folderid,
        fileName: filename,
        suffix: fileext,
        del: false,
      }),
    );

    if (file != undefined) {
      enres.fileExist = true;
    }

    if (
      (userfile != undefined && folder != undefined) ||
      userfile != undefined
    ) {
      enres.userFileExist = true;
    }

    return AjaxResult.success(enres);
  }

  /**
   * 上传文件
   * @param req
   * @param userid
   * @param folderid
   * @param fileName
   * @param filePath
   * @param fileExt
   * @param fileSha256
   * @param currentChunkMax
   * @param currentChunkIndex
   * @returns
   */
  uploadStreamFile(
    req: Request,
    userid: number,
    folderid: number,
    fileName: string,
    filePath: string,
    fileExt: string,
    fileSha256: string,
    currentChunkMax: number,
    currentChunkIndex: number,
  ): Promise<AjaxResult> {
    return new Promise<AjaxResult>(async (resolve, reject) => {
      try {
        const sha256Path = `${conf.upload.temp}${fileSha256}/`;
        const uploadPath = `${conf.upload.path}${fileSha256}`;
        const buffers: Buffer[] = [];

        if (!fs.existsSync(conf.upload.temp)) {
          //创建对应的临时文件夹
          fs.mkdirSync(conf.upload.temp, { recursive: true });
        }

        if (!fs.existsSync(conf.upload.path)) {
          //创建对应的合并文件夹
          fs.mkdirSync(conf.upload.path, { recursive: true });
        }

        if (!fs.existsSync(sha256Path)) {
          //创建对应的Sha256文件夹
          fs.mkdirSync(sha256Path, { recursive: true });
        }
        // if (fs.existsSync(`${dPath}${ctx.request.query.files.file.name}`)) {
        //   //有文件则删除
        //   fs.unlinkSync(`${dPath}${ctx.request.files.file.name}`)
        // }

        req
          .on('data', (trunk) => {
            console.log('data');
            buffers.push(trunk);
          })
          .on('end', () => {
            console.log('结束');
            const buffer = Buffer.concat(buffers);
            fs.writeFileSync(`${sha256Path}${currentChunkIndex}`, buffer);
            //连接关闭
            const files = fs.readdirSync(sha256Path);
            if (files.length != currentChunkMax) {
              resolve(AjaxResult.success(null, '传输进行中'));
              return;
            }

            //开始合并片段文件
            for (let i = 0, len = files.length; i < len; i++) {
              const content = fs.readFileSync(
                path.join(sha256Path, i.toString()),
              );
              fs.appendFileSync(uploadPath, content);
            }

            const date = format(new Date(), DateUtils.DATETIME_DEFAULT_FORMAT);
            //写入文件表里
            const sqlurl = uploadPath.replace(/\\/g, '\\\\');

            this.filesEntity
              .save(
                FilesEntity.instance({
                  sha256: fileSha256,
                  url: sqlurl,
                  statusId: 0,
                  fileTypeId: 0,
                }),
              )
              .then(async (v) => {
                // 写入用户文件表里
                await this.userFilesEntity.insert(
                  UserFilesEntity.instance({
                    userId: userid,
                    folderId: folderid,
                    fileId: fileSha256,
                    fileName: fileName,
                    createTime: date,
                    suffix: fileExt,
                  }),
                );
                resolve(AjaxResult.success(null, '传输完成'));
              })
              .catch((e) => {
                console.log(e);
                resolve(AjaxResult.fail('传输出错'));
              });
          })
          // .on('close', () => {
          //   console.log('close');
          //
          // })
          .on('error', () => {
            resolve(AjaxResult.fail('传输出错'));
            console.log('error');
          });
      } catch (e) {
        console.log(e);
        resolve(AjaxResult.fail('传输出错'));
      }
    });
  }

  // private asyRequestListener(): Promise<AjaxResult>{
  //   return new Promise<AjaxResult>((resolve, reject) => {

  //   });
  // }

  /**
   * 秒传文件
   * @param userid
   * @param folderid
   * @param fileName
   * @param filePath
   * @param fileExt
   * @param fileSha256
   * @returns
   */
  async uploadSecondPass(
    userid: number,
    folderid: number,
    fileName: string,
    filePath: string,
    fileExt: string,
    fileSha256: string,
  ): Promise<AjaxResult> {
    const date = format(new Date(), DateUtils.DATETIME_DEFAULT_FORMAT);
    const userfile = UserFilesEntity.instance({
      userId: userid,
      folderId: folderid,
      fileId: fileSha256,
      fileName: fileName,
      createTime: date,
      suffix: fileExt,
    });

    //写入用户文件表里
    const count = await this.userFilesEntity.insert(userfile);

    if (count == void 0) {
      return AjaxResult.fail('秒传失败');
    }

    return AjaxResult.success(null, '秒传成功');
  }
}
