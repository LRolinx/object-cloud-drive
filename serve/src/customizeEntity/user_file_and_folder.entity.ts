import { Column, Entity, PrimaryColumn } from 'typeorm';

/*
 * █████▒█      ██  ▄████▄   ██ ▄█▀     ██████╗ ██╗   ██╗ ██████╗
 * ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒      ██╔══██╗██║   ██║██╔════╝
 * ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░      ██████╔╝██║   ██║██║  ███╗
 * ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄      ██╔══██╗██║   ██║██║   ██║
 * ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄     ██████╔╝╚██████╔╝╚██████╔╝
 * ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒     ╚═════╝  ╚═════╝  ╚═════╝
 * ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
 * ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
 * ░     ░ ░      ░  ░
 * Copyright 2022 LRolinx.
 * <p>
 *  -自定义文件夹以及文件表
 * </p>
 * @author LRolinx
 * @create 2021-12-11 17:24
 */
@Entity('t_user_file_and_folder')
export class UserFileAndFolder {
  /**
   * 加密用户ID
   */
  @PrimaryColumn({
    type: 'varchar',
  })
  id?: string;

  @Column({ type: 'varchar', length: 255 })
  name?: string;

  @Column({ type: 'varchar', length: 255 })
  type?: string;

  @Column({ type: 'double' })
  size?: number;

  @Column({ type: 'varchar', length: 255 })
  path?: string;

  @Column({ type: 'varchar', length: 255 })
  updateTime?: string;

  @Column({ type: 'varchar', length: 255 })
  suffix?: string;

  @Column({ type: 'varchar', length: 255 })
  fileType?: string;
}
