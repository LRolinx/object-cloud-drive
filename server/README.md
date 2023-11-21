A sample command-line application with an entrypoint in `bin/`, library code
in `lib/`, and example unit test in `test/`.

``` bash
//使用kernel 编译二进制文件以可以在各大系统使用
dart compile kernel bin/p2pserver.dart

//本地运行
dart run

//二进制运行
dart p2pserver.dill
```
