# node-example-app

[![Build Status](https://travis.schibsted.io/finn/node-example-app.svg?token=qt273uGfEz64UyWuNHJ1&branch=master)](https://travis.schibsted.io/finn/node-example-app)

## Purpose

This repository contains FINN's nodejs reference web application and allows you to swiftly start developing a node application. It's the reference implementation of [express-base](https://github.schibsted.io/finn/express-base).

What's included?

The following set of features from express-base are thus included.

- An express web app
- [Nunjucks templating](https://mozilla.github.io/nunjucks)
- Error pages
- Secure http headers
- Tracking (analytics, pulse and TrackJS)
- [Polyfills](https://github.schibsted.io/finn/polyfills)
- Unleash flags
- Health check endpoints
- Kibana-supported logger
- Grafana and Prometheus supported metrics
- List of active configuration values, process versions and request header dump via /internal-backstage
- Prometheus metrics and Hystrix data stream via /internal-backstage/prometheus and /internal-backstage/hystrix.stream

The following additional features and/or examples are included.

- Testing with Mocha and Power Assert
- Continuous integration (Travis)
- Deployment to Kubernetes (FIAAS)
- Caching of static assets with md5 hash filename rewriting
- Application configuration using [config-loader](https://github.schibsted.io/finn/config-loader)

## How to set up your own app

1. `npm install @finn-no/example-app-generator -g --registry http://npm.finntech.no` (if you have issues without using sudo, see [here](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md)).
2. Run `example-app-generator` and follow the instructions.

That's it, you're now ready to develop, and deploy, your application!

## How to develop

1. Ensure you have node 6 or later installed. Check your node version with `node -v`. If not, get the [installer](https://nodejs.org/en/download/current/), check out [package managers](https://nodejs.org/en/download/package-manager/) or use a node version manager, such as [`nvm`](https://github.com/creationix/nvm) or [`n`](https://github.com/tj/n).
2. Run `npm install`
3. Run `npm start`
4. Open [http://localhost:3000](http://localhost:3000)

## How to deploy to FIAAS

1. Navigate to [Travis CI](https://travis.schibsted.io/profile/finn) and activate your application
2. After successful Travis build, navigate to `http://pipeline.finn.no/<your-app-name>/` and configure your pipeline.

Travis uses finnbuild.json. Successful builds will:

- Build a Docker image.
- Push the docker image to [Artifactory](https://artifacts.schibsted.io/artifactory/).
- Notify Pipeline (a pipeline project will automatically be created for you unless it's already present).

## How to make your app available externally

See [express-base/docs/load-balancer.md](https://github.schibsted.io/finn/express-base/blob/master/docs/load-balancer.md) for information how to make your app externally available.

## How to configure your application

General documentation for how to configure your application can be found in the [express base](https://github.schibsted.io/finn/express-base/blob/master/docs/config.md) repository. [config-loader](https://github.schibsted.io/finn/config-loader) is used to load environment variables and map to application configuration. Please see the content of directory `/server/config/` (in your application) for examples.

Configuration without defaults must be via the environment. Some of the configuration (e.g. non-secrets) can be contained within the repository. `/server/run.sh` can be used to set these values. If you want to overwrite one or more when running the app you can do so by setting the value prior to executing `run.sh`:

`NODE_ENV=production ./run.sh`

If you want to change some config based on what environment the app is running, add it to `/server/config-{KUB_ENVIRONMENT}.sh`, which is automatically sourced by `run.sh`.

To show a list of currently defined options, one can run `npm run config:show`.

## How to delete your application

Building your application on Travis will lead to side effects outside your repository. This is expected, but if you for some reason want to revert them, most of the changes can be undone by:

1. Hiding the pipeline project on `http://pipeline.finntech.no/projects/<your-app-name>`
2. Using Slack's `#finn-io-cloud` for help removing elements on FIaaS.
3. Using Slack's `#artifactory-support` for help removing artifacts on Artifactory.

## Links related to node-example-app

- [node-example-app in dev](http://node-example-app.k8s.dev.finn.no/)
- [node-example-app in prod](http://node-example-app.k8s1-prod1.z01.finn.no/)
- [Logs](http://kibana.k8s1-prod1.z01.finn.no/#/discover?_g=()&_a=(columns:!(_source),filters:!(!n,(meta:(disabled:!f,index:'logstash-*',key:finn_app,negate:!f,value:node-example-app),query:(match:(finn_app:(query:node-example-app,type:phrase))))),index:'logstash-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc)))
- [Access logs](http://kibana.k8s1-prod1.z01.finn.no/#/discover?_g=()&_a=(columns:!(log),filters:!(!n,(meta:(disabled:!f,index:'logstash-*',key:kubernetes.container_name,negate:!f,value:nginx-ingress-lb),query:(match:(kubernetes.container_name:(query:nginx-ingress-lb,type:phrase))))),index:'logstash-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'log:%22node-example-app.k8s1%22')),sort:!('@timestamp',desc)))
- [Metrics dashboard](http://grafana.finntech.no/dashboard/db/fiaas-prod-apps) (select `node-example-app` from the dropdown)
- [Pipeline](http://pipeline.finn.no/projects/node-example-app)
- [Travis](https://travis.schibsted.io/finn/node-example-app)
- [Hystrix dashboard in dev](http://hystrix-dashboard.dev-k8s.finntech.no/monitor/monitor.html?stream=http%3A%2F%2Fturbine-server%2Fturbine.stream%3Fcluster%3Dnode-example-app)
- [Hystrix dashboard in prod](http://hystrix-dashboard.k8s1-prod1.z01.finn.no/monitor/monitor.html?stream=http%3A%2F%2Fturbine-server%2Fturbine.stream%3Fcluster%3Dnode-example-app)

## Questions

If you have questions about the example-app, or something does not work as you'd expected, perhaps we can help. Please tell us about the problem on Slack, [#finn-framsie](https://sch-chat.slack.com/messages/finn-framsie/).

## Documentation

* [Config](https://github.schibsted.io/finn/express-base/blob/master/docs/config.md) - where to put your app configuration

* [Docker](https://github.schibsted.io/finn/express-base/blob/master/docs/docker.md) - running your app locally with Docker

* [Escape hatch](https://github.schibsted.io/finn/express-base/blob/master/docs/escape-hatch.md) - how to remove parts of the application not needed for your project

* [Event bus](https://github.schibsted.io/finn/express-base/blob/master/docs/event-bus.md) - sending server side events internally

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
