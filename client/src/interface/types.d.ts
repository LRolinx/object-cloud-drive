/**
 * <p>
 * 类型约束
 * </p>
 *
 * @version: v1.0
 * @author: Clover You
 * @email: cloveryou02@163.com
 * @create: 2022-08-22 13:58
 **/

/**
 * 如果T与U存在同名属性时采用T的类型方案
 */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U
