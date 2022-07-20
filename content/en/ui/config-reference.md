---
title: Config Reference
description: ''
position: 22
category: 'Policy Reporter UI'
---

Configuration file reference with all possible options.

```yaml
logSize: 200
displayMode: "" # Possible options: "dark" / "light"

# Attention: be sure that your APIs are not accessable for the outside world
# Use tools like VPN, private Networks or internal Network Load Balancer to expose your APIs in a secure way to the UI
clusters:
 - name: External Cluster                              # name used for the selection of the Cluster
   api: https://policy-reporter.external.cluster       # reachable external Policy Reporter REST API
   kyvernoApi: https://kyverno-plugin.external.cluster # (optional) reachable external Policy Reporter Kyverno Plugin REST API

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
```
