# Health check

Kubernetes probes two endpoints to verify the state of the application, and uses the http status code to determine the current state. A status code between 200 and 399 is a positive answer, everything else is negative. These two endpoints are frequently probed and must respond swiftly.

1. The `liveness` endpoint indicates whether the application is alive or broken. A broken application will be restarted.
2. The `readiness` endpoint indicates whether the application is ready to receive requests.

Both endpoints are configured in `fiaas.yml`, and may point to the same URI if your application is instantly ready to receive requests when started.

* Example code can be found on [./lib/server-impl.js](https://github.schibsted.io/finn/node-example-app/blob/master/lib/server-impl.js)
* [FIaaS health check](https://confluence.schibsted.io/pages/viewpage.action?pageId=22656200) and [Kubernetes health checks](http://kubernetes.io/docs/user-guide/production-pods/#liveness-and-readiness-probes-aka-health-checks) contains additional documentation.
