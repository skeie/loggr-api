# Docker

This section describes how to run the application locally as a Docker image. Note that running Docker locally is not required to develop your application as the docker image will be [built and deployed](https://github.schibsted.io/finn/node-example-app#continuous-integration-and-deployment) to Kubernetes for you.

Node and npm is *not* required locally if you're using Docker.

## Run local code via Docker

Follow these steps if you want to run your code via Docker before you push it (e.g. to verify changes in `Dockerfile`).

**Prerequisites**: docker installed and a local clone of your repository.

- [Install Docker](https://docs.docker.com/engine/installation/)
- Run `docker build . -t finn/<name-of-your-application>:<version> .` from your cloned repository. This will generate a docker image. You can decide `<version>`, e.g. "v1" or the current git hash.
- Run `docker run -it -p 1337:3000 finn/<name-of-your-application>:<version>`

Note: `-it -p 1337:3000` can also be written as `--interactive --tty --port 1337:3000`.

The `-p` argument binds your port `1337` to the container's port `3000`, meaning you can access the application iva
[http://localhost:1337](http://localhost:1337). 'Hello world' should be displayed for the example-app.


## Run arbitrary images from Artifactory

You can also run images from Artifactory rather than from your local repository.

**Prerequisites**: docker installed locally and access to Artifcatory

Run `docker run -it -p 1337:3000 containers.schibsted.io/finntech/node-example-app:latest`. Make sure you're logged into Artifactory with Docker. See
[here](https://confluence.schibsted.io/display/FI/Docker) for instructions
