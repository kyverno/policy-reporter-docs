# Plugin System - Introduction

With Policy Reporter UI v2 a new [plugin system](https://github.com/kyverno/policy-reporter-plugins) will be introduced. While plugins in v1 were only used for integrating the [Policy Reporter Kyverno Plugin](https://github.com/kyverno/policy-reporter-kyverno-plugin), the new system is more generic and needs to provide a defined set of REST APIs, no actual UI changes are required. Plugin information will be included in existing views and providing details about policies.

## Configuration

You configure a plugin in the respective Policy Reporter UI cluster configuration. A plugin is always configured per source. If your plugin supports multiple sources, you must also configure it individually for each source.

::: code-group

```yaml [values.yaml]
ui:
  clusters:
    - name: Dev Cluster
      host: http://policy-reporter.policy-reporter:8080
      plugins:
        - name: kyverno
          host: http://kyverno-plugin.policy-reporter:8080/api
        - name: Trivy Vulnerability
          host: http://trivy-plugin.policy-reporter:8080/api/vulnr
```

```yaml [config.yaml]
clusters:
  - name: Dev Cluster
    host: http://policy-reporter.policy-reporter:8080
    plugins:
      - name: kyverno
        host: http://kyverno-plugin.policy-reporter:8080/api
      - name: Trivy Vulnerability
        host: http://trivy-plugin.policy-reporter:8080/api/vulnr
```

:::

## API Definitions

One Plugin relates to one "source" of PolicyReports.

### [GET] V1 Policies API

The `/v1/policies` API provides a list of Policies. This could be a list of all policies or a list of all policies which produced a **PolicyReportResult**.

```json
[
  {
    "category": "Pod Security Standards (Baseline)",
    "name": "disallow-capabilities",
    "title": "Disallow Capabilities",
    "description": "Adding capabilities beyond those listed in the policy must be disallowed.",
    "severity": "medium"
  }
]
```

### [GET] V1 Policy API

The `/v1/policies/{name}` API provides details of a single policy selected by its unique name.

#### Example URL

```bash
// kyverno example of an cluster policy
http://localhost:8083/api/v1/policies/restrict-apparmor-profiles

// kyverno example of an namespace scoped policy
http://localhost:8083/api/v1/policies/default/restrict-apparmor-profiles
```

#### Example Response

```json
{
  "category": "Pod Security Standards (Restricted)",
  "name": "require-run-as-nonroot",
  "title": "Require runAsNonRoot",
  "description": "Containers must be required to run as non-root users. This policy ensures `runAsNonRoot` is set to `true`. A known issue prevents a policy such as this using `anyPattern` from being persisted properly in Kubernetes 1.23.0-1.23.2.",
  "severity": "medium",
  "engine": {
    "name": "Kyverno",
    "version": "1.6.0",
    "subjects": ["Pod"]
  },
  "code": {
    "contentType": "yaml",
    "content": "apiVersion: kyverno.io/v1\nkind: ClusterPolicy\nmetadata:\n  annotations:\n    kyverno.io/kubernetes-version: 1.22-1.23\n    kyverno.io/kyverno-version: 1.6.0\n    meta.helm.sh/release-name: kyverno-policies\n    meta.helm.sh/release-namespace: kyverno\n    policies.kyverno.io/category: Pod Security Standards (Restricted)\n    policies.kyverno.io/description: Containers must be required to run as non-root\n      users. This policy ensures `runAsNonRoot` is set to `true`. A known issue prevents\n      a policy such as this using `anyPattern` from being persisted properly in Kubernetes\n      1.23.0-1.23.2.\n    policies.kyverno.io/severity: medium\n    policies.kyverno.io/subject: Pod\n    policies.kyverno.io/title: Require runAsNonRoot\n  labels:\n    app.kubernetes.io/component: kyverno\n    app.kubernetes.io/instance: kyverno-policies\n    app.kubernetes.io/managed-by: Helm\n    app.kubernetes.io/name: kyverno-policies\n    app.kubernetes.io/part-of: kyverno-policies\n    app.kubernetes.io/version: 3.1.0\n    helm.sh/chart: kyverno-policies-3.1.0\n  name: require-run-as-nonroot\nspec:\n  admission: true\n  background: true\n  failurePolicy: Fail\n  rules:\n  - match:\n      any:\n      - resources:\n          kinds:\n          - Pod\n    name: run-as-non-root\n    validate:\n      anyPattern:\n      - spec:\n          =(ephemeralContainers):\n          - =(securityContext):\n              =(runAsNonRoot): true\n          =(initContainers):\n          - =(securityContext):\n              =(runAsNonRoot): true\n          containers:\n          - =(securityContext):\n              =(runAsNonRoot): true\n          securityContext:\n            runAsNonRoot: true\n      - spec:\n          =(ephemeralContainers):\n          - securityContext:\n              runAsNonRoot: true\n          =(initContainers):\n          - securityContext:\n              runAsNonRoot: true\n          containers:\n          - securityContext:\n              runAsNonRoot: true\n      message: Running as root is not allowed. Either the field spec.securityContext.runAsNonRoot\n        must be set to `true`, or the fields spec.containers[*].securityContext.runAsNonRoot,\n        spec.initContainers[*].securityContext.runAsNonRoot, and spec.ephemeralContainers[*].securityContext.runAsNonRoot\n        must be set to `true`.\n  validationFailureAction: Audit\nstatus:\n  autogen:\n    rules:\n    - exclude:\n        resources: {}\n      generate:\n        clone: {}\n        cloneList: {}\n      match:\n        any:\n        - resources:\n            kinds:\n            - DaemonSet\n            - Deployment\n            - Job\n            - StatefulSet\n            - ReplicaSet\n            - ReplicationController\n        resources: {}\n      mutate: {}\n      name: autogen-run-as-non-root\n      validate:\n        anyPattern:\n        - spec:\n            template:\n              spec:\n                =(ephemeralContainers):\n                - =(securityContext):\n                    =(runAsNonRoot): true\n                =(initContainers):\n                - =(securityContext):\n                    =(runAsNonRoot): true\n                containers:\n                - =(securityContext):\n                    =(runAsNonRoot): true\n                securityContext:\n                  runAsNonRoot: true\n        - spec:\n            template:\n              spec:\n                =(ephemeralContainers):\n                - securityContext:\n                    runAsNonRoot: true\n                =(initContainers):\n                - securityContext:\n                    runAsNonRoot: true\n                containers:\n                - securityContext:\n                    runAsNonRoot: true\n        message: Running as root is not allowed. Either the field spec.securityContext.runAsNonRoot\n          must be set to `true`, or the fields spec.containers[*].securityContext.runAsNonRoot,\n          spec.initContainers[*].securityContext.runAsNonRoot, and spec.ephemeralContainers[*].securityContext.runAsNonRoot\n          must be set to `true`.\n    - exclude:\n        resources: {}\n      generate:\n        clone: {}\n        cloneList: {}\n      match:\n        any:\n        - resources:\n            kinds:\n            - CronJob\n        resources: {}\n      mutate: {}\n      name: autogen-cronjob-run-as-non-root\n      validate:\n        anyPattern:\n        - spec:\n            jobTemplate:\n              spec:\n                template:\n                  spec:\n                    =(ephemeralContainers):\n                    - =(securityContext):\n                        =(runAsNonRoot): true\n                    =(initContainers):\n                    - =(securityContext):\n                        =(runAsNonRoot): true\n                    containers:\n                    - =(securityContext):\n                        =(runAsNonRoot): true\n                    securityContext:\n                      runAsNonRoot: true\n        - spec:\n            jobTemplate:\n              spec:\n                template:\n                  spec:\n                    =(ephemeralContainers):\n                    - securityContext:\n                        runAsNonRoot: true\n                    =(initContainers):\n                    - securityContext:\n                        runAsNonRoot: true\n                    containers:\n                    - securityContext:\n                        runAsNonRoot: true\n        message: Running as root is not allowed. Either the field spec.securityContext.runAsNonRoot\n          must be set to `true`, or the fields spec.containers[*].securityContext.runAsNonRoot,\n          spec.initContainers[*].securityContext.runAsNonRoot, and spec.ephemeralContainers[*].securityContext.runAsNonRoot\n          must be set to `true`.\n  conditions:\n  - lastTransitionTime: \"2024-01-12T08:26:09Z\"\n    message: Ready\n    reason: Succeeded\n    status: \"True\"\n    type: Ready\n  ready: true\n  rulecount:\n    generate: 0\n    mutate: 0\n    validate: 1\n    verifyimages: 0\n  validatingadmissionpolicy:\n    generated: false\n    message: \"\"\n"
  },
  "details": [
    {
      "title": "Background",
      "value": "enabled"
    },
    {
      "title": "Admission",
      "value": "enabled"
    },
    {
      "title": "FailurePolicy",
      "value": "Fail"
    },
    {
      "title": "Mode",
      "value": "Audit"
    }
  ]
}
```

### [POST] V1 Policy Exception API

The `/v1/policies/exception` API provides a way to create an Exception for a given Resource, Policy and Rules.

#### Request Body

```json
{
  "resource": {
    "apiVersion": "apps/v1",
    "kind": "Deployment",
    "name": "local-path-provisioner",
    "namespace": "local-path-storage"
  },
  "policies": [
    {
      "name": "disallow-capabilities-strict",
      "rules": ["autogen-require-drop-all"]
    }
  ]
}
```

#### Response

```json
{
  "resource": "kind: PolicyException\napiVersion: kyverno.io/v2beta1\nmetadata:\n  name: local-path-provisioner-exception\n  namespace: local-path-storage\n  creationTimestamp: null\nspec:\n  match:\n    any:\n      - resources:\n          kinds:\n            - Deployment\n            - Pod\n            - ReplicaSet\n          names:\n            - local-path-provisioner*\n          namespaces:\n            - local-path-storage\n  exceptions:\n    - policyName: disallow-capabilities-strict\n      ruleNames:\n        - autogen-require-drop-all\n        - require-drop-all\n"
}
```

### Example Client

You can find an example implementation, screenshots and the official **Kyverno** and **Trivy Plugin** in the [Policy Reporter Plugins Mono Repository](https://github.com/kyverno/policy-reporter-plugins)
