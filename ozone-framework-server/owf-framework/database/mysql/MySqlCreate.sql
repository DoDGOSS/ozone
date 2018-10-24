-- MySQL dump 10.13  Distrib 5.7.20, for Win32 (AMD64)
--
-- Host: localhost    Database: owf
-- ------------------------------------------------------
-- Server version	5.7.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application_configuration`
--

DROP TABLE IF EXISTS `application_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_configuration` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL DEFAULT '0',
  `created_by_id` bigint(20) DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `edited_by_id` bigint(20) DEFAULT NULL,
  `edited_date` date DEFAULT NULL,
  `code` varchar(250) NOT NULL,
  `VALUE` varchar(2000) DEFAULT NULL,
  `title` varchar(250) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `type` varchar(250) NOT NULL,
  `group_name` varchar(250) NOT NULL,
  `sub_group_name` varchar(250) DEFAULT NULL,
  `mutable` tinyint(1) NOT NULL,
  `sub_group_order` bigint(20) DEFAULT NULL,
  `help` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `FKFC9C0477666C6D2` (`created_by_id`),
  KEY `FKFC9C047E31CB353` (`edited_by_id`),
  KEY `app_config_group_name_idx` (`group_name`),
  CONSTRAINT `FKFC9C0477666C6D2` FOREIGN KEY (`created_by_id`) REFERENCES `person` (`id`),
  CONSTRAINT `FKFC9C047E31CB353` FOREIGN KEY (`edited_by_id`) REFERENCES `person` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dashboard`
--

DROP TABLE IF EXISTS `dashboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dashboard` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `isdefault` bit(1) NOT NULL,
  `dashboard_position` int(11) NOT NULL,
  `altered_by_admin` bit(1) NOT NULL,
  `guid` varchar(255) NOT NULL,
  `name` varchar(200) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `description` varchar(4000) DEFAULT NULL,
  `created_by_id` bigint(20) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `edited_by_id` bigint(20) DEFAULT NULL,
  `edited_date` datetime DEFAULT NULL,
  `layout_config` longtext,
  `locked` tinyint(1) DEFAULT '0',
  `stack_id` bigint(20) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `icon_image_url` varchar(2083) DEFAULT NULL,
  `published_to_store` tinyint(1) DEFAULT NULL,
  `marked_for_deletion` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guid` (`guid`),
  KEY `fkc18aea947028b8db` (`edited_by_id`),
  KEY `fkc18aea946b3a1281` (`stack_id`),
  KEY `fkc18aea94372cc5a` (`created_by_id`),
  KEY `fkc18aea948656347d` (`user_id`),
  CONSTRAINT `fkc18aea94372cc5a` FOREIGN KEY (`created_by_id`) REFERENCES `person` (`id`),
  CONSTRAINT `fkc18aea946b3a1281` FOREIGN KEY (`stack_id`) REFERENCES `stack` (`id`),
  CONSTRAINT `fkc18aea947028b8db` FOREIGN KEY (`edited_by_id`) REFERENCES `person` (`id`),
  CONSTRAINT `fkc18aea948656347d` FOREIGN KEY (`user_id`) REFERENCES `person` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `databasechangelog`
--

DROP TABLE IF EXISTS `databasechangelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `databasechangelog` (
  `ID` varchar(255) NOT NULL,
  `AUTHOR` varchar(255) NOT NULL,
  `FILENAME` varchar(255) NOT NULL,
  `DATEEXECUTED` datetime NOT NULL,
  `ORDEREXECUTED` int(11) NOT NULL,
  `EXECTYPE` varchar(10) NOT NULL,
  `MD5SUM` varchar(35) DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `COMMENTS` varchar(255) DEFAULT NULL,
  `TAG` varchar(255) DEFAULT NULL,
  `LIQUIBASE` varchar(20) DEFAULT NULL,
  `CONTEXTS` varchar(255) DEFAULT NULL,
  `LABELS` varchar(255) DEFAULT NULL,
  `DEPLOYMENT_ID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `databasechangeloglock`
--

DROP TABLE IF EXISTS `databasechangeloglock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `databasechangeloglock` (
  `ID` int(11) NOT NULL,
  `LOCKED` bit(1) NOT NULL,
  `LOCKGRANTED` datetime DEFAULT NULL,
  `LOCKEDBY` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domain_mapping`
--

DROP TABLE IF EXISTS `domain_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_mapping` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `src_id` bigint(20) NOT NULL,
  `src_type` varchar(255) NOT NULL,
  `relationship_type` varchar(8) DEFAULT NULL,
  `dest_id` bigint(20) NOT NULL,
  `dest_type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `domain_mapping_all` (`src_id`,`src_type`,`relationship_type`,`dest_id`,`dest_type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `intent`
--

DROP TABLE IF EXISTS `intent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `intent` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `action` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `intent_data_type`
--

DROP TABLE IF EXISTS `intent_data_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `intent_data_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `data_type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `intent_data_types`
--

DROP TABLE IF EXISTS `intent_data_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `intent_data_types` (
  `intent_data_type_id` bigint(20) NOT NULL,
  `intent_id` bigint(20) NOT NULL,
  KEY `FK8A59132FD46C6FAA` (`intent_data_type_id`),
  KEY `FK8A59D92FD46C6FAA` (`intent_id`),
  CONSTRAINT `FK8A59132FD46C6FAA` FOREIGN KEY (`intent_data_type_id`) REFERENCES `intent_data_type` (`id`),
  CONSTRAINT `FK8A59D92FD46C6FAA` FOREIGN KEY (`intent_id`) REFERENCES `intent` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `owf_group`
--

DROP TABLE IF EXISTS `owf_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `owf_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `status` varchar(8) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `automatic` bit(1) NOT NULL,
  `display_name` varchar(200) DEFAULT NULL,
  `stack_default` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `owf_group_people`
--

DROP TABLE IF EXISTS `owf_group_people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `owf_group_people` (
  `person_id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL,
  PRIMARY KEY (`group_id`,`person_id`),
  KEY `FK2811370C1F5E0B3` (`person_id`),
  CONSTRAINT `FK28113703B197B21` FOREIGN KEY (`group_id`) REFERENCES `owf_group` (`id`),
  CONSTRAINT `FK2811370C1F5E0B3` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `user_real_name` varchar(200) NOT NULL,
  `username` varchar(200) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `email_show` bit(1) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `prev_login` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `last_notification` datetime DEFAULT NULL,
  `requires_sync` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person_role`
--

DROP TABLE IF EXISTS `person_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person_role` (
  `person_authorities_id` bigint(20) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person_widget_definition`
--

DROP TABLE IF EXISTS `person_widget_definition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person_widget_definition` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `person_id` bigint(20) NOT NULL,
  `visible` bit(1) NOT NULL,
  `pwd_position` int(11) NOT NULL,
  `widget_definition_id` bigint(20) NOT NULL,
  `group_widget` tinyint(1) DEFAULT '0',
  `favorite` tinyint(1) DEFAULT '0',
  `display_name` varchar(256) DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT '0',
  `user_widget` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `person_id` (`person_id`,`widget_definition_id`),
  KEY `FK6F5C17C4293A835C` (`widget_definition_id`),
  CONSTRAINT `FK6F5C17C4293A835C` FOREIGN KEY (`widget_definition_id`) REFERENCES `widget_definition` (`id`),
  CONSTRAINT `FK6F5C17C4C1F5E0B3` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `preference`
--

DROP TABLE IF EXISTS `preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `preference` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `value` longtext NOT NULL,
  `path` varchar(200) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `namespace` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `path` (`path`,`namespace`,`user_id`),
  KEY `FKA8FCBCDB8656347D` (`user_id`),
  CONSTRAINT `FKA8FCBCDB8656347D` FOREIGN KEY (`user_id`) REFERENCES `person` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requestmap`
--

DROP TABLE IF EXISTS `requestmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requestmap` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `url` varchar(255) NOT NULL,
  `config_attribute` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `authority` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `authority` (`authority`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stack`
--

DROP TABLE IF EXISTS `stack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stack` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `name` varchar(256) NOT NULL,
  `description` varchar(4000) DEFAULT NULL,
  `stack_context` varchar(200) NOT NULL,
  `image_url` varchar(2083) DEFAULT NULL,
  `descriptor_url` varchar(2083) DEFAULT NULL,
  `unique_widget_count` bigint(20) DEFAULT '0',
  `owner_id` bigint(20) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT NULL,
  `default_group_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stack_context` (`stack_context`),
  KEY `FK68AC2888656347D` (`owner_id`),
  KEY `FK68AC28835014F5F` (`default_group_id`),
  CONSTRAINT `FK68AC28835014F5F` FOREIGN KEY (`default_group_id`) REFERENCES `owf_group` (`id`),
  CONSTRAINT `FK68AC2888656347D` FOREIGN KEY (`owner_id`) REFERENCES `person` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stack_groups`
--

DROP TABLE IF EXISTS `stack_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stack_groups` (
  `group_id` bigint(20) NOT NULL,
  `stack_id` bigint(20) NOT NULL,
  PRIMARY KEY (`group_id`,`stack_id`),
  KEY `FK9584AB6B6B3A1281` (`stack_id`),
  CONSTRAINT `FK9584AB6B3B197B21` FOREIGN KEY (`group_id`) REFERENCES `owf_group` (`id`),
  CONSTRAINT `FK9584AB6B6B3A1281` FOREIGN KEY (`stack_id`) REFERENCES `stack` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tag_links`
--

DROP TABLE IF EXISTS `tag_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_links` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `pos` bigint(20) DEFAULT NULL,
  `visible` bit(1) DEFAULT NULL,
  `tag_ref` bigint(20) NOT NULL,
  `tag_id` bigint(20) NOT NULL,
  `type` varchar(255) NOT NULL,
  `editable` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7C35D6D45A3B441D` (`tag_id`),
  CONSTRAINT `FK7C35D6D45A3B441D` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tags` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `widget_def_intent`
--

DROP TABLE IF EXISTS `widget_def_intent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `widget_def_intent` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `receive` tinyint(1) NOT NULL,
  `send` tinyint(1) NOT NULL,
  `intent_id` bigint(20) NOT NULL,
  `widget_definition_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8A59D92FD46C6FAC` (`intent_id`),
  KEY `FK8A59D92FD46C6FAB` (`widget_definition_id`),
  CONSTRAINT `FK8A59D92FD46C6FAB` FOREIGN KEY (`widget_definition_id`) REFERENCES `widget_definition` (`id`),
  CONSTRAINT `FK8A59D92FD46C6FAC` FOREIGN KEY (`intent_id`) REFERENCES `intent` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `widget_def_intent_data_types`
--

DROP TABLE IF EXISTS `widget_def_intent_data_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `widget_def_intent_data_types` (
  `intent_data_type_id` bigint(20) NOT NULL,
  `widget_definition_intent_id` bigint(20) NOT NULL,
  KEY `FK8A59D92FD41A6FAD` (`intent_data_type_id`),
  KEY `FK8A59D92FD46C6FAD` (`widget_definition_intent_id`),
  CONSTRAINT `FK8A59D92FD41A6FAD` FOREIGN KEY (`intent_data_type_id`) REFERENCES `intent_data_type` (`id`),
  CONSTRAINT `FK8A59D92FD46C6FAD` FOREIGN KEY (`widget_definition_intent_id`) REFERENCES `widget_def_intent` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `widget_definition`
--

DROP TABLE IF EXISTS `widget_definition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `widget_definition` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `visible` bit(1) NOT NULL,
  `image_url_medium` varchar(2083) DEFAULT NULL,
  `image_url_small` varchar(2083) NOT NULL,
  `singleton` bit(1) NOT NULL,
  `width` int(11) NOT NULL,
  `widget_version` varchar(2083) DEFAULT NULL,
  `height` int(11) NOT NULL,
  `widget_url` varchar(2083) NOT NULL,
  `widget_guid` varchar(255) NOT NULL,
  `display_name` varchar(256) DEFAULT NULL,
  `background` tinyint(1) DEFAULT NULL,
  `universal_name` varchar(255) DEFAULT NULL,
  `descriptor_url` varchar(2083) DEFAULT NULL,
  `description` varchar(4000) DEFAULT NULL,
  `mobile_ready` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `widget_guid` (`widget_guid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `widget_definition_widget_types`
--

DROP TABLE IF EXISTS `widget_definition_widget_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `widget_definition_widget_types` (
  `widget_definition_id` bigint(20) NOT NULL,
  `widget_type_id` bigint(20) NOT NULL,
  PRIMARY KEY (`widget_definition_id`,`widget_type_id`),
  KEY `FK8A59D92FD46C6F7C` (`widget_type_id`),
  CONSTRAINT `FK8A59D92F293A835C` FOREIGN KEY (`widget_definition_id`) REFERENCES `widget_definition` (`id`),
  CONSTRAINT `FK8A59D92FD46C6F7C` FOREIGN KEY (`widget_type_id`) REFERENCES `widget_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `widget_type`
--

DROP TABLE IF EXISTS `widget_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `widget_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-03 10:12:53
