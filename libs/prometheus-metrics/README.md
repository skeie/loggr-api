# prometheus-metrics

[![Build Status](https://travis.schibsted.io/finn/prometheus-metrics.svg?token=qt273uGfEz64UyWuNHJ1&branch=master)](https://travis.schibsted.io/finn/prometheus-metrics)

This is a port of https://git.finn.no/projects/LIBS/repos/statsd-metrics-node/browse. It adds basic prometheus metrics for node.

A nice article on what to monitor on node:
https://www.oreilly.com/ideas/top-nodejs-metrics-to-watch

## Install

```shell
$ npm i -S @finn-no/prometheus-metrics
```

## API

### startMeasuring()

All applications should start measuring metrics as soon as possible:
```js
require('prometheus-metrics').startMeasuring();
```

### .metrics()

To get the internal state of the the metrics you need to call the `.metrics()` method. Your webapp needs to expose this resource to prometheus:

```js
require('prometheus-metrics').metrics();
```

## Custom metrics

This module builds upon [`prom-client`](https://github.com/siimon/prom-client). To register custom metrics, require the type you want from
that library (by going through `prom-client/lib/<type-of-probe>` to avoid triggering default metrics, which are handled by this module) and
either set up polling for it by passing it to `require('prometheus-metrics').addProbe` or managing it manually.

When you create a metric, it's registered in the `prom-client`-singleton, and reported by `require('prometheus-metrics').metrics()`.

### Modules

This module is written for applications and other top-level artifacts. If you're writing a module that want to expose metrics, don't use
this module, use `prom-client` directly instead (and register `prom-client` as a peer dependency).
