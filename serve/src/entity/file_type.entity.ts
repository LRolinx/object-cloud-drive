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
 * 文件类型表
 * </p>
 * @author Clover
 * @create 2021-11-09 09:27
 */
@Entity('t_file_type')
export class FileTypeEntity {
  /**
   * 文件类型id
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '文件类型ID' })
  id?: number;

  /**
   * 文件类型
   */
  @Column({ type: 'varchar', length: 32, comment: '文件类型' })
  type?: string;

  /**
   * 创建一个FileTypeEntity实例
   * @param info 初始化数据
   * @returns FileTypeEntity
   * @author Clover·You
   * @date 2021/11/09 11:19
   */
  static instance(info: FileTypeEntity) {
    const type = new FileTypeEntity();
    for (const key in info) {
      type[key] = info[key];
    }
    return type;
  }
}
