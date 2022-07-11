---
title: E-Mail Reports
description: ''
position: 11
category: 'Policy Reporter'
---

Sends automatically and regularly email summary reports over a configured SMTP server to one ore more emails. It supports `filter` and `channels` to send only a subset of namespaces or sources to dedicated emails, this is useful in multi tenant environments. You can also filter on the root level.

Currently two types of reports are available.

## Summary Report

Basic summary report about the amount of results at cluster and namespace level.

<img src="/images/reports/summary-report.png" style="border: 1px solid #555" alt="Summary Report" />

## Violations Report

Violations report includes, besides the amount of results, a list with all found violation (warn, fail and error) results per namespace and on cluster level.

<img src="/images/reports/violations-report.png" style="border: 1px solid #555" alt="Violations Report" />

## Channels & Filter

`Channels` allows you in combination with `filter` to send only a subset of all available information to dedicated receiver emails.

You can filter by:
* include or exclude list of namespaces
* include or exclude list of sources (like `Kyverno`, `Trivy`, `Falco`, etc.)
* disable ClusterPolicyReports

 This allows you for example to send only a subset of namespaces to the related team email address.

## Examples

### Summary Report

<code-group>
  <code-block label="Helm 3" active>

  ```yaml
  # values.yaml
  emailReports:
    clusterName: Playground Cluster
    smtp:
      host: smtp.server.com
      port: 465
      username: policy-reporter@company.org
      password: password
      from: policy-reporter@company.org
      encryption: ssl/tls
    summary:
      enabled: true
      schedule: "0 8 * * *" # Send the report each day at 08:00 AM
      activeDeadlineSeconds: 300 # timeout in seconds
      backoffLimit: 1 # retry counter
      ttlSecondsAfterFinished: 60
      to: ['receiver@email.com']
  ```

  </code-block>
  <code-block label="config.yaml">

  ```yaml
  emailReports:
    clusterName: Playground Cluster
    smtp:
      host: smtp.server.com
      port: 465
      username: policy-reporter@company.org
      password: password
      from: policy-reporter@company.org
      encryption: ssl/tls
    summary:
      to: ['receiver@email.com']
  ```
  </code-block>
</code-group>

### Violations Report

<code-group>
  <code-block label="Helm 3" active>

  ```yaml
  # values.yaml
  emailReports:
    clusterName: Playground Cluster
    smtp:
      host: smtp.server.com
      port: 465
      username: policy-reporter@company.org
      password: password
      from: policy-reporter@company.org
      encryption: ssl/tls
    violations:
      enabled: true
      schedule: "0 8 * * *" # Send the report each day at 08:00 AM
      activeDeadlineSeconds: 300 # timeout in seconds
      backoffLimit: 1 # retry counter
      ttlSecondsAfterFinished: 60
      to: ['receiver@email.com']
  ```

  </code-block>
  <code-block label="config.yaml">

  ```yaml
  emailReports:
    clusterName: Playground Cluster
    smtp:
      host: smtp.server.com
      port: 465
      username: policy-reporter@company.org
      password: password
      from: policy-reporter@company.org
      encryption: ssl/tls
    violations:
      to: ['receiver@email.com']
  ```
  </code-block>
</code-group>

### Violations Report per Team

<code-group>
  <code-block label="Helm 3" active>

  ```yaml
  # values.yaml
  emailReports:
    clusterName: Prod Cluster
    smtp:
      host: smtp.server.com
      port: 465
      username: policy-reporter@company.org
      password: password
      from: policy-reporter@company.org
      encryption: ssl/tls
    violations:
      enabled: true
      schedule: "0 8 * * *" # Send the report each day at 08:00 AM
      activeDeadlineSeconds: 300 # timeout in seconds
      backoffLimit: 1 # retry counter
      ttlSecondsAfterFinished: 60
      channels:
      # send only team namespace reports from kyverno to team A
      - to: ['team-a@company.org']
        filter:
          disableClusterReports: true
          namespaces:
            include: ['team-a-*']
          sources:
            include: ['Kyverno']
      # send only team namespace reports from kyverno to team B
      - to: ['team-b@company.org']
        filter:
          disableClusterReports: true
          namespaces:
            include: ['team-b-*']
          sources:
            include: ['Kyverno']
      # send Trivy Reports to the infra chapter
      - to: ['infra@company.org']
        filter:
          disableClusterReports: false
          sources:
            include: ['Trivy*', 'Falco']
  ```

  </code-block>
  <code-block label="config.yaml">

  ```yaml
  emailReports:
    clusterName: Prod Cluster
    smtp:
      host: smtp.server.com
      port: 465
      username: policy-reporter@company.org
      password: password
      from: policy-reporter@company.org
      encryption: ssl/tls
    violations:
      channels:
      # send only team namespace reports from Kyverno to team A
      - to: ['team-a@company.org']
        filter:
          disableClusterReports: true
          namespaces:
            include: ['team-a-*']
          sources:
            include: ['Kyverno']
      # send only team namespace reports from Kyverno to team B
      - to: ['team-b@company.org']
        filter:
          disableClusterReports: true
          namespaces:
            include: ['team-b-*']
          sources:
            include: ['Kyverno']
      # send Trivy and Falco Reports to the infra chapter
      - to: ['infra@company.org']
        filter:
          disableClusterReports: false
          sources:
            include: ['Trivy*', 'Falco']
  ```
  </code-block>
</code-group>