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

### What I did/learn

The pod is accepted by the kubernetes cluster but its status is PENDING, which means it didn't find any nodes to run on. Here are [detailed explanation](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/) on each phase of a pod lifecycle.

I've created a node.yaml file with a basic config. Then I've run `k apply -f node.yaml` which answered with "node/greg-training-node created". However running the command `k get nodes` still return "No resources found".

After some unsuccessful research on "create a node in existing kubernetes cluster", I'm creating a node group in AWS console. First I need to create an IAM role for the node group: `greg-training-29-09-2022-node-group-role` following this [page](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html#create-worker-node-role) (need to be aws admin to do so). Then I've changed the instance type to use t3.micro (I thought it would be the cheappest one) and reduce the disk size to 5GB. Desired size is 2 nodes, minimum size is 2 nodes (not sure to fully understand the difference though) and maximum size is 4.
The node group is named: `greg-node-group`. The node group creation is taking way too long time.. I'm waiting since 32min..
I finally got a `NodeCreationFailure: Instances failed to join the kubernetes cluster`
I'm changing my cluster endpoint access from `Public` ➡️ `Public and Private` (17 min later it's successful).

We add a NAT gateway, and the IAM policies of staging-node-group (load balancer, eks).

🏆 Finally 🏆
Finally we've been able to move forward running the following command:
`eksctl create cluster --name greg-kenzo-training-stockholm --region eu-north-1 --version 1.23`

This create a cluster using CloudFormation (AWS Terraform equivalent) automatically with two nodes.
The goal of this tutorial is not to be able to fully understand VPC, subnet or security group that's why we decided to drop the analysis on why it doesn't work.

Finally the command `kubectl get pods` returns my running pod.

### Make your API internally accessible

Write a service to expose your pod to the network inside your cluster.

**Validation**

`kubectl exec -it <your-pod-name> -- curl <your-service-name>` returns hello world.

### What I did/learn

[Kubernetes service](https://kubernetes.io/docs/concepts/services-networking/service/)
Running the validation command I have a connection refuse on port 80.
However, I can connect directly to the pod using: `k exec -it greg-pod -- bash`

Running `k logs greg-pod` which gives `Running on http://0.0.0.0:8080` so I've changed the `targetPort` of the service from `9376` to `8080`. Also I've removed the `containerPort` of the pod.yaml as it seems unused.

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
