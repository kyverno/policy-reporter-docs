# Integrations

Policy Reporter supports different targets to send new PolicyReport results. This makes it possible to create a log or get notified as soon as a new violation is detected. The set of supported tools are based on user requests. Feel free to create an issue or pull request if you need a unsupported integration.

## Supported Integrations

- Grafana Loki
- Elasticsearch
- Slack
- Discord
- Microsoft Teams
- S3 Buckets
- AWS Kinesis
- AWS SecurityHub
- Telegram
- GoogleChat
- GoogleCloudStorage
- Webhooks

## Integration Features

### Filter

To reduce noise and only be notified when you are interested, it is possible to configure different filters per target.

A new default behavior in Policy Reporter v3 is that only violating results (warning, failure or error) of notification targets are processed.

#### SkipExistingOnStartup

This configuration is available for all targets and ignores already existing results on startup. This avoids duplications and spamming when Policy Reporter restarts. For all targets in the Helm chart, it is set to `true` by default, except for SecurityHub, which synchronizes the complete cluster status with AWS SecurityHub.

##### Example

::: code-group

```yaml [values.yaml]
target:
  loki:
    host: 'http://loki.monitoring:3000'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  loki:
    config:
      host: 'http://loki.monitoring:3000'
    skipExistingOnStartup: true
```

:::

#### MinimumSeverity

The `minimumSeverity` replaces the old `minimumPriority` and defines the lowest severity that is processed by the related target.

Possible values and weightings are: `info` > `low` > `medium` > `high` > `critical`.

##### Example

::: code-group

```yaml [values.yaml]
target:
  loki:
    host: 'http://loki.monitoring:3000'
    minimumSeverity: 'medium'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  loki:
    config:
      host: 'http://loki.monitoring:3000'
    minimumSeverity: 'medium'
    skipExistingOnStartup: true
```

:::

#### Sources

A list of PolicyReportResults sources to be processed by the target in question. Wildcards are supported.

##### Example

::: code-group

```yaml [values.yaml]
target:
  loki:
    host: 'http://loki.monitoring:3000'
    minimumSeverity: 'medium'
    skipExistingOnStartup: true
    sources: ['kyverno', 'Trivy*']
```

```yaml [config.yaml]
target:
  loki:
    config:
      host: 'http://loki.monitoring:3000'
    minimumSeverity: 'medium'
    skipExistingOnStartup: true
    sources: ['kyverno', 'Trivy*']
```

:::

#### Filter

Can be used to filter on several values of a result or report labels. You can filter on `policies`, `namespaces`, `status`, `severities`, `sources` and `reportLabels`. Each filter requires a `include` or `exclude` rule, wildacards are supported.

The `namespaces` filter also supports a `selector` map to filter namespaces based on labels.

##### Example

::: code-group

```yaml [values.yaml]
target:
  loki:
    host: 'http://loki.monitoring:3000'
    skipExistingOnStartup: true
    filter:
      namespaces:
        selector: { team: team-a }
      severities:
        exclude: ['low', 'info']
      status:
        exclude: ['error']
      reportLabels:
        include: ['app', 'owner:team-a', 'monitoring:*']
```

```yaml [config.yaml]
target:
  loki:
    config:
      host: 'http://loki.monitoring:3000'
    skipExistingOnStartup: true
    filter:
      namespaces:
        selector: { team: team-a }
      severities:
        exclude: ['low', 'info']
      status:
        exclude: ['error']
      reportLabels:
        include: ['app', 'owner:team-a', 'monitoring:*']
```

:::

### Channels

With the `channels` option, you can define several configurations of the same type for one target. In combination with filters, this allows you to forward your notifications to different target configurations. Channels have the same configuration properties as the main configuration of the target.

Depending on the target different values from the main target will be used as default value in the channel configuration.

#### Example

The Slack channel configuration of Team B uses the configured webhook URL of the main configuration. It only overwrites the Slack `channel` configuration to push the notification in a different Slack Channel as Team A.

::: code-group

```yaml [values.yaml]
target:
  slack:
    name: Team A
    webhook: 'http://slack.webhook.com/12345'
    channel: team-a
    minimumSeverity: 'medium'
    skipExistingOnStartup: true
    filter:
      namespaces:
        selector: { team: team-a }
    channels:
      - name: Team B
        channel: team-b
        filter:
          namespaces:
            selector: { team: team-b }
```

```yaml [config.yaml]
target:
  slack:
    name: Team A
    config:
      webhook: 'http://loki.monitoring:3000'
      channel: team-a
    minimumSeverity: 'medium'
    skipExistingOnStartup: true
    filter:
      namespaces:
        selector: { team: team-a }
    channels:
      - name: Team B
        config:
          channel: team-b
        filter:
          namespaces:
            selector: { team: team-b }
```

:::

### SecretRef

Instead of defining your credentials or webhooks directly, you can also use the `secretRef` configuration to reference an already existing **Secret** by name. If the secret does not exist, the target is skipped.

The **Secret** should contain the related configuration as key. Supported keys are `host`, `webhook`, `channel`, `apiKey`, `accountID`, `typelessApi`, `kmsKeyId`, `username`, `password`, `token`, `credentials`, `accessKeyID` and `secretAccessKey` - depending on the related target. Only exception is token, which is dedicated for webhook targets and is added as Authorization header.

The secretRef is also supported for channels, so you can use different secrets for different channels.

#### Secret Example

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: team-a-slack-webhook
type: Opaque
data:
  webhook: aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDAuLi4= # https://hooks.slack.com/services/T0...
  channel: dGVhbS1h # team-a
```

#### Configuration Example

::: code-group

```yaml [values.yaml]
target:
  slack:
    name: Team A
    secretRef: 'team-a-slack-webhook'
    minimumSeverity: 'medium'
    skipExistingOnStartup: true
    filter:
      namespaces:
        selector: { team: team-a }
```

```yaml [config.yaml]
target:
  slack:
    name: Team A
    secretRef: 'team-a-slack-webhook'
    minimumSeverity: 'medium'
    skipExistingOnStartup: true
    filter:
      namespaces:
        selector: { team: team-a }
```

:::

### MountedSecret

The option `mountedSecret` has a similar functionality as `secretRef`, the difference is that the value corresponds to a path to a mounted secret within the pod. The mounted file is expected as a JSON file with the same key support as `secretRef`. MountedSecret can be used to retrieve values from a central keystore.

#### Secret Example

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: team-a-slack-webhook
type: Opaque
data:
  team-a.json: ewogICJjaGFubmVsIjogInRlYW0tYSIsCiAgIndlYmhvb2siOiAiaHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDAuLi4iCn0= # { "channel": "team-a", "webhook": "https://hooks.slack.com/services/T0..." }
```

#### Configuration Example

::: code-group

```yaml [values.yaml]
target:
  slack:
    name: Team A
    mountedSecret: '/config/team-a.json'
    minimumSeverity: 'medium'
    skipExistingOnStartup: true
    filter:
      namespaces:
        selector: { team: team-a }
```

```yaml [config.yaml]
target:
  slack:
    name: Team A
    mountedSecret: '/config/team-a.json'
    minimumSeverity: 'medium'
    skipExistingOnStartup: true
    filter:
      namespaces:
        selector: { team: team-a }
```

:::

### CustomFields

CustomFields can be used to add static information to each notification. This could be e.g. the cluster name a result came from.

##### Example

::: code-group

```yaml [values.yaml]
target:
  loki:
    host: 'http://loki.monitoring:3000'
    customFields:
      cluster: Dev 1
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  loki:
    config:
      host: 'http://loki.monitoring:3000'
    customFields:
      cluster: Dev 1
    skipExistingOnStartup: true
```

:::

### HTTP Client Configuration

Most target implementations are `HTTP.Client` based and can configurated with e.g. TLS options and custom headers.

#### SkipTLS

Disables client verification of the server's certificate chain and host name.

##### Example

::: code-group

```yaml [values.yaml]
target:
  loki:
    host: 'http://loki.monitoring:3000'
    skipTLS: true
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  loki:
    config:
      host: 'http://loki.monitoring:3000'
      skipTLS: true
    skipExistingOnStartup: true
```

:::

#### Certificate

Configure a file path to the root CA certificate in PEM format which should be used to verify the server certificate.

##### Example

::: code-group

```yaml [values.yaml]
target:
  loki:
    host: 'http://loki.monitoring:3000'
    certificate: '/config/root_ca.pem'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  loki:
    config:
      host: 'http://loki.monitoring:3000'
      certificate: '/config/root_ca.pem'
    skipExistingOnStartup: true
```

:::

#### Headers

Add additional static headers to each request.

##### Example

::: code-group

```yaml [values.yaml]
target:
  loki:
    host: 'http://loki.monitoring:3000'
    headers:
      X-Token: '12345'
    certificate: '/config/root_ca.pem'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  loki:
    config:
      host: 'http://loki.monitoring:3000'
      headers:
        X-Token: '12345'
    skipExistingOnStartup: true
```

:::

## Integration Setup

### Grafana Loki

Policy Reporter can send results directly to Grafana Loki without the need of Promtail. Each result includes all available information as labels as well as a source label with policy-reporter as value. To query all messages from Policy Reporter, use `{source="policy-reporter"}` as the query.

#### Options

| Option        | Description                      | Default          |
| ------------- | -------------------------------- | ---------------- |
| `host`        | Accessible Host                  | _(required)_     |
| `path`        | API Path                         | "/api/prom/push" |
| `skipTLS`     | skip server cert verification    | `false`          |
| `certificate` | path to a root CA in PEM format  | _(optional)_     |
| `headers`     | map of additional static headers | _(optional)_     |

#### Example

The minimal configuration for Grafana Loki requires a valid and accessible host.

::: code-group

```yaml [values.yaml]
target:
  loki:
    host: 'http://loki.monitoring:3000'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  loki:
    config:
      host: 'http://loki.monitoring:3000'
    skipExistingOnStartup: true
```

:::

### Elasticsearch

Policy Reporter sends results in a JSON representation and all available information to a customizable index. This index can be expanded by selecting one of the different rotations or none to disable this function. By default Policy Reporter creates a new index on a daily basis.

#### Options

| Option        | Description                                                                                                                | Default           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `host`        | Accessible Host                                                                                                            | _(required)_      |
| `username`    | HTTPBasic Username                                                                                                         |                   |
| `password`    | HTTPBasic Password                                                                                                         |                   |
| `index`       | Search Index                                                                                                               | `policy-reporter` |
| `rotation`    | Adding the rotation date as suffix to the<br>index name. Possible values are `daily`,<br>`monthly`, `annually` and `none`. | `daily`           |
| `typelessApi` | Switching to Typeless API                                                                                                  | `false`           |
| `skipTLS`     | skip server cert verification                                                                                              | `false`           |
| `certificate` | path to a root CA in PEM format                                                                                            | _(optional)_      |
| `headers`     | map of additional static headers                                                                                           | _(optional)_      |

#### Example

The minimal configuration for Elasticsearch requires a valid and accessible host.

::: code-group

```yaml [values.yaml]
target:
  loki:
    host: 'http://elasticsearch.elk-stack:8080'
    index: 'policy-reporter'
    rotation: 'daily'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  loki:
    config:
      host: 'http://elasticsearch.elk-stack:8080'
      index: 'policy-reporter'
      rotation: 'daily'
    skipExistingOnStartup: true
```

:::

### Microsoft Teams

Sends notifications about new violations with all available information over the webhook API to Microsoft Teams.

#### Options

| Option        | Description                      | Default      |
| ------------- | -------------------------------- | ------------ |
| `webhook`     | Webhook Endpoint                 | _(required)_ |
| `skipTLS`     | skip server cert verification    | `false`      |
| `certificate` | path to a root CA in PEM format  | _(optional)_ |
| `headers`     | map of additional static headers | _(optional)_ |

#### Example

The minimal configuration for MS Teams requires a valid and accessible webhook api.

::: code-group

```yaml [values.yaml]
target:
  teams:
    webhook: 'https://m365x682156.webhook.office.com'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  teams:
    config:
      webhook: 'https://m365x682156.webhook.office.com'
    skipExistingOnStartup: true
```

:::

### Slack

Sends notifications about new violations with all available information over the webhook API to Slack.

#### Options

| Option        | Description                      | Default      |
| ------------- | -------------------------------- | ------------ |
| `webhook`     | Webhook Endpoint                 | _(required)_ |
| `channel`     | Slack Channel                    | _(optional)_ |
| `skipTLS`     | skip server cert verification    | `false`      |
| `certificate` | path to a root CA in PEM format  | _(optional)_ |
| `headers`     | map of additional static headers | _(optional)_ |

#### Example

The minimal configuration for Slack requires a valid and accessible webhook api.

::: code-group

```yaml [values.yaml]
target:
  slack:
    webhook: 'https://hooks.slack.com/services/...'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  slack:
    config:
      webhook: 'https://hooks.slack.com/services/...'
    skipExistingOnStartup: true
```

:::

### Discord

Sends notifications about new violations with all available information over the webhook API to Discord.

#### Options

| Option        | Description                      | Default      |
| ------------- | -------------------------------- | ------------ |
| `webhook`     | Webhook Endpoint                 | _(required)_ |
| `skipTLS`     | skip server cert verification    | `false`      |
| `certificate` | path to a root CA in PEM format  | _(optional)_ |
| `headers`     | map of additional static headers | _(optional)_ |

#### Example

The minimal configuration for Discord requires a valid and accessible webhook api.

::: code-group

```yaml [values.yaml]
target:
  discord:
    webhook: 'https://discordapp.com/api/webhooks/...'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  discord:
    config:
      webhook: 'https://discordapp.com/api/webhooks/...'
    skipExistingOnStartup: true
```

:::

### Webhook

Sends new violations with all available information in JSON format to the configured webhook API.

#### Options

| Option        | Description                      | Default      |
| ------------- | -------------------------------- | ------------ |
| `webhook`     | Webhook Endpoint                 | _(required)_ |
| `skipTLS`     | skip server cert verification    | `false`      |
| `certificate` | path to a root CA in PEM format  | _(optional)_ |
| `headers`     | map of additional static headers | _(optional)_ |

#### Example

The minimal configuration for Discord requires a valid and accessible webhook api.

::: code-group

```yaml [values.yaml]
target:
  webhook:
    webhook: 'https://discordapp.com/api/webhooks/...'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  webhook:
    config:
      webhook: 'https://discordapp.com/api/webhooks/...'
    skipExistingOnStartup: true
```

:::

#### Payload

```json
{
  "message": "validation error: Running as root is not allowed. The fields spec.securityContext.runAsNonRoot, spec.containers[*].securityContext.runAsNonRoot, and spec.initContainers[*].securityContext.runAsNonRoot must be `true`. Rule check-containers[0] failed at path /spec/securityContext/runAsNonRoot/. Rule check-containers[1] failed at path /spec/containers/0/securityContext/.",
  "policy": "require-run-as-non-root",
  "rule": "check-containers",
  "status": "fail",
  "severity": "medium",
  "category": "Pod Security Standards (Restricted)",
  "scored": true,
  "creationTimestamp": "2021-12-04T10:13:02Z",
  "resource": {
    "apiVersion": "v1",
    "kind": "Pod",
    "name": "nginx2",
    "namespace": "test",
    "uid": "ac4d11f3-0aa8-43f0-8056-98f4eae0d956"
  }
}
```

### S3 Storage

Policy Reporter can also send results to S3 compatible services like MinIO, Yandex or AWS S3.
It persists each result as JSON in the following structure: `s3://<bucket>/<prefix>/YYYY-MM-DD/<policy-name>-<result-id>-YYYY-MM-DDTHH:mm:ss.json`

#### Authentication

The S3 integration supports `WebIdentidy`, `PodIdentity` and `Credentials` as authentication mechanisms.

#### Options

| Option                 | Description                               | Default           |
| ---------------------- | ----------------------------------------- | ----------------- |
| `bucket`               | S3 Bucket                                 | _(required)_      |
| `endpoint`             | S3 API Endpoint                           | _(optional)_      |
| `accessKeyID`          | For Credentials authentication            | _(optional)_      |
| `secretAccessKey`      | For Credentials authentication            | _(optional)_      |
| `kmsKeyID`             | Used for Bucket Encryption                | _(optional)_      |
| `bucketKeyEnabled`     | Should use Bucket Key for Encryption      | `false`           |
| `serverSideEncryption` | Enables server side encryption            | `false`           |
| `region`               | Region                                    | `AWS_REGION` ENV  |
| `prefix`               | Path Prefix                               | `policy-reporter` |
| `pathStyle`            | Allow client to use path-style addressing | `false`           |

#### Example

::: code-group

```yaml [values.yaml]
target:
  s3:
    endpoint: 'https://storage.yandexcloud.net'
    region: 'ru-central1'
    bucket: 'dev-cluster'
    secretAccessKey: 'secretAccessKey'
    accessKeyID: 'accessKeyID'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  s3:
    config:
      endpoint: 'https://storage.yandexcloud.net'
      region: 'ru-central1'
      bucket: 'dev-cluster'
      secretAccessKey: 'secretAccessKey'
      accessKeyID: 'accessKeyID'
    skipExistingOnStartup: true
```

:::

### Kinesis

Supports Kinesis compatible Services.

#### Authentication

The AWS integration supports `WebIdentidy`, `PodIdentity` and `Credentials` as authentication mechanisms.

#### Options

| Option                 | Description                               | Default           |
| ---------------------- | ----------------------------------------- | ----------------- |
| `streamName`           | Kinesis Streamname                        | _(required)_      |
| `endpoint`             | Kinesis API Endpoint                      | _(optional)_      |
| `accessKeyID`          | For Credentials authentication            | _(optional)_      |
| `secretAccessKey`      | For Credentials authentication            | _(optional)_      |
| `region`               | Region                                    | `AWS_REGION` ENV  |

#### Example

::: code-group

```yaml [values.yaml]
target:
  s3:
    endpoint: 'https://kinesis.eu-central-1.amazonaws.com'
    region: 'eu-central-1'
    streamName: 'dev-cluster'
    secretAccessKey: 'secretAccessKey'
    accessKeyID: 'accessKeyID'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  s3:
    config:
      endpoint: 'https://kinesis.eu-central-1.amazonaws.com'
      region: 'eu-central-1'
      streamName: 'dev-cluster'
      secretAccessKey: 'secretAccessKey'
      accessKeyID: 'accessKeyID'
    skipExistingOnStartup: true
```

:::

### SecurityHub

Supports AWS SecurityHub. Unlike the other integrations its possible to sync the complete cluster status to SecurityHub and automatically update existing findings when the status changed or the related policy or resource was deleted.

#### Authentication

AWS SecurityHub supports `WebIdentidy`, `PodIdentity` and `Credentials` as authentication mechanisms.

#### Options

| Option                 | Description                               | Default           |
| ---------------------- | ----------------------------------------- | ----------------- |
| `accoundID`            | AWS AccoundID                             | _(required)_      |
| `endpoint`             | API Endpoint                              | _(optional)_      |
| `accessKeyID`          | For Credentials authentication            | _(optional)_      |
| `secretAccessKey`      | For Credentials authentication            | _(optional)_      |
| `productName`          | Used product name in SH Findings          | `Policy Reporter` |
| `companyName`          | Used company name in SH Findings          | `Kyverno`         |
| `delayInSeconds`       | Delay between report cleanups,<br>may be relevant when reaching AWS RateLimits | `2`         |
| `synchronize`          | Enables synchronization of resolved findings in SH| `true`      |
| `region`               | AWS Region                                | `AWS_REGION` ENV  |

#### Example

::: code-group

```yaml [values.yaml]
target:
  securityHub:
    region: 'eu-central-1'
    accoundID: 'accoundID'
    secretAccessKey: 'secretAccessKey'
    accessKeyID: 'accessKeyID'
```

```yaml [config.yaml]   
target:
  securityHub:
    config:
      region: 'eu-central-1'
      accoundID: 'accoundID'
      secretAccessKey: 'secretAccessKey'
      accessKeyID: 'accessKeyID'
```

:::

### Google Cloud Storage

Policy Reporter can also send results to GoogleCloudStorage.
It persists each result as JSON in the following structure: `<bucket>/<prefix>/YYYY-MM-DD/<policy-name>-<result-id>-YYYY-MM-DDTHH:mm:ss.json`

#### Authentication

GoogleCloudStorage supports `PodIdentity` and `Credentials` as authentication mechanisms.

#### Options

| Option                 | Description                               | Default           |
| ---------------------- | ----------------------------------------- | ----------------- |
| `bucket`               | Bucket name                               | _(required)_      |
| `credentials`          | Credentials in JSON format                | _(optional)_      |
| `prefix`               | Path Prefix                               | `policy-reporter` |

#### Example

::: code-group

```yaml [values.yaml]
target:
  gcs:
    bucket: 'dev-cluster'
```

```yaml [config.yaml]   
target:
  gcs:
    config:
      bucket: 'dev-cluster'
```

:::

### Telegram

Sends notifications about new violations with all available information over the webhook API to Telegram.

#### Options

| Option        | Description                      | Default      |
| ------------- | -------------------------------- | ------------ |
| `webhook`     | Webhook Endpoint                 | _(optional)_ |
| `token`       | Telegram Token                   | _(required)_ |
| `chatID`      | Telegram ChatID                  | _(required)_ |
| `skipTLS`     | skip server cert verification    | `false`      |
| `certificate` | path to a root CA in PEM format  | _(optional)_ |
| `headers`     | map of additional static headers | _(optional)_ |

#### Example

The minimal configuration for Discord requires a valid and accessible webhook api.

::: code-group

```yaml [values.yaml]
target:
  telegram:
    chatID: "XXX"
    token: "XXXX"
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  telegram:
    config:
      chatID: "XXX"
      token: "XXXX"
    skipExistingOnStartup: true
```

:::

### Google Chat

Sends notifications about new violations with all available information over the webhook API to Google Chat.

#### Options

| Option        | Description                      | Default      |
| ------------- | -------------------------------- | ------------ |
| `webhook`     | Webhook Endpoint                 | _(required)_ |
| `skipTLS`     | skip server cert verification    | `false`      |
| `certificate` | path to a root CA in PEM format  | _(optional)_ |
| `headers`     | map of additional static headers | _(optional)_ |

#### Example

The minimal configuration for Discord requires a valid and accessible webhook api.

::: code-group

```yaml [values.yaml]
target:
  googleChat:
    webhook: 'https://chat.googleapis.com/v1/spaces/XXX/messages?key=XXX&token=XXX'
    skipExistingOnStartup: true
```

```yaml [config.yaml]
target:
  googleChat:
    config:
      webhook: 'https://chat.googleapis.com/v1/spaces/XXX/messages?key=XXX&token=XXX'
    skipExistingOnStartup: true
```

:::