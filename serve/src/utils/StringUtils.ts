import TypeCheck from './TypeCheck';

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
 *  字符串工具类
 * </p>
 * @author Clover
 * @create 2021-11-09 15:38
 */
export class StringUtils {
  private constructor() {
    //
  }

  /**
   * 验证一个指定的字符串是否为空
   * @param o 需要验证的字符串对象
   * @returns 验证结果
   */
  static hasText(o?: string): boolean {
    if (TypeCheck.getType(o) != '[object String]' || o == void 0) {
      return false;
    }
    return o.trim().length > 0;
  }

  /**
   * 获取文件名和后缀
   * @param value
   */
  static getFileNameAndFext = (value: string) => {
    //
    let fname = '';
    let fext = '';
    if (value.indexOf('.') != -1) {
      fname = value.substring(0, value.lastIndexOf('.')); //获取文件名
      fext = value.substring(value.lastIndexOf('.') + 1); //获取后缀名
    } else {
      fname = value.substring(value.lastIndexOf('.') + 1); //获取文件名
      fext = '';
    }
    return { fname, fext };
  };
}
