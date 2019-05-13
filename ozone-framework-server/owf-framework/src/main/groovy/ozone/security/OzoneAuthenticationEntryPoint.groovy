package ozone.security

import groovy.transform.CompileStatic
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.*
import org.springframework.security.web.util.RedirectUrlBuilder
import org.springframework.security.web.util.UrlUtils
import org.springframework.util.Assert
import org.springframework.web.util.UrlPathHelper

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@CompileStatic
final class OzoneAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private String redirectUrl

    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy()

    private PortResolver portResolver = new PortResolverImpl()

    private UrlPathHelper urlPathHelper = new UrlPathHelper()

    OzoneAuthenticationEntryPoint() {
    }

    OzoneAuthenticationEntryPoint(String redirectUrl) {
        setRedirectUrl(redirectUrl)
    }

    void setRedirectUrl(String redirectUrl) {
        Assert.isTrue(UrlUtils.isValidRedirectUrl(redirectUrl), "'$redirectUrl' is not a valid redirect URL")
        this.redirectUrl = redirectUrl
    }

    @Override
    void commence(final HttpServletRequest request,
                  final HttpServletResponse response,
                  final AuthenticationException authException) throws IOException
    {

        String localPath = urlPathHelper.getPathWithinApplication(request)

        if (localPath == "/") {
            String redirectUrl = buildRedirectUrl(request)
            redirectStrategy.sendRedirect(request, response, redirectUrl)
            return
        }

        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
    }

    protected String buildRedirectUrl(HttpServletRequest request) {
        if (UrlUtils.isAbsoluteUrl(redirectUrl)) {
            return redirectUrl
        }

        int serverPort = portResolver.getServerPort(request)
        String scheme = request.scheme

        RedirectUrlBuilder urlBuilder = new RedirectUrlBuilder()
        urlBuilder.scheme = scheme
        urlBuilder.serverName = request.serverName
        urlBuilder.port = serverPort
        urlBuilder.contextPath = request.contextPath
        urlBuilder.pathInfo = redirectUrl

        return urlBuilder.url
    }

}
