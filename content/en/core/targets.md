---
title: Targets
description: ''
position: 10
category: 'Policy Reporter'
---

Policy Reporter supports different targets to send new PolicyReport results. This makes it possible to create a log or get notified as soon as a new validation result is detected. The set of supported tools are based on personal needs and user requests. Feel free to create an issue or pull request if you want support for a new target.

## Target Configurations

Each Target has similar configuration values. Required is always a valid and accessible __host__ or __webhook__ configuration to be able to send the events.

### Filter Possibilities

Different optional configurations allow you to define which results should be send to the given target. These configurations are available for every target and can be used together with `channels` to route notifications to various clients of the same type of target.

#### minimumPriority

Only events with the given priority or higher are sent. By default each priority is sent. See [priority mapping](/core/08-priority-mapping) for details.

#### sources

Send only results of the configured sources. By default results from all sources are sent.

#### skipExistingOnStartup

On startup, Policy Reporter registers all existing results in the cluster. By default these results are ignored. If you also want to send them to your target, you can set this option to *false*.

#### filter *(since AppVersion 2.5.0)*

The new filter option allows you to define include and exclude rules for the namespaces, policies and priorities of a result. Filters for namespaces and policies have wildcard support.

```yaml
slack:
  webhook: "https://hooks.slack.com/services/123..."
  skipExistingOnStartup: true
  filter:
    namespaces:
      include: ["team-a-*"]
    priorities:
      exclude: ["info", "debug"]
    policies:
      include: ["require-*"]
```

### Channels *(since AppVersion 2.5.0)*

The new `channels` option allows you to define multiple configurations of the same type of target. Thus, in combination with filters, you can route your notifications to different target configurations. Channels have the same configuration properties as the root target configuration.

See the different available targets for concrete example and usage of `channels` and `filter`.

## Grafana Loki

Policy Reporter can send results directly to Grafana Loki without the need of Promtail. Each result includes all available information as labels as well as a `source` label with `policy-reporter` as value. To query all messages from Policy Reporter, use `{source="policy-reporter"}` as the query.

### Example

The minimal configuration for Grafana Loki requires a valid and accessible host.

```yaml
loki:
  host: "http://loki.loki-stack:3100"
  path: "/loki/api/v1/push"
  minimumPriority: "warning"
  skipExistingOnStartup: true
  sources:
  - kyverno
```

### Channel Example

Channels uses the same `host`, `minimumPriority` and `skipExistingOnStartup` configuration as the root target if not defined.

#### Send notification based on namespace prefix with a related Team label

```yaml
loki:
  host: "http://loki.loki-stack:3100"
  path: "/loki/api/v1/push"
  minimumPriority: "warning"
  skipExistingOnStartup: true
  channels:
  - filter:
      namespaces:
        include: ["teame-a-*"]
    customLabels:
      team: "Team A"
  - filter:
      namespaces:
        include: ["teame-b-*"]
    customLabels:
      team: "Team B"
```

### Screenshot
<a href="/images/targets/grafana-loki.png" target="_blank">
    <img src="/images/targets/grafana-loki.png" style="border: 1px solid #555" alt="Grafana Loki Screenshot with PolicyReportResults" />
</a>

## Elasticsearch

Policy Reporter sends results in a JSON representation and all available information to a customizable index. This index can be expanded by selecting one of the different rotations or *none* to disable this function. By default Policy Reporter creates a new index on a daily basis.

### Additional configuration

* __index__ is used as an index name. Uses `policy-reporter` if not configured.
* __rotation__ is used to create rotating indexes by adding the rotation date as suffix to the index name. Possible values are `daily`, `monthly`, `annually` and `none`. Uses `daily` if not configured.

### Example

The minimal configuration for Elasticsearch requires a valid and accessible host.

```yaml
elasticsearch:
  host: "http://elasticsearch.elk-stack:8080"
  index: "policy-reporter"
  rotation: "daily"
  minimumPriority: "warning"
  skipExistingOnStartup: true
  sources:
  - kyverno
```

### Channel Example

Channels uses the same `host`, `minimumPriority` and `skipExistingOnStartup`, `index`, `rotation` configuration as the root target if not defined.

#### Send only critical notifications to a different index with a daily rotation

```yaml
elasticsearch:
  host: "http://elasticsearch.elk-stack:8080"
  index: "policy-reporter"
  rotation: "weekly"
  minimumPriority: "warning"
  skipExistingOnStartup: true
  filter:
    priorities:
      exclude: ["critical"]
  channels:
  - index: "critical-violations"
    rotation: "daily"
    filter:
      priorities:
        include: ["critical"]
```

### Screenshot

<a href="/images/targets/elasticsearch.png" target="_blank">
    <img src="/images/targets/elasticsearch.png" style="border: 1px solid #555" alt="Elasticvue Screenshot with PolicyReportResults" />
</a>

## Microsoft Teams

Send new PolicyReportResults with all available information over the webhook API to Microsoft Teams.

### Example

The minimal configuration for Microsoft Teams requires a valid and accessible webhook URL.

```yaml
teams:
  webhook: "https://m365x682156.webhook.office.com"
  minimumPriority: "critical"
  skipExistingOnStartup: true
  sources:
  - kyverno
```

### Channel Example

Channels uses the same `minimumPriority` and `skipExistingOnStartup` configuration as the root target if not defined.

#### Send notification based on namespace prefix to a dedicated Teams Channel

```yaml
teams:
  minimumPriority: "warning"
  skipExistingOnStartup: true
  channels:
  - webhook: "https://m365x682156.webhook.office.com/1"
    filter:
      namespaces:
        include: ["team-a-*"]
  - webhook: "https://m365x682156.webhook.office.com/2"
    filter:
      namespaces:
        include: ["team-b-*"]
```

### Screenshot
<a href="/images/targets/ms-teams.png" target="_blank">
    <img src="/images/targets/ms-teams.png" style="border: 1px solid #555" alt="MS Teams Notification for a PolicyReportResult" />
</a>

## Slack

Send new PolicyReportResults with all available information over the webhook API to Slack.

### Example

The minimal configuration for Slack requires a valid and accessible webhook URL.

```yaml
slack:
  webhook: "https://hooks.slack.com/services/..."
  minimumPriority: "critical"
  skipExistingOnStartup: true
  sources:
  - kyverno
```

### Channel Example

Channels uses the same `minimumPriority` and `skipExistingOnStartup` configuration as the root target if not defined.

#### Send notification based on namespace prefix to a dedicated Slack Channel

```yaml
slack:
  minimumPriority: "warning"
  skipExistingOnStartup: true
  channels:
  - webhook: "https://hooks.slack.com/services/T1..."
    filter:
      namespaces:
        include: ["team-a-*"]
  - webhook: "https://hooks.slack.com/services/T2..."
    filter:
      namespaces:
        include: ["team-b-*"]
```

### Screenshot
<a href="/images/targets/slack.png" target="_blank">
    <img src="/images/targets/slack.png" style="border: 1px solid #555" alt="Slack Notification for a PolicyReportResult" />
</a>

## Discord

Send new PolicyReportResults with all available information over the webhook API to Discord.

### Example

The minimal configuration for Discord requires a valid and accessible webhook URL.

```yaml
discord:
  webhook: "https://discordapp.com/api/webhooks/..."
  minimumPriority: "critical"
  skipExistingOnStartup: true
  sources:
  - kyverno
```

### Channel Example

Channels uses the same `minimumPriority` and `skipExistingOnStartup` configuration as the root target if not defined.

#### Send notification based on namespace prefix to a dedicated Discord Channel

```yaml
discord:
  minimumPriority: "warning"
  skipExistingOnStartup: true
  channels:
  - webhook: "https://discordapp.com/api/webhooks/1..."
    filter:
      namespaces:
        include: ["team-a-*"]
  - webhook: "https://discordapp.com/api/webhooks/2..."
    filter:
      namespaces:
        include: ["team-b-*"]
```

### Screenshot
<a href="/images/targets/discord.png" target="_blank">
    <img src="/images/targets/discord.png" style="border: 1px solid #555" alt="Discord Notification for a PolicyReportResult" />
</a>

## Policy Reporter UI

Send new PolicyReportResults with all available information as JSON to the REST API of Policy Reporter UI. You can find the received Results in the __Logs__ view of the UI. The results are stored in memory. The max number of stored results can be configured in the Policy Reporter UI.

If the Policy Reporter UI is installed via Helm Chart, it is configured as a target by default with a minimumPriority of `warning` and a maximum logSize of `200`. The logSize can be configured in the [Policy Reporter UI Subchart](/guide/04-helm-chart-core#log-size).

### Example

The minimal configuration for Policy Reporter UI requires a valid and accessible host URL.

```yaml
ui:
  host: "http://policy-reporter-ui:8080"
  minimumPriority: "warning"
  skipExistingOnStartup: true
  sources:
  - kyverno
```

### Screenshot
<a href="/images/targets/policy-reporter-log-dark.png" target="_blank" class="dark-img">
    <img src="/images/targets/policy-reporter-log-dark.png" style="border: 1px solid #555" alt="Policy Reporter UI - Logs View dark mode" />
</a>

<a href="/images/targets/policy-reporter-log-light.png" target="_blank" class="light-img">
    <img src="/images/targets/policy-reporter-log-light.png" style="border: 1px solid #555" alt="Policy Reporter UI - Logs View light mode" />
</a>

## Webhook

Send new PolicyReportResults with all available information as JSON POST request to a custom API with extendable header information.

### Example

The minimal configuration for Webhook requires a valid and accessible host URL.

```yaml
webhook:
  host: "http://webhook.de:8080"
  headers:
    Authorization: "Bearer XXXXXX"
  minimumPriority: "warning"
  skipExistingOnStartup: true
  sources:
  - kyverno
```

### Channel Example

Channels uses the same `minimumPriority` and `skipExistingOnStartup` configuration as the root target if not defined. Root `headers` will be merged together with the defined channel `headers`.

#### Send notification based on namespace prefix to a dedicated Webhook URL

```yaml
webhook:
  minimumPriority: "warning"
  skipExistingOnStartup: true
  headers:
    Authorization: "Bearer XXXXXX"
  channels:
  - host: "https://webhook.team-a.de"
    filter:
      namespaces:
        include: ["team-a-*"]
  - host: "https://webhook.team-b.de"
    filter:
      namespaces:
        include: ["team-b-*"]
```

### Content Example

```json
{
   "message":"validation error: Running as root is not allowed. The fields spec.securityContext.runAsNonRoot, spec.containers[*].securityContext.runAsNonRoot, and spec.initContainers[*].securityContext.runAsNonRoot must be `true`. Rule check-containers[0] failed at path /spec/securityContext/runAsNonRoot/. Rule check-containers[1] failed at path /spec/containers/0/securityContext/.",
   "policy":"require-run-as-non-root",
   "rule":"check-containers",
   "priority":"warning",
   "status":"fail",
   "severity":"medium",
   "category":"Pod Security Standards (Restricted)",
   "scored":true,
   "creationTimestamp":"2021-12-04T10:13:02Z",
   "resource":{
      "apiVersion":"v1",
      "kind":"Pod",
      "name":"nginx2",
      "namespace":"test",
      "uid":"ac4d11f3-0aa8-43f0-8056-98f4eae0d956"
   }
}
```
## S3 compatible Storage

Policy Reporter can also send results to S3 compatible services like __MinIO__, __Yandex__ or __AWS S3__.

It persists each result as JSON in the following structure: `s3://<bucket>/<prefix>/YYYY-MM-DD/<policy-name>-<result-id>-YYYY-MM-DDTHH:mm:ss.json`

### Additional Configure

* __endpoint__ to the S3 API
* __accessKeyID__ and __secretAccessKey__ for authentication with the required write permissions for the selected bucket
* __bucket__ in which the results are persisted
* __region__ of the bucket
* __prefix__ of the file path. Uses `policy-reporter` as default

### Example

```yaml
s3:
  endpoint: "https://storage.yandexcloud.net"
  region: "ru-central1"
  bucket: "dev-cluster"
  secretAccessKey: "secretAccessKey"
  accessKeyID: "accessKeyID"
  minimumPriority: "warning"
  skipExistingOnStartup: true
  sources:
  - kyverno
```

### Channel Example

Channels uses the same `endpoint`, `accessKeyID`, `secretAccessKey`, `region`, `bucket`, `prefix`, `minimumPriority` and `skipExistingOnStartup` configuration as the root target if not defined.

#### Send critical results for a given policy to a dedicated AWS S3 bucket

```yaml
s3:
  endpoint: "https://s3.amazonaws.com"
  region: "eu-central-1"
  bucket: "policy-violations"
  secretAccessKey: "secretAccessKey"
  accessKeyID: "accessKeyID"
  skipExistingOnStartup: true
  channels:
  - bucket: "privileged-containers-violations"
    filter:
      priorities:
        include: ["critical"]
      policies:
        include: ["disallow-privileged-containers"]
  sources:
  - kyverno
```

### Content Example

```json
{
   "Message":"validation error: Running as root is not allowed. The fields spec.securityContext.runAsNonRoot, spec.containers[*].securityContext.runAsNonRoot, and spec.initContainers[*].securityContext.runAsNonRoot must be `true`. Rule check-containers[0] failed at path /spec/securityContext/runAsNonRoot/. Rule check-containers[1] failed at path /spec/containers/0/securityContext/.",
   "Policy":"require-run-as-non-root",
   "Rule":"check-containers",
   "Priority":"warning",
   "Status":"fail",
   "Category":"Pod Security Standards (Restricted)",
   "Source":"Kyverno",
   "Scored":true,
   "Timestamp":"2021-12-04T10:13:02Z",
   "Resource":{
      "APIVersion":"v1",
      "Kind":"Pod",
      "Name":"nginx2",
      "Namespace":"test",
      "UID":"ac4d11f3-0aa8-43f0-8056-98f4eae0d956"
   }
}
```
## Kinesis compatible Services

Policy Reporter can also send results to Kinesis compatible services like __Yandex__ or __AWS Kinesis__.

### Additional Configure

* __endpoint__ to the S3 API
* __accessKeyID__ and __secretAccessKey__ for authentication with the required write permissions for the selected stream
* __streamName__ in which the results are send to
* __region__ of the stream

### Example

```yaml
kinesis:
  endpoint: "https://kinesis.eu-central-1.amazonaws.com"
  region: "eu-central-1"
  streamName: "policy-reporter"
  secretAccessKey: "secretAccessKey"
  accessKeyID: "accessKeyID"
  minimumPriority: "warning"
  skipExistingOnStartup: true
  sources:
  - kyverno
```

### Channel Example

Channels uses the same `endpoint`, `accessKeyID`, `secretAccessKey`, `region`, `streamName`, `minimumPriority` and `skipExistingOnStartup` configuration as the root target if not defined.

#### Send critical results for a given policy to a dedicated AWS Kinesis Stream

```yaml
kinesis:
  endpoint: "https://kinesis.eu-central-1.amazonaws.com"
  region: "eu-central-1"
  streamName: "policy-reporter"
  secretAccessKey: "secretAccessKey"
  accessKeyID: "accessKeyID"
  skipExistingOnStartup: true
  channels:
  - streamName: "critical-policy-violations"
    filter:
      priorities:
        include: ["critical"]
      policies:
        include: ["disallow-privileged-containers"]
  sources:
  - kyverno
```

### Content Example

```json
{
   "Message":"validation error: Running as root is not allowed. The fields spec.securityContext.runAsNonRoot, spec.containers[*].securityContext.runAsNonRoot, and spec.initContainers[*].securityContext.runAsNonRoot must be `true`. Rule check-containers[0] failed at path /spec/securityContext/runAsNonRoot/. Rule check-containers[1] failed at path /spec/containers/0/securityContext/.",
   "Policy":"require-run-as-non-root",
   "Rule":"check-containers",
   "Priority":"warning",
   "Status":"fail",
   "Category":"Pod Security Standards (Restricted)",
   "Source":"Kyverno",
   "Scored":true,
   "Timestamp":"2021-12-04T10:13:02Z",
   "Resource":{
      "APIVersion":"v1",
      "Kind":"Pod",
      "Name":"nginx2",
      "Namespace":"test",
      "UID":"ac4d11f3-0aa8-43f0-8056-98f4eae0d956"
   }
}
```

## Configuration Reference

<code-group>
  <code-block label="Helm 3" active>

  ```yaml
  # values.yaml
  target:
    loki:
      host: ""
      path: ""
      minimumPriority: ""
      skipExistingOnStartup: true
      customLabels: {}
      sources: []
      filter:
        namespaces:
          include: []
          exclude: []
        policies:
          include: []
          exclude: []
        priorities:
          include: []
          exclude: []
        channels: []

    elasticsearch:
      host: ""
      index: "policy-reporter"
      rotation: "daily"
      minimumPriority: ""
      skipExistingOnStartup: true
      sources: []
      filter:
        namespaces:
          include: []
          exclude: []
        policies:
          include: []
          exclude: []
        priorities:
          include: []
          exclude: []
        channels: []

    slack:
      webhook: ""
      minimumPriority: ""
      skipExistingOnStartup: true
      sources: []
      filter:
        namespaces:
          include: []
          exclude: []
        policies:
          include: []
          exclude: []
        priorities:
          include: []
          exclude: []
        channels: []

    discord:
      webhook: ""
      minimumPriority: ""
      skipExistingOnStartup: true
      sources: []
      filter:
        namespaces:
          include: []
          exclude: []
        policies:
          include: []
          exclude: []
        priorities:
          include: []
          exclude: []
        channels: []

    teams:
      webhook: ""
      minimumPriority: ""
      skipExistingOnStartup: true
      sources: []
      filter:
        namespaces:
          include: []
          exclude: []
        policies:
          include: []
          exclude: []
        priorities:
          include: []
          exclude: []
        channels: []

    ui:
      host: http://policy-reporter-ui:8080
      minimumPriority: "warning"
      skipExistingOnStartup: true
      sources: []

    webhook:
      host: ""
      headers: {}
      minimumPriority: ""
      skipExistingOnStartup: true
      sources: []
      filter:
        namespaces:
          include: []
          exclude: []
        policies:
          include: []
          exclude: []
        priorities:
          include: []
          exclude: []
        channels: []

    s3:
      endpoint: ""
      region: ""
      bucket: ""
      prefix: "policy-reporter"
      secretAccessKey: ""
      accessKeyID: ""
      minimumPriority: "warning"
      skipExistingOnStartup: true
      sources: []
      filter:
        namespaces:
          include: []
          exclude: []
        policies:
          include: []
          exclude: []
        priorities:
          include: []
          exclude: []
        channels: []

    kinesis:
      endpoint: ""
      region: ""
      streamName: ""
      secretAccessKey: ""
      accessKeyID: ""
      minimumPriority: "warning"
      skipExistingOnStartup: true
      sources: []
      filter:
        namespaces:
          include: []
          exclude: []
        policies:
          include: []
          exclude: []
        priorities:
          include: []
          exclude: []
        channels: []

  ```

  </code-block>
  <code-block label="config.yaml">

  ```yaml
  loki:
    host: ""
    path: ""
    minimumPriority: ""
    skipExistingOnStartup: true
    customLabels: {}
    sources: []
    filter:
      namespaces:
        include: []
        exclude: []
      policies:
        include: []
        exclude: []
      priorities:
        include: []
        exclude: []
      channels: []

  elasticsearch:
    host: ""
    index: "policy-reporter"
    rotation: "daily"
    minimumPriority: ""
    skipExistingOnStartup: true
    sources: []
    filter:
      namespaces:
        include: []
        exclude: []
      policies:
        include: []
        exclude: []
      priorities:
        include: []
        exclude: []
      channels: []

  slack:
    webhook: ""
    minimumPriority: ""
    skipExistingOnStartup: true
    sources: []
    filter:
      namespaces:
        include: []
        exclude: []
      policies:
        include: []
        exclude: []
      priorities:
        include: []
        exclude: []
      channels: []

  discord:
    webhook: ""
    minimumPriority: ""
    skipExistingOnStartup: true
    sources: []
    filter:
      namespaces:
        include: []
        exclude: []
      policies:
        include: []
        exclude: []
      priorities:
        include: []
        exclude: []
      channels: []

  teams:
    webhook: ""
    minimumPriority: ""
    skipExistingOnStartup: true
    sources: []
    filter:
      namespaces:
        include: []
        exclude: []
      policies:
        include: []
        exclude: []
      priorities:
        include: []
        exclude: []
      channels: []

  ui:
    host: http://policy-reporter-ui:8080
    minimumPriority: "warning"
    skipExistingOnStartup: true
    sources: []

  webhook:
    host: ""
    headers: {}
    minimumPriority: ""
    skipExistingOnStartup: true
    sources: []
    filter:
      namespaces:
        include: []
        exclude: []
      policies:
        include: []
        exclude: []
      priorities:
        include: []
        exclude: []
      channels: []

  s3:
    endpoint: ""
    region: ""
    bucket: ""
    prefix: "policy-reporter"
    secretAccessKey: ""
    accessKeyID: ""
    minimumPriority: "warning"
    skipExistingOnStartup: true
    sources: []
    filter:
      namespaces:
        include: []
        exclude: []
      policies:
        include: []
        exclude: []
      priorities:
        include: []
        exclude: []
      channels: []

  kinesis:
    endpoint: ""
    region: ""
    streamName: ""
    secretAccessKey: ""
    accessKeyID: ""
    minimumPriority: "warning"
    skipExistingOnStartup: true
    sources: []
    filter:
      namespaces:
        include: []
        exclude: []
      policies:
        include: []
        exclude: []
      priorities:
        include: []
        exclude: []
      channels: []
  ```
  </code-block>
</code-group>
