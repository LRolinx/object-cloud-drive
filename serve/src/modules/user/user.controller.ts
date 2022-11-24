import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { UserEntity } from '../../entity/user.entity';
import { AjaxResult } from '../../utils/ajax-result.classes';
import { UserService } from './user.service';
import { StringUtils } from '../../utils/StringUtils';
import { HttpParameterException } from '../../exceptions/http-parameter.exception';

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
  @Post('objectCloudDiskRegistered')
  async userRegistered(
    @Body() { nickName, account, password, registeredCode },
  ): Promise<AjaxResult> {
    if (registeredCode.toUpperCase() == 'OBJECT') {
      return this.userService.userRegistered(
        UserEntity.instance({
          nickName,
          account,
          password,
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
  @Post('objectCloudDiskLogin')
  async userLogin(
    @Body() { account, password }: UserEntity,
  ): Promise<AjaxResult> {
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
    return this.userService.userLogin(account, password);
  }
}
