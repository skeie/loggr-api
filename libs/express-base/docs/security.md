# Security

This section describes bundled security measures.

## Escaping

The Nunjucks template engine is configured to auto escape interpolated variables. In some cases, you want the output to be as-is and avoid the escaping. Use the [safe filter](https://mozilla.github.io/nunjucks/templating.html#safe) to trust the source and avoid escaping. Be aware that doing so opens up a potential XSS -vulnerability, escpecially if the source is user input. If the source is HTML, please consider [sanitizing](https://www.npmjs.com/package/sanitize-html) to whitelist tags before using the `safe` filter.

See also: [A_Positive_XSS_Prevention_Model](https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#A_Positive_XSS_Prevention_Model)

## Headers

Certain security related headers are automatically set on all HTTP responses. Please see `server/lib/middleware/security/headers.js` for the defaults, and [Helmet](https://github.com/helmetjs/helmet) for detailed description for each setting. All settings can be overridden.

## Enforce HTTPS (GET requests)

HTTP GET requests are automatically upgraded to corresponding HTTPS url unless disabled by setting the value of `ENFORCE_HTTPS_ENABLED` to `false`. Since HTTPS is terminated before the request reach the application, the header `X-Secure` (set by the A10 load balancer) is used to determine whether the load balancer saw the request as secure. A request parameter `didRedirect` is added to the url to prevent breaking the application with redirect loops if the header for any reason is removed.

Requests to `/internal-backstage` are excluded.

## Max content length

All requests are verified for content length and requests above 50MB are stopped. To configure the limit, change the `MAX_CONTENT_LENGTH` variable.

## Verifying redirects

Redirects are verified to avoid accidentally sending the user to malicious sites. Redirects to the following locations are always enabled.

* All relative redirects (e.g. /my/subpath).
* To hostnames 0.0.0.0, 127.0.0.1, and localhost.
* To hostnames finn.no, m.finn.no, and www.finn.no.

If you need to add additional hosts to the whitelist, use add the host to the `validateRedirectHostnamesWhitelist` array. Set `VALIDATE_REDIRECT_ENABLED` to `false` to disable verification entirely.

## CSRF protection

Requests are verified using the [csurf](https://github.com/expressjs/csurf) module with a [double submit cookie pattern](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Double_Submit_Cookie).

A request is valid if

- The method is GET, OPTIONS or HEAD

OR

1. A secret is present with the request, AND
2. a CSRF token is present with the request, AND
3. the secret and CSRF token [match](https://github.com/pillarjs/csrf/blob/master/index.js#L120).

The **secret** is stored in a cookie on the client browser after the first response from the server. The secret remains the same throughout the lifetime of the cookie. The **CSRF-token** is stored on each page as a meta tag and must be included in all requests (except those excluded) for the request to be valid. The meta tag is shown just below. Note that the content of this tag is changed on each page load.

```html
<meta name="x-csrf-token" content="43yPdnZO-j622AQP_7yorKjUpg_T1b3Xzm5g"/>
```

The cookie is sent by the browser only when using HTTPS. To disable, set the value of `SECURE_CSRF_COOKIE_ENABLED` to `false`. The default value when developing is `false`.

### Sending the token using XHR/Ajax or fetch

For XHR-request types, use header `'x-csrf-token'` with the same value as the meta tag content. Consider using a XHR / fetch interceptor to avoid setting the value for each request.

### Sending the token using traditional forms

The variable `csrfToken` is made available to all templates automatically. Include the token as a hidden-field on your form.

```html
<form method="POST" action="/">
    <input name="_csrf" type="hidden" value="{{csrfToken}}"/>
    <button>Send</button>
</form>
```

### Disable

CSRF-protection can be disabled by setting the value of `CSRF_PROTECTION_ENABLED` to `false`.


## Cross-origin resource sharing (CORS)

Traditionally JavaScript running in a browser has only been able to make requests, using `XMLHttpRequest` and `Fetch`, to [same origin](https://en.wikipedia.org/wiki/Same-origin_policy) resources.

It's possible to enable requests by setting the appropriate CORS headers.

Stopping cross origin requests [does not provide any extra security](https://annevankesteren.nl/2012/12/cors-101), thus **by default the application is configured to allow all cross origin requests.**

Applications needing different behaviour may disable this by setting the value of `GLOBAL_CORS_ENABLED` to `false`. If the application needs to do anything particular with regards to allowed headers or or preflights it will be necessary to implement this. There exists [Express middleware](https://github.com/expressjs/cors) to do this.

