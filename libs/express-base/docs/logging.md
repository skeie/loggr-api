# Logging

`node-fiaas-logger` is used for logging.

See [node-fiaas-logger](https://github.schibsted.io/finn/node-fiaas-logger/blob/master/README.md) for usage examples, available log levels and additional information.

## Reading logs

Logs, both access and logs made from the application, are automatically available via [Kibana (dev)](kibana.k8s.dev.finn.no) and [Kibana (prod)](http://kibana.k8s1-prod1.z01.finn.no/).

You can find an example [here](http://kibana.k8s1-prod1.z01.finn.no/#/discover?_g=()&_a=(columns:!(_source),filters:!(!n,(meta:(disabled:!f,index:'logstash-*',key:finn_app,negate:!f,value:node-example-app),query:(match:(finn_app:(query:node-example-app,type:phrase))))),index:'logstash-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc))).

### Advanced

Tailing logs directly from a Kubernetes pod can be done using `kubectl`:

1. `kubectl get pods` to list running pods
2. `kubectl logs <name-of-pod>` (add `-f` to follow log)

For information how to install `kubectl`, please see [How to set up a local FIAAS+development environment](https://confluence.schibsted.io/display/FI/How+to+set+up+a+local+FIAAS+development+environment). Skip steps regarding GKE access.

Note that access logs in Kibana are originating from Nginx. To read the access logs from the internal haproxy load balancer, SSH access to dev-k8ssyslog1.sol0.finntech.no (dev) and k8ssyslog1-prod1.z01.finn.no (prod) is required. The logs can be found in `/var/log/haproxy`.
