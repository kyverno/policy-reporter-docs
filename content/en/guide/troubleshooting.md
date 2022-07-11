---
title: Troubleshooting
description: 'Troubleshooting'
position: 6
category: Guide
---

## ReadinessProbe fails

Depending on the CRD version running in your cluster, it may take a few seconds to connect to the Kubernetes API. Until Policy Reporter is able to watch for the PolicyReporter CRD, the check fails. If this causes problems in your cluster, you can add an `initialDelaySeconds` to the readinessProbe configuration in your `values.yaml`.

```yaml
readinessProbe:
  initialDelaySeconds: 10
  httpGet:
    path: /ready
    port: http
```
