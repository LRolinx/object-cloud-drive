import { Column, Entity, PrimaryColumn } from 'typeorm';

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
 *  文件表
 * </p>
 * @author Clover
 * @create 2021-11-09 09:20
 */
@Entity('t_files')
export class FilesEntity {
  /**
   * 文件SHA256
   */
  @PrimaryColumn({
    type: 'varchar',
    length: 512,
    comment: '文件SHA256',
    name: 'file_sha256',
  })
  sha256?: string;

  /**
   * 文件路径
   */
  @Column({
    type: 'varchar',
    length: 512,
    comment: '文件路径',
    name: 'url',
  })
  url?: string;

  /**
   * 是否禁止,违规文件
   */
  @Column({
    type: 'bit',
    comment: '是否禁止,违规文件',
    default: false,
    name: 'disable',
  })
  disable?: boolean;

  /**
   * 是否禁止,违规文件
   */
  @Column({
    type: 'varchar',
    length: 20,
    comment: '禁止时间',
    name: 'disable_time',
    nullable: true,
  })
  disableTime?: string;

  /**
   * 创建一个FilesEntity实例
   * @param info 初始化数据
   * @returns FilesEntity
   * @author Clover·You
   * @date 2021/11/09 11:20
   */
  static instance(info: FilesEntity) {
    const file = new FilesEntity();
    for (const key in info) {
      file[key] = info[key];
    }
    return file;
  }
}
