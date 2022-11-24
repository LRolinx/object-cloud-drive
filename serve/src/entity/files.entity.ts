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
   * 文件id
   */
  @PrimaryColumn({ type: 'varchar', length: 512, comment: '文件id' })
  sha256?: string;

  /**
   * 文件路径
   */
  @Column({ type: 'varchar', length: 255, comment: '文件路径' })
  url?: string;

  /**
   * 文件状态id
   */
  @Column({ type: 'int', comment: '文件状态id' })
  statusId?: number;

  /**
   * 文件类型id
   */
  @Column({ type: 'int', comment: '文件类型id' })
  fileTypeId?: number;

  /**
   * 是否已检查违规情况
   */
  @Column({ type: 'bit', comment: '是否已检查违规情况', default: false })
  checked?: boolean;

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
