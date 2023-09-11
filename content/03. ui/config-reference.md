---
title: Config Reference
description: ''
position: 22
category: 'Policy Reporter UI'
---

# Config Reference

Configuration file reference with all possible options.

```yaml
apiConfig:
  # enable API debug logging
  logging: false
  # set forward and origin headers
  overwriteHost: false
  # authorize API calls against HTTP Basic authenticated API calls
  basicAuth:
    username: ""
    password: ""
    secretRef: "" # get username/password from existing secret

logSize: 200
displayMode: "" # Possible options: "dark" / "light"

# Used in the ClusterSelect, if you configure additional clusters
clusterName: Dev Cluster

# Attention: be sure that your APIs are not accessable for the outside world
# Use tools like VPN, private Networks or internal Network Load Balancer to expose your APIs in a secure way to the UI
clusters:
 - name: External Cluster                              # name used for the selection of the Cluster
   api: https://policy-reporter.external.cluster       # reachable external Policy Reporter REST API
   kyvernoApi: https://kyverno-plugin.external.cluster # (optional) reachable external Policy Reporter Kyverno Plugin REST API
    username: username                                  # HTTP BasicAuth Username
    password: password                                  # HTTP BasicAuth Password
    secretRef: auth-secret                              # all configuration can also provided as existing secret with the related key/value pairs, except the cluster name.

views:
  # information shown on the overall dashboard / index page
  dashboard:
    policyReports: true
    clusterPolicyReports: true
  
  # hides entire pages / views
  logs: true
  policyReports: true
  clusterPolicyReports: true
  kyvernoPolicies: true
  kyvernoVerifyImages: true

redis:
  enabled: false
  address: "redis:6379"
  database: 0
  prefix: "policy-reporter-ui"
  username: ""
  password: ""
```
