# party e-commerce Services

## Build the docker image
'''
docker build --tag ems-party-e-commerce-service .
'''

## Run The Services

## Local/Dev
'''
docker run --detach --publish 8000:80 --name ems-party-e-commerce-service_1 -v $(pwd):/usr/src/app --link ems-party-db-1:erp-party-db erp-party-e-commerce-service
'''

## Staging or Prod
'''
docker run --detach --publish 8000:80 --name ems-party-e-commerce-service_1 -v $(pwd):/usr/src/app --link ems-party-db-1:erp-party-db ems-party-e-commerce-service
'''
