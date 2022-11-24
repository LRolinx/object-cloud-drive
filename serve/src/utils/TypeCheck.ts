/**************************************************************************
 * Copyright Copyright 2020 Clover You.
 * File Name: TypeCheck.ts
 * Description: 用于数据类型检查
 *
 * Version: V1.0
 * Author: Clover You
 * Create Time: 2021/1/12 00:39
 ***************************************************************************/
export default class TypeCheck {
  public static getType(o: any): string {
    return Object.prototype.toString.call(o);
  }
}
