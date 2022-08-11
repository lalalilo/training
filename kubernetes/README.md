## Goal

Understand Kubernetes' main Objects by deploying a simple API on a k8s cluster.

## Steps

### Create an EKS cluster

In [AWS' console](https://eu-west-3.console.aws.amazon.com/eks/home), deploy a new EKS cluster. Make sure you can connect to the cluster with your cli by running:

`aws eks update-kubeconfig --name <your-cluster-name>`

**Validation**

`kubectl get nodes` returns a list of the nodes in your cluster.

### What I did/learn

I'm creating a cluster in `us-west-1` named `greg-cluster-training-kubernetes_10-08-2022`

Cluster roles aka cluster permission is necessary to create the cluster. I'm creating a new role in this region called `greg-cluster-role-training-kubernetes_10-08-2022` having this use case:

- EKS - Cluster: Allows access to other AWS service resources that are required to operate clusters managed by EKS.

I've created a VPC `greg-vpc-training-kubernetes_10-08-2022` having the CIDR block 10.0.0.0/24.
I've created two subnets (as we need at least two availability zone) in this VPC named `greg-subnet-a-training-kubernetes_10-08-2022` and `greg-subnet-c-training-kubernetes_10-08-2022` having the CIDR block 10.0.0.0/25 and 10.0.0.128/25. Here is a [link](https://www.dan.me.uk/ipsubnets?ip=10.0.0.0) that helps me to understand CIDR block ranges.

I didn't had any security group.

I was able to add the cluster in my kubeconfig but I was not able to run any command like `kubectl cluster-info` or `kubectl get nodes` these ended-up with a timeout: `Unable to connect to the server: dial tcp 10.0.0.81:443: i/o timeout`. It comes from that fact that I choose my cluster to be private so only accessible from within the VPC. Changing the networking settings to Public (like our staging cluster) gave me access to the cluster.

The validation is not working as there are no nodes into the cluster by default.
Going on the next step anyway.

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
