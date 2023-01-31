resource "aws_main_route_table_association" "tfer--vpc-002D-0d1707c7f95afd95b" {
  route_table_id = "${data.terraform_remote_state.route_table.outputs.aws_route_table_tfer--rtb-002D-081d8949b381919ab_id}"
  vpc_id         = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-0d1707c7f95afd95b_id}"
}

resource "aws_main_route_table_association" "tfer--vpc-002D-c1df29a8" {
  route_table_id = "${data.terraform_remote_state.route_table.outputs.aws_route_table_tfer--rtb-002D-04e6176d_id}"
  vpc_id         = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-002D-c1df29a8_id}"
}
