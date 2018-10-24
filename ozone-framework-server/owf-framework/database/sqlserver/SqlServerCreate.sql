USE [master]
GO
/****** Object:  Table [dbo].[application_configuration]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[application_configuration](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[version] [bigint] NOT NULL,
	[created_by_id] [numeric](19, 0) NULL,
	[created_date] [smalldatetime] NULL,
	[edited_by_id] [numeric](19, 0) NULL,
	[edited_date] [smalldatetime] NULL,
	[code] [varchar](250) NOT NULL,
	[VALUE] [varchar](2000) NULL,
	[title] [varchar](250) NOT NULL,
	[description] [varchar](2000) NULL,
	[type] [varchar](250) NOT NULL,
	[group_name] [varchar](250) NOT NULL,
	[sub_group_name] [varchar](250) NULL,
	[mutable] [bit] NOT NULL,
	[sub_group_order] [bigint] NULL,
	[help] [varchar](2000) NULL,
 CONSTRAINT [application_configurationPK] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[dashboard]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[dashboard](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[isdefault] [tinyint] NOT NULL,
	[dashboard_position] [int] NOT NULL,
	[altered_by_admin] [tinyint] NOT NULL,
	[guid] [nvarchar](255) NOT NULL,
	[name] [nvarchar](200) NOT NULL,
	[user_id] [numeric](19, 0) NULL,
	[description] [varchar](4000) NULL,
	[created_by_id] [numeric](19, 0) NULL,
	[created_date] [datetime] NULL,
	[edited_by_id] [numeric](19, 0) NULL,
	[edited_date] [datetime] NULL,
	[layout_config] [nvarchar](max) NULL,
	[locked] [bit] NULL,
	[stack_id] [bigint] NULL,
	[type] [varchar](255) NULL,
	[icon_image_url] [varchar](2083) NULL,
	[published_to_store] [bit] NULL,
	[marked_for_deletion] [bit] NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[guid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[DATABASECHANGELOG]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DATABASECHANGELOG](
	[ID] [nvarchar](255) NOT NULL,
	[AUTHOR] [nvarchar](255) NOT NULL,
	[FILENAME] [nvarchar](255) NOT NULL,
	[DATEEXECUTED] [datetime2](3) NOT NULL,
	[ORDEREXECUTED] [int] NOT NULL,
	[EXECTYPE] [nvarchar](10) NOT NULL,
	[MD5SUM] [nvarchar](35) NULL,
	[DESCRIPTION] [nvarchar](255) NULL,
	[COMMENTS] [nvarchar](255) NULL,
	[TAG] [nvarchar](255) NULL,
	[LIQUIBASE] [nvarchar](20) NULL,
	[CONTEXTS] [nvarchar](255) NULL,
	[LABELS] [nvarchar](255) NULL,
	[DEPLOYMENT_ID] [nvarchar](10) NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DATABASECHANGELOGLOCK]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DATABASECHANGELOGLOCK](
	[ID] [int] NOT NULL,
	[LOCKED] [bit] NOT NULL,
	[LOCKGRANTED] [datetime2](3) NULL,
	[LOCKEDBY] [nvarchar](255) NULL,
 CONSTRAINT [PK_DATABASECHANGELOGLOCK] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[domain_mapping]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[domain_mapping](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[src_id] [numeric](19, 0) NOT NULL,
	[src_type] [nvarchar](255) NOT NULL,
	[relationship_type] [nvarchar](8) NULL,
	[dest_id] [numeric](19, 0) NOT NULL,
	[dest_type] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[intent]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[intent](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[version] [bigint] NOT NULL,
	[action] [varchar](255) NOT NULL,
 CONSTRAINT [intentPK] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[action] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[intent_data_type]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[intent_data_type](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[version] [bigint] NOT NULL,
	[data_type] [varchar](255) NOT NULL,
 CONSTRAINT [intent_data_typePK] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[intent_data_types]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[intent_data_types](
	[intent_data_type_id] [bigint] NOT NULL,
	[intent_id] [bigint] NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[owf_group]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[owf_group](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[status] [nvarchar](8) NOT NULL,
	[email] [nvarchar](255) NULL,
	[description] [nvarchar](255) NULL,
	[name] [nvarchar](200) NOT NULL,
	[automatic] [tinyint] NOT NULL,
	[display_name] [varchar](200) NULL,
	[stack_default] [bit] NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[owf_group_people]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[owf_group_people](
	[person_id] [numeric](19, 0) NOT NULL,
	[group_id] [numeric](19, 0) NOT NULL,
PRIMARY KEY CLUSTERED
(
	[group_id] ASC,
	[person_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[person]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[person](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[enabled] [tinyint] NOT NULL,
	[user_real_name] [nvarchar](200) NOT NULL,
	[username] [nvarchar](200) NOT NULL,
	[last_login] [datetime] NULL,
	[email_show] [tinyint] NOT NULL,
	[email] [nvarchar](255) NULL,
	[prev_login] [datetime] NULL,
	[description] [nvarchar](255) NULL,
	[last_notification] [datetime] NULL,
	[requires_sync] [bit] NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[person_role]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[person_role](
	[person_authorities_id] [bigint] NULL,
	[role_id] [bigint] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[person_widget_definition]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[person_widget_definition](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[person_id] [numeric](19, 0) NOT NULL,
	[visible] [tinyint] NOT NULL,
	[pwd_position] [int] NOT NULL,
	[widget_definition_id] [numeric](19, 0) NOT NULL,
	[group_widget] [bit] NULL,
	[favorite] [bit] NULL,
	[display_name] [varchar](256) NULL,
	[disabled] [bit] NULL,
	[user_widget] [bit] NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[person_id] ASC,
	[widget_definition_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[preference]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[preference](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[value] [ntext] NOT NULL,
	[path] [nvarchar](200) NOT NULL,
	[user_id] [numeric](19, 0) NOT NULL,
	[namespace] [nvarchar](200) NOT NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[path] ASC,
	[namespace] ASC,
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[requestmap]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[requestmap](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[url] [nvarchar](255) NOT NULL,
	[config_attribute] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[url] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[role]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[role](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[authority] [nvarchar](255) NOT NULL,
	[description] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[authority] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[stack]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[stack](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[version] [bigint] NOT NULL,
	[name] [varchar](256) NOT NULL,
	[description] [varchar](4000) NULL,
	[stack_context] [varchar](200) NOT NULL,
	[image_url] [varchar](2083) NULL,
	[descriptor_url] [varchar](2083) NULL,
	[unique_widget_count] [bigint] NULL,
	[owner_id] [numeric](19, 0) NULL,
	[approved] [bit] NULL,
	[default_group_id] [numeric](19, 0) NULL,
 CONSTRAINT [stackPK] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[stack_context] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[stack_groups]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[stack_groups](
	[group_id] [numeric](19, 0) NOT NULL,
	[stack_id] [bigint] NOT NULL,
 CONSTRAINT [pk_stack_groups] PRIMARY KEY CLUSTERED
(
	[group_id] ASC,
	[stack_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tag_links]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tag_links](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[pos] [numeric](19, 0) NULL,
	[visible] [tinyint] NULL,
	[tag_ref] [numeric](19, 0) NOT NULL,
	[tag_id] [numeric](19, 0) NOT NULL,
	[type] [nvarchar](255) NOT NULL,
	[editable] [tinyint] NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tags]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tags](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[widget_def_intent]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[widget_def_intent](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[version] [bigint] NOT NULL,
	[receive] [bit] NOT NULL,
	[send] [bit] NOT NULL,
	[intent_id] [bigint] NOT NULL,
	[widget_definition_id] [numeric](19, 0) NOT NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[widget_def_intent_data_types]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[widget_def_intent_data_types](
	[intent_data_type_id] [bigint] NOT NULL,
	[widget_definition_intent_id] [bigint] NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[widget_definition]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[widget_definition](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[visible] [tinyint] NOT NULL,
	[image_url_medium] [nvarchar](2083) NOT NULL,
	[image_url_small] [nvarchar](2083) NOT NULL,
	[singleton] [tinyint] NOT NULL,
	[width] [int] NOT NULL,
	[widget_version] [nvarchar](2083) NULL,
	[height] [int] NOT NULL,
	[widget_url] [nvarchar](2083) NOT NULL,
	[widget_guid] [nvarchar](255) NOT NULL,
	[display_name] [varchar](256) NULL,
	[background] [bit] NULL,
	[universal_name] [varchar](255) NULL,
	[descriptor_url] [varchar](2083) NULL,
	[description] [varchar](4000) NULL,
	[mobile_ready] [bit] NOT NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED
(
	[widget_guid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[widget_definition_widget_types]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[widget_definition_widget_types](
	[widget_definition_id] [numeric](19, 0) NOT NULL,
	[widget_type_id] [numeric](19, 0) NOT NULL,
PRIMARY KEY CLUSTERED
(
	[widget_definition_id] ASC,
	[widget_type_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[widget_type]    Script Date: 5/14/2018 10:30:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[widget_type](
	[id] [numeric](19, 0) IDENTITY(1,1) NOT NULL,
	[version] [numeric](19, 0) NOT NULL,
	[name] [varchar](255) NOT NULL,
	[display_name] [varchar](256) NOT NULL,
 CONSTRAINT [widget_typePK] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [app_config_group_name_idx]    Script Date: 5/14/2018 10:30:50 AM ******/
CREATE NONCLUSTERED INDEX [app_config_group_name_idx] ON [dbo].[application_configuration]
(
	[group_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [FKFC9C0477666C6D2]    Script Date: 5/14/2018 10:30:50 AM ******/
CREATE NONCLUSTERED INDEX [FKFC9C0477666C6D2] ON [dbo].[application_configuration]
(
	[created_by_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [FKFC9C047E31CB353]    Script Date: 5/14/2018 10:30:50 AM ******/
CREATE NONCLUSTERED INDEX [FKFC9C047E31CB353] ON [dbo].[application_configuration]
(
	[edited_by_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [domain_mapping_all]    Script Date: 5/14/2018 10:30:50 AM ******/
CREATE NONCLUSTERED INDEX [domain_mapping_all] ON [dbo].[domain_mapping]
(
	[src_id] ASC,
	[src_type] ASC,
	[relationship_type] ASC,
	[dest_id] ASC,
	[dest_type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [FK68AC2888656347D]    Script Date: 5/14/2018 10:30:50 AM ******/
CREATE NONCLUSTERED INDEX [FK68AC2888656347D] ON [dbo].[stack]
(
	[owner_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[application_configuration] ADD  CONSTRAINT [DF_application_configuration_version]  DEFAULT ((0)) FOR [version]
GO
ALTER TABLE [dbo].[dashboard] ADD  CONSTRAINT [DF_dashboard_locked]  DEFAULT ((0)) FOR [locked]
GO
ALTER TABLE [dbo].[owf_group] ADD  CONSTRAINT [DF_owf_group_stack_default]  DEFAULT ((0)) FOR [stack_default]
GO
ALTER TABLE [dbo].[person] ADD  CONSTRAINT [DF_person_requires_sync]  DEFAULT ((0)) FOR [requires_sync]
GO
ALTER TABLE [dbo].[person_widget_definition] ADD  CONSTRAINT [DF_person_widget_definition_group_widget]  DEFAULT ((0)) FOR [group_widget]
GO
ALTER TABLE [dbo].[person_widget_definition] ADD  CONSTRAINT [DF_person_widget_definition_favorite]  DEFAULT ((0)) FOR [favorite]
GO
ALTER TABLE [dbo].[person_widget_definition] ADD  CONSTRAINT [DF_person_widget_definition_disabled]  DEFAULT ((0)) FOR [disabled]
GO
ALTER TABLE [dbo].[person_widget_definition] ADD  CONSTRAINT [DF_person_widget_definition_user_widget]  DEFAULT ((0)) FOR [user_widget]
GO
ALTER TABLE [dbo].[stack] ADD  CONSTRAINT [DF_stack_unique_widget_count]  DEFAULT ((0)) FOR [unique_widget_count]
GO
ALTER TABLE [dbo].[widget_definition] ADD  CONSTRAINT [DF_widget_definition_description]  DEFAULT ('') FOR [description]
GO
ALTER TABLE [dbo].[widget_definition] ADD  CONSTRAINT [DF_widget_definition_mobile_ready]  DEFAULT ((0)) FOR [mobile_ready]
GO
ALTER TABLE [dbo].[application_configuration]  WITH CHECK ADD  CONSTRAINT [FKFC9C0477666C6D2] FOREIGN KEY([created_by_id])
REFERENCES [dbo].[person] ([id])
GO
ALTER TABLE [dbo].[application_configuration] CHECK CONSTRAINT [FKFC9C0477666C6D2]
GO
ALTER TABLE [dbo].[application_configuration]  WITH CHECK ADD  CONSTRAINT [FKFC9C047E31CB353] FOREIGN KEY([edited_by_id])
REFERENCES [dbo].[person] ([id])
GO
ALTER TABLE [dbo].[application_configuration] CHECK CONSTRAINT [FKFC9C047E31CB353]
GO
ALTER TABLE [dbo].[dashboard]  WITH CHECK ADD  CONSTRAINT [FKC18AEA94372CC5A] FOREIGN KEY([created_by_id])
REFERENCES [dbo].[person] ([id])
GO
ALTER TABLE [dbo].[dashboard] CHECK CONSTRAINT [FKC18AEA94372CC5A]
GO
ALTER TABLE [dbo].[dashboard]  WITH CHECK ADD  CONSTRAINT [FKC18AEA946B3A1281] FOREIGN KEY([stack_id])
REFERENCES [dbo].[stack] ([id])
GO
ALTER TABLE [dbo].[dashboard] CHECK CONSTRAINT [FKC18AEA946B3A1281]
GO
ALTER TABLE [dbo].[dashboard]  WITH CHECK ADD  CONSTRAINT [FKC18AEA947028B8DB] FOREIGN KEY([edited_by_id])
REFERENCES [dbo].[person] ([id])
GO
ALTER TABLE [dbo].[dashboard] CHECK CONSTRAINT [FKC18AEA947028B8DB]
GO
ALTER TABLE [dbo].[dashboard]  WITH CHECK ADD  CONSTRAINT [FKC18AEA948656347D] FOREIGN KEY([user_id])
REFERENCES [dbo].[person] ([id])
GO
ALTER TABLE [dbo].[dashboard] CHECK CONSTRAINT [FKC18AEA948656347D]
GO
ALTER TABLE [dbo].[intent_data_types]  WITH CHECK ADD  CONSTRAINT [FK8A59132FD46C6FAA] FOREIGN KEY([intent_data_type_id])
REFERENCES [dbo].[intent_data_type] ([id])
GO
ALTER TABLE [dbo].[intent_data_types] CHECK CONSTRAINT [FK8A59132FD46C6FAA]
GO
ALTER TABLE [dbo].[intent_data_types]  WITH CHECK ADD  CONSTRAINT [FK8A59D92FD46C6FAA] FOREIGN KEY([intent_id])
REFERENCES [dbo].[intent] ([id])
GO
ALTER TABLE [dbo].[intent_data_types] CHECK CONSTRAINT [FK8A59D92FD46C6FAA]
GO
ALTER TABLE [dbo].[owf_group_people]  WITH CHECK ADD  CONSTRAINT [FK28113703B197B21] FOREIGN KEY([group_id])
REFERENCES [dbo].[owf_group] ([id])
GO
ALTER TABLE [dbo].[owf_group_people] CHECK CONSTRAINT [FK28113703B197B21]
GO
ALTER TABLE [dbo].[owf_group_people]  WITH CHECK ADD  CONSTRAINT [FK2811370C1F5E0B3] FOREIGN KEY([person_id])
REFERENCES [dbo].[person] ([id])
GO
ALTER TABLE [dbo].[owf_group_people] CHECK CONSTRAINT [FK2811370C1F5E0B3]
GO
ALTER TABLE [dbo].[person_widget_definition]  WITH CHECK ADD  CONSTRAINT [FK6F5C17C4293A835C] FOREIGN KEY([widget_definition_id])
REFERENCES [dbo].[widget_definition] ([id])
GO
ALTER TABLE [dbo].[person_widget_definition] CHECK CONSTRAINT [FK6F5C17C4293A835C]
GO
ALTER TABLE [dbo].[person_widget_definition]  WITH CHECK ADD  CONSTRAINT [FK6F5C17C4C1F5E0B3] FOREIGN KEY([person_id])
REFERENCES [dbo].[person] ([id])
GO
ALTER TABLE [dbo].[person_widget_definition] CHECK CONSTRAINT [FK6F5C17C4C1F5E0B3]
GO
ALTER TABLE [dbo].[preference]  WITH CHECK ADD  CONSTRAINT [FKA8FCBCDB8656347D] FOREIGN KEY([user_id])
REFERENCES [dbo].[person] ([id])
GO
ALTER TABLE [dbo].[preference] CHECK CONSTRAINT [FKA8FCBCDB8656347D]
GO
ALTER TABLE [dbo].[stack]  WITH CHECK ADD  CONSTRAINT [FK68AC28835014F5F] FOREIGN KEY([default_group_id])
REFERENCES [dbo].[owf_group] ([id])
GO
ALTER TABLE [dbo].[stack] CHECK CONSTRAINT [FK68AC28835014F5F]
GO
ALTER TABLE [dbo].[stack]  WITH CHECK ADD  CONSTRAINT [FK68AC2888656347D] FOREIGN KEY([owner_id])
REFERENCES [dbo].[person] ([id])
GO
ALTER TABLE [dbo].[stack] CHECK CONSTRAINT [FK68AC2888656347D]
GO
ALTER TABLE [dbo].[stack_groups]  WITH CHECK ADD  CONSTRAINT [FK9584AB6B3B197B21] FOREIGN KEY([group_id])
REFERENCES [dbo].[owf_group] ([id])
GO
ALTER TABLE [dbo].[stack_groups] CHECK CONSTRAINT [FK9584AB6B3B197B21]
GO
ALTER TABLE [dbo].[stack_groups]  WITH CHECK ADD  CONSTRAINT [FK9584AB6B6B3A1281] FOREIGN KEY([stack_id])
REFERENCES [dbo].[stack] ([id])
GO
ALTER TABLE [dbo].[stack_groups] CHECK CONSTRAINT [FK9584AB6B6B3A1281]
GO
ALTER TABLE [dbo].[tag_links]  WITH CHECK ADD  CONSTRAINT [FK7C35D6D45A3B441D] FOREIGN KEY([tag_id])
REFERENCES [dbo].[tags] ([id])
GO
ALTER TABLE [dbo].[tag_links] CHECK CONSTRAINT [FK7C35D6D45A3B441D]
GO
ALTER TABLE [dbo].[widget_def_intent]  WITH CHECK ADD  CONSTRAINT [FK8A59D92FD46C6FAB] FOREIGN KEY([widget_definition_id])
REFERENCES [dbo].[widget_definition] ([id])
GO
ALTER TABLE [dbo].[widget_def_intent] CHECK CONSTRAINT [FK8A59D92FD46C6FAB]
GO
ALTER TABLE [dbo].[widget_def_intent]  WITH CHECK ADD  CONSTRAINT [FK8A59D92FD46C6FAC] FOREIGN KEY([intent_id])
REFERENCES [dbo].[intent] ([id])
GO
ALTER TABLE [dbo].[widget_def_intent] CHECK CONSTRAINT [FK8A59D92FD46C6FAC]
GO
ALTER TABLE [dbo].[widget_def_intent_data_types]  WITH CHECK ADD  CONSTRAINT [FK8A59D92FD41A6FAD] FOREIGN KEY([intent_data_type_id])
REFERENCES [dbo].[intent_data_type] ([id])
GO
ALTER TABLE [dbo].[widget_def_intent_data_types] CHECK CONSTRAINT [FK8A59D92FD41A6FAD]
GO
ALTER TABLE [dbo].[widget_def_intent_data_types]  WITH CHECK ADD  CONSTRAINT [FK8A59D92FD46C6FAD] FOREIGN KEY([widget_definition_intent_id])
REFERENCES [dbo].[widget_def_intent] ([id])
GO
ALTER TABLE [dbo].[widget_def_intent_data_types] CHECK CONSTRAINT [FK8A59D92FD46C6FAD]
GO
ALTER TABLE [dbo].[widget_definition_widget_types]  WITH CHECK ADD  CONSTRAINT [FK8A59D92F293A835C] FOREIGN KEY([widget_definition_id])
REFERENCES [dbo].[widget_definition] ([id])
GO
ALTER TABLE [dbo].[widget_definition_widget_types] CHECK CONSTRAINT [FK8A59D92F293A835C]
GO
ALTER TABLE [dbo].[widget_definition_widget_types]  WITH CHECK ADD  CONSTRAINT [FK8A59D92FD46C6F7C] FOREIGN KEY([widget_type_id])
REFERENCES [dbo].[widget_type] ([id])
GO
ALTER TABLE [dbo].[widget_definition_widget_types] CHECK CONSTRAINT [FK8A59D92FD46C6F7C]
GO
USE [master]
GO
ALTER DATABASE [owf-new] SET  READ_WRITE
GO
