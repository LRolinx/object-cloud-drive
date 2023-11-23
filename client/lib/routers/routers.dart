import 'package:client/pages/login/login.dart';
import 'package:get/get_navigation/get_navigation.dart';

class Routers {
  static const login = '/login';
  static List<GetPage> getPages = [GetPage(name: login, page: () => Login())];
}
