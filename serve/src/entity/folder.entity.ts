import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
 *  用户文件夹实体
 * </p>
 * @author Clover
 * @create 2021-11-09 08:59
 */
@Entity('t_folder')
export class FolderEntity {
  /**
   * 文件夹id
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '文件夹id' })
  id?: number;

  /**
   * 文件夹名称
   */
  @Column({ type: 'varchar', length: 64, comment: '文件夹名称' })
  name?: string;

  /**
   * 用户id
   */
  @Column({ type: 'int', comment: '用户id' })
  userId?: number;

  /**
   * 父文件夹id
   */
  @Column({ type: 'int', name: 'p_id', comment: '父文件夹' })
  pId?: number;

  /**
   * 文件夹大小
   */
  @Column({ type: 'double' })
  size?: number;

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
   * 创建一个FolderEntity实例
   * @param info 初始化数据
   * @returns FolderEntity
   * @author Clover·You
   * @date 2021/11/09 11:20
   */
  static instance(info: FolderEntity) {
    const folder = new FolderEntity();
    for (const key in info) {
      folder[key] = info[key];
    }
    return folder;
  }
}
