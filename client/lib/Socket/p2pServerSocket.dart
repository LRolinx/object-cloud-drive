import 'dart:convert';
import 'dart:ffi';

import 'package:uuid/uuid.dart';
import 'dart:io';

class P2PServerSocket {
  Map<String, Socket> addressBook = {};

  P2PServerSocket(String ip,int port) {
    ServerSocket.bind(ip, port).then((ServerSocket server) {
      print("P2P服务器->启动完成 ${ip}:${port}");

      server.listen(handleClient);
    });
  }

  void handleClient(Socket client) {
    print("P2P客户端接入->${client.remoteAddress.address}:${client.remotePort}");

    client.listen((event) {
      String msg = String.fromCharCodes(event);
      dynamic json = jsonDecode(msg);

      switch (json['code']) {
        case 0:
          /// 断开连接 并取消登记通讯录

          break;
      }
    });
  }
}
