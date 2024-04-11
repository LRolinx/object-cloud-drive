import { AjaxResult } from 'src/utils/ajax-result.classes';
import { Controller, Post, Body, Inject, Res } from '@nestjs/common';
import { StringUtils } from 'src/utils/StringUtils';
import { ResourcPoolService } from './resource_pool.service';

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
   * 播放视频流
   * @param id
   * @returns
   */
  @Post('playVideoSteam')
  async playVideoSteam(@Res({ passthrough: false }) res, @Body() { path }) {
    if (!StringUtils.hasText(path)) {
      return AjaxResult.fail('参数错误');
    }
    return this.resourcPoolService.playLocalResourcPoolSteam(res, path);
  }

  /**
   * 获取视频缩略图
   * @param id
   */
  @Post('getVideoSceenshots')
  async getVideoSceenshots(@Body() { path }) {
    if (!StringUtils.hasText(path)) {
      return AjaxResult.fail('参数错误');
    }
    // const decryptId = id == '0' ? '' : MathTools.decryptForKey(id);
    return this.resourcPoolService.getResourcPoolSceenshots(path);
  }

  /**
   * 获取目录下的文件夹和文件
   */
  @Post('getFolderAndFile')
  async getFolderAndFile(@Body() { path }): Promise<AjaxResult> {
    const _path = path != undefined ? path : 'F:\\Videos';
    return this.resourcPoolService.getFilesAndFoldersInDir(_path);
  }
}
