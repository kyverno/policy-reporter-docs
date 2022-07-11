---
title: Priority Mapping
description: ''
position: 13
category: 'Policy Reporter'
---

Priorities are used to decide if a result should be sent to a __Target__ with configured `minimumPriority` and how it should be displayed.

## How Priority is determined

The __priority__ of a PolicyReportResult depends by default on its __result__ and __severity__ value.

Options in ascending order are: `debug` < `info` < `warning` < `critical` < `error`

### Defaults

* Passed results have __info__ priority
* Warn results have __warning__ priority
* Error results have __error__ priority
* Fail results without severities have __warning__ priority
* Fail results with low severity have __info__ priority
* Fail results with medium severity have __warning__ priority
* Fail results with high severity have __critical__ priority

### Custom Policy Priorities

If you want to change the priority of PolicyReportResults based on the __Policy__, you can configure a __priority map__. This map can assign one priority per policy or a default priority which is used for all results without severity or a concrete mapping to their related policy.

<code-group>
  <code-block label="Helm 3" active>

  ```yaml
  # values.yaml

  policyPriorities:
    # used for all fail results without severity or concrete mapping
    default: warning
    # used for all fail results of the require-ns-labels policy independent of the severity
    require-ns-labels: error
  ```

  </code-block>
  <code-block label="config.yaml">

  ```yaml
  policyPriorities:
    # used for all fail results without severity or concrete mapping
    default: warning
    # used for all fail results of the require-ns-labels policy independent of the severity
    require-ns-labels: error
  ```
  </code-block>
</code-group>

## Severity of Kyverno Policies

Kyverno supports several annotations for its policy CRDs to set additional information in the related PolicyReports. One of these annotations is `policies.kyverno.io/severity` used to set the severity of the related PolicyReportResults. Possible options are `low`, `medium`, and `high`.

This allows you to define the priority of your results within the Kyverno policy itself.
