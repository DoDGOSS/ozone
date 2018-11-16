package ozone.owf.grails.controllers


import ozone.owf.grails.services.AccountService


class LoginController {

    static allowedMethods = [showStatus: 'GET']

    AccountService accountService

    def showStatus() {
        def content = accountService.getLoggedInUserDetails()

        render(content)
    }

}
