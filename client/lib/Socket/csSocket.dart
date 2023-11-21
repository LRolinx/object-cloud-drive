import 'dart:convert';

import 'package:uuid/uuid.dart';
import 'dart:io';

class CsSocket {
  String _ip = "";
  int _port = 0;
  Uuid _uuid = Uuid();
  late Socket _server;
  Map<String, Map<String, String>> addressBook = {};

  CsSocket(String serverip, int serverport, String ip, int port) {
    try {
      String uid = _uuid.v4().toString().replaceAll("-", "");

      Socket.connect(serverip, serverport).then((server) {
        _server = server;
        String info = '{"code":1,"uuid":"${uid}","ip":${ip},"port":${port}}';
        server.write(info);

        handleClient(server);
      });
    } catch (e) {};
  }

  void handleClient(Socket server) {
    try {
      server.listen((event) {
        String msg = String.fromCharCodes(event);
        dynamic json = jsonDecode(msg);

        switch (json['code']) {
          case 0:

            /// 断开连接 并取消登记通讯录
            //   addressBook.remove(json['uuid']);
            break;
          case 1:

            /// 连接 并登记通讯录 并返回ip和端口
            _ip = json['data']['ip'];
            _port = json['data']['port'];
            print("你的真实ip:${_ip} 你的真实port:${_port}");
            break;
          case 2:

            /// 获取 指定人ip和端口
            addressBook[json['data']['uuid']] = {
              "ip": json['data']['ip'],
              "port": json['data']['port']
            };
            break;
        }
      });
    } catch (e) {}
    ;
  }

  String getIp() {
    return _ip;
  }

  int getPort() {
    return _port;
  }

  /// 获取指定人ip和端口
  void getTargetIpPort(String targetUid) {
    String info = '{"code":2,"target":"${targetUid}"}';
    _server.write(info);
  }
}
