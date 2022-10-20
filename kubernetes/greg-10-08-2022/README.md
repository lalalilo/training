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

### What I did/learn

Reading the [ingress doc](https://kubernetes.io/docs/concepts/services-networking/ingress/) it seems that I first need to setup an [ingress controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/).

[AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.4/how-it-works/) seems to fit the need.

https://aws.amazon.com/premiumsupport/knowledge-center/eks-alb-ingress-controller-setup/

```
ISSUER_URL=$(aws eks describe-cluster --name greg-kenzo-training-stockholm-sans-vpc \
  --query "cluster.identity.oidc.issuer" --region eu-north-1 --output text)
aws iam create-open-id-connect-provider \
  --url ${ISSUER_URL} \
  --thumbprint-list oidc.eks.eu-north-1.amazonaws.com \
  --client-id-list sts.amazonaws.com \
  --region eu-north-1

```

Call with Kenzo which explained me why we need an ingress controller. The ingress controller is defined inside the cluster and will be pinged by the ingress to create AWS ressources (the ALB for example) that's why the ingress controller need an OIDC.

I'm following both docs from [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/eks-alb-ingress-controller-setup/) and [NGINX](https://www.nginx.com/blog/deploying-nginx-ingress-controller-on-amazon-eks-how-we-tested/).
It didn't work so I found [another doc](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) using `eksctl`
I created an OIDC for my cluster:
`eksctl utils associate-iam-oidc-provider --cluster greg-kenzo-training-stockholm-sans-vpc --approve --region eu-north-1`

I created a policy named AWSLoadBalancerControllerIAMPolicyGregTraining following [this tutorial](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/deploy/installation/) as the iam_policy.json from the AWS doc was not working.
Here is the content of the policy:
https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.2.1/docs/install/iam_policy.json

Then I created the service account with the previous policy attached.

```

eksctl create iamserviceaccount \
--cluster=greg-kenzo-training-stockholm-sans-vpc \
--region=eu-north-1 \
--namespace=kube-system \
--name=aws-load-balancer-controller \
--attach-policy-arn=arn:aws:iam::651828462322:policy/AWSLoadBalancerControllerIAMPolicyGregTraining \
--override-existing-serviceaccounts \
--approve

```

Then `kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.0.2/cert-manager.yaml`

Then realise it was not useful as I know prod is using helm chart I'm going for helm chart as well so I ran:
`kubectl delete -f https://github.com/jetstack/cert-manager/releases/download/v1.0.2/cert-manager.yaml`

Then
`helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=greg-kenzo-training-stockholm-sans-vpc --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller`

⭐️AWS Load Balancer controller installed!⭐️

I'm checking my public subnet go the tag: `kubernetes.io/role/elb 1`
I'm checking my private subnet go the tag: `kubernetes.io/role/internal-elb 1`
All good probably because my cluster has been created using CLI.

Running `k apply -f ingress.yaml`
Running `k describe ingress greg-ingress` gives me:

```bash

➜ k describe ingress greg-ingress
Name:             greg-ingress
Labels:           <none>
Namespace:        default
Address:          k8s-default-gregingr-ce2d40507d-1389164601.eu-north-1.elb.amazonaws.com
Ingress Class:    alb
Default backend:  greg-service:80 (192.168.60.232:8080)
Rules:
  Host        Path  Backends
  ----        ----  --------
  *           *     greg-service:80 (192.168.60.232:8080)
Annotations:  alb.ingress.kubernetes.io/scheme: internet-facing
              alb.ingress.kubernetes.io/target-type: ip
Events:
  Type    Reason                  Age   From     Message
  ----    ------                  ----  ----     -------
  Normal  SuccessfullyReconciled  3s    ingress  Successfully reconciled

```

Wouhouuu validation is working, running `curl k8s-default-gregingr-ce2d40507d-1389164601.eu-north-1.elb.amazonaws.com` return "Hello World"

### Use environment variables

Write a config map to inject your env variable into the pod.

**Validation**

`curl <your-ingress-address>/author` return { "author": "<your-name>" }

### What I did/learn

I followed two docs: [1](https://kubernetes.io/docs/concepts/configuration/configmap/) and [2](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)

However when getting the author route I got a 404.
I checked successfully that the env variable was present in pod using `k exec -it greg-pod -- bash` and `echo $AUTHOR`
I suspect a wrong docker image.
Building the docker file locally confirm this hypothesis.
I'll upload a new docker image tomorrow.

🥇 Yeah it worked 🥇

### Make sure your service is resilient

Write a ReplicaSet with at least 2 instances

### Make sure deployments don't cause downtime

Write a Deployment

Question:

Comment les values sont chargés dans les configmaps?
Comment tu ajoutes un cluster à argocd?
Selector keept in the service.yaml ... how ?
