--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3
-- Dumped by pg_dump version 10.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: application_configuration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.application_configuration (
    id bigint NOT NULL,
    version bigint DEFAULT 0 NOT NULL,
    created_by_id bigint,
    created_date date,
    edited_by_id bigint,
    edited_date date,
    code character varying(250) NOT NULL,
    value character varying(2000),
    title character varying(250) NOT NULL,
    description character varying(2000),
    type character varying(250) NOT NULL,
    group_name character varying(250) NOT NULL,
    sub_group_name character varying(250),
    mutable boolean NOT NULL,
    sub_group_order bigint,
    help character varying(2000)
);


--
-- Name: application_configuration_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.application_configuration_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: application_configuration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.application_configuration_id_seq OWNED BY public.application_configuration.id;


--
-- Name: hibernate_sequence; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hibernate_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboard; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard (
    id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
    version bigint NOT NULL,
    isdefault boolean NOT NULL,
    dashboard_position integer NOT NULL,
    altered_by_admin boolean NOT NULL,
    guid character varying(255) NOT NULL,
    name character varying(200) NOT NULL,
    user_id bigint,
    description character varying(4000),
    created_by_id bigint,
    created_date timestamp with time zone,
    edited_by_id bigint,
    edited_date timestamp with time zone,
    layout_config text,
    locked boolean DEFAULT false,
    stack_id bigint,
    type character varying(255),
    icon_image_url character varying(2083),
    published_to_store boolean,
    marked_for_deletion boolean
);


--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


--
-- Name: domain_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.domain_mapping (
    id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
    version bigint NOT NULL,
    src_id bigint NOT NULL,
    src_type character varying(255) NOT NULL,
    relationship_type character varying(8),
    dest_id bigint NOT NULL,
    dest_type character varying(255) NOT NULL
);


--
-- Name: intent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intent (
    id bigint NOT NULL,
    version bigint NOT NULL,
    action character varying(255) NOT NULL
);


--
-- Name: intent_data_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intent_data_type (
    id bigint NOT NULL,
    version bigint NOT NULL,
    data_type character varying(255) NOT NULL
);


--
-- Name: intent_data_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.intent_data_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intent_data_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.intent_data_type_id_seq OWNED BY public.intent_data_type.id;


--
-- Name: intent_data_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intent_data_types (
    intent_data_type_id bigint NOT NULL,
    intent_id bigint NOT NULL
);


--
-- Name: intent_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.intent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.intent_id_seq OWNED BY public.intent.id;


--
-- Name: owf_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.owf_group (
    id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
    version bigint NOT NULL,
    status character varying(8) NOT NULL,
    email character varying(255),
    description character varying(255),
    name character varying(200) NOT NULL,
    automatic boolean NOT NULL,
    display_name character varying(200),
    stack_default boolean DEFAULT false
);


--
-- Name: owf_group_people; Type: TABLE; Schema: public; Owner: -
--

-- CREATE TABLE public.owf_group_people (
--     group_id bigint NOT NULL,
--     person_id bigint NOT NULL
-- );


--
-- Name: person; Type: TABLE; Schema: public; Owner: -
--

-- CREATE TABLE public.person (
--     id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
--     version bigint NOT NULL,
--     enabled boolean NOT NULL,
--     user_real_name character varying(200) NOT NULL,
--     username character varying(200) NOT NULL,
--     last_login timestamp without time zone,
--     email_show boolean NOT NULL,
--     email character varying(255),
--     prev_login timestamp without time zone,
--     description character varying(255),
--     last_notification timestamp with time zone,
--     requires_sync boolean DEFAULT false
-- );


--
-- Name: person_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_role (
    person_authorities_id bigint,
    role_id bigint
);


--
-- Name: person_widget_definition; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_widget_definition (
    id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
    version bigint NOT NULL,
    person_id bigint NOT NULL,
    visible boolean NOT NULL,
    pwd_position integer NOT NULL,
    widget_definition_id bigint NOT NULL,
    group_widget boolean DEFAULT false,
    favorite boolean DEFAULT false,
    display_name character varying(256),
    disabled boolean DEFAULT false,
    user_widget boolean DEFAULT false
);


--
-- Name: preference; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.preference (
    id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
    version bigint NOT NULL,
    value text NOT NULL,
    path character varying(200) NOT NULL,
    user_id bigint NOT NULL,
    namespace character varying(200) NOT NULL
);


--
-- Name: requestmap; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.requestmap (
    id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
    version bigint NOT NULL,
    url character varying(255) NOT NULL,
    config_attribute character varying(255) NOT NULL
);


--
-- Name: role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role (
    id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
    version bigint NOT NULL,
    authority character varying(255) NOT NULL,
    description character varying(255) NOT NULL
);


--
-- Name: stack; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stack (
    id bigint NOT NULL,
    version bigint NOT NULL,
    name character varying(256) NOT NULL,
    description character varying(4000),
    stack_context character varying(200) NOT NULL,
    image_url character varying(2083),
    descriptor_url character varying(2083),
    unique_widget_count bigint DEFAULT '0'::bigint,
    owner_id bigint,
    approved boolean,
    default_group_id bigint
);


--
-- Name: stack_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stack_groups (
    group_id bigint NOT NULL,
    stack_id bigint NOT NULL
);


--
-- Name: stack_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stack_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stack_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stack_id_seq OWNED BY public.stack.id;


--
-- Name: tag_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tag_links (
    id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
    version bigint NOT NULL,
    pos bigint,
    visible boolean,
    tag_ref bigint NOT NULL,
    tag_id bigint NOT NULL,
    type character varying(255) NOT NULL,
    editable boolean
);


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
    version bigint NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: widget_def_intent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.widget_def_intent (
    id bigint NOT NULL,
    version bigint NOT NULL,
    receive boolean NOT NULL,
    send boolean NOT NULL,
    intent_id bigint NOT NULL,
    widget_definition_id bigint NOT NULL
);


--
-- Name: widget_def_intent_data_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.widget_def_intent_data_types (
    intent_data_type_id bigint NOT NULL,
    widget_definition_intent_id bigint NOT NULL
);


--
-- Name: widget_def_intent_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.widget_def_intent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: widget_def_intent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.widget_def_intent_id_seq OWNED BY public.widget_def_intent.id;


--
-- Name: widget_definition; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.widget_definition (
    id bigint DEFAULT nextval('public.hibernate_sequence'::regclass) NOT NULL,
    version bigint NOT NULL,
    visible boolean NOT NULL,
    image_url_medium character varying(2083) NOT NULL,
    image_url_small character varying(2083) NOT NULL,
    singleton boolean NOT NULL,
    width integer NOT NULL,
    widget_version character varying(2083),
    height integer NOT NULL,
    widget_url character varying(2083) NOT NULL,
    widget_guid character varying(255) NOT NULL,
    display_name character varying(256) NOT NULL,
    background boolean,
    universal_name character varying(255),
    descriptor_url character varying(2083),
    description character varying(4000) DEFAULT ''::character varying,
    mobile_ready boolean DEFAULT false NOT NULL
);


--
-- Name: widget_definition_widget_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.widget_definition_widget_types (
    widget_definition_id bigint NOT NULL,
    widget_type_id bigint NOT NULL
);


--
-- Name: widget_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.widget_type (
    id bigint NOT NULL,
    version bigint NOT NULL,
    name character varying(255) NOT NULL,
    display_name character varying(256) NOT NULL
);


--
-- Name: widget_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.widget_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: widget_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.widget_type_id_seq OWNED BY public.widget_type.id;


--
-- Name: application_configuration id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_configuration ALTER COLUMN id SET DEFAULT nextval('public.application_configuration_id_seq'::regclass);


--
-- Name: intent id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intent ALTER COLUMN id SET DEFAULT nextval('public.intent_id_seq'::regclass);


--
-- Name: intent_data_type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intent_data_type ALTER COLUMN id SET DEFAULT nextval('public.intent_data_type_id_seq'::regclass);


--
-- Name: stack id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stack ALTER COLUMN id SET DEFAULT nextval('public.stack_id_seq'::regclass);


--
-- Name: widget_def_intent id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_def_intent ALTER COLUMN id SET DEFAULT nextval('public.widget_def_intent_id_seq'::regclass);


--
-- Name: widget_type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_type ALTER COLUMN id SET DEFAULT nextval('public.widget_type_id_seq'::regclass);


--
-- Name: application_configuration application_configurationPK; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_configuration
    ADD CONSTRAINT "application_configurationPK" PRIMARY KEY (id);


--
-- Name: application_configuration application_configuration_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_configuration
    ADD CONSTRAINT application_configuration_code_key UNIQUE (code);


--
-- Name: dashboard dashboard_guid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard
    ADD CONSTRAINT dashboard_guid_key UNIQUE (guid);


--
-- Name: dashboard dashboard_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard
    ADD CONSTRAINT dashboard_pkey PRIMARY KEY (id);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: domain_mapping domain_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.domain_mapping
    ADD CONSTRAINT domain_mapping_pkey PRIMARY KEY (id);


--
-- Name: intent intentPK; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intent
    ADD CONSTRAINT "intentPK" PRIMARY KEY (id);


--
-- Name: intent intent_action_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intent
    ADD CONSTRAINT intent_action_key UNIQUE (action);


--
-- Name: intent_data_type intent_data_typePK; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intent_data_type
    ADD CONSTRAINT "intent_data_typePK" PRIMARY KEY (id);


--
-- Name: owf_group_people owf_group_people_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owf_group_people
    ADD CONSTRAINT owf_group_people_pkey PRIMARY KEY (group_id, person_id);


--
-- Name: owf_group owf_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owf_group
    ADD CONSTRAINT owf_group_pkey PRIMARY KEY (id);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: person person_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_username_key UNIQUE (username);


--
-- Name: person_widget_definition person_widget_definition_person_id_widget_definition_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_widget_definition
    ADD CONSTRAINT person_widget_definition_person_id_widget_definition_id_key UNIQUE (person_id, widget_definition_id);


--
-- Name: person_widget_definition person_widget_definition_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_widget_definition
    ADD CONSTRAINT person_widget_definition_pkey PRIMARY KEY (id);


--
-- Name: stack_groups pk_stack_groups; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stack_groups
    ADD CONSTRAINT pk_stack_groups PRIMARY KEY (group_id, stack_id);


--
-- Name: preference preference_path_namespace_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preference
    ADD CONSTRAINT preference_path_namespace_user_id_key UNIQUE (path, namespace, user_id);


--
-- Name: preference preference_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preference
    ADD CONSTRAINT preference_pkey PRIMARY KEY (id);


--
-- Name: requestmap requestmap_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requestmap
    ADD CONSTRAINT requestmap_pkey PRIMARY KEY (id);


--
-- Name: requestmap requestmap_url_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requestmap
    ADD CONSTRAINT requestmap_url_key UNIQUE (url);


--
-- Name: role role_authority_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_authority_key UNIQUE (authority);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: stack stackPK; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stack
    ADD CONSTRAINT "stackPK" PRIMARY KEY (id);


--
-- Name: stack stack_stack_context_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stack
    ADD CONSTRAINT stack_stack_context_key UNIQUE (stack_context);


--
-- Name: tag_links tag_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag_links
    ADD CONSTRAINT tag_links_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: widget_def_intent widget_def_intentPK; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_def_intent
    ADD CONSTRAINT "widget_def_intentPK" PRIMARY KEY (id);


--
-- Name: widget_definition widget_definition_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_definition
    ADD CONSTRAINT widget_definition_pkey PRIMARY KEY (id);


--
-- Name: widget_definition widget_definition_widget_guid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_definition
    ADD CONSTRAINT widget_definition_widget_guid_key UNIQUE (widget_guid);


--
-- Name: widget_definition_widget_types widget_definition_widget_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_definition_widget_types
    ADD CONSTRAINT widget_definition_widget_types_pkey PRIMARY KEY (widget_definition_id, widget_type_id);


--
-- Name: widget_type widget_typePK; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_type
    ADD CONSTRAINT "widget_typePK" PRIMARY KEY (id);


--
-- Name: app_config_group_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX app_config_group_name_idx ON public.application_configuration USING btree (group_name);


--
-- Name: domain_mapping_all; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX domain_mapping_all ON public.domain_mapping USING btree (src_id, src_type, relationship_type, dest_id, dest_type);


--
-- Name: fk68ac2888656347d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fk68ac2888656347d ON public.stack USING btree (owner_id);


--
-- Name: fkfc9c0477666c6d2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fkfc9c0477666c6d2 ON public.application_configuration USING btree (created_by_id);


--
-- Name: fkfc9c047e31cb353; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fkfc9c047e31cb353 ON public.application_configuration USING btree (edited_by_id);


--
-- Name: owf_group_people fk28113703b197b21; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owf_group_people
    ADD CONSTRAINT fk28113703b197b21 FOREIGN KEY (group_id) REFERENCES public.owf_group(id);


--
-- Name: owf_group_people fk2811370c1f5e0b3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owf_group_people
    ADD CONSTRAINT fk2811370c1f5e0b3 FOREIGN KEY (person_id) REFERENCES public.person(id);


--
-- Name: stack fk68ac28835014f5f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stack
    ADD CONSTRAINT fk68ac28835014f5f FOREIGN KEY (default_group_id) REFERENCES public.owf_group(id);


--
-- Name: stack fk68ac2888656347d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stack
    ADD CONSTRAINT fk68ac2888656347d FOREIGN KEY (owner_id) REFERENCES public.person(id);


--
-- Name: person_widget_definition fk6f5c17c4293a835c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_widget_definition
    ADD CONSTRAINT fk6f5c17c4293a835c FOREIGN KEY (widget_definition_id) REFERENCES public.widget_definition(id);


--
-- Name: person_widget_definition fk6f5c17c4c1f5e0b3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_widget_definition
    ADD CONSTRAINT fk6f5c17c4c1f5e0b3 FOREIGN KEY (person_id) REFERENCES public.person(id);


--
-- Name: tag_links fk7c35d6d45a3b441d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag_links
    ADD CONSTRAINT fk7c35d6d45a3b441d FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- Name: intent_data_types fk8a59132fd46c6faa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intent_data_types
    ADD CONSTRAINT fk8a59132fd46c6faa FOREIGN KEY (intent_data_type_id) REFERENCES public.intent_data_type(id);


--
-- Name: widget_definition_widget_types fk8a59d92f293a835c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_definition_widget_types
    ADD CONSTRAINT fk8a59d92f293a835c FOREIGN KEY (widget_definition_id) REFERENCES public.widget_definition(id);


--
-- Name: widget_def_intent_data_types fk8a59d92fd41a6fad; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_def_intent_data_types
    ADD CONSTRAINT fk8a59d92fd41a6fad FOREIGN KEY (intent_data_type_id) REFERENCES public.intent_data_type(id);


--
-- Name: widget_definition_widget_types fk8a59d92fd46c6f7c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_definition_widget_types
    ADD CONSTRAINT fk8a59d92fd46c6f7c FOREIGN KEY (widget_type_id) REFERENCES public.widget_type(id);


--
-- Name: intent_data_types fk8a59d92fd46c6faa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intent_data_types
    ADD CONSTRAINT fk8a59d92fd46c6faa FOREIGN KEY (intent_id) REFERENCES public.intent(id);


--
-- Name: widget_def_intent fk8a59d92fd46c6fab; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_def_intent
    ADD CONSTRAINT fk8a59d92fd46c6fab FOREIGN KEY (widget_definition_id) REFERENCES public.widget_definition(id);


--
-- Name: widget_def_intent fk8a59d92fd46c6fac; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_def_intent
    ADD CONSTRAINT fk8a59d92fd46c6fac FOREIGN KEY (intent_id) REFERENCES public.intent(id);


--
-- Name: widget_def_intent_data_types fk8a59d92fd46c6fad; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_def_intent_data_types
    ADD CONSTRAINT fk8a59d92fd46c6fad FOREIGN KEY (widget_definition_intent_id) REFERENCES public.widget_def_intent(id);


--
-- Name: stack_groups fk9584ab6b3b197b21; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stack_groups
    ADD CONSTRAINT fk9584ab6b3b197b21 FOREIGN KEY (group_id) REFERENCES public.owf_group(id);


--
-- Name: stack_groups fk9584ab6b6b3a1281; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stack_groups
    ADD CONSTRAINT fk9584ab6b6b3a1281 FOREIGN KEY (stack_id) REFERENCES public.stack(id);


--
-- Name: preference fka8fcbcdb8656347d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preference
    ADD CONSTRAINT fka8fcbcdb8656347d FOREIGN KEY (user_id) REFERENCES public.person(id);


--
-- Name: dashboard fkc18aea94372cc5a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard
    ADD CONSTRAINT fkc18aea94372cc5a FOREIGN KEY (created_by_id) REFERENCES public.person(id);


--
-- Name: dashboard fkc18aea946b3a1281; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard
    ADD CONSTRAINT fkc18aea946b3a1281 FOREIGN KEY (stack_id) REFERENCES public.stack(id);


--
-- Name: dashboard fkc18aea947028b8db; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard
    ADD CONSTRAINT fkc18aea947028b8db FOREIGN KEY (edited_by_id) REFERENCES public.person(id);


--
-- Name: dashboard fkc18aea948656347d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard
    ADD CONSTRAINT fkc18aea948656347d FOREIGN KEY (user_id) REFERENCES public.person(id);


--
-- Name: application_configuration fkfc9c0477666c6d2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_configuration
    ADD CONSTRAINT fkfc9c0477666c6d2 FOREIGN KEY (created_by_id) REFERENCES public.person(id);


--
-- Name: application_configuration fkfc9c047e31cb353; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_configuration
    ADD CONSTRAINT fkfc9c047e31cb353 FOREIGN KEY (edited_by_id) REFERENCES public.person(id);


--
-- PostgreSQL database dump complete
--
