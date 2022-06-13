---
title: Introduction
description: 'What is Policy Reporter'
position: 1
---

## Motivation

<a href="https://github.com/kyverno/policy-reporter" target="_blank">Policy Reporter</a> was created to make the results of your Kyverno validation policies more visible and observable. By default, Kyverno provides the option to create your validation policies in `audit` or `enforce` mode. While `enforce` blocks to applying a manifests that violate the given policy, `audit` creates [PolicyReports](https://kyverno.io/docs/policy-reports/) that provide information about all resources that pass or fail your policies. Because Policy Reports are simple Custom Resource Definitions you can access them with `kubectl get/discribe`.

The disadvantages of these PolicyReports are that the results of a policy can be spread across multiple namespaces and both, the passed and failed results of multiple policies, are combined into one PolicyReport. This makes it difficult to find all failed results of a single ClusterPolicy. Since a PolicyReport contains all the results of a namespace, it is also difficult to check for new violations by new policies or resources.

Policy Reporter helps with this problems by providing different features based on PolicyReports:
* New violations can be send to different clients like Grafana Loki, Elasticsearch, Slack, Discord or MS Teams
* The optional metrics endpoint can be used to observe violations in monitoring tools like Grafana
* Policy Reporter provides also a standalone <a href="https://github.com/kyverno/policy-reporter-ui" target="_blank">Dashboard</a> to get a graphical overview of all results with filter and an optional <a href="https://github.com/kyverno/policy-reporter-kyverno-plugin" target="_blank">Kyverno Plugin</a> to get also information about your Kyverno policies.

## Use cases

Due to the work of the <a href="https://github.com/kubernetes-sigs/wg-policy-prototypes" target="_blank">Kubernetes Policy Working Group</a> and Community, the adoption of the PolicyReport and ClusterPolicyReport <abbr title="Custom Resource Definitions">CRDs</abbr> for different apps is increasing. This enables Policy Reporter to be used with other tools such as Kube Bench, Trivy, jsPolicy or Falco.

## Screenshots

### Policy Reporter UI

<img src="/images/screenshots/dashboard-light.png" style="border: 1px solid #ccc" class="light-img" alt="Dashboard light" />
<img src="/images/screenshots/dashboard-dark.png" style="border: 1px solid #555" class="dark-img" alt="Dashboard dark" />

### Grafana

<img src="/images/screenshots/grafana.png" style="border: 1px solid #555" alt="Grafana: Policy Report Details" />

### Discord

<img src="/images/screenshots/discord.png" style="border: 1px solid #555" alt="Discord: Policy Report Alert" />

## Resources

### Videos

<iframe width="100%" height="315" src="https://www.youtube-nocookie.com/embed/1mKywg9f5Fw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen width="100%" style="border: 1px solid #555"></iframe>
<br />
<iframe width="100%" height="315" src="https://www.youtube-nocookie.com/embed/ZrOtTELNLyg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen width="100%" style="border: 1px solid #555"></iframe>
<br />
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/tG-YLGF9_Aw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen width="100%" style="border: 1px solid #555"></iframe>

### Blogs

* [Monitor Security and Best Practices with Kyverno and Policy Reporter](https://blog.webdev-jogeleit.de/blog/monitor-security-with-kyverno-and-policy-reporter/)
* [Kubernetes Security — Use Kyverno Policy Reporter to fix Kyverno deployment by Charles-Edouard Brétéché](https://medium.com/@charled.breteche/kubernetes-security-use-kyverno-policy-reporter-to-fix-kyverno-deployment-22f3bb18540c)