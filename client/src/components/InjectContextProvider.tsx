/**
 * <p>
 * 全局依赖上下文
 * </p>
 *
 * @version: v1.0
 * @author: Clover
 * @create: 2022-11-25 14:10
 */

 import { message } from "antd";
 import { MessageInstance } from "antd/es/message/interface";
 import React, { PropsWithChildren } from "react"
 
 export type InjectContextMember = {
   message?: MessageInstance
 }
 
 export const InjectContextProvider = (props: PropsWithChildren) => {
   const [messageApi, msgContextHolder] = message.useMessage()
   let children = props.children
 
   const context: InjectContextMember = {
     message: messageApi
   }
 
   if (props.children instanceof Array) {
     children = [msgContextHolder, ...props.children]
   } else {
     children = [msgContextHolder, props.children]
   }
 
   return <InjectContextProvider.Context.Provider value={context}>
     {children}
   </InjectContextProvider.Context.Provider>
 }
 
 InjectContextProvider.Context = React.createContext<InjectContextMember>({})
 
 InjectContextProvider.ContextHolder = InjectContextProvider.Context
