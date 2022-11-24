import MathTools from 'src/utils/MathTools';
import { Request } from 'express';
import { AjaxResult } from 'src/utils/ajax-result.classes';
import {
  Body,
  Controller,
  Inject,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UploadService } from './upload.service';
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
 *  -上传控制器
 * </p>
 * @author LRolinx
 * @create 2021-12-12 15:08
 */
@Controller('upload')
export class UploadController {
  constructor(
    @Inject(UploadService)
    private readonly uploadService: UploadService,
  ) {}

  /**
   * 上传前检查文件
   * @param userid
   * @param folderid
   * @param sha256Id
   * @param filename
   * @param fileext
   * @returns
   */
  @Post('examineFile')
  async examineFile(
    @Body() { userid, folderid, sha256Id, filename, fileext },
  ): Promise<AjaxResult> {
    if (
      !StringUtils.hasText(userid) ||
      !StringUtils.hasText(folderid) ||
      !StringUtils.hasText(sha256Id) ||
      (!StringUtils.hasText(filename) && !StringUtils.hasText(fileext))
    ) {
      return AjaxResult.fail('参数错误');
    } else {
      const decryptUserid = parseInt(MathTools.decryptForKey(userid));
      const decryptFolderid =
        folderid == '0' ? 0 : parseInt(MathTools.decryptForKey(folderid));
      return this.uploadService.examineFile(
        decryptUserid,
        decryptFolderid,
        sha256Id,
        filename,
        fileext,
      );
    }
  }

  /**
   * 上传流文件
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
  @Put('uploadStreamFile')
  async uploadStreamFile(
    @Req() req: Request,
    @Query()
    {
      userid,
      folderid,
      fileName,
      filePath,
      fileExt,
      fileSha256,
      currentChunkMax,
      currentChunkIndex,
    },
  ): Promise<AjaxResult> {
    if (
      !StringUtils.hasText(userid) ||
      !StringUtils.hasText(folderid) ||
      !StringUtils.hasText(filePath) ||
      !StringUtils.hasText(fileSha256) ||
      !StringUtils.hasText(currentChunkMax) ||
      !StringUtils.hasText(currentChunkIndex) ||
      (!StringUtils.hasText(fileName) && !StringUtils.hasText(fileExt))
    ) {
      return AjaxResult.fail('参数错误');
    }

    const decryptUserid = parseInt(MathTools.decryptForKey(userid));
    const decryptFolderid =
      folderid == '0' ? 0 : parseInt(MathTools.decryptForKey(folderid));
    const ajaxResult = await this.uploadService.uploadStreamFile(
      req,
      decryptUserid,
      decryptFolderid,
      fileName,
      filePath,
      fileExt,
      fileSha256,
      currentChunkMax,
      currentChunkIndex,
    );
    console.log(ajaxResult);
    return ajaxResult;
  }

  /**
   * 秒传文件
   * @param userid
   * @param folderid
   * @param fileName
   * @param filePath
   * @param fileExt
   * @param fileSha256
   */
  @Post('uploadSecondPass')
  async uploadSecondPass(
    @Body()
    { userid, folderid, fileName, filePath, fileExt, fileSha256 },
  ): Promise<AjaxResult> {
    if (
      !StringUtils.hasText(userid) ||
      !StringUtils.hasText(folderid) ||
      !StringUtils.hasText(fileName) ||
      !StringUtils.hasText(filePath) ||
      !StringUtils.hasText(fileExt) ||
      !StringUtils.hasText(fileSha256)
    ) {
      return AjaxResult.fail('参数错误');
    }

    const decryptUserid = parseInt(MathTools.decryptForKey(userid));
    const decryptFolderid =
      folderid == '0' ? 0 : parseInt(MathTools.decryptForKey(folderid));

    return this.uploadService.uploadSecondPass(
      decryptUserid,
      decryptFolderid,
      fileName,
      filePath,
      fileExt,
      fileSha256,
    );
  }
}
