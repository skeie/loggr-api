# Metrics

[`prometheus-client`][prom-client-url] is used for metrics. It will automatically supply some system and process level metrics, such as cpu
usage, and event loop lag, but application specific metrics have to be configured manually.

See `prometheus-client` [docs][prom-client-url] for more in depth usage.

## Getting a Dashboard in Grafana

When deploying to FIaaS, a dashboard is automatically created for you at http://grafana.finntech.no/dashboard/db/*NAME_OF_APPLICATION*.

## Example Usage

See:

* [./lib/server-impl.js](https://github.schibsted.io/finn/node-example-app/blob/master/lib/server-impl.js) (And lines using `events`)
* [./lib/metrics.js](https://github.schibsted.io/finn/node-example-app/blob/master/lib/metrics.js)

## Other Resources

* [FIaaS documentation][fiias-metric-docs] on metrics


[prom-client-url]: https://github.schibsted.io/finn/prometheus-metrics
[fiias-metric-docs]: https://confluence.schibsted.io/display/FI/Metrics
