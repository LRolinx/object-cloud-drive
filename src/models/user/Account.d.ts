/**
 * <p>
 * 账号相关类型
 * </p>
 *
 * @version: v1.0
 * @author: Clover
 * @create: 2022-11-25 14:17
 */
declare namespace Account {
  type LoginTo = {
    username?: string
    password?: string
  }

  type LoginToKeys = keyof LoginTo
}
