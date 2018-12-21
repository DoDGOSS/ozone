package ozone.owf.grails.controllers

import grails.converters.JSON

import org.springframework.http.HttpStatus

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfInvalidParameterException
import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.DashboardService


class DashboardController extends BaseOwfRestController {

    DashboardService dashboardService

    AccountService accountService

    def modelName = 'dashboard'

    def show() {
        def result = dashboardService.show(params)

        renderResult(result.dashboard as JSON, HttpStatus.OK)
    }

    def list() {
        def result = dashboardService.list(params)
        def jsonResult = [success: result.success, results: result.count, data: result.dashboardList] as JSON

        renderResult(jsonResult, HttpStatus.OK)
    }

    def create() {
        def result = dashboardService.create(params)
        def jsonResult = getJsonResult(result, modelName, params)

        renderResult(jsonResult, HttpStatus.OK)
    }

    def update() {
        def result = dashboardService.update(params)
        def jsonResult = getJsonResult(result, modelName, params)

        renderResult(jsonResult, HttpStatus.OK)
    }

    def createOrUpdate() {
        if (params.data == null) {
            throw new OwfInvalidParameterException("'data' parameter is null")
        }

        // Update Dashboard associations
        if (params.update_action != null && params.update_action != '') {
            params.guid = params.dashboard_id
            def results = dashboardService.addOrRemove(params)
            renderResult([success: true, data: results] as JSON, HttpStatus.OK)
            return
        }

        def results = []
        def dashboards = JSON.parse(params.data)
        dashboards.each {
            def args = [:]

            args['name'] = it.name
            args['guid'] = it.guid
            args['isdefault'] = it.isdefault
            args['locked'] = it.locked

            if (params.user_id != null && params.user_id != '') {
                args['personId'] = params.user_id
            }
            args['description'] = it.description

            args['layoutConfig'] = it.layoutConfig?.toString();

            args['isGroupDashboard'] = params.isGroupDashboard?.toString()?.toBoolean() ?: false

            if (args['isGroupDashboard']) {
                args['dashboardPosition'] = 1;
            }
            else {
                args['dashboardPosition'] = it.dashboardPosition;
            }
            args['adminEnabled'] = params.adminEnabled?.toString()?.toBoolean() ?: false

            //tell service to recreate state ids
            args.regenerateStateIds = true

            def serviceResults = dashboardService.createOrUpdate(args)
            if (serviceResults) {
                results << serviceModelService.
                        createServiceModel(serviceResults.dashboard, [isGroupDashboard: args.isGroupDashboard?.
                                toString()?.toBoolean()])
            }
        }

        renderResult([success: true, data: results] as JSON, HttpStatus.OK)
    }


    def delete() {
        if (params.data == null) {
            def result = dashboardService.delete(params)
            def jsonResult = getJsonResult(result, modelName, params)
            renderResult(jsonResult, HttpStatus.OK)
            return
        }

        def results = []
        def dashboards = JSON.parse(params.data)
        dashboards.each {
            def args = [:]

            args['guid'] = it.guid
            if (it.user_id != null) {
                args['personId'] = it.user_id
            }
            args['isGroupDashboard'] = it.isGroupDashboard
            args['adminEnabled'] = params.adminEnabled ? params.adminEnabled?.toString()?.toBoolean() : false

            def serviceResults = dashboardService.delete(args)
            if (serviceResults) {
                results << serviceModelService.
                        createServiceModel(serviceResults.dashboard, [isGroupDashboard: args.isGroupDashboard?.
                                toString()?.toBoolean()])
            }
        }

        def jsonResult = [success: true, data: results] as JSON
        renderResult(jsonResult, HttpStatus.OK)
    }

    def restore() {
        def result = dashboardService.restore(params)

        renderResult(result as JSON, HttpStatus.OK)
    }

    def bulkDelete() {
        def result = dashboardService.bulkDelete(params)
        def jsonResult = getJsonResult(result, modelName, params)

        renderResult(jsonResult, HttpStatus.OK)
    }

    def bulkDeleteAndUpdate() {
        def jsonResult

        def result = dashboardService.bulkDeleteAndUpdate(params)
        jsonResult = getJsonResult(result, modelName, params)

        renderResult(jsonResult, HttpStatus.OK)
    }

    def bulkUpdate() {
        def result = dashboardService.bulkUpdate(params)
        def jsonResult = getJsonResult(result, modelName, params)

        renderResult(jsonResult, HttpStatus.OK)
    }

    def getdefault() {
        def result = dashboardService.getDefault(params)
        def jsonResult = getJsonResult(result, modelName, params)

        renderResult(jsonResult, HttpStatus.OK)
    }

    def myDashboards() {
        def user = accountService.getLoggedInUser()
        def models = dashboardService.myDashboards(user)

        render([success: true, results: models.size(), data: models*.asJSON()] as JSON)
    }

    def handleOwfException(OwfException ex) {
        def typeMessage = ex.exceptionType.generalMessage
        def typeReturnCode = ex.exceptionType.normalReturnCode

        def message = "Error during ${getActionName()}: ${typeMessage} ${ex.message}"

        renderResult(message, typeReturnCode)
    }

}
