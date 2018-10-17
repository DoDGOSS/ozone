--------------------------------------------------------
--  File created - Monday-May-07-2018
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Sequence HIBERNATE_SEQUENCE
--------------------------------------------------------

   CREATE SEQUENCE  "OWF"."HIBERNATE_SEQUENCE"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 473 CACHE 20 NOORDER  NOCYCLE ;
--------------------------------------------------------
--  DDL for Table APPLICATION_CONFIGURATION
--------------------------------------------------------

  CREATE TABLE "OWF"."APPLICATION_CONFIGURATION"
   (	"ID" NUMBER(38,0),
	"VERSION" NUMBER(38,0) DEFAULT 0,
	"CREATED_BY_ID" NUMBER(38,0),
	"CREATED_DATE" DATE,
	"EDITED_BY_ID" NUMBER(38,0),
	"EDITED_DATE" DATE,
	"CODE" VARCHAR2(250 BYTE),
	"VALUE" VARCHAR2(2000 BYTE),
	"TITLE" VARCHAR2(250 BYTE),
	"DESCRIPTION" VARCHAR2(2000 BYTE),
	"TYPE" VARCHAR2(250 BYTE),
	"GROUP_NAME" VARCHAR2(250 BYTE),
	"SUB_GROUP_NAME" VARCHAR2(250 BYTE),
	"MUTABLE" NUMBER(1,0),
	"SUB_GROUP_ORDER" NUMBER(38,0),
	"HELP" VARCHAR2(2000 BYTE)
   ) ;
--------------------------------------------------------
--  DDL for Table DASHBOARD
--------------------------------------------------------

  CREATE TABLE "OWF"."DASHBOARD"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"ISDEFAULT" NUMBER(1,0),
	"DASHBOARD_POSITION" NUMBER(10,0),
	"ALTERED_BY_ADMIN" NUMBER(1,0),
	"GUID" VARCHAR2(255 CHAR),
	"NAME" VARCHAR2(200 CHAR),
	"USER_ID" NUMBER(19,0),
	"DESCRIPTION" VARCHAR2(4000 BYTE),
	"CREATED_BY_ID" NUMBER(38,0),
	"CREATED_DATE" TIMESTAMP (6),
	"EDITED_BY_ID" NUMBER(38,0),
	"EDITED_DATE" TIMESTAMP (6),
	"LAYOUT_CONFIG" CLOB,
	"LOCKED" NUMBER(1,0) DEFAULT 0,
	"STACK_ID" NUMBER(38,0),
	"TYPE" VARCHAR2(255 BYTE),
	"ICON_IMAGE_URL" VARCHAR2(2083 BYTE),
	"PUBLISHED_TO_STORE" NUMBER(1,0),
	"MARKED_FOR_DELETION" NUMBER(1,0)
   ) ;
--------------------------------------------------------
--  DDL for Table DATABASECHANGELOG
--------------------------------------------------------

  CREATE TABLE "OWF"."DATABASECHANGELOG"
   (	"ID" VARCHAR2(255 BYTE),
	"AUTHOR" VARCHAR2(255 BYTE),
	"FILENAME" VARCHAR2(255 BYTE),
	"DATEEXECUTED" TIMESTAMP (6),
	"ORDEREXECUTED" NUMBER(*,0),
	"EXECTYPE" VARCHAR2(10 BYTE),
	"MD5SUM" VARCHAR2(35 BYTE),
	"DESCRIPTION" VARCHAR2(255 BYTE),
	"COMMENTS" VARCHAR2(255 BYTE),
	"TAG" VARCHAR2(255 BYTE),
	"LIQUIBASE" VARCHAR2(20 BYTE),
	"CONTEXTS" VARCHAR2(255 BYTE),
	"LABELS" VARCHAR2(255 BYTE),
	"DEPLOYMENT_ID" VARCHAR2(10 BYTE)
   ) ;
--------------------------------------------------------
--  DDL for Table DATABASECHANGELOGLOCK
--------------------------------------------------------

  CREATE TABLE "OWF"."DATABASECHANGELOGLOCK"
   (	"ID" NUMBER(*,0),
	"LOCKED" NUMBER(1,0),
	"LOCKGRANTED" TIMESTAMP (6),
	"LOCKEDBY" VARCHAR2(255 BYTE)
   ) ;
--------------------------------------------------------
--  DDL for Table DOMAIN_MAPPING
--------------------------------------------------------

  CREATE TABLE "OWF"."DOMAIN_MAPPING"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"SRC_ID" NUMBER(19,0),
	"SRC_TYPE" VARCHAR2(255 CHAR),
	"RELATIONSHIP_TYPE" VARCHAR2(8 CHAR),
	"DEST_ID" NUMBER(19,0),
	"DEST_TYPE" VARCHAR2(255 CHAR)
   ) ;
--------------------------------------------------------
--  DDL for Table INTENT
--------------------------------------------------------

  CREATE TABLE "OWF"."INTENT"
   (	"ID" NUMBER(38,0),
	"VERSION" NUMBER(38,0),
	"ACTION" VARCHAR2(255 BYTE)
   ) ;
--------------------------------------------------------
--  DDL for Table INTENT_DATA_TYPE
--------------------------------------------------------

  CREATE TABLE "OWF"."INTENT_DATA_TYPE"
   (	"ID" NUMBER(38,0),
	"VERSION" NUMBER(38,0),
	"DATA_TYPE" VARCHAR2(255 BYTE)
   ) ;
--------------------------------------------------------
--  DDL for Table INTENT_DATA_TYPES
--------------------------------------------------------

  CREATE TABLE "OWF"."INTENT_DATA_TYPES"
   (	"INTENT_DATA_TYPE_ID" NUMBER(38,0),
	"INTENT_ID" NUMBER(38,0)
   ) ;
--------------------------------------------------------
--  DDL for Table OWF_GROUP
--------------------------------------------------------

  CREATE TABLE "OWF"."OWF_GROUP"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"STATUS" VARCHAR2(8 CHAR),
	"EMAIL" VARCHAR2(255 CHAR),
	"DESCRIPTION" VARCHAR2(255 CHAR),
	"NAME" VARCHAR2(200 CHAR),
	"AUTOMATIC" NUMBER(1,0),
	"DISPLAY_NAME" VARCHAR2(200 BYTE),
	"STACK_DEFAULT" NUMBER(1,0) DEFAULT 0
   ) ;
--------------------------------------------------------
--  DDL for Table OWF_GROUP_PEOPLE
--------------------------------------------------------

  CREATE TABLE "OWF"."OWF_GROUP_PEOPLE"
   (	"PERSON_ID" NUMBER(19,0),
	"GROUP_ID" NUMBER(19,0)
   ) ;
--------------------------------------------------------
--  DDL for Table PERSON
--------------------------------------------------------

  CREATE TABLE "OWF"."PERSON"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"ENABLED" NUMBER(1,0),
	"USER_REAL_NAME" VARCHAR2(200 CHAR),
	"USERNAME" VARCHAR2(200 CHAR),
	"LAST_LOGIN" TIMESTAMP (6),
	"EMAIL_SHOW" NUMBER(1,0),
	"EMAIL" VARCHAR2(255 CHAR),
	"PREV_LOGIN" TIMESTAMP (6),
	"DESCRIPTION" VARCHAR2(255 CHAR),
	"LAST_NOTIFICATION" TIMESTAMP (6),
	"REQUIRES_SYNC" NUMBER(1,0) DEFAULT 0
   ) ;
--------------------------------------------------------
--  DDL for Table PERSON_ROLE
--------------------------------------------------------

  CREATE TABLE "OWF"."PERSON_ROLE"
   (	"PERSON_AUTHORITIES_ID" NUMBER(38,0),
	"ROLE_ID" NUMBER(38,0)
   ) ;
--------------------------------------------------------
--  DDL for Table PERSON_WIDGET_DEFINITION
--------------------------------------------------------

  CREATE TABLE "OWF"."PERSON_WIDGET_DEFINITION"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"PERSON_ID" NUMBER(19,0),
	"VISIBLE" NUMBER(1,0),
	"PWD_POSITION" NUMBER(10,0),
	"WIDGET_DEFINITION_ID" NUMBER(19,0),
	"GROUP_WIDGET" NUMBER(1,0) DEFAULT 0,
	"FAVORITE" NUMBER(1,0) DEFAULT 0,
	"DISPLAY_NAME" VARCHAR2(256 BYTE),
	"DISABLED" NUMBER(1,0) DEFAULT 0,
	"USER_WIDGET" NUMBER(1,0) DEFAULT 0
   ) ;
--------------------------------------------------------
--  DDL for Table PREFERENCE
--------------------------------------------------------

  CREATE TABLE "OWF"."PREFERENCE"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"VALUE" CLOB,
	"PATH" VARCHAR2(200 CHAR),
	"USER_ID" NUMBER(19,0),
	"NAMESPACE" VARCHAR2(200 CHAR)
   ) ;
--------------------------------------------------------
--  DDL for Table REQUESTMAP
--------------------------------------------------------

  CREATE TABLE "OWF"."REQUESTMAP"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"URL" VARCHAR2(255 CHAR),
	"CONFIG_ATTRIBUTE" VARCHAR2(255 CHAR)
   ) ;
--------------------------------------------------------
--  DDL for Table ROLE
--------------------------------------------------------

  CREATE TABLE "OWF"."ROLE"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"AUTHORITY" VARCHAR2(255 CHAR),
	"DESCRIPTION" VARCHAR2(255 CHAR)
   ) ;
--------------------------------------------------------
--  DDL for Table STACK
--------------------------------------------------------

  CREATE TABLE "OWF"."STACK"
   (	"ID" NUMBER(38,0),
	"VERSION" NUMBER(38,0),
	"NAME" VARCHAR2(256 BYTE),
	"DESCRIPTION" VARCHAR2(4000 BYTE),
	"STACK_CONTEXT" VARCHAR2(200 BYTE),
	"IMAGE_URL" VARCHAR2(2083 BYTE),
	"DESCRIPTOR_URL" VARCHAR2(2083 BYTE),
	"UNIQUE_WIDGET_COUNT" NUMBER(38,0) DEFAULT 0,
	"OWNER_ID" NUMBER(38,0),
	"APPROVED" NUMBER(1,0),
	"DEFAULT_GROUP_ID" NUMBER(38,0)
   ) ;
--------------------------------------------------------
--  DDL for Table STACK_GROUPS
--------------------------------------------------------

  CREATE TABLE "OWF"."STACK_GROUPS"
   (	"GROUP_ID" NUMBER(38,0),
	"STACK_ID" NUMBER(38,0)
   ) ;
--------------------------------------------------------
--  DDL for Table TAGS
--------------------------------------------------------

  CREATE TABLE "OWF"."TAGS"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"NAME" VARCHAR2(255 CHAR)
   ) ;
--------------------------------------------------------
--  DDL for Table TAG_LINKS
--------------------------------------------------------

  CREATE TABLE "OWF"."TAG_LINKS"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"POS" NUMBER(19,0),
	"VISIBLE" NUMBER(1,0),
	"TAG_REF" NUMBER(19,0),
	"TAG_ID" NUMBER(19,0),
	"TYPE" VARCHAR2(255 CHAR),
	"EDITABLE" NUMBER(1,0)
   ) ;
--------------------------------------------------------
--  DDL for Table WIDGET_DEFINITION
--------------------------------------------------------

  CREATE TABLE "OWF"."WIDGET_DEFINITION"
   (	"ID" NUMBER(19,0),
	"VERSION" NUMBER(19,0),
	"VISIBLE" NUMBER(1,0),
	"IMAGE_URL_MEDIUM" VARCHAR2(2083 CHAR),
	"IMAGE_URL_SMALL" VARCHAR2(2083 CHAR),
	"SINGLETON" NUMBER(1,0),
	"WIDTH" NUMBER(10,0),
	"WIDGET_VERSION" VARCHAR2(2083 CHAR),
	"HEIGHT" NUMBER(10,0),
	"WIDGET_URL" VARCHAR2(2083 CHAR),
	"WIDGET_GUID" VARCHAR2(255 CHAR),
	"DISPLAY_NAME" VARCHAR2(256 BYTE),
	"BACKGROUND" NUMBER(1,0),
	"UNIVERSAL_NAME" VARCHAR2(255 BYTE),
	"DESCRIPTOR_URL" VARCHAR2(2083 BYTE),
	"DESCRIPTION" VARCHAR2(4000 BYTE) DEFAULT '',
	"MOBILE_READY" NUMBER(1,0) DEFAULT 0
   ) ;
--------------------------------------------------------
--  DDL for Table WIDGET_DEFINITION_WIDGET_TYPES
--------------------------------------------------------

  CREATE TABLE "OWF"."WIDGET_DEFINITION_WIDGET_TYPES"
   (	"WIDGET_DEFINITION_ID" NUMBER(38,0),
	"WIDGET_TYPE_ID" NUMBER(38,0)
   ) ;
--------------------------------------------------------
--  DDL for Table WIDGET_DEF_INTENT
--------------------------------------------------------

  CREATE TABLE "OWF"."WIDGET_DEF_INTENT"
   (	"ID" NUMBER(38,0),
	"VERSION" NUMBER(38,0),
	"RECEIVE" NUMBER(1,0),
	"SEND" NUMBER(1,0),
	"INTENT_ID" NUMBER(38,0),
	"WIDGET_DEFINITION_ID" NUMBER(38,0)
   ) ;
--------------------------------------------------------
--  DDL for Table WIDGET_DEF_INTENT_DATA_TYPES
--------------------------------------------------------

  CREATE TABLE "OWF"."WIDGET_DEF_INTENT_DATA_TYPES"
   (	"INTENT_DATA_TYPE_ID" NUMBER(38,0),
	"WIDGET_DEFINITION_INTENT_ID" NUMBER(38,0)
   ) ;
--------------------------------------------------------
--  DDL for Table WIDGET_TYPE
--------------------------------------------------------

  CREATE TABLE "OWF"."WIDGET_TYPE"
   (	"ID" NUMBER(38,0),
	"VERSION" NUMBER(38,0),
	"NAME" VARCHAR2(255 BYTE),
	"DISPLAY_NAME" VARCHAR2(256 BYTE)
   ) ;
--------------------------------------------------------
--  DDL for Index APPLICATION_CONFIGURATIONPK
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."APPLICATION_CONFIGURATIONPK" ON "OWF"."APPLICATION_CONFIGURATION" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index APP_CONFIG_GROUP_NAME_IDX
--------------------------------------------------------

  CREATE INDEX "OWF"."APP_CONFIG_GROUP_NAME_IDX" ON "OWF"."APPLICATION_CONFIGURATION" ("GROUP_NAME")
  ;
--------------------------------------------------------
--  DDL for Index DOMAIN_MAPPING_ALL
--------------------------------------------------------

  CREATE INDEX "OWF"."DOMAIN_MAPPING_ALL" ON "OWF"."DOMAIN_MAPPING" ("SRC_ID", "SRC_TYPE", "RELATIONSHIP_TYPE", "DEST_ID", "DEST_TYPE")
  ;
--------------------------------------------------------
--  DDL for Index FK68AC2888656347D
--------------------------------------------------------

  CREATE INDEX "OWF"."FK68AC2888656347D" ON "OWF"."STACK" ("OWNER_ID")
  ;
--------------------------------------------------------
--  DDL for Index FKFC9C0477666C6D2
--------------------------------------------------------

  CREATE INDEX "OWF"."FKFC9C0477666C6D2" ON "OWF"."APPLICATION_CONFIGURATION" ("CREATED_BY_ID")
  ;
--------------------------------------------------------
--  DDL for Index FKFC9C047E31CB353
--------------------------------------------------------

  CREATE INDEX "OWF"."FKFC9C047E31CB353" ON "OWF"."APPLICATION_CONFIGURATION" ("EDITED_BY_ID")
  ;
--------------------------------------------------------
--  DDL for Index INTENTPK
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."INTENTPK" ON "OWF"."INTENT" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index INTENT_DATA_TYPEPK
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."INTENT_DATA_TYPEPK" ON "OWF"."INTENT_DATA_TYPE" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index PK_DATABASECHANGELOGLOCK
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."PK_DATABASECHANGELOGLOCK" ON "OWF"."DATABASECHANGELOGLOCK" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index PK_STACK_GROUPS
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."PK_STACK_GROUPS" ON "OWF"."STACK_GROUPS" ("GROUP_ID", "STACK_ID")
  ;
--------------------------------------------------------
--  DDL for Index STACKPK
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."STACKPK" ON "OWF"."STACK" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007308
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007308" ON "OWF"."DASHBOARD" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007309
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007309" ON "OWF"."DASHBOARD" ("GUID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007337
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007337" ON "OWF"."DOMAIN_MAPPING" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007348
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007348" ON "OWF"."OWF_GROUP" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007351
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007351" ON "OWF"."OWF_GROUP_PEOPLE" ("GROUP_ID", "PERSON_ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007358
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007358" ON "OWF"."PERSON" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007359
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007359" ON "OWF"."PERSON" ("USERNAME")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007366
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007366" ON "OWF"."PERSON_WIDGET_DEFINITION" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007367
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007367" ON "OWF"."PERSON_WIDGET_DEFINITION" ("PERSON_ID", "WIDGET_DEFINITION_ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007374
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007374" ON "OWF"."PREFERENCE" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007375
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007375" ON "OWF"."PREFERENCE" ("PATH", "NAMESPACE", "USER_ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007380
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007380" ON "OWF"."REQUESTMAP" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007381
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007381" ON "OWF"."REQUESTMAP" ("URL")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007386
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007386" ON "OWF"."ROLE" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007387
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007387" ON "OWF"."ROLE" ("AUTHORITY")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007396
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007396" ON "OWF"."TAG_LINKS" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007400
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007400" ON "OWF"."TAGS" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007401
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007401" ON "OWF"."TAGS" ("NAME")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007414
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007414" ON "OWF"."WIDGET_DEFINITION" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007415
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007415" ON "OWF"."WIDGET_DEFINITION" ("WIDGET_GUID")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007443
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007443" ON "OWF"."INTENT" ("ACTION")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007470
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007470" ON "OWF"."STACK" ("STACK_CONTEXT")
  ;
--------------------------------------------------------
--  DDL for Index SYS_C007485
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."SYS_C007485" ON "OWF"."APPLICATION_CONFIGURATION" ("CODE")
  ;
--------------------------------------------------------
--  DDL for Index WIDGET_DEF_INTENTPK
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."WIDGET_DEF_INTENTPK" ON "OWF"."WIDGET_DEF_INTENT" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index WIDGET_TYPEPK
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."WIDGET_TYPEPK" ON "OWF"."WIDGET_TYPE" ("ID")
  ;
--------------------------------------------------------
--  DDL for Index WIDGET_TYPES_PKEY
--------------------------------------------------------

  CREATE UNIQUE INDEX "OWF"."WIDGET_TYPES_PKEY" ON "OWF"."WIDGET_DEFINITION_WIDGET_TYPES" ("WIDGET_DEFINITION_ID", "WIDGET_TYPE_ID")
  ;
--------------------------------------------------------
--  DDL for Function CUSTOM_AUTH
--------------------------------------------------------

  CREATE OR REPLACE FUNCTION "OWF"."CUSTOM_AUTH" (p_username in VARCHAR2, p_password in VARCHAR2)
return BOOLEAN
is
  l_password varchar2(4000);
  l_stored_password varchar2(4000);
  l_expires_on date;
  l_count number;
begin
-- First, check to see if the user is in the user table
select count(*) into l_count from demo_users where user_name = p_username;
if l_count > 0 then
  -- First, we fetch the stored hashed password & expire date
  select password, expires_on into l_stored_password, l_expires_on
   from demo_users where user_name = p_username;

  -- Next, we check to see if the user's account is expired
  -- If it is, return FALSE
  if l_expires_on > sysdate or l_expires_on is null then

    -- If the account is not expired, we have to apply the custom hash
    -- function to the password
    l_password := custom_hash(p_username, p_password);

    -- Finally, we compare them to see if they are the same and return
    -- either TRUE or FALSE
    if l_password = l_stored_password then
      return true;
    else
      return false;
    end if;
  else
    return false;
  end if;
else
  -- The username provided is not in the DEMO_USERS table
  return false;
end if;
end;

/
--------------------------------------------------------
--  DDL for Function CUSTOM_HASH
--------------------------------------------------------

  CREATE OR REPLACE FUNCTION "OWF"."CUSTOM_HASH" (p_username in varchar2, p_password in varchar2)
return varchar2
is
  l_password varchar2(4000);
  l_salt varchar2(4000) := 'F8E8AK80N5DXPBQKCU9XWZ93GTHS42';
begin

-- This function should be wrapped, as the hash algorhythm is exposed here.
-- You can change the value of l_salt or the method of which to call the
-- DBMS_OBFUSCATOIN toolkit, but you much reset all of your passwords
-- if you choose to do this.

l_password := utl_raw.cast_to_raw(dbms_obfuscation_toolkit.md5
  (input_string => p_password || substr(l_salt,10,13) || p_username ||
    substr(l_salt, 4,10)));
return l_password;
end;

/
--------------------------------------------------------
--  Constraints for Table APPLICATION_CONFIGURATION
--------------------------------------------------------

  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" ADD CONSTRAINT "SYS_C007485" UNIQUE ("CODE") ENABLE;
  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" ADD CONSTRAINT "APPLICATION_CONFIGURATIONPK" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" MODIFY ("MUTABLE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" MODIFY ("GROUP_NAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" MODIFY ("TYPE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" MODIFY ("TITLE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" MODIFY ("CODE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table DASHBOARD
--------------------------------------------------------

  ALTER TABLE "OWF"."DASHBOARD" ADD CONSTRAINT "SYS_C007309" UNIQUE ("GUID") ENABLE;
  ALTER TABLE "OWF"."DASHBOARD" ADD CONSTRAINT "SYS_C007308" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."DASHBOARD" MODIFY ("NAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DASHBOARD" MODIFY ("GUID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DASHBOARD" MODIFY ("ALTERED_BY_ADMIN" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DASHBOARD" MODIFY ("DASHBOARD_POSITION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DASHBOARD" MODIFY ("ISDEFAULT" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DASHBOARD" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DASHBOARD" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table DATABASECHANGELOG
--------------------------------------------------------

  ALTER TABLE "OWF"."DATABASECHANGELOG" MODIFY ("EXECTYPE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DATABASECHANGELOG" MODIFY ("ORDEREXECUTED" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DATABASECHANGELOG" MODIFY ("DATEEXECUTED" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DATABASECHANGELOG" MODIFY ("FILENAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DATABASECHANGELOG" MODIFY ("AUTHOR" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DATABASECHANGELOG" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table DATABASECHANGELOGLOCK
--------------------------------------------------------

  ALTER TABLE "OWF"."DATABASECHANGELOGLOCK" ADD CONSTRAINT "PK_DATABASECHANGELOGLOCK" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."DATABASECHANGELOGLOCK" MODIFY ("LOCKED" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DATABASECHANGELOGLOCK" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table DOMAIN_MAPPING
--------------------------------------------------------

  ALTER TABLE "OWF"."DOMAIN_MAPPING" ADD CONSTRAINT "SYS_C007337" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."DOMAIN_MAPPING" MODIFY ("DEST_TYPE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DOMAIN_MAPPING" MODIFY ("DEST_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DOMAIN_MAPPING" MODIFY ("SRC_TYPE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DOMAIN_MAPPING" MODIFY ("SRC_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DOMAIN_MAPPING" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."DOMAIN_MAPPING" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table INTENT
--------------------------------------------------------

  ALTER TABLE "OWF"."INTENT" ADD CONSTRAINT "SYS_C007443" UNIQUE ("ACTION") ENABLE;
  ALTER TABLE "OWF"."INTENT" ADD CONSTRAINT "INTENTPK" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."INTENT" MODIFY ("ACTION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."INTENT" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."INTENT" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table INTENT_DATA_TYPE
--------------------------------------------------------

  ALTER TABLE "OWF"."INTENT_DATA_TYPE" ADD CONSTRAINT "INTENT_DATA_TYPEPK" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."INTENT_DATA_TYPE" MODIFY ("DATA_TYPE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."INTENT_DATA_TYPE" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."INTENT_DATA_TYPE" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table INTENT_DATA_TYPES
--------------------------------------------------------

  ALTER TABLE "OWF"."INTENT_DATA_TYPES" MODIFY ("INTENT_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."INTENT_DATA_TYPES" MODIFY ("INTENT_DATA_TYPE_ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table OWF_GROUP
--------------------------------------------------------

  ALTER TABLE "OWF"."OWF_GROUP" ADD CONSTRAINT "SYS_C007348" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."OWF_GROUP" MODIFY ("AUTOMATIC" NOT NULL ENABLE);
  ALTER TABLE "OWF"."OWF_GROUP" MODIFY ("NAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."OWF_GROUP" MODIFY ("STATUS" NOT NULL ENABLE);
  ALTER TABLE "OWF"."OWF_GROUP" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."OWF_GROUP" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table OWF_GROUP_PEOPLE
--------------------------------------------------------

  ALTER TABLE "OWF"."OWF_GROUP_PEOPLE" ADD CONSTRAINT "SYS_C007351" PRIMARY KEY ("GROUP_ID", "PERSON_ID") ENABLE;
--------------------------------------------------------
--  Constraints for Table PERSON
--------------------------------------------------------

  ALTER TABLE "OWF"."PERSON" ADD CONSTRAINT "SYS_C007359" UNIQUE ("USERNAME") ENABLE;
  ALTER TABLE "OWF"."PERSON" ADD CONSTRAINT "SYS_C007358" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."PERSON" MODIFY ("EMAIL_SHOW" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PERSON" MODIFY ("USERNAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PERSON" MODIFY ("USER_REAL_NAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PERSON" MODIFY ("ENABLED" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PERSON" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PERSON" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table PERSON_WIDGET_DEFINITION
--------------------------------------------------------

  ALTER TABLE "OWF"."PERSON_WIDGET_DEFINITION" ADD CONSTRAINT "SYS_C007367" UNIQUE ("PERSON_ID", "WIDGET_DEFINITION_ID") ENABLE;
  ALTER TABLE "OWF"."PERSON_WIDGET_DEFINITION" ADD CONSTRAINT "SYS_C007366" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."PERSON_WIDGET_DEFINITION" MODIFY ("WIDGET_DEFINITION_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PERSON_WIDGET_DEFINITION" MODIFY ("PWD_POSITION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PERSON_WIDGET_DEFINITION" MODIFY ("VISIBLE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PERSON_WIDGET_DEFINITION" MODIFY ("PERSON_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PERSON_WIDGET_DEFINITION" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PERSON_WIDGET_DEFINITION" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table PREFERENCE
--------------------------------------------------------

  ALTER TABLE "OWF"."PREFERENCE" ADD CONSTRAINT "SYS_C007375" UNIQUE ("PATH", "NAMESPACE", "USER_ID") ENABLE;
  ALTER TABLE "OWF"."PREFERENCE" ADD CONSTRAINT "SYS_C007374" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."PREFERENCE" MODIFY ("NAMESPACE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PREFERENCE" MODIFY ("USER_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PREFERENCE" MODIFY ("PATH" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PREFERENCE" MODIFY ("VALUE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PREFERENCE" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."PREFERENCE" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table REQUESTMAP
--------------------------------------------------------

  ALTER TABLE "OWF"."REQUESTMAP" ADD CONSTRAINT "SYS_C007381" UNIQUE ("URL") ENABLE;
  ALTER TABLE "OWF"."REQUESTMAP" ADD CONSTRAINT "SYS_C007380" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."REQUESTMAP" MODIFY ("CONFIG_ATTRIBUTE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."REQUESTMAP" MODIFY ("URL" NOT NULL ENABLE);
  ALTER TABLE "OWF"."REQUESTMAP" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."REQUESTMAP" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table ROLE
--------------------------------------------------------

  ALTER TABLE "OWF"."ROLE" ADD CONSTRAINT "SYS_C007387" UNIQUE ("AUTHORITY") ENABLE;
  ALTER TABLE "OWF"."ROLE" ADD CONSTRAINT "SYS_C007386" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."ROLE" MODIFY ("DESCRIPTION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."ROLE" MODIFY ("AUTHORITY" NOT NULL ENABLE);
  ALTER TABLE "OWF"."ROLE" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."ROLE" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table STACK
--------------------------------------------------------

  ALTER TABLE "OWF"."STACK" ADD CONSTRAINT "SYS_C007470" UNIQUE ("STACK_CONTEXT") ENABLE;
  ALTER TABLE "OWF"."STACK" ADD CONSTRAINT "STACKPK" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."STACK" MODIFY ("STACK_CONTEXT" NOT NULL ENABLE);
  ALTER TABLE "OWF"."STACK" MODIFY ("NAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."STACK" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."STACK" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table STACK_GROUPS
--------------------------------------------------------

  ALTER TABLE "OWF"."STACK_GROUPS" ADD CONSTRAINT "PK_STACK_GROUPS" PRIMARY KEY ("GROUP_ID", "STACK_ID") ENABLE;
  ALTER TABLE "OWF"."STACK_GROUPS" MODIFY ("STACK_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."STACK_GROUPS" MODIFY ("GROUP_ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table TAGS
--------------------------------------------------------

  ALTER TABLE "OWF"."TAGS" ADD CONSTRAINT "SYS_C007401" UNIQUE ("NAME") ENABLE;
  ALTER TABLE "OWF"."TAGS" ADD CONSTRAINT "SYS_C007400" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."TAGS" MODIFY ("NAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."TAGS" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."TAGS" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table TAG_LINKS
--------------------------------------------------------

  ALTER TABLE "OWF"."TAG_LINKS" ADD CONSTRAINT "SYS_C007396" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."TAG_LINKS" MODIFY ("TYPE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."TAG_LINKS" MODIFY ("TAG_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."TAG_LINKS" MODIFY ("TAG_REF" NOT NULL ENABLE);
  ALTER TABLE "OWF"."TAG_LINKS" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."TAG_LINKS" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table WIDGET_DEFINITION
--------------------------------------------------------

  ALTER TABLE "OWF"."WIDGET_DEFINITION" ADD CONSTRAINT "SYS_C007415" UNIQUE ("WIDGET_GUID") ENABLE;
  ALTER TABLE "OWF"."WIDGET_DEFINITION" ADD CONSTRAINT "SYS_C007414" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("MOBILE_READY" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("DISPLAY_NAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("WIDGET_GUID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("WIDGET_URL" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("HEIGHT" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("WIDTH" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("SINGLETON" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("IMAGE_URL_SMALL" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("IMAGE_URL_MEDIUM" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("VISIBLE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table WIDGET_DEFINITION_WIDGET_TYPES
--------------------------------------------------------

  ALTER TABLE "OWF"."WIDGET_DEFINITION_WIDGET_TYPES" ADD CONSTRAINT "WIDGET_TYPES_PKEY" PRIMARY KEY ("WIDGET_DEFINITION_ID", "WIDGET_TYPE_ID") ENABLE;
  ALTER TABLE "OWF"."WIDGET_DEFINITION_WIDGET_TYPES" MODIFY ("WIDGET_TYPE_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEFINITION_WIDGET_TYPES" MODIFY ("WIDGET_DEFINITION_ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table WIDGET_DEF_INTENT
--------------------------------------------------------

  ALTER TABLE "OWF"."WIDGET_DEF_INTENT" ADD CONSTRAINT "WIDGET_DEF_INTENTPK" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."WIDGET_DEF_INTENT" MODIFY ("WIDGET_DEFINITION_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEF_INTENT" MODIFY ("INTENT_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEF_INTENT" MODIFY ("SEND" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEF_INTENT" MODIFY ("RECEIVE" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEF_INTENT" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEF_INTENT" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table WIDGET_DEF_INTENT_DATA_TYPES
--------------------------------------------------------

  ALTER TABLE "OWF"."WIDGET_DEF_INTENT_DATA_TYPES" MODIFY ("WIDGET_DEFINITION_INTENT_ID" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_DEF_INTENT_DATA_TYPES" MODIFY ("INTENT_DATA_TYPE_ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table WIDGET_TYPE
--------------------------------------------------------

  ALTER TABLE "OWF"."WIDGET_TYPE" ADD CONSTRAINT "WIDGET_TYPEPK" PRIMARY KEY ("ID") ENABLE;
  ALTER TABLE "OWF"."WIDGET_TYPE" MODIFY ("DISPLAY_NAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_TYPE" MODIFY ("NAME" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_TYPE" MODIFY ("VERSION" NOT NULL ENABLE);
  ALTER TABLE "OWF"."WIDGET_TYPE" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Ref Constraints for Table APPLICATION_CONFIGURATION
--------------------------------------------------------

  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" ADD CONSTRAINT "FKFC9C0477666C6D2" FOREIGN KEY ("CREATED_BY_ID")
	  REFERENCES "OWF"."PERSON" ("ID") ENABLE;
  ALTER TABLE "OWF"."APPLICATION_CONFIGURATION" ADD CONSTRAINT "FKFC9C047E31CB353" FOREIGN KEY ("EDITED_BY_ID")
	  REFERENCES "OWF"."PERSON" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table DASHBOARD
--------------------------------------------------------

  ALTER TABLE "OWF"."DASHBOARD" ADD CONSTRAINT "FKC18AEA94372CC5A" FOREIGN KEY ("CREATED_BY_ID")
	  REFERENCES "OWF"."PERSON" ("ID") ENABLE;
  ALTER TABLE "OWF"."DASHBOARD" ADD CONSTRAINT "FKC18AEA946B3A1281" FOREIGN KEY ("STACK_ID")
	  REFERENCES "OWF"."STACK" ("ID") ENABLE;
  ALTER TABLE "OWF"."DASHBOARD" ADD CONSTRAINT "FKC18AEA947028B8DB" FOREIGN KEY ("EDITED_BY_ID")
	  REFERENCES "OWF"."PERSON" ("ID") ENABLE;
  ALTER TABLE "OWF"."DASHBOARD" ADD CONSTRAINT "FKC18AEA948656347D" FOREIGN KEY ("USER_ID")
	  REFERENCES "OWF"."PERSON" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table INTENT_DATA_TYPES
--------------------------------------------------------

  ALTER TABLE "OWF"."INTENT_DATA_TYPES" ADD CONSTRAINT "FK8A59132FD46C6FAA" FOREIGN KEY ("INTENT_DATA_TYPE_ID")
	  REFERENCES "OWF"."INTENT_DATA_TYPE" ("ID") ENABLE;
  ALTER TABLE "OWF"."INTENT_DATA_TYPES" ADD CONSTRAINT "FK8A59D92FD46C6FAA" FOREIGN KEY ("INTENT_ID")
	  REFERENCES "OWF"."INTENT" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table OWF_GROUP_PEOPLE
--------------------------------------------------------

  ALTER TABLE "OWF"."OWF_GROUP_PEOPLE" ADD CONSTRAINT "FK28113703B197B21" FOREIGN KEY ("GROUP_ID")
	  REFERENCES "OWF"."OWF_GROUP" ("ID") ENABLE;
  ALTER TABLE "OWF"."OWF_GROUP_PEOPLE" ADD CONSTRAINT "FK2811370C1F5E0B3" FOREIGN KEY ("PERSON_ID")
	  REFERENCES "OWF"."PERSON" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table PERSON_WIDGET_DEFINITION
--------------------------------------------------------

  ALTER TABLE "OWF"."PERSON_WIDGET_DEFINITION" ADD CONSTRAINT "FK6F5C17C4293A835C" FOREIGN KEY ("WIDGET_DEFINITION_ID")
	  REFERENCES "OWF"."WIDGET_DEFINITION" ("ID") ENABLE;
  ALTER TABLE "OWF"."PERSON_WIDGET_DEFINITION" ADD CONSTRAINT "FK6F5C17C4C1F5E0B3" FOREIGN KEY ("PERSON_ID")
	  REFERENCES "OWF"."PERSON" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table PREFERENCE
--------------------------------------------------------

  ALTER TABLE "OWF"."PREFERENCE" ADD CONSTRAINT "FKA8FCBCDB8656347D" FOREIGN KEY ("USER_ID")
	  REFERENCES "OWF"."PERSON" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table STACK
--------------------------------------------------------

  ALTER TABLE "OWF"."STACK" ADD CONSTRAINT "FK68AC28835014F5F" FOREIGN KEY ("DEFAULT_GROUP_ID")
	  REFERENCES "OWF"."OWF_GROUP" ("ID") ENABLE;
  ALTER TABLE "OWF"."STACK" ADD CONSTRAINT "FK68AC2888656347D" FOREIGN KEY ("OWNER_ID")
	  REFERENCES "OWF"."PERSON" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table STACK_GROUPS
--------------------------------------------------------

  ALTER TABLE "OWF"."STACK_GROUPS" ADD CONSTRAINT "FK9584AB6B3B197B21" FOREIGN KEY ("GROUP_ID")
	  REFERENCES "OWF"."OWF_GROUP" ("ID") ENABLE;
  ALTER TABLE "OWF"."STACK_GROUPS" ADD CONSTRAINT "FK9584AB6B6B3A1281" FOREIGN KEY ("STACK_ID")
	  REFERENCES "OWF"."STACK" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table TAG_LINKS
--------------------------------------------------------

  ALTER TABLE "OWF"."TAG_LINKS" ADD CONSTRAINT "FK7C35D6D45A3B441D" FOREIGN KEY ("TAG_ID")
	  REFERENCES "OWF"."TAGS" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table WIDGET_DEFINITION_WIDGET_TYPES
--------------------------------------------------------

  ALTER TABLE "OWF"."WIDGET_DEFINITION_WIDGET_TYPES" ADD CONSTRAINT "FK8A59D92F293A835C" FOREIGN KEY ("WIDGET_DEFINITION_ID")
	  REFERENCES "OWF"."WIDGET_DEFINITION" ("ID") ENABLE;
  ALTER TABLE "OWF"."WIDGET_DEFINITION_WIDGET_TYPES" ADD CONSTRAINT "FK8A59D92FD46C6F7C" FOREIGN KEY ("WIDGET_TYPE_ID")
	  REFERENCES "OWF"."WIDGET_TYPE" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table WIDGET_DEF_INTENT
--------------------------------------------------------

  ALTER TABLE "OWF"."WIDGET_DEF_INTENT" ADD CONSTRAINT "FK8A59D92FD46C6FAB" FOREIGN KEY ("WIDGET_DEFINITION_ID")
	  REFERENCES "OWF"."WIDGET_DEFINITION" ("ID") ENABLE;
  ALTER TABLE "OWF"."WIDGET_DEF_INTENT" ADD CONSTRAINT "FK8A59D92FD46C6FAC" FOREIGN KEY ("INTENT_ID")
	  REFERENCES "OWF"."INTENT" ("ID") ENABLE;
--------------------------------------------------------
--  Ref Constraints for Table WIDGET_DEF_INTENT_DATA_TYPES
--------------------------------------------------------

  ALTER TABLE "OWF"."WIDGET_DEF_INTENT_DATA_TYPES" ADD CONSTRAINT "FK8A59D92FD41A6FAD" FOREIGN KEY ("INTENT_DATA_TYPE_ID")
	  REFERENCES "OWF"."INTENT_DATA_TYPE" ("ID") ENABLE;
  ALTER TABLE "OWF"."WIDGET_DEF_INTENT_DATA_TYPES" ADD CONSTRAINT "FK8A59D92FD46C6FAD" FOREIGN KEY ("WIDGET_DEFINITION_INTENT_ID")
	  REFERENCES "OWF"."WIDGET_DEF_INTENT" ("ID") ENABLE;
