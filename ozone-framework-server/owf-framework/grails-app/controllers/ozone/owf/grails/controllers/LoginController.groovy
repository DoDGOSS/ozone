package ozone.owf.grails.controllers


import org.grails.web.json.JSONObject

import ozone.owf.grails.services.AccountService


class LoginController {

    static allowedMethods = [showStatus: 'GET']

    AccountService accountService

    def showStatus() {
        def user = accountService.getLoggedInUser()

        def response = new JSONObject([id         : user.id,
                                       username   : user.username,
                                       displayName: user.userRealName])

        render(response)
    }

}
