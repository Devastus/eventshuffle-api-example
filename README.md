EventShuffle API - example
==================================

An example of a much simplified microservice API for an application to help scheduling events with friends.

## Usage

### Local

To launch the application by itself, first navigate to `event-service` folder and install the required node modules:
```sh
npm install
```
After that, you can launch the API in development mode with this command:
```sh
npm run dev
```
It will spin up the server with SQLite in-memory database for easy testing.

Visit `http://localhost:8080` to access the API.

### Docker

First make sure you have Docker and Docker Compose installed.

Navigate to the project root and use these commands to run the whole stack in Docker Compose - we need to create the external network first.
```sh
docker network create external
```
```sh
docker-compose up -d
```
This will build the event-service image and spin it up alongside a MySQL container, Nginx reverse proxy and Elastic Search.

Visit `http://localhost:8080` to access the API.

Run this command to take down the containers:
```sh
docker-compose down
```

## Deployment

### GKE (Google Kubernetes Engine)

A Github Action is run for every master push that builds, tests and deploys the application into GKE, if everything went succesfully.
See `.github/workflows` and `deployment/` folders for specifics respectively.

Currently, you can visit `http://35.228.127.159/api/v1/event` to access the API at Google Kubernetes Cluster.

## Technologies

- Koa.js - Node.js backend framework
- TypeORM with SQLite / MySQL
- Typescript
- Docker
- Kubernetes
- Github Actions
- Google Cloud
