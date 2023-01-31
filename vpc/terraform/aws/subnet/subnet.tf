resource "aws_subnet" "tfer--subnet-002D-029f5b744b711bf39" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.128.0/18"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_customer_owned_ip_on_launch                = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Import = "Kenzo"
    Name   = "priv-subnet-1"
  }

  tags_all = {
    Import = "Kenzo"
    Name   = "priv-subnet-1"
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-0d1707c7f95afd95b_id}"
}

resource "aws_subnet" "tfer--subnet-002D-04e78d1dac4235e83" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.64.0/18"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_customer_owned_ip_on_launch                = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Import = "Kenzo"
    Name   = "pub-subnet-2"
  }

  tags_all = {
    Import = "Kenzo"
    Name   = "pub-subnet-2"
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-0d1707c7f95afd95b_id}"
}

resource "aws_subnet" "tfer--subnet-002D-09f00e9bd269a6437" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.192.0/18"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_customer_owned_ip_on_launch                = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Import = "Kenzo"
    Name   = "priv-subnet-2"
  }

  tags_all = {
    Import = "Kenzo"
    Name   = "priv-subnet-2"
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-0d1707c7f95afd95b_id}"
}

resource "aws_subnet" "tfer--subnet-002D-0e4b385c4702b7d5e" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.0.0/18"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_customer_owned_ip_on_launch                = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Import = "Kenzo"
    Name   = "pub-subnet-1"
  }

  tags_all = {
    Import = "Kenzo"
    Name   = "pub-subnet-1"
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-0d1707c7f95afd95b_id}"
}

resource "aws_subnet" "tfer--subnet-002D-301a0c48" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "172.31.32.0/20"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_customer_owned_ip_on_launch                = "false"
  map_public_ip_on_launch                        = "true"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    "kubernetes.io/role/internal-elb" = ""
  }

  tags_all = {
    "kubernetes.io/role/internal-elb" = ""
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-c1df29a8_id}"
}

resource "aws_subnet" "tfer--subnet-002D-94aa5dfd" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "172.31.16.0/20"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_customer_owned_ip_on_launch                = "false"
  map_public_ip_on_launch                        = "true"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    "kubernetes.io/role/elb" = ""
  }

  tags_all = {
    "kubernetes.io/role/elb" = ""
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-c1df29a8_id}"
}

resource "aws_subnet" "tfer--subnet-002D-eb97a6a1" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "172.31.0.0/20"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_customer_owned_ip_on_launch                = "false"
  map_public_ip_on_launch                        = "true"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    "kubernetes.io/role/elb" = ""
  }

  tags_all = {
    "kubernetes.io/role/elb" = ""
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-c1df29a8_id}"
}
