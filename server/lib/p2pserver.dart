import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
/// 创建Socket服务器
/// 

// 通讯录
Map<String,Map<String,dynamic>> addressBook = {};

void createSocketServer () async {
List<NetworkInterface> networklist  = await NetworkInterface.list();

networklist.forEach((element) {
  networklist.first.addresses.forEach((e) {
      // if (e.type == InternetAddressType.IPv4) {
      //   ipv4list.add(e);
      // }
      // if (e.type == InternetAddressType.IPv6) {
      //   ipv6list.add(e);
      // }
      print("${element.name}->${e.address}");
    });
});


  String ipv4ip = "142.171.184.126";
  int ipv4port = 6666;
  ServerSocket.bind(ipv4ip, ipv4port).then((ServerSocket server) {
    print("服务器->启动完成 ${ipv4ip}->${ipv4port}");
    //监听
    server.listen(handleClient);
  });
}


void handleClient(Socket client) {
  print("客户端接入->${client.remoteAddress.address}:${client.remotePort}");

  client.listen((event) { 
    String msg = String.fromCharCodes(event);
    dynamic json = jsonDecode(msg);

    switch(json['code']){
      case 0:
      /// 断开连接 并取消登记通讯录
      addressBook.remove(json['uuid']);
      break;
      case 1:
      /// 连接 并登记通讯录 并返回真实ip和端口
      addressBook[json['uuid']] = {
        "socket":client,
        "ip":json['ip'],
        "port":json['port'],
      };
      String info = '{"code":1,"data":{"ip":"${client.remoteAddress.address}","port":${client.remotePort}}}';
      client.write(info);
      break;
      case 2:
      /// 获取 指定人公共ip和公共端口 + 局域ip和局域端口
      Socket target = addressBook[json['target']]?['socket'] as Socket;
      String localip = addressBook[json['target']]?['ip'];
      int localport = addressBook[json['target']]?['port'];
      String info = '{"code":2,"data":"{"uuid":"${json['target']}","ip":"${target.remoteAddress.address}","port":${target.remotePort},"localip":${localip},"localport":${localport}}"}';
      client.write(info);
      // addressBook[json['target']]?.write(info);
      break;
      case 3:
      /// 转发消息给其他人
      addressBook.forEach((key, _socket) {
        if(key != json['uuid']) {
          String info = '{"uuid":"${json['uuid']}","code":3,"data":""}';
          _socket['socket'].write(info);
        }
      });
      break;
      case 4:
      /// 转发消息给指定人
      String info = '{"uuid":"${json['uuid']}","code":4,"data":""}';
      addressBook[json['target']]?['socket'].write(info);
      break;
    }
  });
}
