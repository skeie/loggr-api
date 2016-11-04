# Templates

Web apps that serve HTML should use [nunjucks templates](https://mozilla.github.io/nunjucks/).

The example app defines a base layout template, `base.njk` and a template for the index page, `index.njk`. The layout template provides the skeleton of the page, with header and footer and style tags and so on. Page templates inherit from the base template and fill inn blocks in the layout. For an example, look at `index.njk`.

## Assets

Use this syntax to link assets `<img src="{{ 'static/images/dekor.png' | asset }}">`. This will generate this output `<img src="static_generated/dekor.#filehash#.png">` and ensure that your assets are cached correctly in prod.
