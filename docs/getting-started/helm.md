# Helm Chart

[![Artifact HUB](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/policy-reporter)](https://artifacthub.io/packages/helm/policy-reporter/policy-reporter)

The provided Helm Chart is the easiest way to install and configure Policy Reporter. Depending on your usage, it provides several values to customize Policy Reporter and its optional components to your individual needs.

## Helm Repository

```bash
helm repo add policy-reporter https://kyverno.github.io/policy-reporter
helm repo update
```

## Helm Chart OCI

The Policy Reporter Helm Chart is also available as an OCI artifact in the Kyverno GitHub Container Registry at [charts/policy-reporter](https://github.com/kyverno/policy-reporter/pkgs/container/charts%2Fpolicy-reporter).

## Configuration

By default most available features are disabled. So it's up to the user to enable or configure the features needed. This approach reduces the required resources to a bare minimum.

::: tip
See the complete [values.yaml](https://github.com/kyverno/policy-reporter/blob/main/charts/policy-reporter/values.yaml) for reference.
:::

## Structure

The Helm Chart consists of:

- templates to setup and configure the Policy Reporter Core application
- templates to setup and configure Policy Reporter UI (via options under the `ui` Helm chart value)
- templates to setup and configure the **Kyverno** and **Trivy** plugins (via options under the `plugin.kyverno` and `plugin.trivy` Helm chart values respectively)
- templates to simplify integration with the **Prometheus Operator** (via options under the `monitoring` Helm chart value)

## Policy Reporter

Details on configuring the various functions can be found on the respective function pages.

### High Available Setup

The High Available setup makes it possible to deploy more then one instance of Policy Reporter without the issue of duplicated pushes. By default HA mode will be enabled if the `replicaCount` is higher then `1`.

Policy Reporter uses `LeaderElection`, to ensure that only one instance is responsible to send pushes for new PolicyReportResults. Other features like API requests and metrics are loadbalanced between each instance.

The High Available setup also adds an `PodDisruptionBudget` with a default minAvailable of `1`. Both, `LeaderElection` as well as the `PodDisruptionBudget` can be configured to you personal needs.

```yaml
replicaCount: 3
# enabled if replicaCount > 1
podDisruptionBudget:
  # -- Configures the minimum available pods for policy-reporter disruptions.
  # Cannot be used if `maxUnavailable` is set.
  minAvailable: 1
  # -- Configures the maximum unavailable pods for policy-reporter disruptions.
  # Cannot be used if `minAvailable` is set.
  maxUnavailable:
# required when policy-reporter runs in HA mode and you have targets configured
# if no targets are configured, leaderElection is disabled automatically
# will be enabled when replicaCount > 1
leaderElection:
  enabled: false
  releaseOnCancel: true
  leaseDuration: 15
  renewDeadline: 10
  retryPeriod: 2
```

### NetworkPolicy

If enabled, the Helm Chart creates a `NetworkPolicy` resource to allow Policy Reporter egress traffic to the **Kubernetes API** (defaults to port **6443**) as well as ingress traffic to the Policy Reporter REST API from the Policy Reporter UI. Ingress and egress rules for additional targets or monitoring tools can be extended as needed.

::: info
Make sure that your default network policy allows ingress traffic to the DNS service so that Policy Reporter and its components can resolve the DNS names used.
:::

```yaml
networkPolicy:
  enabled: true
  egress:
    - to:
      ports:
        - protocol: TCP
          port: 6443
  ingress: []
```

### Ingress

Serve the API over a hostname with the integrated Ingress support. This is mainly needed for the **Multi Tenant** feature of Policy Reporter UI. In this case make sure that the API is not reachable for the **outside world**.

```yaml
ingress:
  enabled: true
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$1
  hosts:
    - host: domain.com
      paths:
        - path: '/(.*)'
          pathType: ImplementationSpecific
```

## Policy Reporter UI

Details on configuring the various functions can be found on the respective function pages.

### Enable Policy Reporter UI

Enable to optional Policy Reporter UI component

```yaml
ui:
  enabled: true
```

### High Available Setup

Because all features are stateless, you can deploy Policy Reporter UI without additional needs in HA mode (`replicaCount` > `1`).

The High Available setup adds an `PodDisruptionBudget` with a `minAvailable` of `1`. The `PodDisruptionBudget` can be configured to you personal needs.

```yaml
ui:
  enabled: true
  replicaCount: 3

  # enabled if replicaCount > 1
  podDisruptionBudget:
    # -- Configures the minimum available pods for policy-reporter-ui disruptions.
    # Cannot be used if `maxUnavailable` is set.
    minAvailable: 1
    # -- Configures the maximum unavailable pods for policy-reporter-ui disruptions.
    # Cannot be used if `minAvailable` is set.
    maxUnavailable:
```

### NetworkPolicy

If enabled, it creates an additional NetworkPolicy to allow ingress traffic to the Policy Reporter UI on the service port and egress traffic to the **Kubernetes API** (defaults to port **6443**), Policy Reporter and enabled plugins. Ingress and Egress rules can be extended as needed.

::: info
Make sure that your default network policy allows ingress traffic to the DNS service so that Policy Reporter and its components can resolve the DNS names used.
:::

```yaml
ui:
  enabled: true
  networkPolicy:
    enabled: true
    ingress: []
    egress:
      - ports:
          - protocol: TCP
            port: 6443
```

### Ingress

Serve the UI over a hostname with the integrated Ingress support.

```yaml
ui:
  enabled: true
  ingress:
    enabled: true
    annotations:
      nginx.ingress.kubernetes.io/use-regex: "true"
      nginx.ingress.kubernetes.io/rewrite-target: /$1
    hosts:
      - host: domain.com
        paths:
          - path: '/(.*)'
            pathType: ImplementationSpecific
```

It is also possible to serve the Policy Reporter UI on a subpath by making appropriate changes to the ingress configuration. For example, if you wanted to serve the UI on `/policy-reporter-ui/`:

```yaml
ui:
  enabled: true
  ingress:
    enabled: true
    annotations:
      nginx.ingress.kubernetes.io/use-regex: "true"
      nginx.ingress.kubernetes.io/rewrite-target: /$1
    hosts:
      - host: domain.com
        paths:
          - path: '/policy-reporter-ui/(.*)'
            pathType: ImplementationSpecific
```

Importantly, the trailing slash _must_ be specified in order for the web resources to be fetched correctly, i.e, you must access the Policy Reporter UI at `http(s)://domain.com/policy-reporter-ui/`.

## Kyverno Plugin

Details on configuring the various functions can be found on the respective function pages.

### Enable Kyverno Plugin

Enable to optional Kyverno Plugin

```yaml
plugin:
  kyverno:
    enabled: true
```

### High Available Setup

In HA mode Kyverno Plugin uses `LeaderElection` to ensure that only one instance is responsible for managing enforce violation `PolicyReports`. Other features like API requests are loadbalanced between each instance. This means, if `plugin.kyverno.blockReports.enabled` is false, leaderElection is not needed and will be disabled.

The High Available setup also adds an `PodDisruptionBudget` with a `minAvailable` of `1`. Both, `LeaderElection` as well as the `PodDisruptionBudget` can be configured to you personal needs.

```yaml
plugin:
  kyverno:
    enabled: true
    replicaCount: 3
    # enabled if replicaCount > 1
    podDisruptionBudget:
      # -- Configures the minimum available pods for policy-reporter disruptions.
      # Cannot be used if `maxUnavailable` is set.
      minAvailable: 1
      # -- Configures the maximum unavailable pods for policy-reporter disruptions.
      # Cannot be used if `minAvailable` is set.
      maxUnavailable:

    # required when running in HA mode and the "blockReports" feature is enabled
    # if "blockReports" is disabled, leaderElection is also disabled automatically
    # will be enabled when replicaCount > 1
    leaderElection:
      releaseOnCancel: true
      leaseDuration: 15
      renewDeadline: 10
      retryPeriod: 2
```

### NetworkPolicy

If enabled, the Helm Chart creates a NetworkPolicy resource to allow the Kyverno Plugin egress traffic to the **Kubernetes API** (defaults to port `6443`) as well as ingress traffic to the REST API of the Policy Reporter UI. Ingress and egress rules can be extended as needed.

::: info
Make sure that your default network policy allows ingress traffic to the DNS service so that Policy Reporter and its components can resolve the DNS names used.
:::

```yaml
plugin:
  kyverno:
    enabled: true
    networkPolicy:
      enabled: true
      egress:
        - to:
          ports:
            - protocol: TCP
              port: 6443
      ingress: []
```

### Ingress

Serve the API over a hostname with the integrated Ingress support. This is mainly needed for the **Multi Tenant** feature of Policy Reporter UI. In this case make sure that the API is not reachable for the **outside world**.

```yaml
plugin:
  kyverno:
    enabled: true
    ingress:
      enabled: true
      annotations:
        nginx.ingress.kubernetes.io/use-regex: "true"
        nginx.ingress.kubernetes.io/rewrite-target: /$1
      hosts:
        - host: domain.com
          paths:
            - path: '/(.*)'
              pathType: ImplementationSpecific
```

## Trivy Plugin

Details on configuring the various functions can be found on the respective function pages.

### Enable Trivy Plugin

Enable to optional Kyverno Plugin

```yaml
plugin:
  trivy:
    enabled: true
```

### High Available Setup

Because all features are stateless, you can deploy the Trivy Plugin without additional needs in HA mode (`replicaCount` > `1`).

The High Available setup adds an `PodDisruptionBudget` with a `minAvailable` of `1`. The `PodDisruptionBudget` can be configured to you personal needs.

```yaml
plugin:
  trivy:
    enabled: true
    replicaCount: 3
    # enabled if replicaCount > 1
    podDisruptionBudget:
      # -- Configures the minimum available pods for policy-reporter disruptions.
      # Cannot be used if `maxUnavailable` is set.
      minAvailable: 1
      # -- Configures the maximum unavailable pods for policy-reporter disruptions.
      # Cannot be used if `minAvailable` is set.
      maxUnavailable:
```

### NetworkPolicy

If enabled, the Helm Chart creates a NetworkPolicy resource to allow the Trivy Plugin egress traffic to the Policy Reporter REST API as well as ingress traffic to the Policy Reporter UI REST API. Ingress and egress rules can be extended as needed.

::: info
Make sure that your default network policy allows ingress traffic to the DNS service so that Policy Reporter and its components can resolve the DNS names used.
:::

```yaml
plugin:
  trivy:
    enabled: true
    networkPolicy:
      enabled: true
      egress: []
      ingress: []
```

### Ingress

Serve the API over a hostname with the integrated Ingress support. This is mainly needed for the **Multi Tenant** feature of Policy Reporter UI. In this case make sure that the API is not reachable for the **outside world**.

```yaml
plugin:
  trivy:
    enabled: true
    ingress:
      enabled: true
      annotations:
        nginx.ingress.kubernetes.io/use-regex: "true"
        nginx.ingress.kubernetes.io/rewrite-target: /$1
      hosts:
        - host: domain.com
          paths:
            - path: '/(.*)'
              pathType: ImplementationSpecific
```

## Monitoring

The Monitoring Subchart integrates Policy Reporter into the [Prometheus Operator](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack).

This Subchart creates a ServiceMonitor for the available /metrics endpoint of Policy Reporter to be fetched from Prometheus along with three preconfigured dashboards (as ConfigMaps) for the provided Grafana.

### Enable Monitoring

Enable to optional Kyverno Plugin

```yaml
monitoring:
  enabled: true
```

### ServiceMonitor

By default, the ServiceMonitor is created in the Helm release namespace without additional labels. Depending on your installation you may have to add labels to match the `serviceMonitorSelector` of your Prometheus CRD. If you use the Helm Chart from the Prometheus community as linked above, you need a label `release` with the release name of your Prometheus operator installation. The `serviceMonitor.namespace` configuration is optional and can be changed as needed.

```yaml
monitoring:
  enabled: true
  serviceMonitor:
    # HonorLabels chooses the metrics labels on collisions with target labels
    honorLabels: false
    # allow to override the namespace for serviceMonitor
    namespace:
    # labels to match the serviceMonitorSelector of the Prometheus Resource
    labels: {}
    # https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/api.md#relabelconfig
    relabelings: []
    # see serviceMonitor.relabelings
    metricRelabelings: []
    # optional namespaceSelector
    namespaceSelector: {}
    # optional scrapeTimeout
    scrapeTimeout:
    # optional scrape interval
    interval:
```

### Grafana Dashboards

To ensure that the ConfigMaps are identified as dashboards for Grafana, they need a special label `grafana_dashboard` and must be in the **namespace** of the Grafana installation.

The required label is preconfigured but can be changed if needed. The namespace must set. It is also possible to disable the ConfigMaps entirely.

```yaml
monitoring:
  enabled: true
  grafana:
    # namespace for configMap of grafana dashboards
    namespace:
    dashboards:
      # Enable the deployment of grafana dashboards
      enabled: true
      # Label to find dashboards using the k8s sidecar
      label: grafana_dashboard
      value: '1'
      labelFilter: []
      multicluster:
        enabled: false
        label: cluster
      enable:
        overview: true
        policyReportDetails: true
        clusterPolicyReportDetails: true
    folder:
      # Annotation to enable folder storage using the k8s sidecar
      annotation: grafana_folder
      # Grafana folder in which to store the dashboards
      name: Policy Reporter
    datasource:
      label: Prometheus
      pluginId: prometheus
      pluginName: Prometheus

    # -- create GrafanaDashboard custom resource referencing to the configMap.
    # according to https://grafana-operator.github.io/grafana-operator/docs/examples/dashboard_from_configmap/readme/
    grafanaDashboard:
      enabled: false
      folder: kyverno
      allowCrossNamespaceImport: true
      matchLabels:
        dashboards: 'grafana'
```

### Dashboard Views

Depending on your `PolicyReports`, some result types like skipped or error are not supported. Also, depending on the size of your cluster and the number of namespaces, some parts are too small to be clearly arranged. To be flexible, the chart allows you to hide parts of the dashboard and change the height of the different components.

```yaml
monitoring:
  enabled: true
  policyReportDetails:
    firstStatusRow:
      height: 8
    secondStatusRow:
      enabled: true
      height: 2
    statusTimeline:
      enabled: true
      height: 8
    passTable:
      enabled: true
      height: 8
    failTable:
      enabled: true
      height: 8
    warningTable:
      enabled: true
      height: 4
    errorTable:
      enabled: true
      height: 4

  clusterPolicyReportDetails:
    statusRow:
      height: 6
    statusTimeline:
      enabled: true
      height: 8
    passTable:
      enabled: true
      height: 8
    failTable:
      enabled: true
      height: 8
    warningTable:
      enabled: true
      height: 4
    errorTable:
      enabled: true
      height: 4

  policyReportOverview:
    failingSummaryRow:
      height: 8
    failingTimeline:
      height: 10
    failingPolicyRuleTable:
      height: 10
    failingClusterPolicyRuleTable:
      height: 10
```
