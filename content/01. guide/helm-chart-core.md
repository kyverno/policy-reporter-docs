---
title: Helm Chart
description: 'Policy Reporter Helm Chart configuration'
position: 4
category: Guide
---

# Helm Chart

The available Helm Chart is the easiest way to install and configure Policy Reporter. Depending on your usage, it provides several values to configure features and disable anything else.

<alert>

The following explanations focus on feature-based configurations. Additional configurations like __resource limits__, __nodeSelector__, etc. are also possible for each component. See the `values.yaml` of the related chart for reference.

</alert>

## Usage

### Add the Policy Reporter Helm Repository

```bash
helm repo add policy-reporter https://kyverno.github.io/policy-reporter
helm repo update
```

### Installation

```bash
helm install policy-reporter policy-reporter/policy-reporter -f values.yaml --create-namespace -n policy-reporter
```

## Configuration

By default all available features are disabled. So it's up to the user to enable or configure the features needed. This approach reduces the required resources to a bare minimum.

<alert>

See the complete <a href="https://raw.githubusercontent.com/kyverno/policy-reporter/main/charts/policy-reporter/values.yaml" target="_blank">values.yaml</a> for reference.

</alert>

### Enable Metrics Endpoint

Metrics will be available at `http://policy-reporter:8080/metrics`

```yaml [values.yaml]
metrics:
  enabled: true
```

### Enable REST Endpoints

REST APIs will be available at `http://policy-reporter:8080/v1/` see [API Reference](/core/api-reference) for details.

```yaml [values.yaml]
rest:
  enabled: true
```

### Enable API BasicAuth (since v2.20.0)

It is possible to enable global HTTP Basic Authentication for the API and metric endpoints

```yaml [values.yaml]
global:
  basicAuth:
    # username: username
    # password: password
    secretRef: auth-secret
```

The credentials can be configured directly or as reference to an already existing secret with `username` and `password` key/value pairs.

Policy Reporter UI will automatically do authorized API calls. If `monitoring` is enabled the ServiceMonitor resources will also get the required `basicAuth` configuration.


### Enable Targets / Notification

Policy Reporter supports several targets to which notifications can be sent. You can configure as many targets as you like, and also configure different targets for different priorities or sources (like Kyverno, Kube Bench or Falco). Channels in combination with filters allow you to configure multiple clients of the same type of targets. This is useful, for example, to forward different priorities or results of certain namespaces to a separate Slack channel.

For example, you can configure Grafana Loki by providing an accessible host or Slack with different channels:

```yaml [values.yaml]
target:
  loki:
    # loki host address
    host: "http://loki.loki-stack:3100"
    # loki API path, defaults to "/api/prom/push" (deprecated)
    path: "/loki/api/v1/push"
    # minimum priority "" < info < warning < critical < error
    minimumPriority: "warning"
    # Skip already existing PolicyReportResults on startup
    skipExistingOnStartup: true
    # Send only results from the given sources
    customLabels:
      cluster: rancher-desktop
    sources:
    - kyverno
    - falco
  
  slack:
    minimumPriority: "warning"
    skipExistingOnStartup: true
    channels:
    - webhook: "https://hooks.slack.com/services/123..."
      filter:
        namespaces:
          include: ["team-a-*"]
    - webhook: "https://hooks.slack.com/services/456..."
      filter:
        namespaces:
          include: ["team-b-*"]
```

#### Use secretRef

Instead of defining your credentials or webhooks directly in the `values.yaml`, you can also use the `secretRef` configuration to define an already existing __Secret__ by name. If the secret does not exist, the target is skipped.

The Secret should contain the related configuration as `key`. Supported keys are host, webhook, username, password, token, accessKeyID and secretAccessKey - depending on the related target. Only exception is `token`, which is dedicated for `webhook` targets and is added as Authorization header.

The `secretRef` is also supported for channels, so you can use different secrets for different channels.

```yaml [values.yaml]
# values.yaml
target:
  slack:
    minimumPriority: "warning"
    skipExistingOnStartup: true
    channels:
    # secretRef configuration
    - secretRef: "team-a-slack-webhook"
      filter:
        namespaces:
          include: ["team-a-*"]
    # inline configuration
    - webhook: "https://hooks.slack.com/services/456..."
      filter:
        namespaces:
          include: ["team-b-*"]
```

related Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: team-a-slack-webhook
type: Opaque
data:
  webhook: aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDAuLi4= # https://hooks.slack.com/services/T0...
```

<alert>

See [Targets](/core/targets) for all available targets and how to configure them.

</alert>

### Enable E-Mail Reports

Sends automatically and regularly email summary reports over a configured SMTP server to one ore more emails. It supports `filter` and `channels` to send only a subset of namespaces or sources to dedicated emails, this is useful in multi tenant environments.

```yaml [values.yaml]
emailReports:
  clusterName: "" # (optional) - displayed in the E-Mail Report if configured
  smtp:
    # (optional) name of a existing secret with all or a subset of the following SMTP configurations
    # its an alternative way to configure your SMTP server without exposing credentials in the values.yaml 
    secret: ""
    host: ""
    port: 465
    username: ""
    password: ""
    from: "" # Displayed From E-Mail Address
    encryption: "" # default is none, supports ssl/tls and starttls
    certificate: "" # path to your customize cert
    skipTLS: false # skip TLS verification

  # basic summary report
  summary:
    enabled: false
    schedule: "* 8 * * *" # CronJob schedule defines when the report will be send
    activeDeadlineSeconds: 300 # timeout in seconds
    backoffLimit: 3 # retry counter
    ttlSecondsAfterFinished: 0
    restartPolicy: Never # pod restart policy

    to: [] # list of receiver email addresses
    filter: {} # optional filters
    #  disableClusterReports: false # remove ClusterPolicyResults from Reports
    #  namespaces:
    #    include: []
    #    exclude: []
    #  sources:
    #    include: []
    #    exclude: []
    channels: [] # (optional) channels can be used to to send only a subset of namespaces / sources to dedicated email addresses
    #- to: ['team-a@company.org']
    #  filter:
    #    disableClusterReports: true
    #    namespaces:
    #      include: ['team-a-*']
    #    sources:
    #      include: ['Kyverno']

  # violation summary report
  violations:
    enabled: false
    schedule: "* 8 * * *" # CronJob schedule defines when the report will be send
    activeDeadlineSeconds: 300 # timeout in seconds
    backoffLimit: 3 # retry counter
    ttlSecondsAfterFinished: 0
    restartPolicy: Never # pod restart policy

    to: [] # list of receiver email addresses
    filter: {} # optional filters
    #  disableClusterReports: false # remove ClusterPolicyResults from Reports
    #  namespaces:
    #    include: []
    #    exclude: []
    #  sources:
    #    include: []
    #    exclude: []
    channels: [] # (optional) channels can be used to to send only a subset of namespaces / sources to dedicated email addresses
    #- to: ['team-a@company.org']
    #  filter:
    #    disableClusterReports: true
    #    namespaces:
    #      include: ['team-a-*']
    #    sources:
    #      include: ['Kyverno']
```

### PolicyReport CRD Filter

Filter processed PolicyReport resources by namespace - you can either define an include or exclude list of namespaces with wildcard support. See [report filter](/core/report-filter) for details.

```yaml [values.yaml]
# Filter PolicyReport resources to process
reportFilter:
  namespaces:
    # Process only PolicyReport resources from an included namespace, wildcards are supported
    include: []
    # Ignore all PolicyReport resources from a excluded namespace, wildcards are supported
    # exclude will be ignored if an include filter exists
    exclude: []
  clusterReports:
    # Disable the processing of ClusterPolicyReports
    disabled: false
```

### Metric customization

#### Metric Modes

Reduce the cardinality of the PolicyReportResult metrics by customize the provided labels.

Available metric modes are:
* __detailed__ (default): provides all existing label information but has a high cardinality.<br />Creates 1 metric per resource / policy / rule
* __simple__: provides a predefined subset of the available labels with a lower cardinality.<br />Provides ["namespace", "policy", "status", "severity", "category", "source"]
* __custom__: provides the configured labels as list via the `metrics.customLabels` value.<br />It supports all labels that are also available in the __detailed__ mode.<br />See the [API Reference](/core/api-reference#policy_report_result) for details.


```yaml [values.yaml]
metrics:
  enabled: true
  mode: custom
  customLabels: ["namespace", "policy", "source", "status"]
```

##### Metric Report Label

Use (Cluster)PolicyReport labels as additional metric labels in `custom` mode. Invalid metric label characters will be replaced with `_`.

__Example__

Add the `app` label of each (Cluster)PolicyReport, if available, as metric label.

```yaml [policy-report]
apiVersion: wgpolicyk8s.io/v1alpha2
kind: PolicyReport
metadata:
  labels:
    app: nginx
  name: cpol-disallow-host-path
  namespace: test
```

```yaml [values.yaml]
metrics:
  enabled: true
  mode: custom
  customLabels: ["status","label:app"]
```

```
# HELP policy_report_result List of all PolicyReport Results
# TYPE policy_report_result gauge
policy_report_result{app="nginx",status="pass"} 1
policy_report_result{app="",status="pass"} 1
```

##### Metric Property Label

Use PolicyReportResult `properties` as additional labels in `custom` mode. Invalid metric label characters will be replaced with `_`.

__Example__

Add the `score` property of PolicyReportResults, if available, as metric label.

```yaml [policy-report]
apiVersion: wgpolicyk8s.io/v1alpha2
kind: PolicyReport
  name: trivy-vuln-polr-nginx-5fbc65fff
  namespace: test
  ...
results:
- category: Vulnerability Scan
  message: 'apt: integer overflows and underflows while parsing .deb packages'
  policy: CVE-2020-27350
  properties:
    artifact.repository: library/nginx
    artifact.tag: "1.17"
    score: "5.7"
```

```yaml [values.yaml]
metrics:
  enabled: true
  mode: custom
  customLabels: ["property:score", "property:artifact.tag", "status"]
```

```
# HELP policy_report_result List of all PolicyReport Results
# TYPE policy_report_result gauge
policy_report_result{artifact_tag="1.17",score="5.7",status="pass"} 1
policy_report_result{artifact_tag="",score="",status="pass"} 1
```

#### Metric Filter

Configure the processed namespaces, sources, policies, severities, kinds and/or status for metrics to get rid of unnecessary metrics. You can either define exclude or include rules, with wildcard support, for each available filter and combine them as needed.

```yaml [values.yaml]
metrics:
  enabled: true
  filter:
    namespaces:
      include: ["prod", "stage"]
    sources:
      include: ["Trivy*", "Kyverno"]
    status:
      exclude: ["skip"]
    kinds:
      exclude: ["Pod"]
```

### Priority Mapping

Define a custom mapping for fail results based on the related __policy__. You can also overwrite the default priority for fail results without a severity. See [priority mapping](/core/priority-mapping) for details.

```yaml [values.yaml]
policyPriorities:
  # used for all fail results without severity or concrete mapping
  default: warning
  # used for all fail results of the require-ns-labels policy independent of the severity
  require-ns-labels: error
```

### External Databases (AppVersion >= 2.15.0)

By default, Policy Reporter uses an internal SQLite database to convert (cluster) policies into an internal SQL schema. The REST API uses this schema to execute performant queries and filter or group information according to various criteria.

While this works well in most scenarios, SQLite can reach its limits in large environments. To overcome these limitations, it is possible to configure an external SQL database. Currently PostgreSQL, MySQL and MariaDB are supported.

In a HA setup, only one pod writes to the database, all other pods only read from it. In case of a new leader promotion, the new leader cleans up the DB and recreates the current state to reflect possible changes during the downtime of the previous leader.

```yaml [values.yaml]
database:
  type: "postgres"
  database: "policy-reporter"
  username: "username"
  password: "password"
  host: "localhost:5432"
  enableSSL: false
  # instead of configure the individual values you can also provide an DSN string
  # example postgres: postgres://postgres:password@localhost:5432/postgres?sslmode=disable
  # example mysql: root:password@tcp(localhost:3306)/test?tls=false
  dsn: ""
  # configure an existing secret as source for your values
  # supported fields: username, password, host, dsn, database
  secretRef: ""
  # use an mounted secret as source for your values, required the information in JSON format
  # supported fields: username, password, host, dsn, database
  mountedSecret: ""
```

### External Caching Storage

To reduce the memory usage of Policy Reporter in bigger clusters, it is possible to configure `Redis` as external caching service.

```yaml [values.yaml]
redis:
  # enables the feature
  enabled: false
  # address of the redis service
  address: "redis:6379"
  # used redis database
  database: 1
  # prefix for each key
  prefix: "policy-reporter"
  # optional authentication
  username: ""
  password: ""
```

### Logging

Since AppVersion `2.14.0` its possible to customize the logger output like `encoding` and `logLevel`. It is also possible to enable API access debug logging.

```yaml [values.yaml]
logging:
  encoding: console  # possible encodings are console and json
  logLevel: 0        # default info
  development: false # more human readable structure, enables stacktraces and removes log sampling

api:
  logging: false     # enable debug API access logging, sets logLevel to debug
```

### High Available Setup

The High Available setup makes it possible to deploy more then one instance of Policy Reporter without the issue of duplicated pushes.
By default HA mode will be enabled if the `replicaCount` is higher then `1`.

Policy Reporter uses `LeaderElection`, to ensure that only one instance is responsible to send pushes for new `PolicyReportResults`. Other features like API requests and metrics are loadbalanced between each instance.

The High Available setup also adds an `PodDisruptionBudget` with a default `minAvailable` of `1`. Both, `LeaderElection` as well as the `PodDisruptionBudget` can be configured to you personal needs.

```yaml [values.yaml]
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

### Ingress

Serve the API over a hostname with the integrated Ingress support. This is mainly needed for the [Multi Tenance Feature](/guide/helm-chart-core#external-clusters) of Policy Reporter UI. In this case make sure that the API is not reachable for the outside world.

```yaml [values.yaml]
ingress:
  enabled: true
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$1
  hosts:
    - host: domain.com
      paths:
      - path: "/(.*)"
```

### Enable NetworkPolicy

If enabled, the Helm Chart creates a NetworkPolicy resource to allow Policy Reporter egress traffic to the Kubernetes API (defaults to port `6443`) as well as ingress traffic to the Policy Reporter REST API from the Policy Reporter UI. Ingress and egress rules for additional targets or monitoring tools can be extended as needed.

```yaml [values.yaml]
networkPolicy:
  enabled: true
  egress:
  - to:
    ports:
    - protocol: TCP
      port: 6443
  ingress: []
```

## Subcharts

Extend Policy Reporter with the __Policy Reporter UI__ and __Kyverno Plugin__ subcharts. The __Monitoring__ subchart helps you link Policy Reporter to your <a href="https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack" target="_blank">Prometheus Operator</a> setup.

## Policy Reporter UI

<alert>

Each value is prefixed with `ui` to be clear that it has to be configured under this subchart.

</alert>

<alert>

See the complete <a href="https://raw.githubusercontent.com/kyverno/policy-reporter/main/charts/policy-reporter/charts/ui/values.yaml" target="_blank">values.yaml</a> for reference.

</alert>

Enable the Policy Reporter UI subchart and the required Policy Reporter REST API.

```yaml [values.yaml]
ui:
  enabled: true
```

### Display Mode

Policy Reporter UI supports a light and dark mode. The default depends on your system/browser configuration. To enforce a default mode, configure it with:

```yaml [values.yaml]
ui:
  displayMode: dark # available options: dark / light
```

### Log size

Configure the maximum size of the log in the Policy Reporter UI:

```yaml [values.yaml]
ui:
  logSize: 200 # 200 items are stored in memory
```

### Refresh Interval

Configure the default refresh interval for all requests in millseconds, you can set it to `0`, to disable autorefreshing.

```yaml [values.yaml]
ui:
  refreshInterval: 10000
```

### Configure Views

Policy Reporter UI has different views for different kinds of information. Each view, except the dashboard as the entrypoint, can be enabled or disabled as needed. The dashboard can be customized by disabling ClusterPolicyReport or PolicyReport information.

```yaml [values.yaml]
ui:
  views:
    dashboard:
      policyReports: true
      clusterPolicyReports: true
    logs: true # also remove the UI as target of policy reporter
    policyReports: true
    clusterPolicyReports: true
    kyvernoPolicies: true
    kyvernoVerifyImages: true
```

### External Clusters

<alert type="warning">

<b>Attention:</b> be sure that your APIs are not accessable for the outside world!<br />
Use tools like VPN, private Networks or internal Network Load Balancer to expose your APIs in a secure way to the UI

</alert>

By default, the Policy Reporter UI processes only the Policy Reporter REST API running in the same cluster. If you are working in a multi-cluster environment and running Policy Reporter in each cluster, it can be annoying to switch between the different UIs of each cluster. To solve this problem, it is possible to configure additional Policy Reporter REST APIs from external clusters and switch between them as needed.

The APIs must be accessible for Policy Reporter UI, currently only HTTP Basic authentication is supported. Make sure that you make your APIs available only internally.

To activate the REST-API of your external installations of Policy Reporter, you must set `rest.enabled` to `true` in the respective configurations.

You can use the the `ui.clusterName` configuration to set the name of the default Cluster API, default is `Default`.

```yaml [values.yaml]
ui:
  clusterName: Dev Cluster # name used in the ClusterSelect for the default API

  clusters:
  - name: External Cluster                              # name used for the selection of the Cluster
    api: https://policy-reporter.external.cluster       # reachable external Policy Reporter REST API
    kyvernoApi: https://kyverno-plugin.external.cluster # (optional) reachable external Policy Reporter Kyverno Plugin REST API
    skipTLS: false                                      # skip SSL verification
    certificate: "/app/certs/root.ca"                   # (optional) path to a mounted root cert for custom signed domains
    username: username                                  # HTTP BasicAuth Username
    password: password                                  # HTTP BasicAuth Password
    secretRef: auth-secret                              # all configuration can also provided as existing secret with the related key/value pairs, except the cluster name.
```

#### External Cluster configuration

```yaml [values.yaml]
rest:
  enabled: true
```

### Kyverno Plugin integration

<alert>

Requires the `kyvernoPlugin` subchart to be enabled.

</alert>

Enable the UI integration of the Kyverno Plugin to get additional __views__ about Kyverno Policies.

```yaml [values.yaml]
ui:
  plugins:
    kyverno: true
```

### Logging

Since AppVersion `1.18.2` its possible to customize the logger output like `encoding` and `logLevel`. It is also possible to enable Proxy request debug logging.

```yaml [values.yaml]
logging:
  encoding: console  # possible encodings are console and json
  logLevel: 0        # default info
  development: false # more human readable structure, enables stacktraces and removes log sampling

api:
  logging: false     # enable debug Proxy request logging, sets logLevel to debug
```


### High Available Setup

Because most features are stateless, you can deploy Policy Reporter UI without additional needs in HA mode (`replicaCount` > `1`). The only exception is the Log page, which receives pushes from Policy Reporter and hold them in memory by default. If you are using this feature it is recommended to configure `redis` as central storage for Log entries.

The High Available setup adds an `PodDisruptionBudget` with a default `minAvailable` of `1`. The `PodDisruptionBudget` can be configured to you personal needs.

```yaml [values.yaml]
ui:
  replicaCount: 3

  # use redis as external log storage instead of an in memory store
  # recommended when using a HA setup with more then one replica
  # to get all logs on each instance 
  redis:
    enabled: false
    address: "redis:6379"
    database: 0
    prefix: "policy-reporter-ui"
    username: ""
    password: ""

  # enabled if replicaCount > 1
  podDisruptionBudget:
    # -- Configures the minimum available pods for policy-reporter-ui disruptions.
    # Cannot be used if `maxUnavailable` is set.
    minAvailable: 1
    # -- Configures the maximum unavailable pods for policy-reporter-ui disruptions.
    # Cannot be used if `minAvailable` is set.
    maxUnavailable:
```

### Ingress

Serve the UI over a hostname with the integrated __Ingress__ support.

```yaml [values.yaml]
ui:
 ingress:
    enabled: true
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /$1
    hosts:
      - host: domain.com
        paths:
        - path: "/(.*)"
```

### Enable NetworkPolicy

If enabled, it creates an additional NetworkPolicy to allow ingress traffic to the Policy Reporter UI on the default Port `8080` and egress traffic to Policy Reporter and the Kyverno Plugin if enabled. Egress rules can be extended as needed.

```yaml [values.yaml]
ui:
  networkPolicy:
    enabled: true
    egress: []
```

## Kyverno Plugin

<alert>

Each value is prefixed with `kyvernoPlugin` to be clear that it has to be configured under this subchart.

</alert>

<alert>

Other than Policy Reporter, the __metrics__ as well as the __REST__ API are enabled by default.

</alert>

<alert>

See the complete <a href="https://raw.githubusercontent.com/kyverno/policy-reporter/main/charts/policy-reporter/charts/kyvernoPlugin/values.yaml" target="_blank">values.yaml</a> for reference.

</alert>

Enable the Policy Reporter Kyverno Plugin subchart.

```yaml [values.yaml]
kyvernoPlugin:
  enabled: true
```

### Disable Metrics Endpoint

```yaml [values.yaml]
kyvernoPlugin:
  metrics:
    enabled: false
```

### Disable REST Endpoint

```yaml [values.yaml]
kyvernoPlugin:
  rest:
    enabled: false
```

### Enable enforce violation PolicyReports (requires Kyverno >= 1.7.0)

Because Kyverno creates PolicyReports only for audit Policies, Policy Reporters KyvernoPlugin brings the possibility to create additional PolicyReports for blocked resources as well. This makes it possible to get also metrics and notification about resources blocked by an enforce Policy.

By default PolicyReportResults are using another source (`Kyverno Event`) as audit results,  so that they are displayed on separate pages. This source is customizable, so you can change it for example to `Kyverno`, so the results are shown in the same dashboards as the audit results.

```yaml [values.yaml]
kyvernoPlugin:
  blockReports:
    # enable the feature
    enabled: false
    # namespace where kyverno events are created
    # set to an empty string to watch for events in all namespaces
    eventNamespace: default
    results: 
      # maximal results stored in a PolicyReport per namespace
      maxPerReport: 200
      # keep only the latest result of the same violation in the report
      keepOnlyLatest: false
    # source used for the PolicyReportResults
    source: "Kyverno Event"
```
``

### Logging

Since AppVersion `1.5.1` its possible to customize the logger output like `encoding` and `logLevel`. It is also possible to enable API access debug logging.

```yaml [values.yaml]
logging:
  encoding: console  # possible encodings are console and json
  logLevel: 0        # default info
  development: false # more human readable structure, enables stacktraces and removes log sampling

api:
  logging: false     # enable debug API access logging, sets logLevel to debug
```

### High Available Setup

In HA mode KyvernoPlugin uses `LeaderElection` to ensure that only one instance is responsible for managing block-PolicyReports. Other features like API requests and metrics are loadbalanced between each instance. This means, if `kyvernoPlugin.blockReports.enabled` is `false`, `leaderElection` is not needed and will be disabled.

The High Available setup also adds an `PodDisruptionBudget` with a default `minAvailable` of `1`. Both, `LeaderElection` as well as the `PodDisruptionBudget` can be configured to you personal needs.

```yaml [values.yaml]
kyvernoPlugin:
  replicaCount: 3

  # enabled if replicaCount > 1
  podDisruptionBudget:
    # -- Configures the minimum available pods for policy-reporter disruptions.
    # Cannot be used if `maxUnavailable` is set.
    minAvailable: 1
    # -- Configures the maximum unavailable pods for policy-reporter disruptions.
    # Cannot be used if `minAvailable` is set.
    maxUnavailable:

  # required if policy-reporter-kyverno-plugin should run in HA mode and the "blockReports" feature is enabled
  # if "blockReports" is disabled, leaderElection is also disabled automatically
  # will be enabled when replicaCount > 1
  leaderElection:
    enabled: false
    releaseOnCancel: true
    leaseDuration: 15
    renewDeadline: 10
    retryPeriod: 2
```

### Ingress

Serve the API over a hostname with the integrated Ingress support. This is mainly needed for the [Multi Tenance Feature](/guide/helm-chart-core#external-clusters) of Policy Reporter UI. In this case make sure that the API is not reachable for the outside world.

```yaml [values.yaml]
kyvernoPlugin:
  ingress:
    enabled: true
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /$1
    hosts:
      - host: domain.com
        paths:
        - path: "/(.*)"
```


### Enable NetworkPolicy

If enabled, the Helm Chart creates a NetworkPolicy resource to allow Policy Reporter Kyverno Plugin egress traffic to the Kubernetes API (defaults to port `6443`) as well as ingress traffic to the REST API from the Policy Reporter UI. Ingress and egress rules can be extended as needed.

```yaml [values.yaml]
kyvernoPlugin:
  networkPolicy:
    enabled: true
    egress:
    - to:
      ports:
      - protocol: TCP
        port: 6443
    ingress: []
```

## Monitoring

<alert>

Each value is prefixed with `monitoring` to be clear that it has to be configured under this subchart.

</alert>
<alert>

See the complete <a href="https://raw.githubusercontent.com/kyverno/policy-reporter/main/charts/policy-reporter/charts/monitoring/values.yaml" target="_blank">values.yaml</a> for reference.

</alert>

The Monitoring Subchart integrates Policy Reporter into the <a href="https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack" target="_blank">Prometheus Operator</a>.

This Subchart creates a ServiceMonitor for the available `/metrics` endpoint of Policy Reporter to be fetched from Prometheus along with three preconfigured dashboards (as ConfigMaps) for the provided Grafana.

Enable the Policy Reporter Monitoring subchart.

```yaml [values.yaml]
monitoring:
  enabled: true
```

### Configure the ServiceMonitor

By default, the ServiceMonitor is created in the HelmRelease namespace without additional labels. Depending on your installation you may have to add labels to match the `serviceMonitorSelector` of your Prometheus CRD. If you use the Helm Chart from the Prometheus community as linked above, you need a label `release` with the release name of your Prometheus operator installation. The `serviceMonitor.namespace` configuration is optional and can be changed as needed.

```yaml [values.yaml]
monitoring:
  serviceMonitor:
    namespace:
    labels:
      release: prometheus-operator
```

### Enable the Kyverno Plugin integration

<alert>

Requires the `kyvernoPlugin` subchart to be enabled.

</alert>

If enabled, a second ServiceMonitor will be created for the `/metrics` endpoint of the Kyverno Plugin. This ServiceMonitor also uses the configuration provided by `monitoring.serviceMonitor`.

```yaml [values.yaml]
monitoring:
  plugins:
    kyverno: true
```

### Configure Grafana Dashboards

To ensure that the ConfigMaps are identified as dashboards for Grafana, they need a special label `grafana_dashboard` and must be in the namespace of the Grafana installation.

The required label is preconfigured but can be changed if needed. The namespace must set. It is also possible to disable the ConfigMaps entirely.

```yaml [values.yaml]
monitoring:
  grafana:
    # required: namespace of your Grafana installation
    namespace:
    dashboards:
      # Enable the deployment of grafana dashboards
      enabled: true 
      # Label to find dashboards using the k8s sidecar
      label: grafana_dashboard
    # works only if it is supported by your Grafana installation
    folder:
      # Annotation to enable folder storage using the k8s sidecar
      annotation: grafana_folder
      # Grafana folder in which to store the dashboards
      name: Policy Reporter
```

### Configure the Dashboard Views

Depending on your Policy Reports, some result types like `skipped` or `error` are not supported. Also, depending on the size of your cluster and the number of namespaces, some parts are too small to be clearly arranged. To be flexible, the Subchart allows you to hide parts of the dashboard and change the height of the different components.

```yaml [values.yaml] 
monitoring:
  # PolicyReport Details Dashboard
  policyReportDetails:
    # high of pass and fail Bar Charts
    firstStatusRow:
      height: 8
    # high of warn and error Bar Charts
    secondStatusRow:
      enabled: true
      height: 2
    # change the high of the Timeline or disable it
    statusTimeline:
      enabled: true
      height: 8
    # change the high of the different status tables or disable them as you like
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

  # ClusterPolicyReport Details Dashboard
  clusterPolicyReportDetails:
    # high of the status counter boxes
    statusRow:
      height: 6
    # change the high of the Timeline or disable it
    statusTimeline:
      enabled: true
      height: 8
    # change the high of the different status tables or disable them as you like
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

  # PolicyReports Dashboard
  policyReportOverview:
    # high of the fail bar chart and counter box
    failingSummaryRow:
      height: 8
    # high of the timeline
    failingTimeline:
      height: 10
    # high of the PolicyReport fail table
    failingPolicyRuleTable:
      height: 10
    # high of the ClusterPolicyReport fail table
    failingClusterPolicyRuleTable:
      height: 10
```
