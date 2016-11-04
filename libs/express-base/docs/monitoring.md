# Monitoring

Use Sensu for monitoring and alerts, see [Sensu](https://confluence.schibsted.io/display/FI/Sensu) for in-depth information. Please note that FIaaS guidelines regarding configuring of alerts is subject to change and that Puppet will not necessarily be used in the future.

Prometheus metrics (preferred) and service checks/scraping of the web application can be used as data sources for monitoring. However, local scraping is not supported since we are unaware of the set of IP addresses used by the pod(s) on Kubernetes.

See [Sensu#Prometheus metrics](https://confluence.schibsted.io/display/FI/Sensu#Sensu-PrometheusCheck) for how to set up Prometheus as data source for monitoring.


