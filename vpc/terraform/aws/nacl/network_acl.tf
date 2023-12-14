resource "aws_network_acl" "tfer--acl-002D-0425429e3f74899d2" {
  egress {
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = "0"
    icmp_code  = "0"
    icmp_type  = "0"
    protocol   = "-1"
    rule_no    = "100"
    to_port    = "0"
  }

  ingress {
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = "0"
    icmp_code  = "0"
    icmp_type  = "0"
    protocol   = "-1"
    rule_no    = "100"
    to_port    = "0"
  }

  subnet_ids = ["${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-09f00e9bd269a6437_id}", "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-029f5b744b711bf39_id}", "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-0e4b385c4702b7d5e_id}", "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-04e78d1dac4235e83_id}"]

  tags = {
    Import = "Kenzo"
  }

  tags_all = {
    Import = "Kenzo"
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-0d1707c7f95afd95b_id}"
}

resource "aws_network_acl" "tfer--acl-002D-efbc4d86" {
  egress {
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = "0"
    icmp_code  = "0"
    icmp_type  = "0"
    protocol   = "-1"
    rule_no    = "100"
    to_port    = "0"
  }

  ingress {
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = "0"
    icmp_code  = "0"
    icmp_type  = "0"
    protocol   = "-1"
    rule_no    = "100"
    to_port    = "0"
  }

  subnet_ids = ["${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-94aa5dfd_id}", "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-301a0c48_id}", "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-eb97a6a1_id}"]
  vpc_id     = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-c1df29a8_id}"
}
