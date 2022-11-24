import { format } from 'date-fns';
import { AjaxResult } from 'src/utils/ajax-result.classes';
import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFileAndFolder } from 'src/customizeEntity/user_file_and_folder.entity';
import { FolderEntity } from 'src/entity/folder.entity';
import { UserFilesEntity } from 'src/entity/user_files.entity';
import DateUtils from 'src/utils/DateUtils';
import MathTools from 'src/utils/MathTools';
import { Repository } from 'typeorm';
import conf from 'src/config/config';
import {DataBaseConfig} from 'src/config/orm.config';
import * as fs from 'fs';

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
 *  -云盘Service
 * </p>
 * @author LRolinx
 * @create 2021-12-10 17:31
 */

@Injectable()
export class DriveService {
  constructor(
    @InjectRepository(FolderEntity)
    private readonly folderEntity: Repository<FolderEntity>,
    @InjectRepository(UserFilesEntity)
    private readonly userFilesEntity: Repository<UserFilesEntity>,
  ) {}
  /**
   * 创建文件夹
   * @param userId 用户id
   * @param name 文件夹名称
   * @param folderId 父级文件夹id
   */
  async addFolder(
    userId: number,
    folderId: number,
    name: string,
  ): Promise<AjaxResult> {
    //检查指定的folder_id文件夹里是否已有对应的name文件夹
    const folder = FolderEntity.instance({
      userId,
      name,
      pId: folderId,
      del: false,
    });
    const folders = await this.folderEntity.findOne(folder);
    if (folders == undefined) {
      //文件夹不存在
      const date = format(new Date(), DateUtils.DATETIME_DEFAULT_FORMAT);
      const folderDB = FolderEntity.instance({
        userId,
        pId: folderId,
        name,
        size: 0,
        createTime: date,
      });
      const count = await this.folderEntity.insert(folderDB);
      if (count == void 0) {
        //新建文件夹失败
        return AjaxResult.fail('新建文件夹失败');
      }
      //新建文件夹成功
      return AjaxResult.success(
        MathTools.encryptForKey(count.raw['insertId']),
        '新建文件夹成功',
      );
    } else {
      //文件夹存在
      return AjaxResult.fail(
        '文件夹存在',
        500,
        MathTools.encryptForKey(folders.id),
      );
    }
  }

  /**
   * 获取用户文件和文件夹
   * @param userId
   * @param folderId
   */
  async getUserFileAndFolder(
    userId: number,
    folderId: number,
  ): Promise<AjaxResult> {
    const folder = FolderEntity.instance({
      userId,
      pId: folderId,
      del: false,
    });

    const userfile = UserFilesEntity.instance({
      userId,
      folderId,
      del: false,
    });

    const folders = await this.folderEntity.find(folder);
    const files = await this.userFilesEntity.find(userfile);
    const result: UserFileAndFolder[] = [];

    if (folders !== null) {
      for (const folder of folders) {
        const data = new UserFileAndFolder();
        data.id = MathTools.encryptForKey(folder.id);
        data.type = 'folder';
        data.name = folder.name;
        data.size = folder.size;
        data.updateTime = folder.createTime;
        result.push(data);
      }
    }
    if (files !== null) {
      for (const file of files) {
        const data = new UserFileAndFolder();
        data.id = MathTools.encryptForKey(file.id);
        data.type = 'file';
        data.updateTime = file.createTime;
        data.name = file.fileName;
        data.size = 0;
        data.suffix = file.suffix;
        result.push(data);
      }
    }

    return AjaxResult.success(result, '查询成功');
  }

  /**
   * 根据文件id获取文件
   * @param id
   */
  async getUserFileForFileId(id: number): Promise<StreamableFile> {
    const userfile = UserFilesEntity.instance({
      id,
      del: false,
    });
    const files = await this.userFilesEntity.findOne(userfile);
    const path = `${conf.upload.path}${files.fileId}`;
    if (!fs.existsSync(path)) {
      //文件不存在
      return null;
    }
    const file = fs.createReadStream(path);
    return new StreamableFile(file);
  }

  /**
   * 删除用户文件或者文件夹
   * @param id
   * @param type
   * @returns
   */
  async delUserFileOrFolder(id: number, type: string): Promise<AjaxResult> {
    const date = format(new Date(), DateUtils.DATETIME_DEFAULT_FORMAT);
    if (type == 'file') {
      //删除文件
      const userfile = UserFilesEntity.instance({
        id,
        del: false,
      });
      const count = await this.userFilesEntity.update(userfile, {
        del: true,
        delTime: date,
      });
      if (count == void 0) {
        return AjaxResult.fail('删除失败');
      }
      return AjaxResult.success(null, '删除文件成功');
    } else {
      //删除文件夹
      const userfile = FolderEntity.instance({
        id,
      });
      const count = await this.folderEntity.update(userfile, {
        del: true,
        delTime: date,
      });
      if (count == void 0) {
        return AjaxResult.fail('删除失败');
      }
      return AjaxResult.success(null, '删除文件夹成功');
    }
    return AjaxResult.fail('删除失败');
  }
}
