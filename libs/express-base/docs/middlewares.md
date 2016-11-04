# Middlewares

## User token middleware

The user token middlware exposes a user token on the request object, that can be used in route handlers and middlware that do requests on behalf of the user.

The token is extracted from the `__flt_${env}` cookie or from the Bearer token in the authorization header of the request. The token is made avaliable as `req.userToken`.

If the user is not logged in, `req.userToken` will be `null`.

Caveat: The middlware requires `req.cookies` to be populated by the `cookie-parser` middleware.

## Finnlets middleware

The finnlets middlware exposes functions to load [finnlets](https://github.schibsted.io/finn/finnlets). The finnlets will be made available on `res.locals.finnlets`.

Currently there are three finnlets available: top bar, minimal top bar and footer.

Example:

```js
const { middleware } = require('@finn-no/express-base');

const { finnlets: finnletMiddleware } = middleware;

const finnlets = finnletMiddleware('http://example.com/finnlet-server');

router.get(
    '/',
    finnlets.withTopbar(),
    finnlets.withFooter(),
    (req, res) => res.render('index')
);
```

The only argument is the URL of the Finnlet server. If the url is omitted, it will use the default FiaaS Finnlet URL, which is
`finnlet-server`.

This adds `footer` and `topbar` properties on the `res.locals.finnlets` object. The default base template (`views/base.njk`) uses these.

The following finnlet loading functions are available:

### `withFooter([socialMediaDisplay])`

Loads the global FINN footer and exposes it on `res.locals.finnlets.footer`. Takes an optional argument that controls whether or not to show the row of social media buttons in the footer. If omitted, the default behaviour is used. The default behaviour is controlled by the finnlet server.

The legal values for `socialMediaDisplay` can be found as an [enum in the finnlet footer client](https://github.schibsted.io/finn/finnlets/blob/master/packages/finnlet-footer/lib/index.js#L5). They are currently the strings `OFF` and `ON`.

### `withTopbar([activeMenuItem])`

Loads the global FINN top bar and exposes it on `res.locals.finnlets.topbar`. Takes an optional argument that controls what tab in topbar is highlighted. By default, no tab is highlighted.

The legal values for `activeMenuItem` can be found as an [enum in the finnlet topbar client](https://github.schibsted.io/finn/finnlets/blob/master/packages/finnlet-topbar/src/topbar.js#L7). They are currently the strings `NONE`, `LATEST`, `NEW_AD`, `NOTIFICATIONS` and `PROFILE`.

### `withMinimalTopbar()`

Loads the minimal, "distraction free", global FINN top bar and exposes it on `res.locals.finnlets.topbar`.

Caveats: The middlware dependens on the user token middleware being enabled.

## Unleash middleware

The unleash middleware connects to an [Unleash](https://github.com/finn-no/unleash) feature toggle server and makes it possible to expose toggles on the request object for use in routes and templates.

Caveats: The middleware only supports the `default` unleash strategy. More strategies will be added in the future. See [Issue #6](https://github.com/finn-no/unleash-client-node/issues/6) for progress.

In addition, the middleware depends on the user token middleware being enabled.

### Usage

To use the middlware, first create a middleware instance:

```js
const { middleware } = require('@finn-no/express-base');

const { unleash } = middleware;

const unleashMiddleware = unleash('http://unleash.myserver.com/features');
```

The only argument is the URL of the Unleash server. If the url is omitted, it will use the default FiaaS Unleash URL, which is
`unleash-server/features`.

The middlware instance can be used then setting up routes. The middlware will expose the chosen toggles on `res.locals.unleash`. In its simplest form, it takes any number of toggle names as arguments:

```js
router.get(
    '/',
    unleashMiddleware('showHorseShoeBanner', 'enableTracking'),
    (req, res) => res.render('index')
);
```

This will fetch toggle status for `showHorseShoeBanner`, `enableTracking` and make them available on `res.locals.unleash`, so that templates and routes can access them. Thus in `index.njk` we could do:

```html
{% if unleash.enableTracking %}
    <script src="/tracking.js"></script>
{% endif %}
```

If using a feature toggle name the unleash server does not know about, the value of the toggle is `false`. In other words, new toggles should either have off as a sensible default, or clients should always be providing a default when fetching the toggle from the unleash server.

It's possible to pass objects as arguments to the middleware as well. These define a mapping of toggle name to default value:

```js
const toggles = {
    showHorseShoeBanner: false,
    enableTracking: true,
};

router.get(
    '/',
    unleashMiddleware(toggles),
    (req, res) => res.render('index')
);
```

It's also possible to mix and match toggle objects and strings:

```js
router.get(
    '/',
    unleashMiddleware(toggles, 'someOtherToggle'),
    (req, res) => res.render('index')
);
```

## Device type middlware

The device type middlware exposes a a number of assumptions about the device that made the request on `res.locals.deviceType`.

The `deviceType` object contains the following booleans: `isProbablyIos`, `isProbablyAndroid`, `isProbablyMobile`, `isProbablyTablet` and `isProbablyMobileOrTablet`.

As the names indicate, the device type information is not guaranteed to be accurate, but has been good enough for most device targeting on mfinn for several years.
