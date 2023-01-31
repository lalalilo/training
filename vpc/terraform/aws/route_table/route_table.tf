resource "aws_route_table" "tfer--rtb-002D-04e6176d" {
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "igw-69629700"
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-c1df29a8_id}"
}

resource "aws_route_table" "tfer--rtb-002D-081d8949b381919ab" {
  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-0d1707c7f95afd95b_id}"
}

resource "aws_route_table" "tfer--rtb-002D-0c8c41096c2135653" {
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = "nat-0adc7721f8e63f22b"
  }

  tags = {
    Import = "Kenzo"
    Name   = "kenzo-test-priv-route-table"
  }

  tags_all = {
    Import = "Kenzo"
    Name   = "kenzo-test-priv-route-table"
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-0d1707c7f95afd95b_id}"
}

resource "aws_route_table" "tfer--rtb-002D-0cfbe49d38b20e62e" {
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "igw-034fbe9be82635b26"
  }

  tags = {
    Import = "Kenzo"
    Name   = "test-kenzo-pub-route-table"
  }

  tags_all = {
    Import = "Kenzo"
    Name   = "test-kenzo-pub-route-table"
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-0d1707c7f95afd95b_id}"
}
