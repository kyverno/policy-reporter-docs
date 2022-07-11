---
title: Report Filter
description: ''
position: 12
category: 'Policy Reporter'
---

ReportFilter are used to configure which PolicyReport resources should be processed or not. It is possible to configure an include or exclude list of namespaces, with wildcard (`*`) support. ReportFilter can also be used to disable the processing of ClusterPolicyReport resources.

### Example for include filter

<code-group>
  <code-block label="Helm 3" active>

  ```yaml
  # values.yaml
  reportFilter:
    namespaces:
      include: ["team-a-*", "policy-reporter"]
  ```

  </code-block>
  <code-block label="config.yaml">

  ```yaml
  reportFilter:
    namespaces:
      include: ["team-a-*", "policy-reporter"]
  ```
  </code-block>
</code-group>

### Example for exclude filter

<code-group>
  <code-block label="Helm 3" active>

  ```yaml
  # values.yaml
  reportFilter:
    namespaces:
      exclude: ["kube-system", "monitoring", "*-system"]
  ```

  </code-block>
  <code-block label="config.yaml">

  ```yaml
  reportFilter:
    namespaces:
      exclude: ["kube-system", "monitoring", "*-system"]
  ```
  </code-block>
</code-group>

### Example for disabled ClusterPolicyReport processing

<code-group>
  <code-block label="Helm 3" active>

  ```yaml
  # values.yaml
  reportFilter:
    clusterReports:
      disabled: true
  ```

  </code-block>
  <code-block label="config.yaml">

  ```yaml
  reportFilter:
    clusterReports:
      disabled: true
  ```
  </code-block>
</code-group>
