import { AjaxResult } from 'src/utils/ajax-result.classes';
import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  Get,
  Query,
} from '@nestjs/common';
import { StringUtils } from 'src/utils/StringUtils';
import { VideoService } from './video.service';

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
    const decryptId = id == '0' ? 0 : id; // parseInt(MathTools.decryptForKey(id));
    return this.videoService.playVideoSteam(res, decryptId, range);
  }

  /**
   * 播放本地视频流
   * @param fileName
   * @returns
   */
  @Get('playLocalVideoSteam')
  async playLocalVideoSteam(
    @Res({ passthrough: false }) res,
    // @Body() { , range },
    @Query() { fileName },
  ) {
    return this.videoService.playLocalVideoSteam(res, fileName, undefined);
  }

  /**
   * 获取视频缩略图
   * @param id
   */
  @Post('getVideoSceenshots')
  async getVideoSceenshots(@Body() { fileSha256 }) {
    if (!StringUtils.hasText(fileSha256)) {
      return AjaxResult.fail('参数错误');
    }
    // const decryptId = id == '0' ? '' : MathTools.decryptForKey(id);
    return this.videoService.getVideoSceenshots(fileSha256);
  }
}
