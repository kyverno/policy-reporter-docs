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
  filter:
    sources:
      exclude: []
      include: []
    status:
      exclude: []
      include: []
    severities:
      exclude: []
      include: []
    namespaces:
      exclude: []
      include: []
    policies:
      exclude: []
      include: []


dbfile: "sqlite-database.db"

priorityMap: {}

reportFilter:
  namespaces:
    include: []
    exclude: []
  clusterReports:
    disabled: false

redis:
  enabled: false
  address: "redis:6379"
  database: 1
  prefix: "policy-reporter"
  username: ""
  password: ""

loki:
  host: ""
  minimumPriority: "warning"
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
