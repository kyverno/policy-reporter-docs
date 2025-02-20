# Custom Boards

Custom Boards allows you to configure additional dashboards with a custom subset of sources and namespaces, selected via a list and/or label selector.

## Examples

### Namespace List

Basic Setup with a fixed list of namespaces.

::: code-group

```yaml [values.yaml]
ui:
  enabled: true

  customBoards:
    - name: System
      namespaces:
        list:
          - kube-system
          - kyverno
          - policy-reporter
```

```yaml [config.yaml]
customBoards:
  - name: System
    namespaces:
      list:
        - kube-system
        - kyverno
        - policy-reporter
```

:::

#### Screenshot

<img src="../assets/custom-boards/list.png" style="border: 1px solid #555; margin-top: 20px;" alt="Policy Reporter UI - Custom Board with defined list of namespaces" />

### Namespace Selector

Setup a flexible list of namespaces by using a namespace label selector. Label selectors supporting different operations like `equal`, `exists`, `one of` and `doesnotexist`.

::: code-group

```yaml [values.yaml]
ui:
  enabled: true

  customBoards:
  - name: System
    namespaces:
      selector:
        group: system          # equal check
        app: '*'               # label exists
        service: '!*'          # label does not exists
        tools: 'kyverno,falco' # label tools is one of the defined values: [kyverno, falco]
```

```yaml [config.yaml]
customBoards:
  - name: System
    namespaces:
      selector:
        group: system          # equal check
        app: '*'               # label exists
        service: '!*'          # label does not exists
        tools: 'kyverno,falco' # label tools is one of the defined values: [kyverno, falco]
```

:::

#### Screenshot

<img src="../assets/custom-boards/selector.png" style="border: 1px solid #555; margin-top: 20px;" alt="Policy Reporter UI - Custom Board with dynamic list of namespaces" />

### Source List

Restrict the displayed sources.

::: code-group

```yaml [values.yaml]
ui:
  enabled: true

  customBoards:
  - name: System
    clusterScope:
      enabled: true
    namespaces:
      selector:
        group: system
    sources:
        list: [kyverno]
```

```yaml [config.yaml]
customBoards:
  - name: System
    clusterScope:
      enabled: true
    namespaces:
      selector:
        group: system
    sources:
        list: [kyverno]
```

:::

#### Screenshot

<img src="../assets/custom-boards/sources.png" style="border: 1px solid #555; margin-top: 20px;" alt="Policy Reporter UI - Custom Board with defined source list" />
