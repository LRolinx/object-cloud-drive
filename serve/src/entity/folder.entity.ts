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
 *  用户文件夹实体
 * </p>
 * @author Clover
 * @create 2021-11-09 08:59
 */
@Entity('t_folder')
export class FolderEntity {
  /**
   * 文件夹ID
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '文件夹ID', name: 'id' })
  id?: number;

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
   * 父UUID
   */
  @Column({
    type: 'varchar',
    length: 36,
    comment: '父UUID',
    name: 'p_uuid',
  })
  pUuid?: string;

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
   * 文件夹名称
   */
  @Column({ type: 'varchar', length: 256, comment: '文件夹名称', name: 'name' })
  name?: string;

  /**
   * 文件夹大小
   */
  @Column({ type: 'double', comment: '文件夹大小', name: 'size' })
  size?: number;

  /**
   * 创建时间
   */
  @Column({ type: 'varchar', length: 20, name: 'create_time' })
  createTime?: string;

  /**
   * 是否删除
   */
  @Column({ type: 'bit', default: false, name: 'del' })
  del?: boolean;

  /**
   * 删除时间
   */
  @Column({ type: 'varchar', length: 20, nullable: true, name: 'del_time' })
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
