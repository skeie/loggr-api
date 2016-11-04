# Load balancer

Deploying an application will make it available on [internal Kubernetes' URLs](https://github.schibsted.io/finn/node-example-app/blob/master/README.md#links). Exposing the application to the rest of the world (via https://www.finn.no) requires updating A10's configuration (IBM's load balancer), and is a manual task.

Before you proceed, ensure your application is available on the internal URL's. When it is, send an email to `ops@finn.no` with the following information:

1. Which path you want to use
2. The name of your application
3. The exposed port for your application
4. Link to your application in dev and production
