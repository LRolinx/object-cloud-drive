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
 *  文件状态表
 * </p>
 * @author Clover
 * @create 2021-11-09 09:30
 */
@Entity('t_files_status')
export class FilesStatusEntity {
  /**
   * 文件状态id
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '文件状态id' })
  id?: number;

  /**
   * 文件状态
   */
  @Column({ type: 'char', length: 1, comment: '文件状态' })
  status?: string;

  /**
   * 文件是否删除
   */
  @Column({ type: 'bit', comment: '文件是否删除', default: false })
  del?: boolean;

  /**
   * 创建一个FilesStatusEntity实例
   * @param info 初始化数据
   * @returns FilesStatusEntity
   * @author Clover·You
   * @date 2021/11/09 11:19
   */
  static instance(info: FilesStatusEntity) {
    const status = new FilesStatusEntity();
    for (const key in info) {
      status[key] = info[key];
    }
    return status;
  }
}
