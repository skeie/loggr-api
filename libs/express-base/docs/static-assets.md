# Static assets

Place your static assets like images, css and js in the `assets/static` folder.

## Caching and hashed filenames

Running `npm run assets` will copy all assets from `assets/static` to `assets/static_generated` and add md5 hash to the filename. It will also generate the `assets/static_generated/asset-map.json` file with mappings.

Using `<img src="{{ 'static/images/dekor.png' | asset }}">` in templates will output the original path in development and the path with hashed filenames in production. Use the config variables to override while testing.

## Config variables

`ASSETS_CDN_BASE` - prefixes all asset paths.

`HASHED_ASSETS_ENABLED` - rewrites asset paths using the `<img src="{{ 'static/images/dekor.png' | asset }}">` syntax.

`ASSETS_CACHE_ENABLED` - enable cache headers. Disable for development/debugging purposes.
