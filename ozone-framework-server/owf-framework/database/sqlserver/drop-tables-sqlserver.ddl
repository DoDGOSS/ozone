USE [owf-new];
DROP TABLE databasechangelog;
GO
DROP TABLE databasechangeloglock;
GO

DROP TABLE tag_links;
GO
DROP TABLE tags;
GO
-- requires: n/a
DROP TABLE application_configuration;
GO
DROP TABLE domain_mapping;
GO

-- requires: intent, intent_data_type
DROP TABLE intent_data_types;
GO

-- requires: owf_group, person
DROP TABLE owf_group_people;
GO


-- requires: person
DROP TABLE preference;
GO
DROP TABLE dashboard;
GO

-- requires: person, role
DROP TABLE person_role;
GO



-- requires: widget_definition, person
DROP TABLE person_widget_definition;
GO


-- requires: intent_data_type, widget_def_intent
DROP TABLE widget_def_intent_data_types;
GO

-- requires: widget_definition, widget_type
DROP TABLE widget_definition_widget_types;
GO

-- requires: intent, widget_definition
DROP TABLE widget_def_intent;
GO

-- requires: n/a
DROP TABLE requestmap;
GO

-- requires: stack, owf_group
DROP TABLE stack_groups;
GO

-- requires: owf_group, person
DROP TABLE stack;
GO


-- requires: n/a
DROP TABLE intent;
GO
DROP TABLE intent_data_type;
GO
DROP TABLE owf_group;
GO
DROP TABLE person;
GO
DROP TABLE role;
GO
DROP TABLE widget_definition;
GO
DROP TABLE widget_type;
GO

-- Only used for Postgres. Must be commneted out for other DBs
-- DROP SEQUENCE hibernate_sequence;