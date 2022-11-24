
/**************************************************************************
 * Copyright Copyright 2020 Clover You.
 * File Name: Bean.ts
 * Description:
 *
 * Version: V1.0
 * Author: Clover You
 * Create Time: 2021/1/12 00:31
 ***************************************************************************/
import TypeCheck from "./TypeCheck";

export interface TargetConstructor {
    new(): any;
}

export default class Bean {

    /**
     * 将Map转为对应实体
     * @param source 数据源 - Map
     * @param target 实体
     * @return target<T>
     */
    public static async Map2Model<T>(source: any, target: TargetConstructor): Promise<T> {
        const targetType: string = TypeCheck.getType(target);
        const sourceType: string = TypeCheck.getType(source);
        class clazz extends target { }
        const copyObj: any = new clazz();

        if (sourceType === "[object Object]") {
            for (const sourceKey in source) {
                const upperName = await this.handleString(sourceKey);
                if (copyObj[sourceKey] !== undefined) {
                    copyObj[sourceKey] = source[sourceKey];
                } else if(copyObj[upperName] !== undefined) {
                    copyObj[upperName] = source[sourceKey];
                }
            }
        }
        return copyObj;
    }

    public static async handleString(str: string): Promise<string> {
        const strs = str.split("_");
        let name = '';
        for (const n of strs) {
            name += n.toLowerCase().replace(n[0], n[0].toUpperCase());
        }
        return name.replace(name[0], name[0].toLowerCase());
    }
}