package ozone.security

import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import grails.gorm.transactions.Transactional
import org.grails.web.json.JSONObject

import org.springframework.security.core.Authentication
import org.springframework.security.web.WebAttributes
import org.springframework.security.web.authentication.AuthenticationSuccessHandler

import ozone.owf.grails.services.AccountService


class OzoneAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    AccountService accountService;

    @Override
    @Transactional
    void onAuthenticationSuccess(HttpServletRequest request,
                                 HttpServletResponse response,
                                 Authentication authentication) throws ServletException, IOException
    {

        def user = accountService.getLoggedInUser()
        if (!user) {
            def username = accountService.getLoggedInUsername()
            def content = new JSONObject([errors: [[status: "404",
                                                    title : "Not Found",
                                                    detail: "User not found for username '$username'"]]])

            response.setContentType("application/json;charset=UTF-8")
            response.writer.write(content.toString())
            response.status = 400
            clearAuthenticationAttributes(request);
            return
        }

        def content = accountService.getLoggedInUserDetails()

        response.setContentType("application/json;charset=UTF-8")
        response.writer.write(content.toString())
        response.status = 200
        clearAuthenticationAttributes(request);
    }

    static void clearAuthenticationAttributes(HttpServletRequest request) {
        request.getSession(false)?.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION)
    }

}
