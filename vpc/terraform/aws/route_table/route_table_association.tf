resource "aws_route_table_association" "tfer--subnet-002D-029f5b744b711bf39" {
  route_table_id = "${data.terraform_remote_state.route_table.outputs.aws_route_table_tfer--rtb-002D-0c8c41096c2135653_id}"
  subnet_id      = "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-029f5b744b711bf39_id}"
}

resource "aws_route_table_association" "tfer--subnet-002D-04e78d1dac4235e83" {
  route_table_id = "${data.terraform_remote_state.route_table.outputs.aws_route_table_tfer--rtb-002D-0cfbe49d38b20e62e_id}"
  subnet_id      = "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-04e78d1dac4235e83_id}"
}

resource "aws_route_table_association" "tfer--subnet-002D-09f00e9bd269a6437" {
  route_table_id = "${data.terraform_remote_state.route_table.outputs.aws_route_table_tfer--rtb-002D-0c8c41096c2135653_id}"
  subnet_id      = "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-09f00e9bd269a6437_id}"
}

resource "aws_route_table_association" "tfer--subnet-002D-0e4b385c4702b7d5e" {
  route_table_id = "${data.terraform_remote_state.route_table.outputs.aws_route_table_tfer--rtb-002D-0cfbe49d38b20e62e_id}"
  subnet_id      = "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-002D-0e4b385c4702b7d5e_id}"
}
