# Authentication

With Policy Reporter UI v2 it is possible to use either OAuth2 or OpenIDConnect as authentication mechanism.

::: warning
Its not possible to reduce or configure view permission based on roles or any other information yet. Authentication ensures that no unauthorized person is able to open the UI at all.
:::

## OAuth2

Policy Reporter UI v2 supports a fixed set of oauth2 providers. If the provider of your choice is not yet supported, you can submit a feature request for it.

### Supported Provider

- amazon
- gitlab
- github
- apple
- google
- yandex
- azuread

### Example Configuration (GitHub Provider)

**Since the callback URL depends on your setup, you must explicitly configure it.**

::: code-group

```yaml [values.yaml]
ui:
  oauth:
    enabled: true
    clientId: c79c02881aa1...
    clientSecret: fb2035255d0bd182c9...
    provider: github
    callback: http://localhost:8082/callback
```

```yaml [config.yaml]
oauth:
  enabled: true
  clientId: c79c02881aa1...
  clientSecret: fb2035255d0bd182c9...
  provider: github
  callback: http://localhost:8082/callback
```

```yaml [Helm + SecretRef]
# secret example
apiVersion: v1
kind: Secret
metadata:
  name: github-provider
data:
  clientId: Yzc5YzAyODgxYWEx # c79c02881aa1...
  clientSecret: ZmIyMDM1MjU1ZDBiZDE4MmM5 # fb2035255d0bd182c9...
  provider: Z2l0aHVi # github

# values.yaml
ui:
  oauth:
    enabled: true
    secretRef: 'github-provider'
    callback: http://localhost:8082/callback
```

:::

## OpenIDConnect

This authentication mechanism supports all compatible services and systems.

### Example Configuration (Keycloak)

**Since the callback URL depends on your setup, you must explicitly configure it.**

::: code-group

```yaml [values.yaml]
ui:
  openIDConnect:
    enabled: true
    clientId: policy-reporter
    clientSecret: c11cYF9tNtL94w....
    callbackUrl: http://localhost:8082/callback
    discoveryUrl: 'https://keycloak.instance.de/realms/policy-reporter'
```

```yaml [config.yaml]
openIDConnect:
    enabled: true
    clientId: policy-reporter
    clientSecret: c11cYF9tNtL94w....
    callbackUrl: http://localhost:8082/callback
    discoveryUrl: 'https://keycloak.instance.de/realms/policy-reporter'
```

```yaml [Helm + SecretRef]
# secret example
apiVersion: v1
kind: Secret
metadata:
  name: keycloak-provider
data:
  clientId: Yzc5YzAyODgxYWEx
  clientSecret: ZmIyMDM1MjU1ZDBiZDE4MmM5
  discoveryUrl: aHR0cHM6Ly9rZXljbG9hay5pbnN0YW5jZS5kZS9yZWFsbXMvcG9saWN5LXJlcG9ydGVy

# values.yaml
ui:
  openIDConnect:
    enabled: true
    callback: http://localhost:8082/callback
    secretRef: 'keycloak-provider'
```

:::