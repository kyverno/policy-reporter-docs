# Kyverno Plugin

The new [Kyverno Plugin](https://github.com/kyverno/policy-reporter-plugins/tree/main/plugins/kyverno) is an updated version of the previous [Policy Reporter Kyverno Plugin](https://github.com/kyverno/policy-reporter-kyverno-plugin). It provides the new APIs as well existing features like PolicyReport generation for blocked Admission Requests.

## Plugin APIs

As described on the [Plugin System - Instruction Page](./introduction), this plugin implements the necessary APIs to provide additional information about Kyverno policies and to create PolicyException definitions.

See [Policy Reporter Plugins](https://github.com/kyverno/policy-reporter-plugins/) Repository for a list of existing APIs and examples.

## Enable via Helm

Enable Kyverno Plugin via the provided Helm Chart

```yaml
plugin:
  kyverno:
    enabled: true
```
## Enforce Violation PolicyReports

Because Kyverno creates `PolicyReports` only for audit policies and background scans, the **Kyverno Plugin** brings the possibility to create additional `PolicyReports` for blocked resources as well. This makes it possible to get also metrics and notification about resources blocked by an **enforce** policy.

By default **PolicyReportResults** are using another `source` (_Kyverno Event_) as audit results, so that they are displayed on dashboards. This `source` is customizable, so you can change it for example to `kyverno`, so the results are shown in the same dashboards as the audit and background scan results.

These `PolcyReports` are created from the **Kubernetes Events** that Kyverno generates when a resource is blocked. For `ClusterPolicies` these events are created in the default namespace. Namespace scoped `Policies` generate the events in the respective namespace. For performance reasons, this plugin only monitors the `default` namespace by default. If you use namespace scoped `policies`, you should set this configuration to an empty string, this way it will monitor all namespaces.

### Configuration

::: code-group

```yaml [values.yaml]
plugin:
  kyverno:
    enabled: true
    blockReports:
      # enable the feature
      enabled: true
      # namespace where kyverno events are created
      # set to an empty string to watch for events in all namespaces
      eventNamespace: default
      results:
        # maximal results stored in a PolicyReport per namespace
        maxPerReport: 200
        # keep only the latest result of the same violation in the report
        keepOnlyLatest: false
      # source used for the PolicyReportResults
      source: 'Kyverno Event'
```

```yaml [config.yaml]
blockReports:
  # enable the feature
  enabled: true
  # namespace where kyverno events are created
  # set to an empty string to watch for events in all namespaces
  eventNamespace: default
  results:
    # maximal results stored in a PolicyReport per namespace
    maxPerReport: 200
    # keep only the latest result of the same violation in the report
    keepOnlyLatest: false
  # source used for the PolicyReportResults
  source: 'Kyverno Event'
```

:::
