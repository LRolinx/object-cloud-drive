import { AjaxResult } from 'src/utils/ajax-result.classes';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { DriveService } from './drive.service';
import MathTools from 'src/utils/MathTools';
import { StringUtils } from 'src/utils/StringUtils';
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
 *  -云盘控制器
 * </p>
 * @author LRolinx
 * @create 2021-12-10 17:26
 */
@Controller('drive')
export class DriveController {
  constructor(
    @Inject(DriveService)
    private readonly driveService: DriveService,
  ) {}

  /**
   * 添加用户文件夹
   * @param userUuid
   * @param folderUuid
   * @param name
   * @returns
   */
  @Post('addUserFolder')
  async addUserFolder(
    @Body() { userUuid, folderUuid, name },
  ): Promise<AjaxResult> {
    if (
      !StringUtils.hasText(userUuid) ||
      !StringUtils.hasText(folderUuid) ||
      !StringUtils.hasText(name)
    ) {
      return AjaxResult.fail('参数错误');
    }

    const decryptUserid = MathTools.decryptForKey(userUuid) as string;
    const decryptFolderid = folderUuid;

    return this.driveService.addFolder(decryptUserid, decryptFolderid, name);
  }

  /**
   * 添加批量用户文件夹
   * @param userId
   * @param data
   * @returns
   */
  @Post('batchAddUserFolder')
  async batchAddUserFolder(
    @Body()
    { userUuid, data }: { userUuid: string; data: AddBatchUserFolderType[] },
  ): Promise<AjaxResult> {
    if (!StringUtils.hasText(userUuid) || data == undefined) {
      return AjaxResult.fail('参数错误');
    }

    // const decryptUserid = parseInt(MathTools.decryptForKey(userId) as string);

    return this.driveService.batchAddFolder(userUuid, data);
  }

  /**
   * 获取用户当前文件夹内的文件以及文件夹
   * @param userUuid
   * @param folderUuid
   * @returns
   */
  @Post('getUserFileAndFolder')
  async getUserFileAndFolder(
    @Body() { userUuid, folderUuid },
  ): Promise<AjaxResult> {
    if (!StringUtils.hasText(userUuid) || !StringUtils.hasText(folderUuid)) {
      return AjaxResult.fail('参数错误');
    } else {
      //   const decryptUserid = parseInt(MathTools.decryptForKey(userid) as string);
      //   const decryptFolderid = folderid;

      //获取用户当前目录下的所有文件夹以及文件
      return this.driveService.getUserFileAndFolder(userUuid, folderUuid);
    }
  }

  /**
   * 通过文件id获取用户文件
   * @param id
   * @returns
   */
  @Post('getUserFileForFileId')
  async getUserFileForFileId(@Body() { id }) {
    if (!StringUtils.hasText(id)) {
      return AjaxResult.fail('参数错误');
    }

    const did = parseInt(MathTools.decryptForKey(id) as string);
    return this.driveService.getUserFileForFileId(did);
  }

  /**
   * 删除用户文件或者文件夹
   * @param id
   * @param type
   */
  @Post('delUserFileOrFolder')
  async delUserFileOrFolder(@Body() { id, type }): Promise<AjaxResult> {
    if (!StringUtils.hasText(id) || !StringUtils.hasText(type)) {
      return AjaxResult.fail('参数错误');
    }
    if (type == 'file') {
      const did = parseInt(MathTools.decryptForKey(id) as string);
      return this.driveService.delUserFileOrFolder(did, type);
    }
    //文件夹
    return this.driveService.delUserFileOrFolder(id, type);
  }
}
