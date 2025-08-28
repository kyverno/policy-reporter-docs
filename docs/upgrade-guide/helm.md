# Helm Chart Upgrade v2.x .. v3.x Guide

## General

The overall structure has been revised by resolving the subcharts of the Helm Chart into a single chart organized with sub-directories for the various components.

This procedure simplifies the configuration of global settings and the configuration of the components with each other.

### Upgrade Globals

```yaml
global: # [!code --]
  plugins: # [!code --]
    kyverno: false #  [!code --]
  backend: "" # [!code --]
  fullnameOverride: "" # [!code --]
  namespace: "" # [!code --]
  labels: {} # [!code --]
  basicAuth: # [!code --]
    username: "" # [!code --]
    password: "" # [!code --]
    secretRef: "" # [!code --]

fullnameOverride: "policy-reporter"  # [!code ++]
namespaceOverride: "" # [!code ++]

global: # [!code ++]
  labels: {} # [!code ++]

basicAuth: # [!code ++]
  username: "" # [!code ++]
  password: "" # [!code ++]
  secretRef: "" # [!code ++]
```

### Upgrade ReportFilter

Small change to unify configuration structure across features

```yaml
reportFilter:
  namespaces:
    include: []
    exclude: []
  clusterReports: # [!code --]
    disabled: false # [!code --]
  disableClusterReports: false # [!code ++]
```

## Targets

The Policy Reporter specific field `priority` was removed and the corresponding `minimumPriority` configuration replaced by `minimumSeverity`. This changed for all targets.

The default behavior of target pushes has also been changed, generally only `fail`, `warning` and `error` results are sent. There were no known use cases in which successful or skipped results were sent.

### Example change

```yaml
target:
  loki:
    host: http://loki.monitoring:3000
    minimumPriority: 'warning' # [!code --]
    # minimum severity "" < info < low < medium < high < critical
    minimumSeverity: '' # [!code ++]
```

### UI Target

In the new Policy Reporter UI v2, the Log page function has been removed as it was of little use, so the related `ui` push target was also dropped.

### Telegram Target

To unify naming conventions the `chatID` option was renamed to `chatId`.

### AWS Targets

To unify naming conventions the `accessKeyID` option for all AWS targets (S3, Kinesis, SecurityHub) was renamed to `accessKeyId`.

Same applies for the `accessKeyID` key in Secrets used via `secretRef` or `mountedSecret`. 

### SecurityHub Target

The **SecurityHub** integration has been completely redesigned. Instead of only pushing new violations without synchronizing removed resources or resolved policies, the new integration synchronizes all existing violations with SecurityHub and automatically resolves them once the associated resource or policy has been removed or the violation has been resolved.

```yaml
 securityHub:
    accessKeyID: "" # [!code --]
    accessKeyId: "" # [!code ++]
    secretAccessKey: ""
    secretRef: ""
    mountedSecret: ""
    region: ""
    endpoint: ""
    accountID: "" # [!code --]
    accountId: "" # [!code ++]
    productName: ""
    minimumPriority: "" # [!code --]
    minimumSeverity: "" # [!code ++]
    sources: []
    skipExistingOnStartup: true # [!code --]
    # Takes only effect when `cleanup` is disabled.
    skipExistingOnStartup: false # [!code ++]
    cleanup: false # [!code --]
    # Synces removed or resolved findings to SecurityHub
    synchronize: true # [!code ++]
    # Delay between AWS GetFindings API calls, to avoid hitting the API RequestLimit
    delayInSeconds: 2 # [!code ++]
```

### Loki Target

The Loki target now uses the `/loki/api/v1/push` API by default.

To align with other targets, the `source` label now reflects the `source` field of a PolicyReportResult. You can query all logs created by **Policy Reporter** now with the new `createdBy`=`policy-reporter` label.

## LeaderElecation

Small cleanup to enable `LeaderElecation` manually, its now only configured if Policy Reporter runs with `replicaCount` > `1`

```yaml
leaderElection:
  enabled: false # [!code --]
  releaseOnCancel: true
  leaseDuration: 15
  renewDeadline: 10
  retryPeriod: 2
```

## Policy Reporter UI

As a result of the general chart restructering all Policy Reporter UI related values can now be found under `ui` in the main `values.yaml` file.

### Selector Labels

The selector labels of the Policy Reporter UI deployment have been changed in v3 of the Helm chart which causes an upgrade from v2 to v3 of the Helm chart to fail. If possible, you can delete the Policy Reporter UI deployment before upgrading. This will understandably result in some downtime for the Policy Reporter UI but will resolve the upgrade failure. Alternatively, in [v3.4.2](https://github.com/kyverno/policy-reporter/releases/tag/policy-reporter-3.4.2) of the Helm chart, a fix was released to allow manually overriding the selector labels so you can specify the old selector labels of the Policy Reporter UI deployment as follows which resolves the upgrade failure:

```yaml
ui:
  selectorLabels:
    app.kubernetes.io/instance: "<HELM-RELEASE-NAME>" # specify the name of the Helm release for the Helm chart
    app.kubernetes.io/name: ui
```

For more details, please see [`kyverno/policy-reporter#1113`](https://github.com/kyverno/policy-reporter/issues/1113).

### RefreshInterval

Automatic refresh has been removed in Policy Reporter UI v2. The page must now be refreshed manually.

```yaml
ui:
  refreshInterval: 10000 # [!code --]
```

### Logs

As mentioned, this feature has also been removed and the maximum number of logs no longer needs to be configured.

```yaml
ui:
  log: # [!code --]
    size: 200 # [!code --]
```

### Views

The organization of the dashboard has been completely revised and is now dependent on the available sources and categories. The current MVP does not offer the possibility to control the generally displayed pages. This might be implemented in a future release.

```yaml
ui:
  views:  # [!code --]
    dashboard:  # [!code --]
      policyReports: true  # [!code --]
      clusterPolicyReports: true  # [!code --]
    logs: true  # [!code --]
    policyReports: true  # [!code --]
    clusterPolicyReports: true  # [!code --]
    kyvernoPolicies: true  # [!code --]
    kyvernoVerifyImages: true  # [!code --]
```

### Clusters

The configuration of all connected clusters, including the default cluster, are now unified in a single `clusters` list configuration.

```yaml
ui:
  plugins:   # [!code --]
    kyverno: false   # [!code --]

  clusterName: ""   # [!code --]
  
  clusters:   # [!code --]
    - name: External Cluster   # [!code --]
      api: https://policy-reporter.external.cluster   # [!code --]
      kyvernoApi: https://policy-reporter-kyverno-plugin.external.cluster   # [!code --]
      skipTLS: false # [!code --]
      certificate: "/app/certs/root.ca" # [!code --]
      secreRef: ""  # [!code --]
      basicAuth: # [!code --]
        username: "" # [!code --]
        password: "" # [!code --]

  name: Default # [!code ++]

  clusters: # [!code ++]
  - name: External Cluster  # [!code ++]
    host: https://policy-reporter.external.cluster  # [!code ++]
    skipTLS: false # [!code ++]
    certificate: "/app/certs/root.ca" # [!code ++]
    secreRef: "" # [!code ++]
    basicAuth:   # [!code ++]
      username: ""   # [!code ++]
      password: ""   # [!code ++]
    plugins:  # [!code ++]
    - name: kyverno  # [!code ++]
      host: https://policy-reporter-kyverno-plugin.external.cluster  # [!code ++]
```

### Label Filter

They are not available in the corrent MVP, checkout [Custom Boards](/policy-reporter-ui/custom-boards) as an alternative approach.

```yaml
ui:
  labelFilter: ['owner'] # [!code --]
```

### API Config

The API configuration moved to `server`.

```yaml
ui:
  api: # [!code --]
    logging: false # [!code --]
    overwriteHost: true # [!code --]

  server: # [!code ++]
    port: 8080 # [!code ++]
    overwriteHost: true # [!code ++]

  logging: # [!code ++]
    api: true # [!code ++]
```

### Redis

The optional redis support in the UI was only intended for the removed Logs page and is no longer necessary.

```yaml
ui:
  redis: # [!code --]
    enabled: false # [!code --]
    address: "" # [!code --]
    database: 0 # [!code --]
    prefix: "policy-reporter-ui" # [!code --]
    username: "" # [!code --]
    password: "" # [!code --]
```

### Component API Port configurations

They were only needed because of the previous structure of the subcharts and are no longer necessary.

```yaml
ui:
  policyReporter:  # [!code --]
    port: 8080  # [!code --]

kyvernoPlugin:  # [!code --]
    port: 8080  # [!code --]
```

## Kyverno Plugin

The plugin system has been completely revised for Policy Reporter UI v2, details can be found in the corresponding [Plugin-System](/plugin-system/introduction) section in the documentation. While most of the configuration options for the Kyverno plugin have remained the same, the value path in the Helm Chart has been moved from `kyvernoPlugin` to `plugin.kyverno`.

As a result of the general chart restructering all Kyverno Plugin related values can now be found under `plugin.kyverno` in the main `values.yaml` file.

### Enable the Plugin

```yaml
kyvernoPlugin: # [!code --]
  enabled: true # [!code --]

ui: # [!code --]
  plugins: # [!code --]
    kyverno: false # [!code --]

plugin: # [!code ++]
  kyverno: # [!code ++]
    enabled: true # [!code ++]
```

### API Config

The configuration of `api` and `port` are now combined under `server`. The REST API is now always activated.

```yaml
kyvernoPlugin: # [!code --]
  enabled: true # [!code --]
  port: # [!code --]
    name: rest # [!code --]
    number: 8080 # [!code --]
  api: # [!code --]
    logging: false # [!code --]
  rest: # [!code --]
    enabled: true # [!code --]

plugin: # [!code ++]
  kyverno: # [!code ++]
    enabled: true # [!code ++]
    server: # [!code ++]
      port: 8080 # [!code ++]
```

### Metrics

The plugin's metrics support has been removed in the current MVP.

```yaml
kyvernoPlugin: # [!code --]
  enabled: true # [!code --]
  metrics: # [!code --]
    enabled: false # [!code --]
```

## Trivy Plugin

The Policy Reporter Helm Chart v3 introduced a new Plugin for Trivy Vulnerability findings, you can find details on the correspondig [Trivy Plugin](/plugin-system/trivy-plugin) page.

### Enable the Plugin


```yaml
plugin: # [!code ++]
  trivy: # [!code ++]
    enabled: true # [!code ++]
```

## Monitoring

While the structure of the `monitoring` subchart remains largely the same, the hardcoded `ServiceMonitor` relabelings for removing duplicate data has been removed. Instead, the dashboards have been updated to handle metrics from an HA setup with multiple pods.

### ServiceMonitor

If you only use the provided dashboards from the `monitoring` subchart you have nothing to change. All are dashboards updated to handle this change.

If you use your own dashboards you can:

1. recreate the old behavior by adding the removed relabelings to your values:

```yaml
monitoring:
  serviceMonitor:
    relabelings: # [!code ++]
    - action: labeldrop # [!code ++]
      regex: pod|service|container # [!code ++]
    - targetLabel: instance # [!code ++]
      replacement: policy-reporter # [!code ++]
      action: replace # [!code ++]
```

2. update your dashboards to handle the pod label

Example:


```
# before
sum(policy_report_result{policy=~"$policy", category=~"$category", severity=~"$severity", source=~"$source", kind=~"$kind", exported_namespace=~"$namespace" } > 0) by (status, exported_namespace)

# after
max(sum(policy_report_result{policy=~"$policy", category=~"$category", severity=~"$severity", source=~"$source", kind=~"$kind", exported_namespace=~"$namespace" } > 0) by (status, exported_namespace, pod)) by (status, exported_namespace)
```
