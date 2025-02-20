# Customization

There are a few options to customize the UI to your personal preferences.

## DisplayMode

Defines the default display mode of the UI, defaults to your OS preference setting. Possible values are `dark`, `light`, `colorblind`, `colorblinddark`.

::: code-group

```yaml [values.yaml]
ui:
  displayMode: 'colorblinddark'
```

```yaml [config.yaml]   
ui:
  displayMode: 'colorblinddark'
```

:::

<img src="../assets/policy-reporter-ui-colorblinddark.png" style="border: 1px solid #555; margin-top: 20px;" alt="Policy Reporter UI - Kind Cluster Banner" />

## Banner

Adds custom suffix text to the UI. Can be helpful if you are running multiple UIs in different clusters.

::: code-group

```yaml [values.yaml]
ui:
  banner: 'Kind Cluster'
```

```yaml [config.yaml]   
ui:
  banner: 'Kind Cluster'
```

:::

<img src="../assets/policy-reporter-ui-dark.png" style="border: 1px solid #555; margin-top: 20px;" alt="Policy Reporter UI - Kind Cluster Banner" />
