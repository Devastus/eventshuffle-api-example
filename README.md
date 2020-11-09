EventShuffle API - example
==================================

An example of a much simplified microservice API for an application to help scheduling events with friends.

## Usage

### Local

To launch the service by itself, first navigate to `event-service` folder and install the required node modules:
```sh
npm install
```
After that, you can launch the API in development mode with this command:
```sh
npm run dev
```
It will spin up the server with SQLite in-memory database for easy testing.

Visit [http://localhost:8080/api/v1/event](http://localhost:8080/api/v1/event) to access the API,
or [http://localhost:8080/api/v1/event/swagger](http://localhost:8080/api/v1/event/swagger)
to test it through Swagger.

### Docker

First make sure you have Docker and Docker Compose installed.

Navigate to the project root and use these commands to run the whole stack in Docker Compose - we need to create the external network first.
```sh
docker network create external
```
```sh
docker-compose up -d
```
This will build the event-service image and spin it up alongside a MariaDB container, Nginx reverse proxy and Elastic Search.

Visit [http://localhost:8080/api/v1/event](http://localhost:8080/api/v1/event) to access the API,
or [http://localhost:8080/api/v1/event/swagger](http://localhost:8080/api/v1/event/swagger)
to test it through Swagger.

Run this command at project root to take down the containers:
```sh
docker-compose down
```

## Deployment

### GKE (Google Kubernetes Engine)

A Github Action is run for every master push that builds, tests and publishes a
Docker image into Google Container Registry. Another Github Action deploys a single
Kubernetes deployment (for the sake of simplicity) of the application into GKE.
See `.github/workflows` and `deployment/` folders for specifics respectively.

Currently, you can visit [http://eventshuffle.mullikka.ml/api/v1/event](http://eventshuffle.mullikka.ml/api/v1/event)
to access the API running at Google Kubernetes cluster,
or [http://eventshuffle.mullikka.ml/api/v1/event/swagger](http://localhost:8080/api/v1/event/swagger)
to test it through Swagger.

## Technologies

- Koa.js - Node.js backend framework
- TypeORM
- Typescript
- MariaDB
- SQLite
- Nginx
- Docker
- Kubernetes
- Github Actions
- Google Cloud
