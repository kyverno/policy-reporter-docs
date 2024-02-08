---
title: E-Mail Reports
description: ''
position: 11
category: 'Policy Reporter'
---

# E-Mail Reports

Sends automatically and regularly email summary reports over a configured SMTP server to one ore more emails. It supports `filter` and `channels` to send only a subset of namespaces or sources to dedicated emails, this is useful in multi tenant environments. You can also filter on the root level.

Currently two types of reports are available.

## Summary Report

Basic summary report about the amount of results at cluster and namespace level.

<nuxt-img src="/images/reports/summary-report.png" style="border: 1px solid #555" alt="Summary Report"></nuxt-img>

## Violations Report

Violations report includes, besides the amount of results, a list with all found violation (warn, fail and error) results per namespace and on cluster level.

<nuxt-img src="/images/reports/violations-report.png" style="border: 1px solid #555" alt="Violations Report"></nuxt-img>

## Channels & Filter

`Channels` allows you in combination with `filter` to send only a subset of all available information to dedicated receiver emails.

You can filter by:
* include or exclude list of namespaces
* include or exclude list of sources (like `Kyverno`, `Trivy`, `Falco`, etc.)
* disable ClusterPolicyReports

 This allows you for example to send only a subset of namespaces to the related team email address.

## Examples

### Summary Report

::code-group
  ```yaml [Helm 3]
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
      certificate: ""
      skipTLS: false
    summary:
      enabled: true
      schedule: "0 8 * * *" # Send the report each day at 08:00 AM
      activeDeadlineSeconds: 300 # timeout in seconds
      backoffLimit: 1 # retry counter
      ttlSecondsAfterFinished: 60
      to: ['receiver@email.com']
  ```

  ```yaml [config.yaml]
  emailReports:
    clusterName: Playground Cluster
    smtp:
      host: smtp.server.com
      port: 465
      username: policy-reporter@company.org
      password: password
      from: policy-reporter@company.org
      encryption: ssl/tls
      certificate: ""
      skipTLS: false
    summary:
      to: ['receiver@email.com']
  ```

  ```yaml [Helm 3 - SMTP Secret]
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
    smtp:
      secret: smtp-config
    summary:
      enabled: true
      schedule: "0 8 * * *" # Send the report each day at 08:00 AM
      activeDeadlineSeconds: 300 # timeout in seconds
      backoffLimit: 1 # retry counter
      ttlSecondsAfterFinished: 60
      to: ['receiver@email.com']
  ```
::

### Violations Report

::code-group
  ```yaml [Helm 3]
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

  ```yaml [config.yaml]
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
::

### Violations Report per Team

::code-group
  ```yaml [Helm 3]
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
      certificate: ""
      skipTLS: false
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
    smtp:
      host: smtp.server.com
      port: 465
      username: policy-reporter@company.org
      password: password
      from: policy-reporter@company.org
      encryption: ssl/tls
      certificate: ""
      skipTLS: false
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
      # send Trivy Vulnerability & ConfigAudit and Falco Reports to the infra chapter
      - to: ['infra@company.org']
        filter:
          disableClusterReports: false
          sources:
            include: ['Trivy Vulnerability', 'Trivy ConfigAudit', 'Falco']
  ```
::
