import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
 *  用户实体
 * </p>
 * @author Clover
 * @create 2021-11-09 08:59
 */
@Entity('t_user')
export class UserEntity {
  /**
   * 用户id
   */
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id?: number;

  /**
   * 用户昵称
   */
  @Column({ type: 'varchar', length: 32, name: 'nickname' })
  nickName?: string;

  /**
   * 头像
   */
  @Column({ type: 'varchar', length: 255 })
  photo?: string;

  /**
   * 密码
   */
  @Column({ type: 'varchar', length: 256 })
  password?: string;

  /**
   * 账号
   */
  @Column({ type: 'varchar', length: '20' })
  account?: string;

  /**
   * 是否停用
   */
  @Column({ type: 'bit', default: false })
  isDisable?: boolean;

  /**
   * 创建时间
   */
  @Column({ type: 'char', length: 19, name: 'createtime' })
  createTime?: string;

  /**
   * 是否删除
   */
  @Column({ type: 'bit', default: false })
  del?: boolean;

  /**
   * 删除时间
   */
  @Column({ type: 'char', length: 19, nullable: true })
  deltime?: string;

  /**
   * 创建一个UserEntity实例
   * @param info 初始化数据
   * @returns UserEntity
   * @author Clover·You
   * @date 2021/11/09 11:20
   */
  static instance(info: UserEntity) {
    const user = new UserEntity();
    for (const key in info) {
      user[key] = info[key];
    }
    return user;
  }
}
