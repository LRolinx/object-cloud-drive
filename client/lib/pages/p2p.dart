import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:p2pclient/Socket/p2pServerSocket.dart';

import '../Socket/csSocket.dart';
import '../Socket/p2pClientSocket.dart';

class P2PPage extends StatelessWidget {
  String ipv6ip = InternetAddress.anyIPv6.address;
  int ipv6port = 5566;
  String p2pip = "";
  int p2pport = 0;
  List<NetworkInterface> networklist = List.empty(growable: true);
  List<InternetAddress> ipv4list = List.empty(growable: true);
  List<InternetAddress> ipv6list = List.empty(growable: true);

  //ipv6第一个是真实的 第二个是虚拟的使用第二个更安全

  late CsSocket csSocket;
  late P2PServerSocket p2pServerSocket;
  late P2PClientSocket p2pClientSocket;


  @override
  initState() {
    getNetwork();
    //fe80::216:3cff:feb1:3c90
    csSocket = CsSocket("142.171.184.126", 6666, ipv6list.last.address, ipv6port);
  }

  void getNetwork() async {
    networklist = await NetworkInterface.list();

    networklist.first.addresses.forEach((e) {
      if (e.type == InternetAddressType.IPv4) {
        ipv4list.add(e);
      }
      if (e.type == InternetAddressType.IPv6) {
        ipv6list.add(e);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return ListView(
      children: [
        Row(
          children: [
            TextButton(
                onPressed: () async {
                  p2pServerSocket = P2PServerSocket(ipv6ip, ipv6port);
                },
                child: Text("启动P2P服务器"))
          ],
        ),
        TextField(
          onChanged: (v) {
            // Global.okex_passphrase.value = v.toString();

            // Global.system.saveUserSetting();
            p2pip = v;
          },
          controller: TextEditingController(text: p2pip),
          style: TextStyle(color: Colors.white),
          obscureText: false,
          decoration: InputDecoration(labelText: "ip"),
        ),
        TextField(
          onChanged: (v) {
            // Global.okex_passphrase.value = v.toString();

            // Global.system.saveUserSetting();
            p2pport = int.parse(v);
          },
          controller: TextEditingController(text: p2pport.toString()),
          style: TextStyle(color: Colors.white),
          obscureText: false,
          decoration: InputDecoration(labelText: "port"),
        ),
        Row(
          children: [
            TextButton(
                onPressed: () {
                  p2pClientSocket = P2PClientSocket(p2pip, p2pport);
                },
                child: Text("连接P2P服务器"))
          ],
        )
      ],
    );
  }
}
