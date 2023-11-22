import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

/// 资源管理器
class ResourceManager extends StatefulWidget {
  @override
  State<ResourceManager> createState() => _ResourceManagerState();
}

class _ResourceManagerState extends State<ResourceManager> {
  Future<List<ResourceType>> dirList() async {
    String path = Directory.current.path;
    List<String> rootsp = path.toString().split('\\');

    final List<ResourceType> dictRoots = [
      ResourceType(
          title: '${rootsp[rootsp.length - 1]}',
          parentpath: rootsp[0],
          path: path,
          remarks: '',
          isfolder: true,
          children: []),
    ];

    Stream<FileSystemEntity> fileList = Directory(path).list(recursive: true);
    await for (FileSystemEntity fileSystemEntity in fileList) {
      List<String> sp = fileSystemEntity.path.toString().split('\\');
      var data = ResourceType(
          title: sp[sp.length - 1],
          parentpath: fileSystemEntity.parent.path,
          path: fileSystemEntity.path,
          isfolder: FileSystemEntity.isDirectorySync(fileSystemEntity.path),
          children: []);

      // 写入字典列表
      dictRoots
          .firstWhereOrNull((element) => element.path == data.parentpath)
          ?.children
          .add(data);
      dictRoots.add(data);

      // print('$fileSystemEntity');
    }

    // 排序
    dictRoots.forEach((element) {
      element.children.sort((a, b) {
        int ab = a.isfolder == true ? 1 : 0;
        int bb = b.isfolder == true ? 1 : 0;
        return a.title.compareTo(b.title) & bb.compareTo(ab);
      });
    });

    // 筛出根目录 并返回子目录
    List<ResourceType> roots = [
      dictRoots.firstWhereOrNull((element) => element.path == path)
          as ResourceType
    ];

    return roots[0].children;
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    late RxList<ResourceType> roots = RxList([]);

    dirList().then((value) {
      roots.value = value;
    });

    return Container(
      height: MediaQuery.of(context).size.height / 100 * 100,
      child: Obx(
        () => GridView(
          padding: EdgeInsets.symmetric(vertical: 0),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 8,
          ),
          children: roots.value.map((item) {
            return TextButton(
                style: ButtonStyle(
                  shape: MaterialStateProperty.all(RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5))),
                  // side: MaterialStateProperty.all(BorderSide(color: Colors.red,width: 1))
                ),
                onPressed: () {},
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      child: item.isfolder
                          ? Image.asset("assets/img/folder.png")
                          : Image.asset("assets/img/folder_share.png"),
                    ),
                    Text(item.title!)
                  ],
                ));
          }).toList(),
        ),
      ),
    );
  }
}

class ResourceType {
  const ResourceType({
    required this.title,
    this.remarks = '',
    this.parentpath = '',
    this.path = '',
    this.isfolder = false,
    this.children = const <ResourceType>[],
  });

  // 标题
  final String title;

  // 父路径
  final String parentpath;

  // 路径
  final String path;

  // 说明
  final String remarks;

  // 是否文件夹
  final bool isfolder;

  // 子级
  final List<ResourceType> children;
}
