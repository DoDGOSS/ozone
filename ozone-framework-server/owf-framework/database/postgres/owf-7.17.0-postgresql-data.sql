--- application_configuration
  --- depends on: n/a
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (1, 0, 1, 'Enable CEF Logging', null, 'owf.enable.cef.logging', null, 'false', 'Boolean', 'AUDITING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (2, 0, 2, 'Enable CEF Object Access Logging', null, 'owf.enable.cef.object.access.logging', null, 'false', 'Boolean', 'AUDITING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (3, 0, 3, 'Enable CEF Sweep Log', null, 'owf.enable.cef.log.sweep', null, 'false', 'Boolean', 'AUDITING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (4, 0, 4, 'CEF Log Location', null, 'owf.cef.log.location', null, '/usr/share/tomcat6', 'String', 'AUDITING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (5, 0, 5, 'CEF Sweep Log Location', null, 'owf.cef.sweep.log.location', null, '/var/log/cef', 'String', 'AUDITING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (6, 0, 6, 'Security Level', null, 'owf.security.level', null, null, 'String', 'AUDITING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (7, 0, 1, 'Enable Session Control', null, 'owf.session.control.enabled', 'Session Control', 'false', 'Boolean', 'USER_ACCOUNT_SETTINGS', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (8, 0, 2, 'Max Concurrent Sessions', null, 'owf.session.control.max.concurrent', 'Session Control', '1', 'Integer', 'USER_ACCOUNT_SETTINGS', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (9, 0, 1, 'Disable Inactive Accounts', null, 'owf.disable.inactive.accounts', 'Inactive Accounts', 'true', 'Boolean', 'USER_ACCOUNT_SETTINGS', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (10, 0, 2, 'Account Inactivity Threshold', null, 'owf.inactivity.threshold', 'Inactive Accounts', '90', 'Integer', 'USER_ACCOUNT_SETTINGS', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (11, 0, 1, 'Disable Accounts Job Start Time', null, 'owf.job.disable.accounts.start.time', null, '23:59:59', 'String', 'HIDDEN', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (12, 0, 2, 'Disable Accounts Job Interval', null, 'owf.job.disable.accounts.interval', null, '1440', 'Integer', 'HIDDEN', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (13, 0, 1, 'Warning Banner Content', null, 'free.warning.content', null, null, 'String', 'BRANDING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (14, 0, 1, 'Custom Background URL', null, 'owf.custom.background.url', 'Custom Background', null, 'String', 'BRANDING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (15, 0, 1, 'Custom Header URL', null, 'owf.custom.header.url', 'Custom Header and Footer', null, 'String', 'BRANDING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (16, 0, 2, 'Custom Header Height', null, 'owf.custom.header.height', 'Custom Header and Footer', '0', 'Integer', 'BRANDING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (17, 0, 3, 'Custom Footer URL', null, 'owf.custom.footer.url', 'Custom Header and Footer', null, 'String', 'BRANDING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (18, 0, 4, 'Custom Footer Height', null, 'owf.custom.footer.height', 'Custom Header and Footer', '0', 'Integer', 'BRANDING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (19, 0, 5, 'Custom CSS', null, 'owf.custom.css', 'Custom Header and Footer', null, 'String', 'BRANDING', null, true);
INSERT INTO public.application_configuration (id, version, sub_group_order, title, help, code, sub_group_name, value, type, group_name, description, mutable) VALUES (20, 0, 6, 'Custom Javascript', null, 'owf.custom.jss', 'Custom Header and Footer', null, 'String', 'BRANDING', null, true);


--- owf_group
  --- depends on: [stack]
INSERT INTO public.owf_group (id, version, stack_id, display_name, stack_default, name, status, description, email, automatic) VALUES (23, 0, null, 'OWF Administrators', false, 'OWF Administrators', 'active', 'OWF Administrators', null, true);
INSERT INTO public.owf_group (id, version, stack_id, display_name, stack_default, name, status, description, email, automatic) VALUES (24, 0, null, 'OWF Users', false, 'OWF Users', 'active', 'OWF Users', null, true);


--- role
  --- depends on: n/a
INSERT INTO public.role (id, version, authority, description) VALUES (21, 0, 'ROLE_ADMIN', 'Admin Role');
INSERT INTO public.role (id, version, authority, description) VALUES (22, 0, 'ROLE_USER', 'User Role');


--- person
  --- depends on: n/a
INSERT INTO public.person (id, version, user_real_name, last_notification, requires_sync, prev_login, email_show, username, enabled, description, email, last_login) VALUES (25, 0, 'Test Administrator 1', null, false, null, false, 'testAdmin1', true, 'Test Administrator 1', 'testAdmin1@ozone.test', null);
INSERT INTO public.person (id, version, user_real_name, last_notification, requires_sync, prev_login, email_show, username, enabled, description, email, last_login) VALUES (26, 0, 'Test User 1', null, false, null, false, 'testUser1', true, 'Test User 1', 'testUser1@ozone.test', null);


--- person_role
  --- depends on: person, role
INSERT INTO public.person_role (person_authorities_id, role_id) VALUES (25, 22);
INSERT INTO public.person_role (person_authorities_id, role_id) VALUES (25, 21);
INSERT INTO public.person_role (person_authorities_id, role_id) VALUES (26, 22);


--- preference
  --- depends on: person
INSERT INTO public.preference (id, version, path, namespace, value, user_id) VALUES (27, 0, 'guid_to_launch', 'owf.admin.UserEditCopy', 'a9bf8e71-692d-44e3-a465-5337ce5e725e', 25);
INSERT INTO public.preference (id, version, path, namespace, value, user_id) VALUES (28, 0, 'guid_to_launch', 'owf.admin.WidgetEditCopy', '679294b3-ccc3-4ace-a061-e3f27ed86451', 25);
INSERT INTO public.preference (id, version, path, namespace, value, user_id) VALUES (29, 0, 'guid_to_launch', 'owf.admin.GroupEditCopy', 'dc5c2062-aaa8-452b-897f-60b4b55ab564', 25);
INSERT INTO public.preference (id, version, path, namespace, value, user_id) VALUES (30, 0, 'guid_to_launch', 'owf.admin.DashboardEditCopy', '2445afb9-eb3f-4b79-acf8-6b12180921c3', 25);
INSERT INTO public.preference (id, version, path, namespace, value, user_id) VALUES (31, 0, 'guid_to_launch', 'owf.admin.StackEditCopy', '72c382a3-89e7-4abf-94db-18db7779e1df', 25);


--- stack
  --- depends on: owf_group, person
INSERT INTO public.stack (id, version, owner_id, stack_context, default_group_id, unique_widget_count, name, approved, image_url, descriptor_url, description) VALUES (67, 0, null, 'ef8b5d6f-4b16-4743-9a57-31683c94b616', 23, 5, 'Administration', true, 'themes/common/images/admin/64x64_admin_app.png', null, 'This application collects the administrative components into a common set of application pages for managing system resources.  These pages can be used to create, modify, update, and delete Apps, App Components, Users and Groups, and system configuration settings.');
INSERT INTO public.stack (id, version, owner_id, stack_context, default_group_id, unique_widget_count, name, approved, image_url, descriptor_url, description) VALUES (68, 0, null, 'investments', 24, 6, 'Investments', true, null, null, 'Sample app containing example investment pages.');
INSERT INTO public.stack (id, version, owner_id, stack_context, default_group_id, unique_widget_count, name, approved, image_url, descriptor_url, description) VALUES (69, 0, null, '908d934d-9d53-406c-8143-90b406fb508f', 24, 2, 'Sample', true, null, null, null);


--- stack_groups
  --- depends on: stack, group
INSERT INTO public.stack_groups (group_id, stack_id) VALUES (23, 67);
INSERT INTO public.stack_groups (group_id, stack_id) VALUES (24, 68);
INSERT INTO public.stack_groups (group_id, stack_id) VALUES (24, 69);


--- dashboard
  --- depends on: person, stack


--- intent
  --- depends on: n/a
INSERT INTO public.intent (id, version, action) VALUES (71, 0, 'Graph');
INSERT INTO public.intent (id, version, action) VALUES (73, 0, 'View');


--- intent_data_type
  --- depends on: n/a
INSERT INTO public.intent_data_type (id, version, data_type) VALUES (70, 0, 'application/vnd.owf.sample.price');
INSERT INTO public.intent_data_type (id, version, data_type) VALUES (72, 0, 'text/html');


--- intent_data_types
  --- depends on: intent, intent_data_type
INSERT INTO public.intent_data_types (intent_id, intent_data_type_id) VALUES (71, 70);
INSERT INTO public.intent_data_types (intent_id, intent_data_type_id) VALUES (73, 72);


--- widget_type
  --- depends on: n/a
INSERT INTO public.widget_type (id, version, name, display_name) VALUES (32, 0, 'standard', 'standard');
INSERT INTO public.widget_type (id, version, name, display_name) VALUES (33, 0, 'administration', 'administration');
INSERT INTO public.widget_type (id, version, name, display_name) VALUES (34, 0, 'marketplace', 'store');
INSERT INTO public.widget_type (id, version, name, display_name) VALUES (35, 0, 'metric', 'metric');
INSERT INTO public.widget_type (id, version, name, display_name) VALUES (36, 0, 'fullscreen', 'fullscreen');


--- widget_definition
  --- depends on: n/a
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (37, 0, 581, 'themes/common/images/adm-tools/Widgets64.png', false, 'org.ozoneplatform.owf.admin.appcomponentedit', 'App Component Editor', '679294b3-ccc3-4ace-a061-e3f27ed86451', false, '1.0', 440, false, 'admin/WidgetEdit', 'themes/common/images/adm-tools/Widgets24.png', null, '', false);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (38, 0, 818, 'themes/common/images/adm-tools/Widgets64.png', false, 'org.ozoneplatform.owf.admin.appcomponentmanagement', 'App Components', '48edfe94-4291-4991-a648-c19a903a663b', false, '1.0', 440, false, 'admin/WidgetManagement', 'themes/common/images/adm-tools/Widgets24.png', null, '', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (39, 0, 581, 'themes/common/images/adm-tools/Groups64.png', false, 'org.ozoneplatform.owf.admin.groupedit', 'Group Editor', 'dc5c2062-aaa8-452b-897f-60b4b55ab564', false, '1.0', 440, false, 'admin/GroupEdit', 'themes/common/images/adm-tools/Groups24.png', null, '', false);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (40, 0, 818, 'themes/common/images/adm-tools/Groups64.png', false, 'org.ozoneplatform.owf.admin.groupmanagement', 'Groups', '53a2a879-442c-4012-9215-a17604dedff7', false, '1.0', 440, false, 'admin/GroupManagement', 'themes/common/images/adm-tools/Groups24.png', null, '', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (41, 0, 581, 'themes/common/images/adm-tools/Users64.png', false, 'org.ozoneplatform.owf.admin.useredit', 'User Editor', 'a9bf8e71-692d-44e3-a465-5337ce5e725e', false, '1.0', 440, false, 'admin/UserEdit', 'themes/common/images/adm-tools/Users24.png', null, '', false);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (42, 0, 818, 'themes/common/images/adm-tools/Users64.png', false, 'org.ozoneplatform.owf.admin.usermanagement', 'Users', '38070c45-5f6a-4460-810c-6e3496495ec4', false, '1.0', 440, false, 'admin/UserManagement', 'themes/common/images/adm-tools/Users24.png', null, '', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (43, 0, 900, 'themes/common/images/adm-tools/Configuration64.png', false, 'org.ozoneplatform.owf.admin.configuration', 'Configuration', 'af180bfc-3924-4111-93de-ad6e9bfc060e', false, '1.0', 440, false, 'admin/Configuration', 'themes/common/images/adm-tools/Configuration24.png', null, '', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (44, 0, 581, 'themes/common/images/adm-tools/Stacks64.png', false, 'org.ozoneplatform.owf.admin.appedit', 'App Editor', '72c382a3-89e7-4abf-94db-18db7779e1df', false, '1.0', 440, false, 'admin/StackEdit', 'themes/common/images/adm-tools/Stacks24.png', null, '', false);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (45, 0, 818, 'themes/common/images/adm-tools/Stacks64.png', false, 'org.ozoneplatform.owf.admin.appmanagement', 'Apps', '391dd2af-a207-41a3-8e51-2b20ec3e7241', false, '1.0', 440, false, 'admin/StackManagement', 'themes/common/images/adm-tools/Stacks24.png', null, '', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (46, 0, 581, 'themes/common/images/adm-tools/Dashboards64.png', false, 'org.ozoneplatform.owf.admin.pageedit', 'Page Editor', '2445afb9-eb3f-4b79-acf8-6b12180921c3', false, '1.0', 440, false, 'admin/DashboardEdit', 'themes/common/images/adm-tools/Dashboards24.png', null, '', false);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (74, 0, 295, 'static/themes/common/images/widget-icons/ChannelShouter.png', false, 'org.owfgoss.owf.examples.ChannelShouter', 'Channel Shouter', 'c2a75b26-64c4-43b0-81ba-995f628c0166', false, '1.0', 250, false, 'widgets/channel_shouter', 'static/themes/common/images/widget-icons/ChannelShouter.png', null, 'Broadcast a message on a specified channel.', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (75, 0, 540, 'static/themes/common/images/widget-icons/ChannelListener.png', false, 'org.owfgoss.owf.examples.ChannelListener', 'Channel Listener', '4c89a118-d53b-4a31-84b5-32a874e72ba0', false, '1.0', 440, false, 'widgets/channel_listener', 'static/themes/common/images/widget-icons/ChannelListener.png', null, 'Receive a message on a specified channel.', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (76, 0, 300, 'static/themes/common/images/widget-icons/ColorServer.png', false, 'org.owfgoss.owf.examples.ColorServer', 'Color Server', 'fe454def-f43c-4b64-98c5-64ca0968850f', false, '1.0', 300, false, 'widgets/color_server', 'static/themes/common/images/widget-icons/ColorServer.png', null, 'Simple eventing example that works in tandem with Color Client.', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (77, 0, 300, 'static/themes/common/images/widget-icons/ColorClient.png', false, 'org.owfgoss.owf.examples.ColorClient', 'Color Client', '11d0637b-e841-4316-b4fb-73ac0a2c7df6', false, '1.0', 300, false, 'widgets/color_client', 'static/themes/common/images/widget-icons/ColorClient.png', null, 'Simple eventing example that works in tandem with Color Server.', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (78, 0, 540, 'static/themes/common/images/widget-icons/WidgetLog.png', false, 'org.owfgoss.owf.examples.WidgetLog', 'Widget Log', '5035c340-74c1-423a-9146-dea69c8a57b5', false, '1.0', 440, false, 'widgets/widget_log', 'static/themes/common/images/widget-icons/WidgetLog.png', null, 'Display log messages from widgets with logging enabled.', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (79, 0, 540, 'static/themes/common/images/widget-icons/WidgetChrome.png', false, 'org.owfgoss.owf.examples.WidgetChrome', 'Widget Chrome', '2073d230-3a13-4226-a705-68a012fd21f0', false, '1.0', 440, false, 'widgets/widget_chrome', 'static/themes/common/images/widget-icons/WidgetChrome.png', null, 'Example that utilizes the Widget Chrome API', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (80, 0, 450, 'static/themes/common/images/widget-icons/Preferences.png', false, 'org.owfgoss.owf.examples.Preferences', 'Preferences', 'abb9f0df-0d78-4144-bdcf-9ed1a5442adc', false, '1.0', 300, false, 'widgets/preferences', 'static/themes/common/images/widget-icons/Preferences.png', null, 'Example that utilizes the Preferences API', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (81, 0, 500, 'static/themes/common/images/widget-icons/EventMonitor.png', false, 'org.owfgoss.owf.examples.EventMonitor', 'Event Monitor Widget', 'e280bacf-7332-429c-b265-76fbf73a55be', false, '1.0', 600, false, 'widgets/event_monitor', 'static/themes/common/images/widget-icons/EventMonitor.png', null, 'Example that utilizes the Eventing API.', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (82, 0, 400, 'static/themes/common/images/widget-icons/HTMLViewer.png', false, 'org.owfgoss.owf.examples.HTMLViewer', 'HTML Viewer', '62a0cbee-13b7-4188-9b87-9d79771e5551', false, '1.0', 600, false, 'widgets/html_viewer', 'static/themes/common/images/widget-icons/HTMLViewer.png', null, 'This app component displays HTML.', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (84, 0, 825, 'static/themes/common/images/widget-icons/NYSEStock.png', false, 'org.owfgoss.owf.examples.NYSE', 'NYSE Widget', 'bdb48ce5-134c-43ab-aa86-5522d6ae6eff', false, '1.0', 437, false, 'widgets/nyse', 'static/themes/common/images/widget-icons/NYSEStock.png', null, 'This app component displays the end of day report for the New York Stock Exchange.', true);
INSERT INTO public.widget_definition (id, version, width, image_url_medium, singleton, universal_name, display_name, widget_guid, mobile_ready, widget_version, height, background, widget_url, image_url_small, descriptor_url, description, visible) VALUES (87, 0, 800, 'static/themes/common/images/widget-icons/PriceChart.png', false, 'org.owfgoss.owf.examples.StockChart', 'Stock Chart', 'f7967903-c352-42ab-948c-d3bcdb632b7d', false, '1.0', 600, false, 'widgets/stock_chart', 'static/themes/common/images/widget-icons/PriceChart.png', null, 'This app component charts stock prices.', true);


--- widget_definition_widget_types
  --- depends on: widget_definition, widget_type
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (33, 37);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (33, 38);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (33, 39);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (33, 40);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (33, 41);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (33, 42);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (33, 43);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (33, 44);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (33, 45);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (33, 46);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 74);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 75);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 76);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 77);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 78);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 79);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 80);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 81);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 82);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 84);
INSERT INTO public.widget_definition_widget_types (widget_type_id, widget_definition_id) VALUES (32, 87);


--- widget_def_intent
  -- depends on: intent, widget_definition
INSERT INTO public.widget_def_intent (id, version, intent_id, send, widget_definition_id, receive) VALUES (83, 0, 73, false, 82, true);
INSERT INTO public.widget_def_intent (id, version, intent_id, send, widget_definition_id, receive) VALUES (85, 0, 71, true, 84, false);
INSERT INTO public.widget_def_intent (id, version, intent_id, send, widget_definition_id, receive) VALUES (86, 0, 73, true, 84, false);
INSERT INTO public.widget_def_intent (id, version, intent_id, send, widget_definition_id, receive) VALUES (88, 0, 71, false, 87, true);


--- widget_def_intent_data_types
  -- depends on: intent_data_type, widget_def_intent
INSERT INTO public.widget_def_intent_data_types (widget_definition_intent_id, intent_data_type_id) VALUES (83, 72);
INSERT INTO public.widget_def_intent_data_types (widget_definition_intent_id, intent_data_type_id) VALUES (85, 70);
INSERT INTO public.widget_def_intent_data_types (widget_definition_intent_id, intent_data_type_id) VALUES (86, 72);
INSERT INTO public.widget_def_intent_data_types (widget_definition_intent_id, intent_data_type_id) VALUES (88, 70);


--- domain_mapping
  --- depends on: n/a
INSERT INTO public.domain_mapping (id, version, relationship_type, dest_type, src_id, src_type, dest_id) VALUES (47, 0, 'owns', 'widget_definition', 23, 'group', 37);
INSERT INTO public.domain_mapping (id, version, relationship_type, dest_type, src_id, src_type, dest_id) VALUES (48, 0, 'owns', 'widget_definition', 23, 'group', 38);
INSERT INTO public.domain_mapping (id, version, relationship_type, dest_type, src_id, src_type, dest_id) VALUES (49, 0, 'owns', 'widget_definition', 23, 'group', 39);
INSERT INTO public.domain_mapping (id, version, relationship_type, dest_type, src_id, src_type, dest_id) VALUES (50, 0, 'owns', 'widget_definition', 23, 'group', 40);
INSERT INTO public.domain_mapping (id, version, relationship_type, dest_type, src_id, src_type, dest_id) VALUES (51, 0, 'owns', 'widget_definition', 23, 'group', 41);
INSERT INTO public.domain_mapping (id, version, relationship_type, dest_type, src_id, src_type, dest_id) VALUES (52, 0, 'owns', 'widget_definition', 23, 'group', 42);
INSERT INTO public.domain_mapping (id, version, relationship_type, dest_type, src_id, src_type, dest_id) VALUES (53, 0, 'owns', 'widget_definition', 23, 'group', 43);
INSERT INTO public.domain_mapping (id, version, relationship_type, dest_type, src_id, src_type, dest_id) VALUES (54, 0, 'owns', 'widget_definition', 23, 'group', 44);
INSERT INTO public.domain_mapping (id, version, relationship_type, dest_type, src_id, src_type, dest_id) VALUES (55, 0, 'owns', 'widget_definition', 23, 'group', 45);
INSERT INTO public.domain_mapping (id, version, relationship_type, dest_type, src_id, src_type, dest_id) VALUES (56, 0, 'owns', 'widget_definition', 23, 'group', 46);


--- person_widget_definition
  --- depends on: person, widget_definition
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (57, 0, 0, false, false, false, 37, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (58, 0, 1, false, false, false, 38, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (59, 0, 2, false, false, false, 39, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (60, 0, 3, false, false, false, 40, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (61, 0, 4, false, false, false, 41, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (62, 0, 5, false, false, false, 42, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (63, 0, 6, false, false, false, 43, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (64, 0, 7, false, false, false, 44, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (65, 0, 8, false, false, false, 45, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (66, 0, 9, false, false, false, 46, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (89, 0, 0, false, false, false, 74, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (90, 0, 1, false, false, false, 75, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (91, 0, 2, false, false, false, 76, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (92, 0, 3, false, false, false, 77, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (93, 0, 4, false, false, false, 78, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (94, 0, 5, false, false, false, 79, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (95, 0, 6, false, false, false, 80, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (96, 0, 7, false, false, false, 81, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (97, 0, 8, false, false, false, 82, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (98, 0, 9, false, false, false, 84, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (99, 0, 10, false, false, false, 87, null, 25, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (100, 0, 0, false, false, false, 74, null, 26, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (101, 0, 1, false, false, false, 75, null, 26, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (102, 0, 2, false, false, false, 76, null, 26, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (103, 0, 3, false, false, false, 77, null, 26, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (104, 0, 4, false, false, false, 78, null, 26, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (105, 0, 5, false, false, false, 79, null, 26, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (106, 0, 6, false, false, false, 80, null, 26, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (107, 0, 7, false, false, false, 81, null, 26, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (108, 0, 8, false, false, false, 82, null, 26, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (109, 0, 9, false, false, false, 84, null, 26, false, true);
INSERT INTO public.person_widget_definition (id, version, pwd_position, favorite, user_widget, disabled, widget_definition_id, display_name, person_id, group_widget, visible) VALUES (110, 0, 10, false, false, false, 87, null, 26, false, true);
