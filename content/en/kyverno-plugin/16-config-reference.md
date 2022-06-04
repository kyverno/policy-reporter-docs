---
title: Config Reference
description: ''
position: 16
category: 'Kyverno Plugin'
---

Configuration file reference with all possible options.

```yaml
kubeconfig: '~/.kube/config' 

api:
  port: 8080

rest:
  enabled: false

metrics:
  enabled: false

blockReports:
  enabled: false
  eventNamespace: default
  results: 
    maxPerReport: 200
    keepOnlyLatest: false
```
