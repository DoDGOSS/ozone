-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: owf
-- ------------------------------------------------------
-- Server version	5.7.27

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
-- Current Database: `owf`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `owf` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `owf`;

--
-- Table structure for table `application_configuration`
--

DROP TABLE IF EXISTS `application_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_configuration` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `sub_group_order` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `help` varchar(2000) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `sub_group_name` varchar(255) DEFAULT NULL,
  `value` varchar(2000) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `mutable` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `app_config_group_name_idx` (`group_name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_configuration`
--

LOCK TABLES `application_configuration` WRITE;
/*!40000 ALTER TABLE `application_configuration` DISABLE KEYS */;
INSERT INTO `application_configuration` VALUES (1,0,1,'Enable CEF Logging',NULL,'owf.enable.cef.logging',NULL,'false','Boolean','AUDITING',NULL,_binary ''),(2,0,2,'Enable CEF Object Access Logging',NULL,'owf.enable.cef.object.access.logging',NULL,'false','Boolean','AUDITING',NULL,_binary ''),(3,0,3,'Enable CEF Sweep Log',NULL,'owf.enable.cef.log.sweep',NULL,'false','Boolean','AUDITING',NULL,_binary ''),(4,0,4,'CEF Log Location',NULL,'owf.cef.log.location',NULL,'/usr/share/tomcat6','String','AUDITING',NULL,_binary ''),(5,0,5,'CEF Sweep Log Location',NULL,'owf.cef.sweep.log.location',NULL,'/var/log/cef','String','AUDITING',NULL,_binary ''),(6,0,6,'Security Level',NULL,'owf.security.level',NULL,NULL,'String','AUDITING',NULL,_binary ''),(7,0,1,'Enable Session Control',NULL,'owf.session.control.enabled','Session Control','false','Boolean','USER_ACCOUNT_SETTINGS',NULL,_binary ''),(8,0,2,'Max Concurrent Sessions',NULL,'owf.session.control.max.concurrent','Session Control','1','Integer','USER_ACCOUNT_SETTINGS',NULL,_binary ''),(9,0,1,'Disable Inactive Accounts',NULL,'owf.disable.inactive.accounts','Inactive Accounts','true','Boolean','USER_ACCOUNT_SETTINGS',NULL,_binary ''),(10,0,2,'Account Inactivity Threshold',NULL,'owf.inactivity.threshold','Inactive Accounts','90','Integer','USER_ACCOUNT_SETTINGS',NULL,_binary ''),(11,0,1,'Disable Accounts Job Start Time',NULL,'owf.job.disable.accounts.start.time',NULL,'23:59:59','String','HIDDEN',NULL,_binary ''),(12,0,2,'Disable Accounts Job Interval',NULL,'owf.job.disable.accounts.interval',NULL,'1440','Integer','HIDDEN',NULL,_binary ''),(13,0,1,'Warning Banner Content',NULL,'free.warning.content',NULL,NULL,'String','BRANDING',NULL,_binary ''),(14,0,1,'Custom Background URL',NULL,'owf.custom.background.url','Custom Background',NULL,'String','BRANDING',NULL,_binary ''),(15,0,1,'Custom Header URL',NULL,'owf.custom.header.url','Custom Header and Footer',NULL,'String','BRANDING',NULL,_binary ''),(16,0,2,'Custom Header Height',NULL,'owf.custom.header.height','Custom Header and Footer','0','Integer','BRANDING',NULL,_binary ''),(17,0,3,'Custom Footer URL',NULL,'owf.custom.footer.url','Custom Header and Footer',NULL,'String','BRANDING',NULL,_binary ''),(18,0,4,'Custom Footer Height',NULL,'owf.custom.footer.height','Custom Header and Footer','0','Integer','BRANDING',NULL,_binary ''),(19,0,5,'Custom CSS',NULL,'owf.custom.css','Custom Header and Footer',NULL,'String','BRANDING',NULL,_binary ''),(20,0,6,'Custom Javascript',NULL,'owf.custom.jss','Custom Header and Footer',NULL,'String','BRANDING',NULL,_binary '');
/*!40000 ALTER TABLE `application_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard`
--

DROP TABLE IF EXISTS `dashboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dashboard` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `stack_id` bigint(20) DEFAULT NULL,
  `icon_image_url` varchar(2083) DEFAULT NULL,
  `edited_date` datetime DEFAULT NULL,
  `altered_by_admin` bit(1) NOT NULL,
  `isdefault` bit(1) NOT NULL,
  `locked` bit(1) NOT NULL,
  `dashboard_position` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `layout_config` longtext,
  `created_by_id` bigint(20) DEFAULT NULL,
  `published_to_store` bit(1) DEFAULT NULL,
  `edited_by_id` bigint(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `guid` varchar(255) NOT NULL,
  `marked_for_deletion` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_rokanqok6qf19poxei3nputoy` (`guid`),
  KEY `FK2tdotyqjidwto0qc0dh1f0qya` (`stack_id`),
  KEY `FKh5xwaide0jsbnu74mvro4q4o4` (`user_id`),
  KEY `FK95ytd384hyoyfb95urd46wm96` (`created_by_id`),
  KEY `FKl08hc08jal99a1ahhnl5outgm` (`edited_by_id`),
  CONSTRAINT `FK2tdotyqjidwto0qc0dh1f0qya` FOREIGN KEY (`stack_id`) REFERENCES `stack` (`id`),
  CONSTRAINT `FK95ytd384hyoyfb95urd46wm96` FOREIGN KEY (`created_by_id`) REFERENCES `person` (`id`),
  CONSTRAINT `FKh5xwaide0jsbnu74mvro4q4o4` FOREIGN KEY (`user_id`) REFERENCES `person` (`id`),
  CONSTRAINT `FKl08hc08jal99a1ahhnl5outgm` FOREIGN KEY (`edited_by_id`) REFERENCES `person` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard`
--

LOCK TABLES `dashboard` WRITE;
/*!40000 ALTER TABLE `dashboard` DISABLE KEYS */;
INSERT INTO `dashboard` VALUES (1,0,'2019-08-27 23:18:25',4,NULL,'2019-08-27 23:18:25',_binary '\0',_binary '\0',_binary '\0',0,'Untitled',NULL,NULL,'{\"xtype\":\"container\",\"flex\":1,\"items\":[],\"paneType\":\"\",\"height\":\"100%\"}',NULL,_binary '',NULL,NULL,'410adfc8-d42c-4ded-7ba8-62af13e134ca',_binary '\0'),(2,5,'2019-08-27 23:18:25',4,NULL,'2019-08-27 23:18:25',_binary '\0',_binary '\0',_binary '\0',0,'Untitled',1,NULL,'{\"xtype\":\"tabbedpane\",\"flex\":1,\"items\":[],\"paneType\":\"tabbedpane\",\"height\":\"100%\",\"widgets\":[{\"universalName\":\"org.ozoneplatform.owf.admin.usermanagement\",\"widgetGuid\":\"38070c45-5f6a-4460-810c-6e3496495ec4\",\"uniqueId\":\"cfd212b8-6ee9-4acc-93d6-04772d8a19f9\",\"dashboardGuid\":\"bc9bf72a-bbea-476a-8b77-06f7d12588a1\",\"paneGuid\":\"a9423882-3ab5-e08d-fd04-95ac2398ab15\",\"intentConfig\":null,\"launchData\":null,\"name\":\"Users\",\"active\":true,\"x\":0,\"y\":62,\"zIndex\":0,\"minimized\":false,\"maximized\":false,\"pinned\":false,\"collapsed\":false,\"columnPos\":0,\"buttonId\":null,\"buttonOpened\":false,\"region\":\"none\",\"statePosition\":1,\"singleton\":false,\"floatingWidget\":false,\"height\":948,\"width\":2048}],\"defaultSettings\":{\"widgetStates\":{\"38070c45-5f6a-4460-810c-6e3496495ec4\":{\"timestamp\":1569942775492}}}}',NULL,_binary '',NULL,NULL,'bc9bf72a-bbea-476a-8b77-06f7d12588a1',_binary '\0'),(3,1,'2019-10-01 15:13:23',5,NULL,'2019-10-01 15:13:23',_binary '\0',_binary '',_binary '\0',1,'Test Stack',NULL,NULL,'{\"xtype\":\"desktoppane\",\"flex\":1,\"widgets\":[{\"universalName\":\"org.owfgoss.owf.examples.ChannelShouter\",\"widgetGuid\":\"754e9e20-7a80-44cc-aed9-25214023a98c\",\"uniqueId\":\"aacd3c03-cbc8-3f38-8991-f93b59dd68f5\",\"dashboardGuid\":\"e25dc414-02d2-4ec8-b152-58d0d3db79bd\",\"paneGuid\":\"4c4e07a8-bf29-8317-65f6-2789a2b839f3\",\"name\":\"Channel Shouter\",\"active\":false,\"x\":0,\"y\":0,\"minimized\":false,\"maximized\":false,\"pinned\":false,\"collapsed\":false,\"columnPos\":0,\"buttonId\":null,\"buttonOpened\":false,\"region\":\"none\",\"statePosition\":1,\"intentConfig\":null,\"launchData\":null,\"singleton\":false,\"floatingWidget\":false,\"background\":false,\"mobileReady\":false,\"zIndex\":19000,\"height\":250,\"width\":295},{\"universalName\":\"org.owfgoss.owf.examples.ChannelListener\",\"widgetGuid\":\"7fef7d8f-934c-497b-84b7-938aff93daae\",\"uniqueId\":\"eb1a7240-cfc1-bee5-9d20-de424a47cbb7\",\"dashboardGuid\":\"e25dc414-02d2-4ec8-b152-58d0d3db79bd\",\"paneGuid\":\"4c4e07a8-bf29-8317-65f6-2789a2b839f3\",\"name\":\"Channel Listener\",\"active\":true,\"x\":293,\"y\":1,\"minimized\":false,\"maximized\":false,\"pinned\":false,\"collapsed\":false,\"columnPos\":0,\"buttonId\":null,\"buttonOpened\":false,\"region\":\"none\",\"statePosition\":2,\"intentConfig\":null,\"launchData\":null,\"singleton\":false,\"floatingWidget\":false,\"background\":false,\"mobileReady\":false,\"zIndex\":19010,\"height\":440,\"width\":540}],\"items\":[],\"paneType\":\"desktoppane\",\"height\":\"100%\",\"defaultSettings\":{\"widgetStates\":{\"754e9e20-7a80-44cc-aed9-25214023a98c\":{\"x\":0,\"y\":0,\"height\":250,\"width\":295,\"timestamp\":1569945693835},\"7fef7d8f-934c-497b-84b7-938aff93daae\":{\"x\":293,\"y\":1,\"height\":440,\"width\":540,\"timestamp\":1569945701019},\"53a2a879-442c-4012-9215-a17604dedff7\":{\"x\":0,\"y\":0,\"height\":440,\"width\":818,\"timestamp\":1569945701017}}}}',NULL,_binary '',NULL,'This is a test Stack.','94a58ce9-54db-8e64-b7b5-460b01cf4671',_binary '\0'),(4,10,'2019-10-01 15:13:23',5,NULL,'2019-10-01 15:13:23',_binary '\0',_binary '',_binary '\0',1,'Test Stack',1,NULL,'{\"xtype\":\"desktoppane\",\"flex\":1,\"widgets\":[{\"universalName\":\"org.owfgoss.owf.examples.ChannelShouter\",\"widgetGuid\":\"754e9e20-7a80-44cc-aed9-25214023a98c\",\"uniqueId\":\"aacd3c03-cbc8-3f38-8991-f93b59dd68f5\",\"dashboardGuid\":\"e25dc414-02d2-4ec8-b152-58d0d3db79bd\",\"paneGuid\":\"a4fcad8a-8b90-67f8-0c5f-1ff21185e3f2\",\"name\":\"Channel Shouter\",\"active\":false,\"x\":0,\"y\":0,\"minimized\":false,\"maximized\":false,\"pinned\":false,\"collapsed\":false,\"columnPos\":0,\"buttonId\":null,\"buttonOpened\":false,\"region\":\"none\",\"statePosition\":1,\"intentConfig\":null,\"launchData\":null,\"singleton\":false,\"floatingWidget\":false,\"background\":false,\"mobileReady\":false,\"zIndex\":19000,\"height\":250,\"width\":295},{\"universalName\":\"org.owfgoss.owf.examples.ChannelListener\",\"widgetGuid\":\"7fef7d8f-934c-497b-84b7-938aff93daae\",\"uniqueId\":\"eb1a7240-cfc1-bee5-9d20-de424a47cbb7\",\"dashboardGuid\":\"e25dc414-02d2-4ec8-b152-58d0d3db79bd\",\"paneGuid\":\"a4fcad8a-8b90-67f8-0c5f-1ff21185e3f2\",\"name\":\"Channel Listener\",\"active\":true,\"x\":293,\"y\":1,\"minimized\":false,\"maximized\":false,\"pinned\":false,\"collapsed\":false,\"columnPos\":0,\"buttonId\":null,\"buttonOpened\":false,\"region\":\"none\",\"statePosition\":2,\"intentConfig\":null,\"launchData\":null,\"singleton\":false,\"floatingWidget\":false,\"background\":false,\"mobileReady\":false,\"zIndex\":19010,\"height\":440,\"width\":540}],\"items\":[],\"paneType\":\"desktoppane\",\"height\":\"100%\",\"defaultSettings\":{\"widgetStates\":{\"754e9e20-7a80-44cc-aed9-25214023a98c\":{\"x\":0,\"y\":0,\"height\":250,\"width\":295,\"timestamp\":1569948243044},\"7fef7d8f-934c-497b-84b7-938aff93daae\":{\"x\":293,\"y\":1,\"height\":440,\"width\":540,\"timestamp\":1569948245768},\"53a2a879-442c-4012-9215-a17604dedff7\":{\"x\":0,\"y\":0,\"height\":440,\"width\":818,\"timestamp\":1569945795458},\"dc5c2062-aaa8-452b-897f-60b4b55ab564\":{\"x\":0,\"y\":0,\"height\":440,\"width\":581,\"timestamp\":1569945788964}}}}',NULL,_binary '\0',NULL,'This is a test Stack.','e25dc414-02d2-4ec8-b152-58d0d3db79bd',_binary '\0'),(5,0,'2019-10-01 16:44:14',6,NULL,'2019-10-01 16:44:14',_binary '\0',_binary '\0',_binary '\0',2,'Quad Layout Test',NULL,NULL,'{\"layout\":{\"type\":\"hbox\",\"align\":\"stretch\"},\"xtype\":\"container\",\"flex\":3,\"cls\":\"hbox \",\"items\":[{\"layout\":{\"type\":\"vbox\",\"align\":\"stretch\"},\"xtype\":\"container\",\"flex\":1,\"cls\":\"vbox left\",\"items\":[{\"xtype\":\"dashboarddesignerpane\",\"flex\":1,\"cls\":\"top\",\"widgets\":[],\"items\":[],\"htmlText\":\"50%\",\"paneType\":\"fitpane\"},{\"xtype\":\"dashboardsplitter\"},{\"xtype\":\"dashboarddesignerpane\",\"flex\":1,\"cls\":\"bottom\",\"items\":[],\"htmlText\":\"50%\",\"paneType\":\"fitpane\"}]},{\"xtype\":\"dashboardsplitter\"},{\"layout\":{\"type\":\"vbox\",\"align\":\"stretch\"},\"xtype\":\"container\",\"flex\":1,\"cls\":\"vbox right\",\"items\":[{\"xtype\":\"dashboarddesignerpane\",\"flex\":1,\"cls\":\"top\",\"widgets\":[],\"items\":[],\"htmlText\":\"50%\",\"paneType\":\"fitpane\"},{\"xtype\":\"dashboardsplitter\"},{\"xtype\":\"dashboarddesignerpane\",\"flex\":1,\"cls\":\"bottom\",\"items\":[],\"htmlText\":\"50%\",\"paneType\":\"fitpane\"}]}]}',NULL,_binary '\0',NULL,'Quad Layout Test','f3932f40-ebdf-2621-7f12-b33cf5fb1fcb',_binary '\0'),(6,0,'2019-10-01 16:44:14',6,NULL,'2019-10-01 16:44:14',_binary '\0',_binary '\0',_binary '\0',3,'Quad Layout Test',1,NULL,'{\"layout\":{\"type\":\"hbox\",\"align\":\"stretch\"},\"xtype\":\"container\",\"flex\":3,\"cls\":\"hbox \",\"items\":[{\"layout\":{\"type\":\"vbox\",\"align\":\"stretch\"},\"xtype\":\"container\",\"flex\":1,\"cls\":\"vbox left\",\"items\":[{\"xtype\":\"dashboarddesignerpane\",\"flex\":1,\"cls\":\"top\",\"widgets\":[],\"items\":[],\"htmlText\":\"50%\",\"paneType\":\"fitpane\"},{\"xtype\":\"dashboardsplitter\"},{\"xtype\":\"dashboarddesignerpane\",\"flex\":1,\"cls\":\"bottom\",\"items\":[],\"htmlText\":\"50%\",\"paneType\":\"fitpane\"}]},{\"xtype\":\"dashboardsplitter\"},{\"layout\":{\"type\":\"vbox\",\"align\":\"stretch\"},\"xtype\":\"container\",\"flex\":1,\"cls\":\"vbox right\",\"items\":[{\"xtype\":\"dashboarddesignerpane\",\"flex\":1,\"cls\":\"top\",\"widgets\":[],\"items\":[],\"htmlText\":\"50%\",\"paneType\":\"fitpane\"},{\"xtype\":\"dashboardsplitter\"},{\"xtype\":\"dashboarddesignerpane\",\"flex\":1,\"cls\":\"bottom\",\"items\":[],\"htmlText\":\"50%\",\"paneType\":\"fitpane\"}]}]}',NULL,_binary '\0',NULL,'Quad Layout Test','ae4631e1-76ec-412c-ac97-7ad90d2853d8',_binary '\0');
/*!40000 ALTER TABLE `dashboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_mapping`
--

DROP TABLE IF EXISTS `domain_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_mapping` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `relationship_type` varchar(10) DEFAULT NULL,
  `dest_type` varchar(255) NOT NULL,
  `src_id` bigint(20) NOT NULL,
  `src_type` varchar(255) NOT NULL,
  `dest_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_mapping`
--

LOCK TABLES `domain_mapping` WRITE;
/*!40000 ALTER TABLE `domain_mapping` DISABLE KEYS */;
INSERT INTO `domain_mapping` VALUES (1,0,'owns','widget_definition',1,'group',1),(2,0,'owns','widget_definition',1,'group',2),(3,0,'owns','widget_definition',1,'group',3),(4,0,'owns','widget_definition',1,'group',4),(5,0,'owns','widget_definition',1,'group',5),(6,0,'owns','widget_definition',1,'group',6),(7,0,'owns','widget_definition',1,'group',7),(8,0,'owns','widget_definition',1,'group',8),(9,0,'owns','widget_definition',1,'group',9),(10,0,'owns','widget_definition',1,'group',10),(11,0,'owns','dashboard',3,'group',1),(12,0,'cloneOf','dashboard',2,'dashboard',1),(13,0,'owns','dashboard',4,'group',3),(14,0,'cloneOf','dashboard',4,'dashboard',3),(15,0,'owns','widget_definition',4,'group',11),(16,0,'owns','widget_definition',4,'group',12),(17,0,'owns','dashboard',6,'group',5),(18,0,'cloneOf','dashboard',6,'dashboard',5);
/*!40000 ALTER TABLE `domain_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intent`
--

DROP TABLE IF EXISTS `intent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `intent` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `action` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_kerhm7si3gd2u70tnkq4kb2e5` (`action`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intent`
--

LOCK TABLES `intent` WRITE;
/*!40000 ALTER TABLE `intent` DISABLE KEYS */;
INSERT INTO `intent` VALUES (1,0,'Graph'),(2,0,'View');
/*!40000 ALTER TABLE `intent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intent_data_type`
--

DROP TABLE IF EXISTS `intent_data_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `intent_data_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `data_type` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_399kypns09y8l9fcmohnrqe6m` (`data_type`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intent_data_type`
--

LOCK TABLES `intent_data_type` WRITE;
/*!40000 ALTER TABLE `intent_data_type` DISABLE KEYS */;
INSERT INTO `intent_data_type` VALUES (1,0,'application/vnd.owf.sample.price'),(2,0,'text/html');
/*!40000 ALTER TABLE `intent_data_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intent_data_types`
--

DROP TABLE IF EXISTS `intent_data_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `intent_data_types` (
  `intent_data_type_id` bigint(20) NOT NULL,
  `intent_id` bigint(20) NOT NULL,
  PRIMARY KEY (`intent_id`,`intent_data_type_id`),
  KEY `FKqic1cvivkrdbno80ukfftl543` (`intent_data_type_id`),
  CONSTRAINT `FKplrjh8q0uwboben7o6scaq1ui` FOREIGN KEY (`intent_id`) REFERENCES `intent` (`id`),
  CONSTRAINT `FKqic1cvivkrdbno80ukfftl543` FOREIGN KEY (`intent_data_type_id`) REFERENCES `intent_data_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intent_data_types`
--

LOCK TABLES `intent_data_types` WRITE;
/*!40000 ALTER TABLE `intent_data_types` DISABLE KEYS */;
INSERT INTO `intent_data_types` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `intent_data_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owf_group`
--

DROP TABLE IF EXISTS `owf_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `owf_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `stack_id` bigint(20) DEFAULT NULL,
  `display_name` varchar(200) DEFAULT NULL,
  `stack_default` bit(1) NOT NULL,
  `name` varchar(200) NOT NULL,
  `status` varchar(8) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `automatic` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf6vovq3w6jomqk7cobc4j7052` (`stack_id`),
  CONSTRAINT `FKf6vovq3w6jomqk7cobc4j7052` FOREIGN KEY (`stack_id`) REFERENCES `stack` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owf_group`
--

LOCK TABLES `owf_group` WRITE;
/*!40000 ALTER TABLE `owf_group` DISABLE KEYS */;
INSERT INTO `owf_group` VALUES (1,0,NULL,'OWF Administrators',_binary '\0','OWF Administrators','active','OWF Administrators',NULL,_binary ''),(2,0,NULL,'OWF Users',_binary '\0','OWF Users','active','OWF Users',NULL,_binary ''),(3,1,NULL,NULL,_binary '','f9267111-b8fb-4e1c-977b-d52fdfd94cdf','active','',NULL,_binary '\0'),(4,1,NULL,NULL,_binary '','d6dd348b-332d-49bb-8b55-c0a17de41953','active','',NULL,_binary '\0'),(5,1,NULL,'OWF Test',_binary '\0','OWF Test','active','Some test group',NULL,_binary '\0'),(6,1,NULL,NULL,_binary '','4f6e0742-c4ea-4dc2-b6ca-69d2aae46882','active','',NULL,_binary '\0');
/*!40000 ALTER TABLE `owf_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owf_group_people`
--

DROP TABLE IF EXISTS `owf_group_people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `owf_group_people` (
  `group_id` bigint(20) NOT NULL,
  `person_id` bigint(20) NOT NULL,
  PRIMARY KEY (`group_id`,`person_id`),
  KEY `FKa7nm8kwb815rxx7hfrynv2qjc` (`person_id`),
  CONSTRAINT `FKa7nm8kwb815rxx7hfrynv2qjc` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`),
  CONSTRAINT `FKt3v3gnrhqgs1qqe9318ys26k4` FOREIGN KEY (`group_id`) REFERENCES `owf_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owf_group_people`
--

LOCK TABLES `owf_group_people` WRITE;
/*!40000 ALTER TABLE `owf_group_people` DISABLE KEYS */;
INSERT INTO `owf_group_people` VALUES (3,1),(4,1),(6,1);
/*!40000 ALTER TABLE `owf_group_people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `user_real_name` varchar(200) NOT NULL,
  `last_notification` datetime DEFAULT NULL,
  `requires_sync` bit(1) NOT NULL,
  `prev_login` datetime DEFAULT NULL,
  `email_show` bit(1) NOT NULL,
  `username` varchar(200) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_n0i6d7rc1hqkjivk494g8j2qd` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (1,3,'Test Administrator 1',NULL,_binary '\0',NULL,_binary '\0','testAdmin1',_binary '','Test Administrator 1','testAdmin1@ozone.test',NULL),(2,0,'Test User 1',NULL,_binary '\0',NULL,_binary '\0','testUser1',_binary '','Test User 1','testUser1@ozone.test',NULL);
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person_role`
--

DROP TABLE IF EXISTS `person_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person_role` (
  `person_authorities_id` bigint(20) NOT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  KEY `FKs7asxi8amiwjjq1sonlc4rihn` (`role_id`),
  KEY `FKry1n64fbb320j2cdlahmlr6o2` (`person_authorities_id`),
  CONSTRAINT `FKry1n64fbb320j2cdlahmlr6o2` FOREIGN KEY (`person_authorities_id`) REFERENCES `person` (`id`),
  CONSTRAINT `FKs7asxi8amiwjjq1sonlc4rihn` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person_role`
--

LOCK TABLES `person_role` WRITE;
/*!40000 ALTER TABLE `person_role` DISABLE KEYS */;
INSERT INTO `person_role` VALUES (1,1),(1,2),(2,2);
/*!40000 ALTER TABLE `person_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person_widget_definition`
--

DROP TABLE IF EXISTS `person_widget_definition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person_widget_definition` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `pwd_position` int(11) NOT NULL,
  `favorite` bit(1) DEFAULT NULL,
  `user_widget` bit(1) DEFAULT NULL,
  `disabled` bit(1) DEFAULT NULL,
  `widget_definition_id` bigint(20) NOT NULL,
  `display_name` varchar(256) DEFAULT NULL,
  `person_id` bigint(20) NOT NULL,
  `group_widget` bit(1) DEFAULT NULL,
  `visible` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKe37caca87254d19270b7a21e6790` (`person_id`,`widget_definition_id`),
  KEY `FKngf7mw50an8gn9fkjwxqpnex2` (`widget_definition_id`),
  CONSTRAINT `FKngf7mw50an8gn9fkjwxqpnex2` FOREIGN KEY (`widget_definition_id`) REFERENCES `widget_definition` (`id`),
  CONSTRAINT `FKs731caq8pemlhdepdq9ghrqpp` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person_widget_definition`
--

LOCK TABLES `person_widget_definition` WRITE;
/*!40000 ALTER TABLE `person_widget_definition` DISABLE KEYS */;
INSERT INTO `person_widget_definition` VALUES (1,0,0,_binary '\0',_binary '\0',_binary '\0',1,NULL,1,_binary '\0',_binary ''),(2,0,1,_binary '\0',_binary '\0',_binary '\0',2,NULL,1,_binary '\0',_binary ''),(3,0,2,_binary '\0',_binary '\0',_binary '\0',3,NULL,1,_binary '\0',_binary ''),(4,0,3,_binary '\0',_binary '\0',_binary '\0',4,NULL,1,_binary '\0',_binary ''),(5,0,4,_binary '\0',_binary '\0',_binary '\0',5,NULL,1,_binary '\0',_binary ''),(6,0,5,_binary '\0',_binary '\0',_binary '\0',6,NULL,1,_binary '\0',_binary ''),(7,0,6,_binary '\0',_binary '\0',_binary '\0',7,NULL,1,_binary '\0',_binary ''),(8,0,7,_binary '\0',_binary '\0',_binary '\0',8,NULL,1,_binary '\0',_binary ''),(9,0,8,_binary '\0',_binary '\0',_binary '\0',9,NULL,1,_binary '\0',_binary ''),(10,0,9,_binary '\0',_binary '\0',_binary '\0',10,NULL,1,_binary '\0',_binary ''),(11,0,0,_binary '\0',_binary '\0',_binary '\0',11,NULL,1,_binary '\0',_binary ''),(12,0,1,_binary '\0',_binary '\0',_binary '\0',12,NULL,1,_binary '\0',_binary ''),(13,0,2,_binary '\0',_binary '\0',_binary '\0',13,NULL,1,_binary '\0',_binary ''),(14,0,3,_binary '\0',_binary '\0',_binary '\0',14,NULL,1,_binary '\0',_binary ''),(15,0,4,_binary '\0',_binary '\0',_binary '\0',15,NULL,1,_binary '\0',_binary ''),(16,0,5,_binary '\0',_binary '\0',_binary '\0',16,NULL,1,_binary '\0',_binary ''),(17,0,6,_binary '\0',_binary '\0',_binary '\0',17,NULL,1,_binary '\0',_binary ''),(18,0,7,_binary '\0',_binary '\0',_binary '\0',18,NULL,1,_binary '\0',_binary ''),(19,0,8,_binary '\0',_binary '\0',_binary '\0',19,NULL,1,_binary '\0',_binary ''),(20,0,9,_binary '\0',_binary '\0',_binary '\0',20,NULL,1,_binary '\0',_binary ''),(21,0,10,_binary '\0',_binary '\0',_binary '\0',21,NULL,1,_binary '\0',_binary ''),(22,0,0,_binary '\0',_binary '\0',_binary '\0',11,NULL,2,_binary '\0',_binary ''),(23,0,1,_binary '\0',_binary '\0',_binary '\0',12,NULL,2,_binary '\0',_binary ''),(24,0,2,_binary '\0',_binary '\0',_binary '\0',13,NULL,2,_binary '\0',_binary ''),(25,0,3,_binary '\0',_binary '\0',_binary '\0',14,NULL,2,_binary '\0',_binary ''),(26,0,4,_binary '\0',_binary '\0',_binary '\0',15,NULL,2,_binary '\0',_binary ''),(27,0,5,_binary '\0',_binary '\0',_binary '\0',16,NULL,2,_binary '\0',_binary ''),(28,0,6,_binary '\0',_binary '\0',_binary '\0',17,NULL,2,_binary '\0',_binary ''),(29,0,7,_binary '\0',_binary '\0',_binary '\0',18,NULL,2,_binary '\0',_binary ''),(30,0,8,_binary '\0',_binary '\0',_binary '\0',19,NULL,2,_binary '\0',_binary ''),(31,0,9,_binary '\0',_binary '\0',_binary '\0',20,NULL,2,_binary '\0',_binary ''),(32,0,10,_binary '\0',_binary '\0',_binary '\0',21,NULL,2,_binary '\0',_binary '');
/*!40000 ALTER TABLE `person_widget_definition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preference`
--

DROP TABLE IF EXISTS `preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `preference` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `path` varchar(200) NOT NULL,
  `namespace` varchar(200) NOT NULL,
  `value` longtext NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK3e66cf42870f5333e0dfdd7de903` (`path`,`namespace`,`user_id`),
  KEY `FK5sn8wsl0ilbbldp3ts4wrq0mk` (`user_id`),
  CONSTRAINT `FK5sn8wsl0ilbbldp3ts4wrq0mk` FOREIGN KEY (`user_id`) REFERENCES `person` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preference`
--

LOCK TABLES `preference` WRITE;
/*!40000 ALTER TABLE `preference` DISABLE KEYS */;
INSERT INTO `preference` VALUES (1,0,'guid_to_launch','owf.admin.UserEditCopy','a9bf8e71-692d-44e3-a465-5337ce5e725e',1),(2,0,'guid_to_launch','owf.admin.WidgetEditCopy','679294b3-ccc3-4ace-a061-e3f27ed86451',1),(3,0,'guid_to_launch','owf.admin.GroupEditCopy','dc5c2062-aaa8-452b-897f-60b4b55ab564',1),(4,0,'guid_to_launch','owf.admin.DashboardEditCopy','2445afb9-eb3f-4b79-acf8-6b12180921c3',1),(5,0,'guid_to_launch','owf.admin.StackEditCopy','72c382a3-89e7-4abf-94db-18db7779e1df',1),(6,0,'appcomponent-view','owf','{\"pinned\":false}',1);
/*!40000 ALTER TABLE `preference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requestmap`
--

DROP TABLE IF EXISTS `requestmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requestmap` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `config_attribute` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_26v03gjht0pvthrnhv99bbgvn` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requestmap`
--

LOCK TABLES `requestmap` WRITE;
/*!40000 ALTER TABLE `requestmap` DISABLE KEYS */;
/*!40000 ALTER TABLE `requestmap` ENABLE KEYS */;
UNLOCK TABLES;

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
  UNIQUE KEY `UK_irsamgnera6angm0prq1kemt2` (`authority`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,0,'ROLE_ADMIN','Admin Role'),(2,0,'ROLE_USER','User Role');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stack`
--

DROP TABLE IF EXISTS `stack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stack` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `owner_id` bigint(20) DEFAULT NULL,
  `stack_context` varchar(200) NOT NULL,
  `default_group_id` bigint(20) DEFAULT NULL,
  `unique_widget_count` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `approved` bit(1) DEFAULT NULL,
  `image_url` varchar(2083) DEFAULT NULL,
  `descriptor_url` varchar(2083) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_uu17ra7yaaqgf2tdyafdtcgd` (`stack_context`),
  KEY `FK9hvgvrg6d7pbbdvea0v4ec89w` (`owner_id`),
  KEY `FKrmcc4gnxjxiyadk8k6ngd485h` (`default_group_id`),
  CONSTRAINT `FK9hvgvrg6d7pbbdvea0v4ec89w` FOREIGN KEY (`owner_id`) REFERENCES `person` (`id`),
  CONSTRAINT `FKrmcc4gnxjxiyadk8k6ngd485h` FOREIGN KEY (`default_group_id`) REFERENCES `owf_group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stack`
--

LOCK TABLES `stack` WRITE;
/*!40000 ALTER TABLE `stack` DISABLE KEYS */;
INSERT INTO `stack` VALUES (1,0,NULL,'ef8b5d6f-4b16-4743-9a57-31683c94b616',1,5,'Administration',_binary '','themes/common/images/admin/64x64_admin_app.png',NULL,'This application collects the administrative components into a common set of application pages for managing system resources.  These pages can be used to create, modify, update, and delete Apps, App Components, Users and Groups, and system configuration settings.'),(2,0,NULL,'investments',2,6,'Investments',_binary '',NULL,NULL,'Sample app containing example investment pages.'),(3,0,NULL,'908d934d-9d53-406c-8143-90b406fb508f',2,2,'Sample',_binary '',NULL,NULL,NULL),(4,0,1,'fd275613-7a34-46f6-94e8-244f68676064',3,0,'Untitled',_binary '\0',NULL,NULL,NULL),(5,2,1,'d33388d1-29a9-40fd-a645-7510b0bd9421',4,0,'Test Stack',_binary '',NULL,NULL,'This is a test Stack.'),(6,0,1,'74b17d80-2ade-4747-a3f2-8931fbcaf77b',6,0,'Quad Layout Test',_binary '\0',NULL,NULL,'Quad Layout Test');
/*!40000 ALTER TABLE `stack` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stack_groups`
--

DROP TABLE IF EXISTS `stack_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stack_groups` (
  `stack_id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL,
  PRIMARY KEY (`stack_id`,`group_id`),
  KEY `FKhl7gm6kwqg8lmqtisqugb1hr3` (`group_id`),
  CONSTRAINT `FKhl7gm6kwqg8lmqtisqugb1hr3` FOREIGN KEY (`group_id`) REFERENCES `owf_group` (`id`),
  CONSTRAINT `FKlpife05bc467x72smeiitknrk` FOREIGN KEY (`stack_id`) REFERENCES `stack` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stack_groups`
--

LOCK TABLES `stack_groups` WRITE;
/*!40000 ALTER TABLE `stack_groups` DISABLE KEYS */;
INSERT INTO `stack_groups` VALUES (1,1),(2,2),(3,2),(5,5);
/*!40000 ALTER TABLE `stack_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `widget_def_intent`
--

DROP TABLE IF EXISTS `widget_def_intent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `widget_def_intent` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `intent_id` bigint(20) NOT NULL,
  `send` bit(1) NOT NULL,
  `widget_definition_id` bigint(20) NOT NULL,
  `receive` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKamhwfk1hk9u4n3c22e7mavxgl` (`intent_id`),
  KEY `FKmo2r52p19fvxi4hbuhaq5jbp1` (`widget_definition_id`),
  CONSTRAINT `FKamhwfk1hk9u4n3c22e7mavxgl` FOREIGN KEY (`intent_id`) REFERENCES `intent` (`id`),
  CONSTRAINT `FKmo2r52p19fvxi4hbuhaq5jbp1` FOREIGN KEY (`widget_definition_id`) REFERENCES `widget_definition` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `widget_def_intent`
--

LOCK TABLES `widget_def_intent` WRITE;
/*!40000 ALTER TABLE `widget_def_intent` DISABLE KEYS */;
INSERT INTO `widget_def_intent` VALUES (1,0,2,_binary '\0',19,_binary ''),(2,0,1,_binary '',20,_binary '\0'),(3,0,2,_binary '',20,_binary '\0'),(4,0,1,_binary '\0',21,_binary '');
/*!40000 ALTER TABLE `widget_def_intent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `widget_def_intent_data_types`
--

DROP TABLE IF EXISTS `widget_def_intent_data_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `widget_def_intent_data_types` (
  `intent_data_type_id` bigint(20) NOT NULL,
  `widget_definition_intent_id` bigint(20) NOT NULL,
  PRIMARY KEY (`widget_definition_intent_id`,`intent_data_type_id`),
  KEY `FKk7mwd0l66rb1x9hwpnugca42n` (`intent_data_type_id`),
  CONSTRAINT `FK1l6f6b4vhcdsbqsgw5hgqhqa3` FOREIGN KEY (`widget_definition_intent_id`) REFERENCES `widget_def_intent` (`id`),
  CONSTRAINT `FKk7mwd0l66rb1x9hwpnugca42n` FOREIGN KEY (`intent_data_type_id`) REFERENCES `intent_data_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `widget_def_intent_data_types`
--

LOCK TABLES `widget_def_intent_data_types` WRITE;
/*!40000 ALTER TABLE `widget_def_intent_data_types` DISABLE KEYS */;
INSERT INTO `widget_def_intent_data_types` VALUES (1,2),(1,4),(2,1),(2,3);
/*!40000 ALTER TABLE `widget_def_intent_data_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `widget_definition`
--

DROP TABLE IF EXISTS `widget_definition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `widget_definition` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `width` int(11) NOT NULL,
  `image_url_medium` varchar(2083) NOT NULL,
  `singleton` bit(1) NOT NULL,
  `universal_name` varchar(255) DEFAULT NULL,
  `display_name` varchar(256) NOT NULL,
  `widget_guid` varchar(255) NOT NULL,
  `mobile_ready` bit(1) NOT NULL,
  `widget_version` varchar(2083) DEFAULT NULL,
  `height` int(11) NOT NULL,
  `background` bit(1) NOT NULL,
  `widget_url` varchar(2083) NOT NULL,
  `image_url_small` varchar(2083) NOT NULL,
  `descriptor_url` varchar(2083) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `visible` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_7t1wwgyhnl3avk517neyohnx5` (`widget_guid`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `widget_definition`
--

LOCK TABLES `widget_definition` WRITE;
/*!40000 ALTER TABLE `widget_definition` DISABLE KEYS */;
INSERT INTO `widget_definition` VALUES (1,0,581,'themes/common/images/adm-tools/Widgets64.png',_binary '\0','org.ozoneplatform.owf.admin.appcomponentedit','App Component Editor','679294b3-ccc3-4ace-a061-e3f27ed86451',_binary '\0','1.0',440,_binary '\0','admin/WidgetEdit','themes/common/images/adm-tools/Widgets24.png',NULL,'',_binary '\0'),(2,0,818,'themes/common/images/adm-tools/Widgets64.png',_binary '\0','org.ozoneplatform.owf.admin.appcomponentmanagement','App Components','48edfe94-4291-4991-a648-c19a903a663b',_binary '\0','1.0',440,_binary '\0','admin/WidgetManagement','themes/common/images/adm-tools/Widgets24.png',NULL,'',_binary ''),(3,0,581,'themes/common/images/adm-tools/Groups64.png',_binary '\0','org.ozoneplatform.owf.admin.groupedit','Group Editor','dc5c2062-aaa8-452b-897f-60b4b55ab564',_binary '\0','1.0',440,_binary '\0','admin/GroupEdit','themes/common/images/adm-tools/Groups24.png',NULL,'',_binary '\0'),(4,0,818,'themes/common/images/adm-tools/Groups64.png',_binary '\0','org.ozoneplatform.owf.admin.groupmanagement','Groups','53a2a879-442c-4012-9215-a17604dedff7',_binary '\0','1.0',440,_binary '\0','admin/GroupManagement','themes/common/images/adm-tools/Groups24.png',NULL,'',_binary ''),(5,0,581,'themes/common/images/adm-tools/Users64.png',_binary '\0','org.ozoneplatform.owf.admin.useredit','User Editor','a9bf8e71-692d-44e3-a465-5337ce5e725e',_binary '\0','1.0',440,_binary '\0','admin/UserEdit','themes/common/images/adm-tools/Users24.png',NULL,'',_binary '\0'),(6,0,818,'themes/common/images/adm-tools/Users64.png',_binary '\0','org.ozoneplatform.owf.admin.usermanagement','Users','38070c45-5f6a-4460-810c-6e3496495ec4',_binary '\0','1.0',440,_binary '\0','admin/UserManagement','themes/common/images/adm-tools/Users24.png',NULL,'',_binary ''),(7,0,900,'themes/common/images/adm-tools/Configuration64.png',_binary '\0','org.ozoneplatform.owf.admin.configuration','Configuration','af180bfc-3924-4111-93de-ad6e9bfc060e',_binary '\0','1.0',440,_binary '\0','admin/Configuration','themes/common/images/adm-tools/Configuration24.png',NULL,'',_binary ''),(8,0,581,'themes/common/images/adm-tools/Stacks64.png',_binary '\0','org.ozoneplatform.owf.admin.appedit','App Editor','72c382a3-89e7-4abf-94db-18db7779e1df',_binary '\0','1.0',440,_binary '\0','admin/StackEdit','themes/common/images/adm-tools/Stacks24.png',NULL,'',_binary '\0'),(9,0,818,'themes/common/images/adm-tools/Stacks64.png',_binary '\0','org.ozoneplatform.owf.admin.appmanagement','Apps','391dd2af-a207-41a3-8e51-2b20ec3e7241',_binary '\0','1.0',440,_binary '\0','admin/StackManagement','themes/common/images/adm-tools/Stacks24.png',NULL,'',_binary ''),(10,0,581,'themes/common/images/adm-tools/Dashboards64.png',_binary '\0','org.ozoneplatform.owf.admin.pageedit','Page Editor','2445afb9-eb3f-4b79-acf8-6b12180921c3',_binary '\0','1.0',440,_binary '\0','admin/DashboardEdit','themes/common/images/adm-tools/Dashboards24.png',NULL,'',_binary '\0'),(11,0,295,'static/themes/common/images/widget-icons/ChannelShouter.png',_binary '\0','org.owfgoss.owf.examples.ChannelShouter','Channel Shouter','754e9e20-7a80-44cc-aed9-25214023a98c',_binary '\0','1.0',250,_binary '\0','widgets/channel_shouter','static/themes/common/images/widget-icons/ChannelShouter.png',NULL,'Broadcast a message on a specified channel.',_binary ''),(12,0,540,'static/themes/common/images/widget-icons/ChannelListener.png',_binary '\0','org.owfgoss.owf.examples.ChannelListener','Channel Listener','7fef7d8f-934c-497b-84b7-938aff93daae',_binary '\0','1.0',440,_binary '\0','widgets/channel_listener','static/themes/common/images/widget-icons/ChannelListener.png',NULL,'Receive a message on a specified channel.',_binary ''),(13,0,300,'static/themes/common/images/widget-icons/ColorServer.png',_binary '\0','org.owfgoss.owf.examples.ColorServer','Color Server','47e42e8a-edc4-4cc9-8b87-dab2c4974e64',_binary '\0','1.0',300,_binary '\0','widgets/color_server','static/themes/common/images/widget-icons/ColorServer.png',NULL,'Simple eventing example that works in tandem with Color Client.',_binary ''),(14,0,300,'static/themes/common/images/widget-icons/ColorClient.png',_binary '\0','org.owfgoss.owf.examples.ColorClient','Color Client','b8f7fa66-5b0c-487f-b8ed-3e5a872d729a',_binary '\0','1.0',300,_binary '\0','widgets/color_client','static/themes/common/images/widget-icons/ColorClient.png',NULL,'Simple eventing example that works in tandem with Color Server.',_binary ''),(15,0,540,'static/themes/common/images/widget-icons/WidgetLog.png',_binary '\0','org.owfgoss.owf.examples.WidgetLog','Widget Log','3d0a750d-2a92-46d9-948a-20957a10f07c',_binary '\0','1.0',440,_binary '\0','widgets/widget_log','static/themes/common/images/widget-icons/WidgetLog.png',NULL,'Display log messages from widgets with logging enabled.',_binary ''),(16,0,540,'static/themes/common/images/widget-icons/WidgetChrome.png',_binary '\0','org.owfgoss.owf.examples.WidgetChrome','Widget Chrome','7545aa60-7359-40c4-bda8-e619cd5fb562',_binary '\0','1.0',440,_binary '\0','widgets/widget_chrome','static/themes/common/images/widget-icons/WidgetChrome.png',NULL,'Example that utilizes the Widget Chrome API',_binary ''),(17,0,450,'static/themes/common/images/widget-icons/Preferences.png',_binary '\0','org.owfgoss.owf.examples.Preferences','Preferences','1151a4de-85ea-437a-a441-78b04f88b31d',_binary '\0','1.0',300,_binary '\0','widgets/preferences','static/themes/common/images/widget-icons/Preferences.png',NULL,'Example that utilizes the Preferences API',_binary ''),(18,0,500,'static/themes/common/images/widget-icons/EventMonitor.png',_binary '\0','org.owfgoss.owf.examples.EventMonitor','Event Monitor Widget','ddac739d-9fe1-49ce-bdb6-4c09ec3b8b98',_binary '\0','1.0',600,_binary '\0','widgets/event_monitor','static/themes/common/images/widget-icons/EventMonitor.png',NULL,'Example that utilizes the Eventing API.',_binary ''),(19,0,400,'static/themes/common/images/widget-icons/HTMLViewer.png',_binary '\0','org.owfgoss.owf.examples.HTMLViewer','HTML Viewer','4d922394-2bc0-4129-8d5b-2281eb25c8a5',_binary '\0','1.0',600,_binary '\0','widgets/html_viewer','static/themes/common/images/widget-icons/HTMLViewer.png',NULL,'This app component displays HTML.',_binary ''),(20,0,825,'static/themes/common/images/widget-icons/NYSEStock.png',_binary '\0','org.owfgoss.owf.examples.NYSE','NYSE Widget','463127f9-3bc0-40b1-8a34-460af990230b',_binary '\0','1.0',437,_binary '\0','widgets/nyse','static/themes/common/images/widget-icons/NYSEStock.png',NULL,'This app component displays the end of day report for the New York Stock Exchange.',_binary ''),(21,0,800,'static/themes/common/images/widget-icons/PriceChart.png',_binary '\0','org.owfgoss.owf.examples.StockChart','Stock Chart','101aeb62-9178-4169-a231-d278f7d839d8',_binary '\0','1.0',600,_binary '\0','widgets/stock_chart','static/themes/common/images/widget-icons/PriceChart.png',NULL,'This app component charts stock prices.',_binary '');
/*!40000 ALTER TABLE `widget_definition` ENABLE KEYS */;
UNLOCK TABLES;

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
  KEY `FK3uq1td9sndypji1n5ymc6ob6i` (`widget_type_id`),
  CONSTRAINT `FK3uq1td9sndypji1n5ymc6ob6i` FOREIGN KEY (`widget_type_id`) REFERENCES `widget_type` (`id`),
  CONSTRAINT `FKpda8tf8ea9bwigk3f3x6osqib` FOREIGN KEY (`widget_definition_id`) REFERENCES `widget_definition` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `widget_definition_widget_types`
--

LOCK TABLES `widget_definition_widget_types` WRITE;
/*!40000 ALTER TABLE `widget_definition_widget_types` DISABLE KEYS */;
INSERT INTO `widget_definition_widget_types` VALUES (11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(21,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2);
/*!40000 ALTER TABLE `widget_definition_widget_types` ENABLE KEYS */;
UNLOCK TABLES;

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
  `display_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `widget_type`
--

LOCK TABLES `widget_type` WRITE;
/*!40000 ALTER TABLE `widget_type` DISABLE KEYS */;
INSERT INTO `widget_type` VALUES (1,0,'standard','standard'),(2,0,'administration','administration'),(3,0,'marketplace','store'),(4,0,'metric','metric'),(5,0,'fullscreen','fullscreen');
/*!40000 ALTER TABLE `widget_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-01 16:59:14
