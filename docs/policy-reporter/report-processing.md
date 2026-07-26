# Report Processing

Policy Reporter has different possibilities to prefilter PolicyReports before they are processed. This can be used to remove noise or non-required information within metrics, notifications or dashboards.

## Report Filter

The `reportFilter` configuration controls which PolicyReport resources should be processed at all. It supports include or exclude lists for `namespaces` and `sources`, plus a `disableClusterReports` switch to skip cluster-scoped reports.

Current report filters are namespace-focused. If you need to filter by resource kind or resource label, use a `sourceConfig` entry instead.

### Example

```yaml
reportFilter:
  namespaces:
    include: ["team-a-*", "policy-reporter"]
  sources:
    include: ["kyverno"]
  disableClusterReports: false
```

## Source Filter

Because different engines/sources may need different filters, it is possible to use a `sourceConfig` entry. As the name suggests, this configuration applies to PolicyReports selected by their source. Compared to `reportFilter`, it can also filter by `resources` and can target either a single `source` or multiple `sources`.

The processing of ClusterPolicyReports can be disabled by setting `disableClusterReports` to `true`.

Engines like **Kyverno**, with its *autogen rules*, applies its policies on controller- as well as the pod resources. To reduce this noise of duplicated information you can set `uncontrolledOnly` to `true`. It will filter out results from controlled `Pod`, `Job`, and `ReplicaSet` resources.

If Namespace resources should be treated as namespace-scoped results, set `selfassignNamespaces` to `true`. This is useful when you want namespace violations to show up under the related namespace instead of as cluster-scoped data.

If a source produces inconsistent result identifiers, you can also enable `customId` and define the fields used to generate the internal result ID. Supported ID fields include `resource`, `policy`, `rule`, `category`, `result`, `message`, `namespace`, and `created`. The generator also supports `label:<name>`, `annotation:<name>`, and `property:<name>` prefixes for values sourced from report metadata and result properties.

### Example

```yaml
sourceFilters:
- selector:
    sources: ["kyverno", "KyvernoValidatingPolicy"]
  uncontrolledOnly: true
  disableClusterReports: false
  resources:
    include: ["pods.v1", "jobs.batch/v1"]
  namespaces:
    exclude: ["kube-*"]
```

### Example with custom result IDs

```yaml
sourceConfig:
- selector:
    source: kyverno
  customId:
    enabled: true
    fields:
      - resource
      - policy
      - rule
      - category
      - result
      - message
  selfassignNamespaces: true
```

## Source Config

### CustomID

To make it possible for Policy Reporter to check if a result already existed when a PolicyReport is updated, it creates an internal ID out of different values from a given PolicyReportResult. Depending on the engine and result structure, this logic may not always apply correctly, which can lead to missing or duplicated notifications.

To customize this logic, define `sourceConfig.customId.enabled: true` and provide the `fields` list for a specific source. This keeps the ID generation local to the source configuration and avoids depending on engine-specific `resultID` values.

Supported fields for ID generation are `resource`, `policy`, `rule`, `category`, `result`, `message`, `namespace`, and `created`. The generator also accepts `label:<name>`, `annotation:<name>`, and `property:<name>` entries for metadata-based IDs.

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