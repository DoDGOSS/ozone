DROP TABLE databasechangelog;
DROP TABLE databasechangeloglock;


DROP TABLE tag_links CASCADE CONSTRAINTS;
DROP TABLE tags CASCADE CONSTRAINTS;
-- requires: n/a
DROP TABLE application_configuration CASCADE CONSTRAINTS;
DROP TABLE domain_mapping CASCADE CONSTRAINTS;

-- requires: intent, intent_data_type
DROP TABLE intent_data_types CASCADE CONSTRAINTS;

-- requires: owf_group, person
DROP TABLE owf_group_people CASCADE CONSTRAINTS;


-- requires: person
DROP TABLE preference CASCADE CONSTRAINTS;
DROP TABLE dashboard CASCADE CONSTRAINTS;

-- requires: person, role
DROP TABLE person_role CASCADE CONSTRAINTS;



-- requires: widget_definition, person
DROP TABLE person_widget_definition CASCADE CONSTRAINTS;


-- requires: intent_data_type, widget_def_intent
DROP TABLE widget_def_intent_data_types CASCADE CONSTRAINTS;

-- requires: widget_definition, widget_type
DROP TABLE widget_definition_widget_types CASCADE CONSTRAINTS;

-- requires: intent, widget_definition
DROP TABLE widget_def_intent CASCADE CONSTRAINTS;

-- requires: n/a
DROP TABLE requestmap CASCADE CONSTRAINTS;

-- requires: stack, owf_group
DROP TABLE stack_groups CASCADE CONSTRAINTS;

-- requires: owf_group, person
DROP TABLE stack CASCADE CONSTRAINTS;


-- requires: n/a
DROP TABLE intent CASCADE CONSTRAINTS;
DROP TABLE intent_data_type CASCADE CONSTRAINTS;
DROP TABLE owf_group CASCADE CONSTRAINTS;
DROP TABLE person CASCADE CONSTRAINTS;
DROP TABLE role CASCADE CONSTRAINTS;
DROP TABLE widget_definition CASCADE CONSTRAINTS;
DROP TABLE widget_type CASCADE CONSTRAINTS;
