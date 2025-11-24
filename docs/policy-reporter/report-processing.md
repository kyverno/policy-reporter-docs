# Report Processing

Policy Reporter has different possibilities to prefilter PolicyReports before they are processed. This can be used to remove noise or none required information within metrics, notifications or dashboards.

## Report Filter

The ReportFilter is used to configure which PolicyReport resources should be processed or not. It is possible to configure an include or exclude list of `namespaces`, `sources`, `kinds`, with wildcard (*) support. ReportFilter can also be used to disable the processing of ClusterPolicyReport resources.

### Example

```yaml
reportFilter:
  namespaces:
    include: ["team-a-*", "policy-reporter"]
```

## Source Filter

Because different engines/sources may need different filters, it is possible to use a SourceFilter. As the name suggest, this filter applies on PolicyReports selected via the `source` of the report. Like ReportFilter it is possible to filter by `namespaces` and `kinds`.

The processing of ClusterPolicyReports can be disabled by setting `disableClusterReports` to `true`.

Engines like **Kyverno**, with its *autogen rules*, applies its policies on controller- as well as the pod resources. To reduce this noise of duplicated information you can set `uncontrolledOnly` to `true`. It will filter out results from controlled `Pod` and `Job` resources.

### Example

```yaml
sourceFilters:
- selector:
    source: kyverno
  uncontrolledOnly: true
  disableClusterReports: false
  kinds:
    exclude: [ReplicaSet]
```

## Source Config

### CustomID

To make it possible for Policy Reporter to check if a result already existed when a PolicyReport is updated, it creates an internal ID out of different values from a given PolicyReportResult. Depending on the engine and results, this logic not always applies correctly, which can lead to missing or duplicated notifications.

One way to customize this logic is to provide a special `resultID` property key within a PolicyReportResult. If this key is present the value of it will be used instead of a self generated ID.

But this requires each engine to implement the ID generation by itself for an external use case. To prevent this external requierement it is now possible to configure the ID generation per source directly in Policy Reporter.

Supported fields for ID generation are: `resource`, `policy`, `rule`, `category`, `result`, `message`, `namespace`, `created`.

#### Example

```yaml
sourceConfig:
- selector:
    source: kyverno
  customID:
    enabled: true
    fields: ["resource", "policy", "rule", "category", "result", "message"]
```

### Selfassign Namspaces

Since namespaces themselves are objects with cluster scope, they also generate cluster scoped reports in most cases. This scenario has the downside that responsible teams for this namespace may not be able to see found violations, as they only have access to namespaced reporting results. This feature allows namespace results to be treated differently and processed as namespace-scoped results for the corresponding namespace.

#### Example

```yaml
sourceConfig:
- selector:
    source: kyverno
  selfassignNamespaces: true
```