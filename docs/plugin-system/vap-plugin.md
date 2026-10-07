# VAP Plugin

::: info
We support the **VAP Plugin** since Helm Chart v3.11.0
:::

The [ValidationAdmissionPolicy (VAP) Plugin](https://github.com/kyverno/policy-reporter-plugins/tree/main/plugins/vap) makes results from Kubernetes' native `ValidatingAdmissionPolicy` available in Policy Reporter. Since Kubernetes does not create PolicyReports for VAP evaluations, the plugin receives API server audit events and stores the results as OpenReports `Report` and `ClusterReport` resources.

## Requirements

The plugin needs to be installed in the cluster and configured as an audit webhook on the Kubernetes API server. The API server must use an audit policy that captures the resources matched by your VAP bindings and an audit webhook kubeconfig that trusts the plugin's TLS certificate. The repository provides [example audit policy](https://github.com/kyverno/policy-reporter-plugins/blob/main/plugins/vap/deploy/audit-policy.yaml) and [webhook kubeconfig](https://github.com/kyverno/policy-reporter-plugins/blob/main/plugins/vap/deploy/audit-webhook-kubeconfig.yaml) files. Metadata-level auditing is sufficient; request and response bodies are not required.

The plugin is available as a standalone [Helm chart](https://github.com/kyverno/policy-reporter-plugins/tree/main/plugins/vap/charts/vap-plugin). Configure TLS for the audit webhook receiver, for example with cert-manager or a pre-provisioned TLS secret, and grant the plugin access to the resources targeted by your policies. See the plugin's [configuration reference](https://github.com/kyverno/policy-reporter-plugins/blob/main/plugins/vap/deploy/config.example.yaml) for all options.

## Configure Policy Reporter UI

The plugin also provides the Policy Reporter plugin API on port `8080` by default. Add it to the UI cluster configuration as a plugin for the VAP source. The example assumes the Helm release is in the `vap-plugin` namespace.

::: code-group

```yaml [values.yaml]
ui:
  clusters:
    - name: Dev Cluster
      host: http://policy-reporter.policy-reporter:8080
      plugins:
        - name: ValidatingAdmissionPolicy
          host: http://vap-plugin.vap-plugin:8080
```

```yaml [config.yaml]
clusters:
  - name: Dev Cluster
    host: http://policy-reporter.policy-reporter:8080
    plugins:
      - name: ValidatingAdmissionPolicy
        host: http://vap-plugin.vap-plugin:8080
```

:::

The plugin API lists `ValidatingAdmissionPolicy` objects and returns policy details, including the policy source as YAML. It does not provide a policy exception endpoint.

## Reported Results

By default, failures with the VAP `Audit` action are reported. Results from the `Deny` action are not persisted unless `report.reportDenied` is enabled in the plugin's Helm values. This setting applies to the complete audit event. `Warn` action failures and successful policy evaluations are not reported.

VAP does not define severity or category. Set defaults with `report.severity` and `report.category`, or use policy annotations to override them:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: require-team-label
  annotations:
    vap.kubernetes.io/title: Require Team Label
    vap.kubernetes.io/description: Pods must carry a non-empty team label.
    vap.kubernetes.io/subject: Pod, Deployment
    vap.kubernetes.io/severity: high
    vap.kubernetes.io/category: best-practices
```

The `vap.kubernetes.io/subject` value is a comma-separated list. Supported severity values are `critical`, `high`, `medium`, `low`, and `info`.