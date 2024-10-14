# Authentication

With Policy Reporter UI v2 it is possible to use either OAuth2 or OpenIDConnect as authentication mechanism.

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

## Access Control

The current MVP provides access management for OAuth and OpenIDConnect for cluster, default boards and custom board access.

### Allow E-Mail List

It is possible to configure access control for **clusters**, **boards** and **custom boards** by providing a list of user emails that are allowed to access them.

### Example

* Allow a set of users to access all generated resource- and policy dashboards.
* Allow a set of users to access the **Infrastructure** custom board.
* Allow a set of users to access the **Cluster 2** cluster.

::: code-group

```yaml [values.yaml]
ui:
  clusters:
  - name: Default
    host: http://policy-reporter:8080

  - name: Cluster 2
    host: http://policy-reporter.company.com
    accessControl:
      emails: ['infra@company.com', 'admin@company.com']

  boards:
    accessControl:
      emails: ['admin@company.com']

  customBoards:
  - name: Infrastructure
    namespaces:
      selector:
        team: infra
    accessControl:
      emails: ['infra@company.com']
```

```yaml [config.yaml]
clusters:
  - name: Default
    host: http://policy-reporter:8080

  - name: Cluster 2
    host: http://policy-reporter.company.com
    accessControl:
      emails: ['admin@company.com', 'infra@company.com']

boards:
  accessControl:
    emails: ['admin@company.com']

customBoards:
- name: Infrastructure
  namespaces:
    selector:
      team: infra
  accessControl:
    emails: ['infra@company.com']
```

:::

### Allowed Groups

For OpenIDConnect only, it is possible to configure access control for **clusters**, **boards** and **custom boards** via groups by specifying a group claim that contains assigned groups in the access token.

### Example

In this example, Keycloak is used as an OpenIDConnect provider and configured so that the roles of the user are mapped as "groups" to the generated access token.

* Allow a set of groups to access all generated resource- and policy dashboards.
* Allow a set of groups to access the **Infrastructure** custom board.
* Allow a set of groups to access the **Cluster 2** cluster.

::: code-group

```yaml [values.yaml]
ui:
  openIDConnect:
    enabled: true
    discoveryUrl: https://keycloak-admin.betreuer-plattform.de/realms/policy-reporter
    callbackUrl: http://policy-reporter-ui:8080
    clientId: policy-reporter
    clientSecret: "secret"
    groupClaim: "groups"

  clusters:
  - name: Default
    host: http://policy-reporter:8080

  - name: Cluster 2
    host: http://policy-reporter.company.com
    accessControl:
      groups: ['admin', 'team-infra']

  boards:
    accessControl:
      groups: ['admin']

  customBoards:
  - name: Infrastructure
    namespaces:
      selector:
        team: infra
    accessControl:
      groups: ['team-infra']
```

```yaml [config.yaml]
openIDConnect:
  enabled: true
  discoveryUrl: https://keycloak-admin.betreuer-plattform.de/realms/policy-reporter
  callbackUrl: http://policy-reporter-ui:8080
  clientId: policy-reporter
  clientSecret: "secret"
  groupClaim: "groups"

boards:
  accessControl:
    groups: ['admin']

customBoards:
- name: Infrastructure
  namespaces:
    selector:
      team: infra
  accessControl:
    emails: ['team-infra']
```

:::
