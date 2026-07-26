# Persistence

Policy Reporter uses an **internal SQLite** database by default to create and manage different views and schemas of your `PolicyReports`. This allows the various REST APIs to work without extra infrastructure and works well for smaller setups.

If you need a shared or more scalable persistence layer, configure an external SQL database. Policy Reporter supports **PostgreSQL**, **MySQL** and **MariaDB**. For distributed deployments.

### Configuration

```yaml
database:
  # supports "postgres", "mysql", "mariadb"
  type: "postgres"
  database: "policy-reporter"
  username: "username"
  password: "password"
  host: "localhost:5432"
  enableSSL: false
  # instead of configure the individual values you can also provide an DSN string
  # example postgres: postgres://postgres:password@localhost:5432/postgres?sslmode=disable
  # example mysql: root:password@tcp(localhost:3306)/test?tls=false
  dsn: ""
  # -- Maximum number of open connections, supported for mysql and postgres
  maxOpenConnections: 25
  # -- Maximum number of idle connections, supported for mysql and postgres
  maxIdleConnections: 25
  # -- Maximum amount of time in minutes a connection may be reused, supported for mysql and postgres
  connectionMaxLifetime: 0
  # -- Maximum amount of time in minutes a connection may be idle, supported for mysql and postgres
  connectionMaxIdleTime: 0
  # -- Timeout for database operations in seconds, supported for mysql and postgres
  timeout: 10
  # -- Enables database related metrics, connection status and query histogram
  metrics: false
  # configure an existing secret as source of your values
  # supported fields: username, password, host, dsn, database
  secretRef: ""
  # use an mounted secret as source of your values, required the information in JSON format
  # supported fields: username, password, host, dsn, database
  mountedSecret: ""
```

### Secret-backed configuration

Database configuration can be populated from a Secret or mounted secret. The supported fields are `username`, `password`, `host`, `dsn`, and `database`.

### Data Consistency

To ensure data consistency after restarts or a leader switch in an HA setup, Policy Reporter refreshes persisted report data and reprocesses all `PolicyReports` in your cluster when a persistent SQL database is used.

Redis is used as a cache for results, so it complements the SQL database rather than replacing it.

#### Metrics

| Option                          | Labels                                     | Type        |
| --------------------------------|--------------------------------------------|-------------|
| `database_connections`          | `database`, `system`                       | Gauge       |
| `database_max_open_connections` | `database`, `system`                       | Gauge       |
| `database_max_idle_time_closed` | `database`, `system`                       | Gauge       |
| `database_max_idle_closed`      | `database`, `system`                       | Gauge       |
| `database_idle_connections`     | `database`, `system`                       | Gauge       |
| `database_max_lifetime_closed`  | `database`, `system`                       | Gauge       |
| `database_in_use`               | `database`, `system`                       | Gauge       |
| `database_wait_count`           | `database`, `system`                       | Gauge       |
| `database_wait_duration`        | `database`, `system`                       | Gauge       |
| `database_query_timing`         | `database`, `system`, `operation`, `table` | Histogram   |
