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
  @PrimaryGeneratedColumn({ type: 'int' })
  id?: number;

  /**
   * 文件id
   */
  @Column({ type: 'varchar', length: 512 })
  fileId?: string;

  /**
   * 文件名
   */
  @Column({ type: 'varchar', length: 255 })
  fileName?: string;

  /**
   * 文件夹id
   */
  @Column({ type: 'int' })
  folderId?: number;

  /**
   * 用户id
   */
  @Column({ type: 'int' })
  userId?: number;

  /**
   * 是否公开
   */
  @Column({ type: 'bit', default: false })
  open?: boolean;

  /**
   * 文件后缀
   */
  @Column({ type: 'varchar', length: 45 })
  suffix?: string;

  /**
   * 创建时间
   */
  @Column({ type: 'char', length: 19 })
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
