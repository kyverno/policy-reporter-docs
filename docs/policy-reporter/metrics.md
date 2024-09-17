# Policy Reporter Metrics

Policy Reporter metrcis are an optional feature and represents your PolicyReport and ClusterPolicyReport resources as gauge metrics with a customizable set of labels.

## Enable Metrics

::: code-group

```yaml [values.yaml]
metrics:
  enabled: true
```

```yaml [config.yaml]
metrics:
  enabled: true
```

```bash [CLI]
/policyreporter run -m
```

:::

## Metrics Filter

To reduce the number of metric elements, it is possible to filter out results for metric processing. All available filters supporting wildcards and can be defined as include or exclude list.

### Supported Filter

| Filter       | Description                                |
|--------------|--------------------------------------------|
| `kinds`      | Kind of the result resource                |
| `namespaces` | Namespace of the result resource           |
| `policies`   | Policy of the result                       |
| `severities` | Severity of the result                     |
| `sources`    | Source of the result                       |
| `status`     | Status of the result                       |

### Example Filter configuration

```yaml
metrics:
  enabled: true
  filter:
    namespaces:
      include: ["prod", "stage"]
    sources:
      include: ["Trivy*", "Kyverno"]
    status:
      exclude: ["skip"]
    kinds:
      exclude: ["Pod"]
```

## Metrics customization

By default, the metrics have a very high cardinality and generate one entry per PolicyReportResult. In order to reduce the cardinality to the required minimum, it is possible to adjust the labels provided for all metrics.

### Metric Modes

Policy Reporter ships with three different modes to control the metrics customization.

* **detailed (default)**: provides all existing label information but has a high cardinality.
Creates 1 metric per resource / policy / rule

* **simple**: provides a predefined subset of the available labels with a lower cardinality.
Provides "namespace", "policy", "status", "severity", "category", "source"

* **custom**: provides the configured labels as list via the metrics.customLabels value.
It supports all labels that are also available in the detailed mode and in addition `message` for the result message.
See the [API Reference](#api-reference) for details.

### Custom Mode special features

Besides the default set of labels available for custom mode it is also possible to append additional information like the result message, PolicyReport labels or PolicyReportResult properties as labels to the metrics.

#### Append PolicyReport Label

Use (Cluster)PolicyReport labels as additional metric labels in custom mode. Invalid label characters will be replaced with _.

##### Example

```yaml [policy-report.yaml]
apiVersion: wgpolicyk8s.io/v1alpha2
kind: PolicyReport
metadata:
  labels:
    app: nginx
  name: cpol-disallow-host-path
  namespace: test
```

```yaml [values.yaml]
metrics:
  enabled: true
  mode: custom
  customLabels: ["status","label:app"]
```

```md
# TYPE policy_report_result gauge
policy_report_result{app="nginx",status="pass"} 1
policy_report_result{app="",status="pass"} 1
```
---

#### Append PolicyReportResult Property

Use PolicyReportResult properties as additional metric labels in custom mode. Invalid label characters will be replaced with _.

##### Example

```yaml [policy-report.yaml]
apiVersion: wgpolicyk8s.io/v1alpha2
kind: PolicyReport
  name: trivy-vuln-polr-nginx-5fbc65fff
  namespace: test
  ...
results:
- category: Vulnerability Scan
  message: 'apt: integer overflows and underflows while parsing .deb packages'
  policy: CVE-2020-27350
  properties:
    artifact.repository: library/nginx
    artifact.tag: "1.17"
    score: "5.7"
```

```yaml [values.yaml]
metrics:
  enabled: true
  mode: custom
  customLabels: ["property:score", "property:artifact.tag", "status"]
```

```md
# TYPE policy_report_result gauge
policy_report_result{artifact_tag="1.17",score="5.7",status="pass"} 1
policy_report_result{artifact_tag="",score="",status="pass"} 1
```

## API Reference

List of available metrics and available labels.

### cluster_policy_report_result

Gauge: Bye default one entry represents one result in a ClusterPolicyReport. Deleted results will also be removed from this metrics.

#### default set of labels

| Label       | Description                                |
|-------------|--------------------------------------------|
| `category`  | Category of the Result                     |
| `kind`      | Kind of the result resource                |
| `name`      | Name of the result resource                |
| `policy`    | Policy of the result                       |
| `report`    | Name of ClusterPolicyReport resource       |
| `rule`      | Rule of the result                         |
| `severity`  | Severity of the result                     |
| `source`    | Source of the result                       |
| `status`    | Status of the result                       |

### policy_report_result

Gauge: Bye default one entry represents one result in a PolicyReport. Deleted results will also be removed from this metrics.

#### default set of labels

| Label       | Description                                |
|-------------|--------------------------------------------|
| `category`  | Category of the Result                     |
| `kind`      | Kind of the result resource                |
| `name`      | Name of the result resource                |
| `namespace` | Namespace of the result resource           |
| `policy`    | Policy of the result                       |
| `report`    | Name of ClusterPolicyReport resource       |
| `rule`      | Rule of the result                         |
| `severity`  | Severity of the result                     |
| `source`    | Source of the result                       |
| `status`    | Status of the result                       |