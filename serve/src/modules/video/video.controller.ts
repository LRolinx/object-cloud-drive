import { Response } from 'express';
import { AjaxResult } from 'src/utils/ajax-result.classes';
import { Controller, Post, Body, Inject, Res, Header } from '@nestjs/common';
import { StringUtils } from 'src/utils/StringUtils';
import { VideoService } from './video.service';
import MathTools from 'src/utils/MathTools';

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
@Controller('video')
export class VideoController {
  constructor(
    @Inject(VideoService)
    private readonly videoService: VideoService,
  ) {}

  /**
   * 播放视频流
   * @param id
   * @returns
   */
  @Post('playVideoSteam')
  async playVideoSteam(
    @Res({ passthrough: false }) res,
    @Body() { id, range },
  ) {
    if (!StringUtils.hasText(id)) {
      return AjaxResult.fail('参数错误');
    }
    const decryptId = id == '0' ? 0 : parseInt(MathTools.decryptForKey(id));
    return this.videoService.playVideoSteam(res, decryptId, range);
  }

  /**
   * 获取视频缩略图
   * @param id
   */
  @Post('getVideoSceenshots')
  async getVideoSceenshots(@Body() { id }) {
    if (!StringUtils.hasText(id)) {
      return AjaxResult.fail('参数错误');
    }
    const decryptId = id == '0' ? 0 : parseInt(MathTools.decryptForKey(id));
    return this.videoService.getVideoSceenshots(decryptId);
  }
}
