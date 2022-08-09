## Goal
Understand Kubernetes' main Objects by deploying a simple API on a k8s cluster.

## Steps

### Create an EKS cluster

In [AWS' console](https://eu-west-3.console.aws.amazon.com/eks/home), deploy a new EKS cluster. Make sure you can connect to the cluster with your cli by running:

`aws eks update-kubeconfig --name <your-cluster-name>`

**Validation**

`kubectl get nodes` returns a list of the nodes in your cluster.

### Run your app

Write a Pod spec to run 651828462322.dkr.ecr.eu-west-3.amazonaws.com/node-web-app:latest in your cluster. Apply the config file via `kubectl apply -f <your-yaml-file>.yaml`

**Validation**

`kubectl get pods` returns your pod.

### Make your API internally accessible

Write a service to expose your pod to the network inside your cluster.

**Validation**

`kubectl exec -it <your-pod-name> -- curl <your-service-name>` returns hello world.

### Make your API publicly accessible

Write an ingress that makes your service accessible to the world.

**Validation**

`curl <your-ingress-address>` returns hello world from your pod.

### Use environment variables

Write a config map to inject your env variable into the pod.

**Validation**

`curl <your-ingress-address>/author` return { "author": "<your-name>" }

### Make sure your service is resilient

Write a ReplicaSet with at least 2 instances

### Make sure deployments don't cause downtime

Write a Deployment
