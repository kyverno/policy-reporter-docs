# Persistence

Policy Reporter uses an **internal SQLite** database to create and manage different views and schemas of your `PolicyReports`. This allows the various REST APIs to work performantly in both smaller and larger clusters. Although this approach is very flexible and does not require any additional setup, it also has its limits above a certain size.

If you encounter performance or persistence issues in your environment consider to replace this internal SQLite Database with an external SQL Database. Policy Reporter supports **PostgreSQL**, **MySQL** and **MariaDB**.

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
  # configure an existing secret as source of your values
  # supported fields: username, password, host, dsn, database
  secretRef: ""
  # use an mounted secret as source of your values, required the information in JSON format
  # supported fields: username, password, host, dsn, database
  mountedSecret: ""
```

### Data Consistency

To ensure data consistency after restarts or a leader switch in an HA setup, Policy Reporter truncates existing Data and reprocesses all `PolicyReports` in your cluster.
