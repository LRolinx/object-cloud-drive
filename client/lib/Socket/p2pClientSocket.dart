import 'dart:convert';

import 'package:uuid/uuid.dart';
import 'dart:io';

class P2PClientSocket {
  late Socket _server;
  Map<String, Map<String, String>> addressBook = {};

  P2PClientSocket(String ip,int port) {

    Socket.connect(ip, port).then((server) {
      _server = server;

      // String info = '{"uuid":"${uuid}","code":1}';
      // server.write(info);

      handleClient(server);
    });
  }

  void handleClient(Socket server) {
    server.listen((event) {
      String msg = String.fromCharCodes(event);
      dynamic json = jsonDecode(msg);

      switch (json['code']) {
        case 0:

          /// 断开连接 并取消登记通讯录
          //   addressBook.remove(json['uuid']);
          break;

        case 2:

          /// 获取 指定人真实ip和端口
          addressBook[json['data']['uuid']] = {
            "ip": json['data']['ip'],
            "port": json['data']['port']
          };
          break;
      }
    });
  }
}
