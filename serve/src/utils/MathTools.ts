/*
 * @Author: LRolinx
 * @Date: 2021-01-20 10:27:54
 * @LastEditTime 2021-12-11 22:21
 * @Description:
 *
 */
import * as NodeRSA from 'node-rsa';
import * as fs from 'fs';
import {DataBaseConfig} from 'src/config/orm.config';
import conf from 'src/config/config';

export default class MathTools {
  // 生成一个1024长度的密钥对
  private static key = new NodeRSA({ b: 1024 });

  // 导出私钥
  private static privateKey = MathTools.key.exportKey('private');

  // 导出公钥
  private static publicKey = MathTools.key.exportKey('public');

  /**
   * 在本地生成加密密匙
   */
  public static generateKey() {
    if (!fs.existsSync(conf.key.path)) {
      //没临时文件夹
      fs.mkdirSync(conf.key.path, {
        recursive: true,
      });
    }

    if (!fs.existsSync(`${conf.key.path}private.key`)) {
      //文件不存在
      fs.writeFileSync(`${conf.key.path}private.key`, MathTools.privateKey);
    }

    if (!fs.existsSync(`${conf.key.path}public.key`)) {
      //文件不存在
      fs.writeFileSync(`${conf.key.path}public.key`, MathTools.publicKey);
    }
  }

  /**
   * 使用密匙加密
   * @param value 需要加密的内容
   */
  public static encryptForKey(value: any): string {
    MathTools.generateKey();

    const data = fs.readFileSync(`${conf.key.path}private.key`);
    const key = new NodeRSA(data);
    return key.encryptPrivate(value, 'base64');
  }

  /**
   * 使用密匙解密
   * @param value 需要解密的内容
   */
  public static decryptForKey(encrypt: any): string {
    const data = fs.readFileSync(`${conf.key.path}public.key`);
    const key = new NodeRSA(data);
    return key.decryptPublic(encrypt, 'utf8');
  }
}
