/*
 Navicat Premium Data Transfer

 Source Server         : server
 Source Server Type    : MySQL
 Source Server Version : 80035
 Source Host           : 192.168.3.40:3306
 Source Schema         : objcloud

 Target Server Type    : MySQL
 Target Server Version : 80035
 File Encoding         : 65001

 Date: 24/11/2023 22:07:59
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_file_type
-- ----------------------------
DROP TABLE IF EXISTS `t_file_type`;
CREATE TABLE `t_file_type`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '类型id',
  `type` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '类型名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '文件类型表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_file_type
-- ----------------------------

-- ----------------------------
-- Table structure for t_files
-- ----------------------------
DROP TABLE IF EXISTS `t_files`;
CREATE TABLE `t_files`  (
  `sha256` varchar(512) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '文件Sha256Id',
  `url` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '文件路径',
  `statusid` int NOT NULL COMMENT '状态Id',
  `filetypeid` int NOT NULL COMMENT '文件类型id',
  `checked` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否已检查',
  PRIMARY KEY (`sha256`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '文件表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_files
-- ----------------------------

-- ----------------------------
-- Table structure for t_files_status
-- ----------------------------
DROP TABLE IF EXISTS `t_files_status`;
CREATE TABLE `t_files_status`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '文件状态id',
  `status` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '文件状态',
  `del` bit(1) NOT NULL DEFAULT b'0' COMMENT '状态是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '文件状态表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_files_status
-- ----------------------------

-- ----------------------------
-- Table structure for t_folder
-- ----------------------------
DROP TABLE IF EXISTS `t_folder`;
CREATE TABLE `t_folder`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '文件夹id',
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '文件夹名称',
  `userid` int NOT NULL COMMENT '用户id',
  `pid` int NULL DEFAULT NULL COMMENT '文件夹id',
  `size` double NOT NULL COMMENT '文件夹大小',
  `createtime` char(19) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '创建时间\n',
  `del` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除 0 — 未删除 1 — 已删除',
  `deltime` char(19) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '文件夹表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_folder
-- ----------------------------

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `nickname` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '昵称',
  `photo` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '头像',
  `password` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '密码',
  `account` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '账号',
  `isDisable` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否停用',
  `createtime` char(19) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `del` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除 0 — 未删除 1— 删除',
  `deltime` char(19) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '数据删除时间\n',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_user
-- ----------------------------

-- ----------------------------
-- Table structure for t_user_files
-- ----------------------------
DROP TABLE IF EXISTS `t_user_files`;
CREATE TABLE `t_user_files`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户文件id',
  `fileid` varchar(512) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '文件Sha256Id',
  `filename` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '文件名',
  `folderid` int NULL DEFAULT NULL COMMENT '文件夹id',
  `userid` int NOT NULL COMMENT '用户id',
  `open` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否公开',
  `suffix` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '文件后缀名',
  `createtime` char(19) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '添加时间',
  `del` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除 0 — 未删除 1 — 已删除',
  `del_time` char(19) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '用户文件表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_user_files
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
