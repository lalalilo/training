resource "aws_eip" "tfer--eipalloc-002D-00393c751827c1a02" {
  instance             = "i-07eb52721fbe16f76"
  network_border_group = "eu-north-1"
  network_interface    = "eni-0073414dd5071a00c"
  public_ipv4_pool     = "amazon"

  tags = {
    Import = "Kenzo"
  }

  tags_all = {
    Import = "Kenzo"
  }

  vpc = "true"
}

resource "aws_eip" "tfer--eipalloc-002D-053043c877d4a6b11" {
  network_border_group = "eu-north-1"
  network_interface    = "eni-0daecd77e5095db14"
  public_ipv4_pool     = "amazon"

  tags = {
    Import = "Kenzo"
  }

  tags_all = {
    Import = "Kenzo"
  }

  vpc = "true"
}

resource "aws_eip" "tfer--eipalloc-002D-0c88afaef7872018e" {
  network_border_group = "eu-north-1"
  public_ipv4_pool     = "amazon"

  tags = {
    Name                                          = "eksctl-greg-kenzo-training-stockholm-sans-vpc-cluster/NATIP"
    "alpha.eksctl.io/cluster-name"                = "greg-kenzo-training-stockholm-sans-vpc"
    "alpha.eksctl.io/cluster-oidc-enabled"        = "false"
    "alpha.eksctl.io/eksctl-version"              = "0.115.0"
    "eksctl.cluster.k8s.io/v1alpha1/cluster-name" = "greg-kenzo-training-stockholm-sans-vpc"
  }

  tags_all = {
    Name                                          = "eksctl-greg-kenzo-training-stockholm-sans-vpc-cluster/NATIP"
    "alpha.eksctl.io/cluster-name"                = "greg-kenzo-training-stockholm-sans-vpc"
    "alpha.eksctl.io/cluster-oidc-enabled"        = "false"
    "alpha.eksctl.io/eksctl-version"              = "0.115.0"
    "eksctl.cluster.k8s.io/v1alpha1/cluster-name" = "greg-kenzo-training-stockholm-sans-vpc"
  }

  vpc = "true"
}
