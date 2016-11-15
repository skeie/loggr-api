## Run this everytime you are deploying a new update.
## TODO: change app name when you copy this file
##
##
## Builds a new docker image and deploy to Google.
## See images we have on google:
##  gcloud docker images
##  gcloud docker images inspect <image name>


# nice output colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

export PROJECT_ID=sandbox-routes

# stop container if its running
docker stop routes-create-api && docker rm -f routes-create-api

if [ $1 == "DRYRUN" ]; then
  echo "\n${GREEN}Dry run baby. Buidling image: dryrun ${NC}"
  docker build -t gcr.io/$PROJECT_ID/routes-create-api:dryrun .
  docker run -d -p 8001:8001 --name routes-create-api gcr.io/$PROJECT_ID/routes-create-api:dryrun

  ## let image deploy
  sleep 5;
  curl http://localhost:8011/health
  if [ $? -eq 0 ]
  then
    echo "\n${GREEN}Health check OK! You can run npm run deploy now. ${NC}"
  else
    echo "\n${GREEN}Health check failed.. ${NC}"
  fi

fi

if [ $1 == "PROD" ]; then
  version=$(npm version patch -m "Upgrade to %s for reasons")

  echo "\n${GREEN}Will deploy routes-create-api:$version ${NC}"
  docker rm routes-create-api
  docker build -t gcr.io/$PROJECT_ID/routes-create-api:$version .

  if [ $? -eq 0 ]
  then
    echo "\n${GREEN}Docker build success! Will push build ${NC}\n"
    gcloud docker push gcr.io/$PROJECT_ID/routes-create-api:$version

    # display osx notification
    if [ $? -eq 0 ]
    then
      osascript -e 'display notification "Docker build and release complete!" with title "routes-create-api [WIN]"'

      # Updating image. Note that this is only for when deployment exists from before
      kubectl set image deployment/routes-create-api-deployment routes-create-api=gcr.io/$PROJECT_ID/routes-create-api:$version
    else
      osascript -e 'display notification "Docker build and release failed" with title "routes-create-api [FAIL]"'
    fi
  else
    echo "\n${RED}Docker build failed ${NC}"
  fi
fi

# to run it:
#   docker run -p 8001:8001 --name routes-create-api gcr.io/$PROJECT_ID/routes-create-api:v$1
#   curl http://localhost:8001
#gcloud docker push gcr.io/$PROJECT_ID/routes-create-api:v$1
