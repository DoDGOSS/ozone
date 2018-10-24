DROP TABLE databasechangelog;
DROP TABLE databasechangeloglock;


DROP TABLE tag_links CASCADE;
DROP TABLE tags CASCADE;
-- requires: n/a
DROP TABLE application_configuration CASCADE;
DROP TABLE domain_mapping CASCADE;

-- requires: intent, intent_data_type
DROP TABLE intent_data_types CASCADE;

-- requires: owf_group, person
DROP TABLE owf_group_people CASCADE;


-- requires: person
DROP TABLE preference CASCADE;
DROP TABLE dashboard CASCADE;

-- requires: person, role
DROP TABLE person_role CASCADE;



-- requires: widget_definition, person
DROP TABLE person_widget_definition CASCADE;


-- requires: intent_data_type, widget_def_intent
DROP TABLE widget_def_intent_data_types CASCADE;

-- requires: widget_definition, widget_type
DROP TABLE widget_definition_widget_types CASCADE;

-- requires: intent, widget_definition
DROP TABLE widget_def_intent CASCADE;

-- requires: n/a
DROP TABLE requestmap CASCADE;

-- requires: stack, owf_group
DROP TABLE stack_groups CASCADE;

-- requires: owf_group, person
DROP TABLE stack CASCADE;


-- requires: n/a
DROP TABLE intent CASCADE;
DROP TABLE intent_data_type CASCADE;
DROP TABLE owf_group CASCADE;
DROP TABLE person CASCADE;
DROP TABLE role CASCADE;
DROP TABLE widget_definition CASCADE;
DROP TABLE widget_type CASCADE;

-- Only used for Postgres. Must be commneted out for other DBs
-- DROP SEQUENCE hibernate_sequence;