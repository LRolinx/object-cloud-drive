import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { UserEntity } from '../../entity/user.entity';
import { AjaxResult } from '../../utils/ajax-result.classes';
import { UserService } from './user.service';
import { StringUtils } from '../../utils/StringUtils';
import { HttpParameterException } from '../../exceptions/http-parameter.exception';
import MathTools from 'src/utils/MathTools';

/**
 * █████▒█      ██  ▄████▄   ██ ▄█▀     ██████╗ ██╗   ██╗ ██████╗
 * ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒      ██╔══██╗██║   ██║██╔════╝
 * ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░      ██████╔╝██║   ██║██║  ███╗
 * ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄      ██╔══██╗██║   ██║██║   ██║
 * ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄     ██████╔╝╚██████╔╝╚██████╔╝
 * ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒     ╚═════╝  ╚═════╝  ╚═════╝
 * ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
 * ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
 * ░     ░ ░      ░  ░
 * Copyright 2021 Clover.
 * <p>
 *  用户控制器
 * </p>
 * @author Clover
 * @create 2021-11-08 15:24
 */
@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  //   获取公钥
  @Post('getpublickey')
  async getpublickey(@Res({ passthrough: false }) res) {
    return this.userService.getpublickey(res);
  }

  /**
   * 用户注册实现
   * @param nickName 昵称
   * @param account 账号
   * @param password 密码
   * @param registeredCode 内部注册码
   * @author LRolinx
   * @author Clover·You
   * @date 2021/11/09 11:29
   */
  @Post('registered')
  async registered(
    @Body() { nickName, account, password, registeredCode },
  ): Promise<AjaxResult> {
    if (registeredCode.toUpperCase() == 'OBJECT') {
      const _account = MathTools.decryptForKey(account) as string;
      const _password = MathTools.decryptForKey(password) as string;
      return this.userService.userRegistered(
        UserEntity.instance({
          nickName,
          account: _account,
          password: _password,
        }),
      );
    } else {
      return AjaxResult.fail(
        '内部注册码错误',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 用户登录请求接口
   * @param account 账号
   * @param password 密码
   * @return Promise<AjaxResult>
   * @author Clover You
   * @date 2021/11/9 14:37
   */
  @Post('login')
  async login(@Body() { account, password }: UserEntity): Promise<AjaxResult> {
    if (!StringUtils.hasText(account)) {
      throw new HttpParameterException(
        '账号不能为空',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!StringUtils.hasText(password)) {
      throw new HttpParameterException(
        '密码不能为空',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const _account = MathTools.decryptForKey(account) as string;
    const _password = MathTools.decryptForKey(password) as string;

    return this.userService.userLogin(_account, _password);
  }
}
