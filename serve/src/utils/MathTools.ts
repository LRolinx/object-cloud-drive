/*
 * @Author: LRolinx
 * @Date: 2021-01-20 10:27:54
 * @LastEditTime 2021-12-11 22:21
 * @Description:
 *
 */
import * as NodeRSA from 'node-rsa';
import * as fs from 'fs';
import conf from 'src/config/config';

export default class MathTools {
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

    // 生成一个1024长度的密钥对
    const decrypt = new NodeRSA({ b: 1024 });

    //设置加密方式
    decrypt.setOptions({ encryptionScheme: 'pkcs1', environment: 'browser' });

    if (!fs.existsSync(`${conf.key.path}private.key`)) {
      //私钥文件不存在
      const privateKey = decrypt.exportKey('private');
      fs.writeFileSync(`${conf.key.path}private.key`, privateKey);
    }

    if (!fs.existsSync(`${conf.key.path}public.key`)) {
      //公钥文件不存在
      const publicKey = decrypt.exportKey('public');
      fs.writeFileSync(`${conf.key.path}public.key`, publicKey);
    }
  }

  /**
   * 使用公开密匙加密
   * @param value 需要加密的内容
   */
  public static encryptForKey(value: any): string {
    MathTools.generateKey();

    const data = fs.readFileSync(`${conf.key.path}public.key`);
    const decrypt = new NodeRSA(data);
    decrypt.setOptions({ encryptionScheme: 'pkcs1', environment: 'browser' });
    return decrypt.encrypt(value, 'base64');
  }

  /**
   * 使用私有密匙解密
   * @param value 需要解密的内容
   */
  public static decryptForKey(encrypt: any): string | boolean {
    try {
      const data = fs.readFileSync(`${conf.key.path}private.key`);
      const decrypt = new NodeRSA(data);
      decrypt.setOptions({ encryptionScheme: 'pkcs1', environment: 'browser' });
      return decrypt.decrypt(encrypt, 'utf8');
    } catch {
      return false;
    }
  }

  /**
   * 生成根UUID
   * @returns
   */
  public static RootUUID() {
    return '00000000-0000-0000-0000-000000000000';
  }

  /**
   * 生成4位随机字符
   * @returns
   */
  private static S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  /**
   * 生成随机UUID
   */
  public static UUID() {
    return `${MathTools.S4()}${MathTools.S4()}-${MathTools.S4()}-${MathTools.S4()}-${MathTools.S4()}-${MathTools.S4()}${MathTools.S4()}${MathTools.S4()}`;
  }
}
