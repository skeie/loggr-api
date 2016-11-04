# Frontend logging

[trackjs](https://trackjs.com) is en externally hosted service used for frontend logging. It records errors and stack traces, as well custom logging from javascript.

## Setup

trackjs is not enabled by default when setting up a project, but his can be done easily:

1. Sign up as a trackjs user
2. Be added to the FINN.no group. You can contact Frode Risøy for this
3. Create a new app in the trackjs admin UI: https://my.trackjs.com/Account/Applications . The application key can be any string, but you should probably use the application name you use in your `package.json` file. Make note of the application name and token. You'll need then in the next step.
4. Update `config/trackjs.js` in your project:
    - `TRACKJS_CDN_URL`: URL from which to load the trackjs library. It will probably never be necessary to change this, but it is provided as an emergency hatch, in case something happens with the trackjs CDN.
    - `TRACKJS_ENABLED`: controls whether or not trackjs snipped will be included
    - `TRACKJS_TOKEN`: from the previous step
    - `TRACKJS_APPLICATION_KEY`: from the previous step

This setup will cause a `trackJsSnippet` variable to be set on the application locals object. The snippet is emitted in the `base.njk` template if trackjs is enabled.

## Caveats

1. We have traditionally not used session or user tracking with trackjs for privacy reasons. Thus the settings for this functionality is not exposed in this example implementation.
2. There are a number of configuration options for tuning the trackjs setup. These are not currently exposed. It's possible to add support for more config options if necessary.

## Using NPM rather than CDN

It's possible to install the [trackjs bundle](https://github.com/TrackJs/trackjs-package) with NPM and include it in the JS bundle for the app. The default trackjs integration does not do this, as it's seen to be preferable to load the scripts separately from CDN. Anyone wanting to use the NPM package will need to remove the default integration and replace it. The NPM package has documentation for this.
