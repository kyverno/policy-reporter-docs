---
title: Config Reference
description: ''
position: 13
category: 'Policy Reporter UI'
---

Configuration file reference with all possible options.

```yaml
logSize: 200
displayMode: "" # Possible options: "dark" / "light"
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
