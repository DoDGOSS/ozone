/*
 *  Copyright (c) 2017 Next Century Corporation
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.ozoneplatform.auditing

import grails.plugins.*

class OzoneAuditingGrailsPlugin extends Plugin {

    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "3.3.0 > *"

    // the other plugins this plugin depends on
    def dependsOn = [:]

    // resources that are excluded from plugin packaging
    def pluginExcludes = []

    def title = "OZONE Auditing plugin"
    def description = '''\\
Common auditing components.
'''

    def author = "OZONE Team"
    def authorEmail = "goss-support@owfgoss.org"

    // URL to the plugin's documentation
    def documentation = ""

    Closure doWithSpring() { {->
        // TODO Implement runtime spring config (optional)
    } }

    void doWithDynamicMethods() {
        // TODO Implement registering dynamic methods to classes (optional)
    }

    void doWithApplicationContext() {
        // TODO Implement post initialization spring config (optional)
    }

    void onChange(Map<String, Object> event) {
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    void onConfigChange(Map<String, Object> event) {
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }

    void onShutdown(Map<String, Object> event) {
        // TODO Implement code that is executed when the application shuts down (optional)
    }

}
