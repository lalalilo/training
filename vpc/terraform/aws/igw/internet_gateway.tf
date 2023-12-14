resource "aws_internet_gateway" "tfer--igw-002D-034fbe9be82635b26" {
  tags = {
    Import = "Kenzo"
    Name   = "test-kenzo-gw"
  }

  tags_all = {
    Import = "Kenzo"
    Name   = "test-kenzo-gw"
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-0d1707c7f95afd95b_id}"
}

resource "aws_internet_gateway" "tfer--igw-002D-69629700" {
  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-c1df29a8_id}"
}
