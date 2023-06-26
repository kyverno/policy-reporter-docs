---
title: Getting started
description: ''
position: 2
category: Guide
---

# Getting started

Policy Reporter can easily installed with Helm 3 or with the provided static [manifest files](https://github.com/kyverno/policy-reporter/tree/main/manifest). It consists of four parts and can be installed and configured as needed.

## Installation

### Helm Repository

```bash
helm repo add policy-reporter https://kyverno.github.io/policy-reporter
helm repo update
```

### Core Installation

Install only the core application to get REST APIs and/or a metrics endpoint. Both are optional and disabled by default.

::code-group
  ```bash [Helm 3]
  helm upgrade --install policy-reporter policy-reporter/policy-reporter --create-namespace -n policy-reporter --set metrics.enabled=true --set api.enabled=true
  ```

  ```bash [Static Manifests]
  kubectl apply -f https://raw.githubusercontent.com/kyverno/policy-reporter/main/manifest/policy-reporter/namespace.yaml
  kubectl apply -f https://raw.githubusercontent.com/kyverno/policy-reporter/main/manifest/policy-reporter/install.yaml
  ```
::

Access your metrics endpoint on <a href="http://localhost:8080/metrics" target="_blank">http://localhost:8080/metrics</a> via Port Forward:

```bash
kubectl port-forward service/policy-reporter 8080:8080 -n policy-reporter
```

Access your REST API endpoints at <a href="http://localhost:8080/v1/targets" target="_blank">http://localhost:8080/v1/targets</a> via port forwarding:

```bash
kubectl port-forward service/policy-reporter 8080:8080 -n policy-reporter
```

See [API Reference](/core/api-reference) for all available endpoints.

### Core + Policy Reporter UI

Install the Policy Reporter core application and the Policy Reporter UI.
This installation also sets Policy Reporter UI as an alert target for new violations.

::code-group
  ```bash [Helm 3]
  helm upgrade --install policy-reporter policy-reporter/policy-reporter --create-namespace -n policy-reporter --set ui.enabled=true
  ```

  ```bash [Static Manifests]
  kubectl apply -f https://raw.githubusercontent.com/kyverno/policy-reporter/main/manifest/policy-reporter-ui/namespace.yaml
  kubectl apply -f https://raw.githubusercontent.com/kyverno/policy-reporter/main/manifest/policy-reporter-ui/config-secret.yaml
  kubectl apply -f https://raw.githubusercontent.com/kyverno/policy-reporter/main/manifest/policy-reporter-ui/install.yaml
  ```
::

Access Policy Reporter at <a href="http://localhost:8081" target="_blank">http://localhost:8081</a> via port forwarding:

```bash
kubectl port-forward service/policy-reporter-ui 8081:8080 -n policy-reporter
```

<nuxt-img src="/images/screenshots/basic-ui-light.png" style="border: 1px solid #ccc" class="light-img" alt="Dashboard light"></nuxt-img>
<nuxt-img src="/images/screenshots/basic-ui-dark.png" style="border: 1px solid #555" class="dark-img" alt="Dashboard dark"></nuxt-img>

### Core + Policy Reporter UI + Kyverno Plugin

Install the Policy Reporter core application, Policy Reporter Kyverno Plugin, and the Policy Reporter UI with the Kyverno views enabled.
This installation also sets Policy Reporter UI as an alert target for new violations.

::code-group
  ```bash [Helm 3]
  helm upgrade --install policy-reporter policy-reporter/policy-reporter --create-namespace -n policy-reporter --set kyvernoPlugin.enabled=true --set ui.enabled=true --set ui.plugins.kyverno=true
  ```

  ```bash [Static Manifests]
  kubectl apply -f https://raw.githubusercontent.com/kyverno/policy-reporter/main/manifest/policy-reporter-kyverno-ui/namespace.yaml
  kubectl apply -f https://raw.githubusercontent.com/kyverno/policy-reporter/main/manifest/policy-reporter-kyverno-ui/config-secret.yaml
  kubectl apply -f https://raw.githubusercontent.com/kyverno/policy-reporter/main/manifest/policy-reporter-kyverno-ui/install.yaml
  ```
::

Access Policy Reporter at <a href="http://localhost:8081" target="_blank">http://localhost:8081</a> via port forwarding:

```bash
kubectl port-forward service/policy-reporter-ui 8081:8080 -n policy-reporter
```

<nuxt-img src="/images/screenshots/kyverno-dashboard-light.png" style="border: 1px solid #ccc" class="light-img" alt="Kyverno Policy Dashboard light"></nuxt-img>
<nuxt-img src="/images/screenshots/kyverno-dashboard-dark.png" style="border: 1px solid #555" class="dark-img" alt="Kyverno Policy Dashboard dark"></nuxt-img>

### Policy Reporter + Prometheus Operator

Install Policy Reporter core application with metrics enabled and the monitoring subchart to install a ServiceMonitor and three pre-configured Grafana Dashboards. Change the `monitoring.grafana.namespace` as needed as well as `monitoring.serviceMonitor.labels` to match the `serviceMonitorSelector` of your Prometheus CRD.

See <a href="/guide/helm-chart-core#configure-the-servicemonitor" target="_blank">Helm Chart - Monitoring</a> for details.

```bash
helm upgrade --install policy-reporter policy-reporter/policy-reporter --set monitoring.enabled=true --set monitoring.grafana.namespace=monitoring --set monitoring.serviceMonitor.labels.release=monitoring -n policy-reporter --create-namespace
```

<nuxt-img src="/images/screenshots/grafana-policy-reports-dashboard.png" style="border: 1px solid #555" alt="Grafana Policy Reports Dashboard"></nuxt-img>
<nuxt-img src="/images/screenshots/grafana-policy-reports-details.png" style="border: 1px solid #555" alt="Grafana Policy Reports Dashboard"></nuxt-img>
<nuxt-img src="/images/screenshots/grafana-cluster-policy-reports-details.png" style="border: 1px solid #555" alt="Grafana Policy Reports Dashboard"></nuxt-img>
