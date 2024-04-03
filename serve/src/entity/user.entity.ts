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
   * 用户ID
   */
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '用户ID',
  })
  id?: number;

  /**
   * 用户UUID
   */
  @Column({
    type: 'varchar',
    length: 36,
    comment: '用户UUID',
    name: 'user_uuid',
  })
  userUUID?: string;

  /**
   * 用户昵称
   */
  @Column({
    type: 'varchar',
    length: 32,
    comment: '用户昵称',
    name: 'nickname',
  })
  nickName?: string;

  /**
   * 头像
   */
  @Column({ type: 'varchar', length: 256, comment: '头像', name: 'photo' })
  photo?: string;

  /**
   * 账号
   */
  @Column({ type: 'varchar', length: 20, comment: '账号', name: 'account' })
  account?: string;

  /**
   * 密码
   */
  @Column({ type: 'varchar', length: 256, comment: '密码', name: 'password' })
  password?: string;

  /**
   * 是否禁用
   */
  @Column({
    type: 'bit',
    default: false,
    comment: '是否禁用',
    name: 'disable',
  })
  disable?: boolean;

  /**
   * 禁用时间
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '禁用时间',
    name: 'disable_time',
  })
  disableTime?: string;

  /**
   * 创建时间
   */
  @Column({
    type: 'varchar',
    length: 20,
    comment: '创建时间',
    name: 'createtime',
  })
  createTime?: string;

  /**
   * 是否删除
   */
  @Column({
    type: 'bit',
    default: false,
    comment: '是否删除',
    name: 'del',
  })
  del?: boolean;

  /**
   * 删除时间
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '删除时间',
    name: 'del_time',
  })
  delTime?: string;

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
