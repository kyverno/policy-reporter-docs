# E-Mail Reports

Email reports can be sent either over SMTP or, if enabled, through Microsoft Graph API. Reports can be scheduled, filtered, and split into channels so that different teams only receive the namespaces or sources that matter to them.

There are two report types:

## Summary Report

Basic summary report about the amount of results at cluster and namespace level.

## Violations Report

Violations report includes, besides the amount of results, a list with all found violation (warn, fail and error) results per namespace and on cluster level.

The `channels` option allows you, in combination with filters, to send only a subset of all available information to dedicated receiver emails.

You can filter by:
* label selector, include- or exclude list of namespaces
* include or exclude list of sources (like Kyverno, Trivy, Falco, etc.)
* disable ClusterPolicyReports

The latest configuration also supports per-report output format via `format`, reusable report titles via `titlePrefix`, and Graph API specific options like CC, BCC, Azure AD endpoint overrides, and disabling Sent Items storage.

## Configuration

```yaml
emailReports:
  clusterName: Playground Cluster
  titlePrefix: Report
  smtp:
    host: smtp.server.com
    port: 465
    username: policy-reporter@company.org
    password: password
    from: policy-reporter@company.org
    encryption: ssl/tls
    skipTLS: false
    certificate: ""
  graphAPI:
    enabled: false
    tenant: ""
    clientID: ""
    clientSecret: ""
    secretRef: ""
    userID: ""
    cc: []
    bcc: []
    disableSaveToSentItems: false
    azureADEndpoint: https://login.microsoftonline.com
    graphEndpoint: https://graph.microsoft.com
  summary:
    to: ['receiver@email.com']
    format: html
    filter:
      disableClusterReports: false
      namespaces:
        include: []
        exclude: []
        selector: {}
      sources:
        include: []
        exclude: []
  violations:
    to: ['receiver@email.com']
    format: html
    filter:
      disableClusterReports: false
      namespaces:
        include: []
        exclude: []
        selector: {}
      sources:
        include: []
        exclude: []
```

## Examples

### Summary Report

::: code-group

```yaml [values.yaml]
emailReports:
  clusterName: Playground Cluster
  titlePrefix: Report
  smtp:
    host: smtp.server.com
    port: 465
    username: policy-reporter@company.org
    password: password
    from: policy-reporter@company.org
    encryption: ssl/tls
    skipTLS: false
    certificate: ""
  summary:
    enabled: true
    schedule: "0 8 * * *" # Send the report each day at 08:00 AM
    activeDeadlineSeconds: 300 # timeout in seconds
    backoffLimit: 1 # retry counter
    ttlSecondsAfterFinished: 60
    format: html
    to: ['receiver@email.com']
```

```yaml [config.yaml]
emailReports:
  clusterName: Playground Cluster
  titlePrefix: Report
  smtp:
    host: smtp.server.com
    port: 465
    username: policy-reporter@company.org
    password: password
    from: policy-reporter@company.org
    encryption: ssl/tls
    skipTLS: false
    certificate: ""
  summary:
    format: html
    to: ['receiver@email.com']
```

```yaml [Helm - SMTP Secret]
# example secret
apiVersion: v1
type: Opaque
kind: Secret
metadata:
  name: smpt-config
data:
  encryption: c3NsL3Rscw==
  host: c210cC5zZXJ2ZXIuY29t
  password: cGFzc3dvcmQ=
  port: NDY1
  username: dXNlcm5hbWU=

# values.yaml
emailReports:
  clusterName: Playground Cluster
  titlePrefix: Report
  smtp:
    secret: smtp-config
  summary:
    enabled: true
    schedule: "0 8 * * *" # Send the report each day at 08:00 AM
    activeDeadlineSeconds: 300 # timeout in seconds
    backoffLimit: 1 # retry counter
    ttlSecondsAfterFinished: 60
    format: html
    to: ['receiver@email.com']
```

:::

### Violations Report

::: code-group

```yaml [values.yaml]
emailReports:
  clusterName: Playground Cluster
  titlePrefix: Report
  smtp:
    host: smtp.server.com
    port: 465
    username: policy-reporter@company.org
    password: password
    from: policy-reporter@company.org
    encryption: ssl/tls
    skipTLS: false
  violations:
    enabled: true
    schedule: "0 8 * * *" # Send the report each day at 08:00 AM
    activeDeadlineSeconds: 300 # timeout in seconds
    backoffLimit: 1 # retry counter
    ttlSecondsAfterFinished: 60
    format: html
    to: ['receiver@email.com']
```

```yaml [config.yaml]
emailReports:
  clusterName: Playground Cluster
  titlePrefix: Report
  smtp:
    host: smtp.server.com
    port: 465
    username: policy-reporter@company.org
    password: password
    from: policy-reporter@company.org
    encryption: ssl/tls
    skipTLS: false
  violations:
    format: html
    to: ['receiver@email.com']
```

:::

### Reports per Team

::: code-group

```yaml [values.yaml]
# values.yaml
emailReports:
  clusterName: Prod Cluster
  titlePrefix: Report
  smtp:
    host: smtp.server.com
    port: 465
    username: policy-reporter@company.org
    password: password
    from: policy-reporter@company.org
    encryption: ssl/tls
    skipTLS: false
    certificate: ""
  violations:
    enabled: true
    schedule: "0 8 * * *" # Send the report each day at 08:00 AM
    activeDeadlineSeconds: 300 # timeout in seconds
    backoffLimit: 1 # retry counter
    ttlSecondsAfterFinished: 60
    format: html
    channels:
    # send only team namespace reports from kyverno to team A
    - to: ['team-a@company.org']
      filter:
        disableClusterReports: true
        namespaces:
          selector: { team: team-a }
        sources:
          include: ['kyverno']
    # send only team namespace reports from kyverno to team B
    - to: ['team-b@company.org']
      filter:
        disableClusterReports: true
        namespaces:
          selector: { team: team-b }
        sources:
          include: ['kyverno']
    # send Trivy ConfigAudit and Vulnerability Reports to the infra chapter
    - to: ['infra@company.org']
      filter:
        disableClusterReports: false
        sources:
          include: ['Trivy Vulnerability', 'Trivy ConfigAudit', 'Falco']
```

```yaml [config.yaml]
emailReports:
  clusterName: Prod Cluster
  titlePrefix: Report
  smtp:
    host: smtp.server.com
    port: 465
    username: policy-reporter@company.org
    password: password
    from: policy-reporter@company.org
    encryption: ssl/tls
    skipTLS: false
    certificate: ""
  violations:
    format: html
    channels:
    # send only team namespace reports from Kyverno to team A
    - to: ['team-a@company.org']
      filter:
        disableClusterReports: true
        namespaces:
          selector: { team: team-a }
        sources:
          include: ['kyverno']
    # send only team namespace reports from Kyverno to team B
    - to: ['team-b@company.org']
      filter:
        disableClusterReports: true
        namespaces:
          selector: { team: team-b }
        sources:
          include: ['kyverno']
    # send Trivy Vulnerability & ConfigAudit and Falco Reports to the infra chapter
    - to: ['infra@company.org']
      filter:
        disableClusterReports: false
        sources:
          include: ['Trivy Vulnerability', 'Trivy ConfigAudit', 'Falco']
```

:::
