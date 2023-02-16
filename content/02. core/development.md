---
title: Local Development
description: ''
position: 15
category: 'Policy Reporter'
---

# Local Development

## Requirements

* Go >= v1.19
* (optional) Kubernetes Cluster with <a href="https://github.com/kubernetes-sigs/wg-policy-prototypes/tree/master/policy-report/crd/v1alpha2">wgpolicyk8s.io CRDs</a> installed

## Getting started

Fork and/or checkout <a href="https://github.com/kyverno/policy-reporter" target="_blank">Policy Reporter on GitHub</a>

### Install dependencies

```bash
go get ./...
```

### Unit Tests

Run unit tests locally with

```bash
make test
```

or

```bash
go test -v ./... -timeout=10s
```

## Running Policy Reporter

To run Policy Reporter locally, you must connect it to a Kubernetes cluster. This is required because it connects to the Kubernetes API to watch for PolicyReports and ClusterPolicyReports. The configuration can be done via CLI arguments, <a href="/core/11-config-reference" target="_blank">config.yaml</a>, or a mix of both.

```bash
go run main.go run -k ~/.kube/config
```

### Argument Reference

| Argument            | Short   | Description                                                           |Default              |
|---------------------|:-------:|-----------------------------------------------------------------------|---------------------|
| `--kubeconfig`      | `-k`    | path to the kubeconfig file,<br>used to connect to the Kubernetes API |                     |
| `--config`          | `-c`    | path to the Policy Reporter config file                               |`config.yaml`        |
| `--dbfile`          | `-d`    | path to the SQLite database file                                      |`sqlite-database.db` |
| `--metrics-enabled` | `-m`    | enables the Metrics API endpoints                                     |`false`              |
| `--rest-enabled`    | `-r`    | enables the REST API endpoints                                        |`false`              |
| `--port`            | `-p`    | used port for the HTTP server                                         |`8080`               |

### Compile and run Policy Reporter

```bash
make build

./build/policyreporter run -k ~/.kube/config
```
