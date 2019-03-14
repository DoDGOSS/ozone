package ozone.owf.grails.controllers

import java.lang.reflect.UndeclaredThrowableException

import grails.converters.JSON
import grails.validation.ValidationException
import grails.web.JSONBuilder

import org.springframework.http.HttpStatus

import ozone.owf.grails.OwfException
import ozone.owf.grails.services.ServiceModelService


class BaseOwfRestController {

    ServiceModelService serviceModelService

    protected getJsonResult(result, targetProperty, params) {
		def hasTargetProperty = result.containsKey(targetProperty)

		// I think it should be null even if the property doesn't exist but am afraid that that may break existing error-functionality somewhere
		def resultObject = hasTargetProperty ? null : result // just the initial value

		def jsonObject = result.get(targetProperty)
		if (jsonObject != null) {
			resultObject = serviceModelService.createServiceModel( jsonObject )
		}

        if (params.isExtAjaxFormat != null && params.isExtAjaxFormat == 'true') {
            return [success: result.success, data: resultObject] as JSON
        } else {
            return resultObject as JSON
        }
    }

    protected  def handleError(ValidationException ve) {
        return [msg: getFieldErrorsAsJSON(ve.errors), status: 500]
    }

    protected  def handleError(UndeclaredThrowableException e) {
        return handleError(e.cause)
    }

    protected def handleError(Throwable e) {
        log.error(e.message, e)
        def message = [:]
        message['success'] = false
        message['errorMsg'] = e.message
        return [msg: message as JSON, status: 500]
    }

    protected def handleError(OwfException owe) {
        // TODO: Throws exception when run during integration tests.
        // logException(owe)

        String message = owe.message?.encodeAsHTML()

        def result = [success : false,
                      errorMsg: "${owe.exceptionType.generalMessage} ${message}"]

        return [msg: result as JSON, status: owe.exceptionType.normalReturnCode]
    }

    private void logException(OwfException owe) {
        log.error(owe.message, owe)

        if ('INFO' == owe.logLevel) {
            log.info(owe)
        } else if ('DEBUG' == owe.logLevel) {
            log.debug(owe)
        } else {
            log.error(owe, owe)
        }
    }

    protected renderResult(Map res) {
        response.status = res.status
        if (isWindowname()) {
            render(view: '/show-windowname', model: [value: res.msg, status: res.status])
        } else {
            render res.msg
        }
    }

    protected renderResult(Object result, HttpStatus status) {
        renderResult(result, status.value())
    }

    protected renderResult(Object result, int statusCode) {
        response.status = statusCode

        if (result instanceof GString || result instanceof String) {
            result = '"' + result.replaceAll(/"/, /\\"/) + '"'
        }

        if (isWindowname()) {
            render(view: '/show-windowname', model: [value: result, status: statusCode])
        } else {
            render result
        }
    }

    // test if the window name transport is being used
    protected isWindowname() {
        return (params['windowname'] == 'true')
    }

    protected def getFieldErrorsAsJSON(errs) {
        if (!errs) return ''
        def sw = new StringWriter()

        def jb = new JSONBuilder()
        jb.build {
            success(false)
            errorMsg('Field  Validation error!')
            errors {
                errs.each { error ->
                    def fe = error.getFieldError()
                    def arguments = Arrays.asList(fe.getArguments());
                    errors(id: fe.getField(), msg: message(code: fe.getCode(), args: arguments, 'default': fe.getDefaultMessage()))
                }
            }
        }
        jb.toString()
    }

}
