# App Configuration

## Logging

Configure additional request logging, output format and log level.

::: code-group

```yaml [values.yaml]
ui:
  logging:
    # -- enables external api request logging
    api: false
    # -- enables server access logging
    server: false
    # -- log encoding
    # possible encodings are console and json
    encoding: console
    # -- log level
    # default info
    logLevel: 0
```

```yaml [config.yaml]
logging:
  # -- Enables external api request logging
  api: false
  # -- Enables server access logging
  server: false
  # -- Log encoding
  # possible encodings are console and json
  encoding: console
  # -- Log level
  # default info
  logLevel: 0
```
:::

## Server

Customize server related configurations

::: code-group

```yaml [values.yaml]
ui:
  server:
    # -- Application port
    port: 8080
    # -- Enables CORS header
    cors: true
    # -- Overwrites Request Host with Proxy Host and adds `X-Forwarded-Host` and `X-Origin-Host` headers
    overwriteHost: true
```

```yaml [values.yaml]
server:
  # -- Application port
  port: 8080
  # -- Enabled CORS header
  cors: true
  # -- Overwrites Request Host with Proxy Host and adds `X-Forwarded-Host` and `X-Origin-Host` headers
  overwriteHost: true
```
:::