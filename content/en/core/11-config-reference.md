---
title: Config Reference
description: ''
position: 11
category: 'Policy Reporter'
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

dbfile: "sqlite-database.db"

priorityMap: {}

reportFilter:
  namespaces:
    include: []
    exclude: []
  clusterReports:
    disabled: false

loki:
  host: ""
  minimumPriority: "warning"
  skipExistingOnStartup: true
  customLabels: {}
  sources: []
  filters:
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
  filters:
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
  filters:
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
  filters:
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
  filters:
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
  host: ""
  minimumPriority: "warning"
  skipExistingOnStartup: true
  sources: []

webhook:
  host: ""
  headers: {}
  minimumPriority: ""
  skipExistingOnStartup: true
  sources: []
  filters:
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
  secretAccessKey: ""
  accessKeyID: ""
  minimumPriority: "warning"
  skipExistingOnStartup: true
  sources: []
  filters:
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
