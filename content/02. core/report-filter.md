---
title: Report Filter
description: ''
position: 12
category: 'Policy Reporter'
---

# Report Filter

ReportFilter are used to configure which PolicyReport resources should be processed or not. It is possible to configure an include or exclude list of namespaces, with wildcard (`*`) support. ReportFilter can also be used to disable the processing of ClusterPolicyReport resources.

### Example for include filter

::code-group
  ```yaml [Helm 3]
  # values.yaml
  reportFilter:
    namespaces:
      include: ["team-a-*", "policy-reporter"]
  ```

  ```yaml [config.yaml]
  reportFilter:
    namespaces:
      include: ["team-a-*", "policy-reporter"]
  ```
::

### Example for exclude filter

::code-group
  ```yaml [Helm 3]
  # values.yaml
  reportFilter:
    namespaces:
      exclude: ["kube-system", "monitoring", "*-system"]
  ```

  ```yaml [config.yaml]
  reportFilter:
    namespaces:
      exclude: ["kube-system", "monitoring", "*-system"]
  ```
::

### Example for disabled ClusterPolicyReport processing

::code-group
  ```yaml [Helm 3]
  # values.yaml
  reportFilter:
    clusterReports:
      disabled: true
  ```

  ```yaml [config.yaml]
  reportFilter:
    clusterReports:
      disabled: true
  ```
::
