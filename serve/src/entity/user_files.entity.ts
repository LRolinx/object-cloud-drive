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
 *  用户文件
 * </p>
 * @author Clover
 * @create 2021-11-09 09:11
 */
@Entity('t_user_files')
export class UserFilesEntity {
  /**
   * 用户文件id
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '用户文件id', name: 'id' })
  id?: number;

  /**
   * 文件SHA256
   */
  @Column({
    type: 'varchar',
    length: 512,
    comment: '文件SHA256',
    name: 'file_sha256',
  })
  fileSha256?: string;

  /**
   * 文件夹UUID
   */
  @Column({
    type: 'varchar',
    length: 36,
    comment: '文件夹UUID',
    name: 'folder_uuid',
  })
  folderUuid?: string;

  /**
   * 用户UUID
   */
  @Column({
    type: 'varchar',
    length: 36,
    comment: '用户UUID',
    name: 'user_uuid',
  })
  userUuid?: string;

  /**
   * 文件名
   */
  @Column({
    type: 'varchar',
    length: 256,
    comment: '文件名',
    name: 'file_name',
  })
  fileName?: string;

  /**
   * 后缀名
   */
  @Column({ type: 'varchar', length: 45, comment: '后缀名', name: 'suffix' })
  suffix?: string;

  /**
   * 是否共享
   */
  @Column({
    type: 'bit',
    default: false,
    comment: '是否共享',
    name: 'open',
  })
  open?: boolean;

  /**
   * 创建时间
   */
  @Column({
    type: 'varchar',
    length: 20,
    comment: '创建时间',
    name: 'create_time',
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
   * 创建一个UserFilesEntity实例
   * @param info 初始化数据
   * @returns UserFilesEntity
   * @author Clover·You
   * @date 2021/11/09 11:20
   */
  static instance(info: UserFilesEntity) {
    const file = new UserFilesEntity();
    for (const key in info) {
      file[key] = info[key];
    }

    return file;
  }
}
