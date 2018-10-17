package ozone.security.filters;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;
import ozone.security.SecurityUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * A Spring Security filter that adds a cookie to the response that is intended to last throughout the session.
 * This class should be used in conjunction with the OzoneLogoutCookieHandler class, which destroys the cookie on logout.
 */
public class OzoneCookieFilter extends GenericFilterBean {

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        /*if the user is authenticated, add the cookie that indicates
         * this.  Note that this cookie has minimal actual security impact.
         * It is simply checked client side to prevent the wierd user experience
         * where a user can view a cached copy of the app without having access
         * to actual data
         */
        if (isAuthenticated() && !hasOzoneCookie(resp)) {
            Cookie owfCookie = new Cookie(SecurityUtils.LOGIN_COOKIE_NAME, "true");
            owfCookie.setPath(req.getContextPath());
            owfCookie.setMaxAge(-1);    //session cookie

            resp.addCookie(owfCookie);
        }

        chain.doFilter(req, resp);
    }

    private static boolean isAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return auth != null && auth.isAuthenticated();
    }

    private static boolean hasOzoneCookie(HttpServletResponse response) {
        for (String cookie : response.getHeaders("Set-Cookie")) {
            if (cookie.startsWith(SecurityUtils.LOGIN_COOKIE_NAME))
                return true;
        }
        return false;
    }

}
