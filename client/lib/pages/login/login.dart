import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';

class Login extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    double width = MediaQuery.of(context).size.width / 100;
    double height = MediaQuery.of(context).size.height / 100;

    return Container(
      color: Colors.blueAccent,
      child: Stack(
        children: [
          Container(
            width: width * 60,
            height: height * 100,
            child: SvgPicture.asset("assets/svg/login.svg"),
          ),
          Positioned(
              right: width * 10 - width,
              top: height * 10 - height,
              child: Container(
                decoration:BoxDecoration(

                    color: Colors.white,
                  borderRadius: BorderRadius.all(Radius.circular(16)),
                  boxShadow: [BoxShadow(color: Colors.black12,blurRadius: 45,offset:Offset(0,20),)]
                ),
                padding: EdgeInsets.only(left: 16,right: 16,top: 10,bottom: 10),
                width: width * 30,
                height: height * 80,
                child: Column(
                  children: [
                    Text("登录",style: TextStyle(fontSize: 24,color: Colors.blueAccent, decoration: TextDecoration.none),),

                    // Container(
                    //   // height: 100,
                    //   // width: 100,
                    //   child: Row(
                    //     children: [
                    //       TextField(),
                    //     ],
                    //   )
                    // )
                    
                    Container(
                      margin: EdgeInsets.only(bottom: 16),
                      child: Row(children: [
                        Expanded(child: MaterialButton(onPressed: (){
                          Get.back();
                        },child: Text("登录"),height: 50,)),
                      ],),
                    ),
                    Container(
                      margin: EdgeInsets.only(bottom: 16),
                      child: Row(children: [
                        Expanded(child: MaterialButton(onPressed: (){},child: Text("注册"),height: 50,)),
                      ],),
                    ),
                  ],
                ),
              ))
        ],
      ),
    );
  }
}
