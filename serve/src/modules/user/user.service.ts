import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { FindOneOptions, InsertResult, Repository } from 'typeorm';
import { AjaxResult } from 'src/utils/ajax-result.classes';
import MathTools from 'src/utils/MathTools';
import { format } from 'date-fns';
import DateUtils from 'src/utils/DateUtils';
import { UserDefaultEntity } from 'src/customizeEntity/user_default.entity';
import * as fs from 'fs';
import conf from 'src/config/config';
import { Response } from 'express';
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
 * Copyright 2024 LRolinx.
 * <p>
 *  用户Service
 * </p>
 * @author LRolinx
 * @create 2024-04-03 15:23
 */

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  async getpublickey(res: Response) {
    const path = `${conf.key.path}public.key`;
    const fileinfo = fs.statSync(path);
    const file = fs.createReadStream(path);
    // AjaxResult.success(data.toString());

    const head = {
      'Accept-Ranges': 'bytes',
      'Content-Length': fileinfo.size,
    };
    res.writeHead(200, head);

    return file.pipe(res);
  }

  async userRegistered({
    account,
    nickName,
    password,
  }: UserEntity): Promise<AjaxResult> {
    const user = await this.queryUserByAccount(account);
    if (user === null || user === undefined) {
      //用户不存在可注册
      const date = format(new Date(), DateUtils.DATETIME_DEFAULT_FORMAT);

      const user = UserEntity.instance({
        userUUID: MathTools.UUID(),
        nickName,
        photo:
          'https://storage.live.com/users/0xf2a82bac8d704404/myprofile/expressionprofile/profilephoto:UserTileStatic/p?ck=1&ex=720&sid=0CF8A907DF236BE1005BB80EDE136A1C&fofoff=1',

        account,
        password: MathTools.encryptForKey(password),
        createTime: date,
      });

      const insertResult = await this.addUser(user);

      if (insertResult == void 0) {
        return AjaxResult.fail('注册失败');
      }
      return AjaxResult.success(null, '注册成功');
    } else {
      return AjaxResult.fail('用户已存在');
    }
  }

  /**
   * 根据账号查询用户
   * @param account 账号
   * @author LRolinx
   * @author Clover You
   * @date 2021/11/09 10:38
   * @return Promise<UserEntity>
   */
  async queryUserByAccount(account: string): Promise<UserEntity> {
    const query: FindOneOptions<UserEntity> = {
      where: UserEntity.instance({ account }),
    };
    return this.userEntity.findOne(query);
  }
  /**
   * 添加用户信息
   * @param user 用户信息
   * @author LRolinx
   * @author Clover You
   * @date 2021/11/09 10:44
   * @return Promise<InsertResult>
   */
  async addUser(user: UserEntity): Promise<InsertResult> {
    return this.userEntity.insert(user);
  }
  /**
   * 用户登录实现
   * @param account 账号
   * @param password 密码
   * @author LRolinx
   * @author Clover You
   * @date 2021/11/09 15:55
   * @return Promise<UserEntity>
   */
  async userLogin(account: string, password: string): Promise<AjaxResult> {
    const user = await this.queryUserByAccount(account.trim());
    if (user == null) {
      return AjaxResult.fail('账号不存在');
    }
    if (MathTools.decryptForKey(user.password) !== password.trim()) {
      return AjaxResult.fail('密码错误');
    }

    const userdef = new UserDefaultEntity();
    userdef.userUuid = user.userUUID;
    userdef.nickName = user.nickName;
    userdef.photo = user.photo;

    return AjaxResult.success(userdef, '登录成功');
  }
}
