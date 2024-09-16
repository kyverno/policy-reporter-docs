# Trivy Plugin

The new [Trivy Plugin](https://github.com/kyverno/policy-reporter-plugins/tree/main/plugins/trivy) is the second policy reporter plugin that implements the new API system to provide additional information for Trivy Vulnerability findings of the [Trivy Operator](https://github.com/aquasecurity/trivy-operator) converted by the [Trivy Operator Polr Adapter](https://github.com/fjogeleit/trivy-operator-polr-adapter).

## Plugin APIs

As described on the [Plugin System - Instruction Page](./introduction), this plugin implements the necessary APIs to provide additional information about vulnerabilities.

See [Policy Reporter Plugins](https://github.com/kyverno/policy-reporter-plugins/) Repository for a list of existing APIs and examples.

## Enable via Helm

Enable Trivy Plugin via the provided Helm Chart

```yaml
plugin:
  trivy:
    enabled: true
```