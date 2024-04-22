import { JSEncrypt } from 'JSEncrypt'
import { useUserStore } from '@/store/models/user'
import { useAppStore } from '@/store/models/app'

export default class MathTools {

  /**
   * 使用公开密匙加密
   * @param value 需要加密的内容
   */
  public static encryptForKey(value: any): string {
    const appStore = useAppStore()
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(appStore.publickey)

    return encryptor.encrypt(value).toString()
  }

  //   /**
  //    * 使用私有密匙解密
  //    * @param value 需要解密的内容
  //    */
  //   public static decryptForKey(encrypt: any): string {
  //     const encryptor = new JSEncrypt()
  //     const key = new NodeRSA(appStore.publickey)
  //     return key.decryptPublic(encrypt, 'utf8')
  //   }


  /**
   * 生成根UUID
   * @returns 
   */
  public static RootUUID() {
    return '00000000-0000-0000-0000-000000000000'
  }

  /**
   * 生成4位随机字符
   * @returns 
   */
  private static S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  /**
   * 生成随机UUID
   */
  public static UUID() {
    return `${MathTools.S4()}${MathTools.S4()}-${MathTools.S4()}-${MathTools.S4()}-${MathTools.S4()}-${MathTools.S4()}${MathTools.S4()}${MathTools.S4()}`
  }
}
