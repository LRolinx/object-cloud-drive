import { format } from 'date-fns';
import { AjaxResult } from 'src/utils/ajax-result.classes';
import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFileAndFolder } from 'src/customizeEntity/user_file_and_folder.entity';
import { FolderEntity } from 'src/entity/folder.entity';
import { UserFilesEntity } from 'src/entity/user_files.entity';
import DateUtils from 'src/utils/DateUtils';
import MathTools from 'src/utils/MathTools';
import { Repository, FindOneOptions } from 'typeorm';
import conf from 'src/config/config';
import * as fs from 'fs';
import { AddBatchUserFolderType } from 'src/types/AddBatchUserFolderType';

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
   * @param userId 用户UUID
   * @param pUuid 父级文件夹UUID
   * @param name 文件夹名称
   */
  async addFolder(
    userUuid: string,
    pUuid: string,
    name: string,
  ): Promise<AjaxResult> {
    //检查指定的folder_id文件夹里是否已有对应的name文件夹
    const folder: FindOneOptions<FolderEntity> = {
      where: FolderEntity.instance({
        userUuid,
        pUuid,
        name,
        del: false,
      }),
    };

    const folders = await this.folderEntity.findOne(folder);

    if (folders == undefined) {
      //文件夹不存在
      const date = format(new Date(), DateUtils.DATETIME_DEFAULT_FORMAT);
      const folderDB = FolderEntity.instance({
        userUuid,
        pUuid,
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
   * 检查文件夹是否存在
   */
  async checkFolder(userUuid, name, pUuid): Promise<boolean> {
    const folder: FindOneOptions<FolderEntity> = {
      where: FolderEntity.instance({
        userUuid,
        name,
        pUuid,
        del: false,
      }),
    };

    const folders = await this.folderEntity.findOne(folder);

    if (folders == undefined) {
      return false;
    }
    return true;
  }

  /**
   * 批量添加文件夹
   * @param userUuid 用户id
   * @param data 数据
   */
  async batchAddFolder(
    userUuid: string,
    data: AddBatchUserFolderType[],
  ): Promise<AjaxResult> {
    for (let i = 0; i < data.length; i++) {
      //   const folderId = data[i].folderId;
      const name = data[i].folderName;
      const pUuid = data[i].pUuid;
      const folderUuid = data[i].folderUuid;

      //检查指定的folder_id文件夹里是否已有对应的name文件夹
      const folder: FindOneOptions<FolderEntity> = {
        where: FolderEntity.instance({
          userUuid,
          name,
          pUuid,
          //   pId: folderId,
          del: false,
        }),
      };

      const folders = await this.folderEntity.findOne(folder);

      if (folders == undefined) {
        //文件夹不存在
        const date = format(new Date(), DateUtils.DATETIME_DEFAULT_FORMAT);
        const folderDB = FolderEntity.instance({
          userUuid,
          pUuid,
          folderUuid,
          name,
          size: 0,
          createTime: date,
        });
        const count = await this.folderEntity.insert(folderDB);
        // if (count == void 0) {
        //   //新建文件夹失败
        //   return AjaxResult.fail('新建文件夹失败');
        // }
        // //新建文件夹成功
        // return AjaxResult.success(
        //   MathTools.encryptForKey(count.raw['insertId']),
        //   '新建文件夹成功',
        // );
      } else {
        //文件夹存在
        // return AjaxResult.fail(
        //   '文件夹存在',
        //   500,
        //   MathTools.encryptForKey(folders.id),
        // );
      }
    }

    return AjaxResult.fail('完成', 200);
  }

  /**
   * 获取用户文件和文件夹
   * @param userUuid
   * @param pUuid
   */
  async getUserFileAndFolder(
    userUuid: string,
    pUuid: string,
  ): Promise<AjaxResult> {
    const folder: FindOneOptions<FolderEntity> = {
      where: FolderEntity.instance({
        userUuid,
        pUuid,
        del: false,
      }),
    };

    const userfile: FindOneOptions<UserFilesEntity> = {
      where: UserFilesEntity.instance({
        userUuid,
        folderUuid: pUuid,
        del: false,
      }),
    };

    const folders = this.folderEntity.find(folder);
    const files = this.userFilesEntity.find(userfile);

    // 多异步工作 等待全部完成
    await Promise.all([folders, files]);

    const result: UserFileAndFolder[] = [];

    if (folders !== null) {
      for (const folder of await folders) {
        const data = new UserFileAndFolder();
        data.id = folder.folderUuid; //MathTools.encryptForKey(); //文件夹不加密减少加密时间同时保证批量添加文件夹
        data.pUUid = folder.pUuid; //MathTools.encryptForKey(); //文件夹不加密减少加密时间同时保证批量添加文件夹
        data.type = 'folder';
        data.name = folder.name;
        data.size = folder.size;
        data.updateTime = folder.createTime;
        result.push(data);
      }
    }
    if (files !== null) {
      for (const file of await files) {
        const data = new UserFileAndFolder();
        data.id = file.fileSha256;
        data.pUUid = file.folderUuid;
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
    const userfile: FindOneOptions<UserFilesEntity> = {
      where: UserFilesEntity.instance({
        id,
        del: false,
      }),
    };
    const files = await this.userFilesEntity.findOne(userfile);
    const path = `${conf.upload.path}${files.fileSha256}`;
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
  async delUserFileOrFolder(id: string, type: string): Promise<AjaxResult> {
    const date = format(new Date(), DateUtils.DATETIME_DEFAULT_FORMAT);
    if (type == 'file') {
      //删除文件
      const userfile = UserFilesEntity.instance({
        fileSha256: id,
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
        folderUuid: id,
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
