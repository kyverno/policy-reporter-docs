---
title: Local Development
description: ''
position: 21
category: 'Policy Reporter UI'
---

# Local Development

## Go Backend

The Go Backend acts as:

* Backend store and API for the Policy Report pushes
* File server for the NuxtJS single page application (the actual UI)
* HTTP proxy for the Policy Reporter REST API
* HTTP proxy for the Kyverno plugin REST API (if enabled)

### Requirements

* Go >= v1.19

### Getting started

Fork and/or checkout <a href="https://github.com/kyverno/policy-reporter-ui" target="_blank">Policy Reporter UI on GitHub</a>

The Go Backend is located in the `./server` directory

### Install dependencies

```bash
cd server

go get ./...
```

## Running Policy Reporter UI

```bash
go run main.go -no-ui -dev -port=8082
```

### Argument Reference

| Argument            | Description                                                                                  |Default       |
|---------------------|----------------------------------------------------------------------------------------------|------------- |
| `-config`           | path to the Policy Reporter UI config file                                                   |`config.yaml` |
| `-dev`              | adds the __Access-Control-Allow-Origin__ HTTP header<br>to all APIs to avoid CORS errors      |`false`       |
| `-no-ui`            | disables the SPA handler to start the backend without the UI,<br>only for development purposes |`false`       |
| `-policy-reporter`  | Host URL to Policy Reporter,<br>used to proxy API requests to and from the UI                    |              |
| `-kyverno-plugin`   | Host URL to Policy Reporter Kyverno plugin,<br>used to proxy API requests to and from the UI     |              |
| `-port`             | used port for the HTTP server                                                                |`8080`        |

### Compile and run Policy Reporter UI

```bash
make build

./build/policyreporter-ui -no-ui -dev -port=8082
```

## NuxtJS Frontend

The actual frontend is a single page application based on <a href="https://nuxtjs.org/" target="_blank">NuxtJS</a> and <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>.

### Requirements

* NodeJS >= v16
* Local running Policy Reporter UI backend
* Accessible Policy Reporter REST API
* Accessible Kyverno plugin REST API (optional)

### Preparation

Access Policy Reporter via port forwarding:

```bash
kubectl port-forward service/policy-reporter 8080:8080 -n policy-reporter
```

Access Policy Reporter Kyverno plugin via port forwarding:

```bash
kubectl port-forward service/policy-reporter-kyverno-plugin 8083:8080 -n policy-reporter
```

Start the Policy Reporter UI server in development mode without the UI. The server has to be started in the `server` directory of the Policy Reporter UI project.

```bash
go run main.go -no-ui -dev -port=8082 -policy-reporter http://localhost:8080 -kyverno-plugin http://localhost:8083
```

### Install Dependencies

Dependencies are managed with NPM.

```bash
npm install
```

### Running Policy Reporter UI

Create a .env file to configure the Policy Reporter UI backend URL. With this setup you can just copy the prepared `.env.example`.

```bash
cp .env.example .env
```

Start the NuxtJS development server

```bash
npm run dev
```

Open <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.

Check the output of the `npm run dev` command if this port is not working.
