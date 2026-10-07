# MCP Server

::: info
We support the `MCP Server` feature since Policy Reporter v3.11.0.

Policy Reporter provides an optional [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server. MCP-compatible clients can use it to query policy compliance data stored by Policy Reporter.

## Enable the MCP Server

With Helm, enable the server and configure its port:

```yaml
mcp:
  enabled: true
  port: 9090
```

For a standalone Policy Reporter configuration, use the same settings in `config.yaml`:

```yaml
mcp:
  enabled: true
  port: 9090
```

The server uses Streamable HTTP and serves the MCP endpoint at `/mcp`. For the default port, clients connect to:

```text
http://<policy-reporter-host>:9090/mcp
```

The MCP server listens on a separate port from the REST API. Make sure the configured port is reachable from the MCP client. Restrict access to trusted clients and networks.

## Available Tools

The server exposes read-only tools for querying stored PolicyReport results:

- `list_resource_compliance`: compliance and severity counts for resources in one or more required namespaces. Supports filters for names, sources, categories, kinds, resource APIs, status, severity, and free-text search.
- `get_namespace_compliance_summary`: aggregated compliance counts per source and namespace, with the same namespace-scoped filters.
- `get_resource_compliance_results`: individual policy results for a resource identified by namespace, kind, and name. Sources, categories, and free-text search can further filter results.
- `list_policy_results`: paginated policy results, with optional filters for policies, categories, namespaces, sources, kinds, resource names and APIs, status, severity, and search text. Without a namespace filter, results for cluster-scoped resources are included as well.

`list_policy_results` defaults to 10 results per page and accepts a maximum page size of 20.