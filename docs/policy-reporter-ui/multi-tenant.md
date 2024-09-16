# Multi Tenant

If you are working in a multi-cluster environment and running Policy Reporter in each cluster, it can be annoying to switch between the different UIs of each cluster. To solve this problem, it is possible to configure multiple Policy Reporter REST APIs and switch between them as needed in a single UI.

The **APIs** must be **accessible** for **Policy Reporter UI**, currently only HTTP Basic authentication is supported. Make sure that you make your APIs available only internally.

::: warning
**Attention**: be sure that your APIs are not accessable for the outside world!
Use tools like **VPN**, **private Networks** or **internal Network Load Balancer** to expose your APIs in a secure way to the UI
:::

::: info
To activate the REST-API of your external installations of Policy Reporter, you must set `rest.enabled` to `true` in the respective configurations.
:::

::: code-group

```yaml [values.yaml]
ui:
  clusters:
    - name: Dev Cluster
      host: http://policy-reporter.policy-reporter:8080
      plugins:
        - name: kyverno
          host: http://kyverno-plugin.policy-reporter:8083/api

    - name: Stage Cluster
      host: http://policy-reporter.stage-cluster.dev
      skipTLS: false
      certificate: '/config/root-ca.pem'
      basicAuth:
        username: ''
        password: ''
      plugins:
        - name: kyverno
          host: http://kyverno-plugin.stage-cluster.dev/api
```

```yaml [config.yaml]
clusters:
  - name: Dev Cluster
    host: http://policy-reporter.policy-reporter:8080
    plugins:
      - name: kyverno
        host: http://kyverno-plugin.policy-reporter:8083/api

  - name: Stage Cluster
    host: http://policy-reporter.stage-cluster.dev
    plugins:
      - name: kyverno
        host: http://kyverno-plugin.stage-cluster.dev/api
```

```yaml [Helm + SecretRef]
apiVersion: v1
kind: Secret
metadata:
  name: dev-cluster
type: Opaque
data:
  host: aHR0cDovL3BvbGljeS1yZXBvcnRlcjo4MDgw #http://policy-reporter:8080
  plugin.kyverno: eyJob3N0IjoiaHR0cDovL3BvbGljeS1yZXBvcnRlci1reXZlcm5vLXBsdWdpbjo4MDgwL2FwaSIsICJuYW1lIjoia3l2ZXJubyJ9 # {"host":"http://policy-reporter-kyverno-plugin:8080/api", "name":"kyverno"}

ui:
  clusters:
    - name: Dev Cluster
      secretRef: 'dev-cluster'
```

:::

## Configuration

### Name

A custom name for the configured cluster, is displayed in the dropdown select for switching between your configured clusters.

### Host

An **accessible** URL to the Policy Reporter Core application REST API.

### SkipTLS

Disable client verification of server certificates.

### Certificate

Configure a path to local root CA certificate in PEM format for server certificate verification.

### BasicAuth

Configure `username` and `password` for HTTPBasic authentication support against the `host`.

### SecretRef

Read `host`, `certificate`, `skipTLS` and/or `username`, `password` from an existing Secret instead of defining them directly. The UI must be restarted if you change the secret at runtime.

### Plugins

A list of plugins, used for the given cluster configuration. The `name` reflects the related source of the plugin, in the example above, the plugin relates to **Kyverno**. The `host` is an **accessable** URL to the Policy Reporter Plugin System defined REST API of the plugin.

Each plugin can also configure `skipTLS`, `certificate`, `basicAuth` and `secretRef`.
