# express-base

[![Build Status](https://travis.schibsted.io/finn/express-base.svg?token=QJD2QsedthZfk9gV96zW&branch=master)](https://travis.schibsted.io/finn/express-base)

## Purpose

This package contains basic functionality to get your node webapp running with the integrations and conventions used at FINN.

What's included?

- An express web app
- Nunjucks templating
- Parsing of form and JSON data
- Error pages
- Secure http headers
- Tracking (analytics, pulse and TrackJS)
- [Polyfills](https://github.schibsted.io/finn/polyfills)
- Health check endpoints
- Kibana-supported logger
- Grafana and Prometheus supported metrics
- List of active configuration values, process versions and request header dump via /internal-backstage
- Prometheus metrics and Hystrix data stream via /internal-backstage/prometheus and /internal-backstage/hystrix.stream

## How to set up you own app

We've made an example app you can use. Please follow the instructions at [node-example-app](https://github.schibsted.io/finn/node-example-app).

## Questions

If you have questions about the express-base package, or something does not work as you'd expected, perhaps we can help. Please [create an issue](https://github.schibsted.io/finn/express-base/issues/new) or tell us about the problem on Slack, [#finn-framsie](https://sch-chat.slack.com/messages/finn-framsie/).

## Documentation

* [Config](https://github.schibsted.io/finn/express-base/blob/master/docs/config.md) - where to put your app configuration

* [Docker](https://github.schibsted.io/finn/express-base/blob/master/docs/docker.md) - running your app locally with Docker

* [Escape hatch](https://github.schibsted.io/finn/express-base/blob/master/docs/escape-hatch.md) - how to remove parts of the application not needed for your project

* [Health check](https://github.schibsted.io/finn/express-base/blob/master/docs/health-check.md) - FIAAS/Kubernetes style

* [Logging](https://github.schibsted.io/finn/express-base/blob/master/docs/logging.md)

* [Metrics](https://github.schibsted.io/finn/express-base/blob/master/docs/metrics.md)

* [Monitoring](https://github.schibsted.io/finn/express-base/blob/master/docs/monitoring.md)

* [Frontend logging](https://github.schibsted.io/finn/express-base/blob/master/docs/frontend-logging.md)

* [Security](https://github.schibsted.io/finn/express-base/blob/master/docs/security.md) - description of bundled security measures.

* [Static assets](https://github.schibsted.io/finn/express-base/blob/master/docs/static-assets.md) - handling of assets like images, css and js

* [Express.js](https://github.schibsted.io/finn/express-base/blob/master/docs/express.md) - custom express.js overrides

* [Middlewares](https://github.schibsted.io/finn/express-base/blob/master/docs/middlewares.md) - various middlewares

* [Templates](https://github.schibsted.io/finn/express-base/blob/master/docs/templates.md) - basic setup and some custom features

* [Testing](https://github.schibsted.io/finn/express-base/blob/master/docs/testing.md) - server and client testing with mocha and power-assert

## Contributing

We'd love your contribution! Please read our [contribution guidelines](contributing.md) to get started.
