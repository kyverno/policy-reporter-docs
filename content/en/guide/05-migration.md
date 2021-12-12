---
title: Migration Guide
description: 'Migration between Major Versions'
position: 5
category: Guide
---

## Policy Reporter

### Deprecations

Deprecated values are removed

```diff
- crdVersion: v1alpha1
- cleanupDebounceTime: 20
```

### Yandex push target

Changed into a general S3 Target.

```diff
target:
-  yandex:
-    accessKeyID: ""
-    secretAccessKey: ""
-    region: ""
-    endpoint: ""
-    bucket: ""
-    prefix: ""
-    minimumPriority: ""
-    skipExistingOnStartup: true
+  s3:
+    accessKeyID: ""
+    secretAccessKey: ""
+    region: "ru-central1"
+    endpoint: "https://storage.yandexcloud.net"
+    bucket: ""
+    prefix: ""
+    minimumPriority: ""
+    sources: []
+    skipExistingOnStartup: true
```

### Metrics API

Metrics are now optional and disabled by default. They are enabled if you use the `monitoring` subchart. Otherwise, you need to enable them separately.

Metrics are now using the same HTTP Server as the REST APIs (`8080` instead of `2112`).

```diff
+ metrics:
+    enabled: true
```

### REST APIs

REST APIs are now optional and disabled by default. They are enabled if you use the `ui` subchart. Otherwise, you need to enable them separately.

```diff
+ rest:
+    enabled: true
```

### Network Policy

Egress traffic is now configured as default egress rule instead of the `networkPolicy.kubernetesApiPort` value.

```diff
networkPolicy:
  enabled: true
-  kubernetesApiPort: 6443
-  egress: []
+  egress:
+  - to:
+    ports:
+    - protocol: TCP
+      port: 6443
```

### Priority mapping

The watch feature was removed, so it is enabled by default. Its recommended to use the severity of your policy to define the priority.

```diff
- policyPriorities:
-   enabled: false
-   mapping: {}
+ policyPriorities: {}
```

## Kyverno Plugin

### Network Policy

Egress traffic is now configured as default egress rule instead of the `kyvernoPlugin.networkPolicy.kubernetesApiPort` value.

```diff
kyvernoPlugin:
  networkPolicy:
    enabled: true
-    kubernetesApiPort: 6443
-    egress: []
+    egress:
+    - to:
+      ports:
+      - protocol: TCP
+        port: 6443
```

## Monitoring

### Namespace

Namespace configuration for the Grafana Dashboard ConfigMaps moved from `monitoring.namespace` to `monitoring.grafana.namespace` and has no default value as before.

```diff
monitoring:
-   namespace: cattle-dashboards
+   grafana:
+     namespace: cattle-dashboards
