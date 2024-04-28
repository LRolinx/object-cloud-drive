import { AjaxResult } from 'src/utils/ajax-result.classes';
import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { StringUtils } from 'src/utils/StringUtils';
import { ResourcPoolService } from './resource_pool.service';
import conf from 'src/config/config';

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
@Controller('resourcepool')
export class ResourcPoolController {
  constructor(
    @Inject(ResourcPoolService)
    private readonly resourcPoolService: ResourcPoolService,
  ) {}

  /**
   * 获取Dash播放地址
   */
  @Post('getDashUrl')
  async getDashUrl(@Body() { name, ext, path }) {
    if (!StringUtils.hasText(path)) {
      return AjaxResult.fail('参数错误');
    }
    return this.resourcPoolService.getDashUrl(name, ext, path);
  }

  /**
   * 播放视频流
   * @param id
   * @returns
   */
  @Get('playVideoSteam/')
  async playVideoSteam(
    @Res({ passthrough: false }) res,
    @Query() { name, ext, path },
  ) {
    if (!StringUtils.hasText(path)) {
      return AjaxResult.fail('参数错误');
    }
    return this.resourcPoolService.playLocalResourcPoolSteam(
      res,
      name,
      ext,
      path,
    );
  }

  /**
   * 播放视频流M4S
   * @param id
   * @returns
   */
  @Get('playVideoSteam/:name/:fileName')
  async playVideoSteamM4S(@Res({ passthrough: false }) res, @Param() params) {
    return this.resourcPoolService.playVideoSteamM4S(
      res,
      params.name,
      params.fileName,
    );
  }

  /**
   * 获取视频缩略图
   * @param id
   */
  @Post('getVideoSceenshots')
  async getVideoSceenshots(@Body() { name, ext, path }) {
    if (!StringUtils.hasText(path)) {
      return AjaxResult.fail('参数错误');
    }
    // const decryptId = id == '0' ? '' : MathTools.decryptForKey(id);
    return this.resourcPoolService.getResourcPoolSceenshots(name, ext, path);
  }

  /**
   * 获取目录下的文件夹和文件
   */
  @Post('getFolderAndFile')
  async getFolderAndFile(@Body() { path }): Promise<AjaxResult> {
    const _path = path != undefined ? path : conf.resourcePool.path;
    return this.resourcPoolService.getFilesAndFoldersInDir(_path);
  }
}
