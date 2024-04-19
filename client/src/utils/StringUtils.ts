/**
 * <p>
 * 字符串工具类
 * </p>
 *
 * @version: v1.0
 * @author: Clover
 * @create: 2022-11-25 14:14
 */

/**
 * 检查字符串是否不为空
 * @param str {string} 需要检查的字符串
 */
 export const hasText = (str?: string): boolean => {
  return str != void 0 && (typeof str as any === 'string') && str?.trim().length > 0
}
