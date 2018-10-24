package ozone.owf.filter

import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.util.regex.Pattern

import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter


@Component
class UnsecureRequestFilter extends OncePerRequestFilter {

    private static DEFAULT_REDIRECT_URL = "https://localhost:8443/owf/"

    private String redirectTargetUrl = DEFAULT_REDIRECT_URL

    private List<String> insecureUris = new ArrayList<>()
    private List<Pattern> insecureUriPatterns = new ArrayList<>()

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException
    {
        String requestUrl = request.getRequestURL().toString()
        String requestUri = request.getRequestURI()

        if (requestUrl.startsWith("http://") && isSecuredUri(requestUri)) {
            response.sendRedirect(this.redirectTargetUrl)
        }
        else {
            filterChain.doFilter(request, response)
        }
    }

    protected boolean isSecuredUri(String requestUri) {
        if (insecureUriPatterns.isEmpty()) return true

        for (Pattern pattern : insecureUriPatterns) {
            if (pattern.matcher(requestUri).matches()) {
                return false
            }
        }

        return true
    }

    String getRedirectTargetUrl() {
        return redirectTargetUrl
    }

    void setRedirectTargetUrl(String redirectTargetUrl) {
        this.redirectTargetUrl = redirectTargetUrl ?: DEFAULT_REDIRECT_URL
    }

    List<String> getInsecureUris() {
        return insecureUris
    }

    void setInsecureUris(List<String> insecureUris) {
        this.insecureUris = insecureUris ?: new ArrayList<>()
        this.insecureUriPatterns = new ArrayList<>()

        for (String uriPattern : this.insecureUris) {
            if (uriPattern != null) {
                this.insecureUriPatterns.add(Pattern.compile(uriPattern))
            }
        }
    }

}
