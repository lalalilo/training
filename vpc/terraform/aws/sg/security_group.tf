resource "aws_security_group" "tfer--default_sg-002D-0cbee41741f7ac21e" {
  description = "default VPC security group"

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "0"
    protocol    = "-1"
    self        = "false"
    to_port     = "0"
  }

  ingress {
    from_port = "0"
    protocol  = "-1"
    self      = "true"
    to_port   = "0"
  }

  name   = "default"
  vpc_id = "vpc-0d1707c7f95afd95b"
}

resource "aws_security_group" "tfer--default_sg-002D-ff6bd496" {
  description = "default VPC security group"

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "0"
    protocol    = "-1"
    self        = "false"
    to_port     = "0"
  }

  ingress {
    from_port = "0"
    protocol  = "-1"
    self      = "true"
    to_port   = "0"
  }

  name   = "default"
  vpc_id = "vpc-c1df29a8"
}

resource "aws_security_group" "tfer--kenzo-002D-test-002D-sg_sg-002D-0a3c553d02442aae7" {
  description = "launch-wizard-2 created 2023-01-31T16:37:52.246Z"

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "0"
    protocol    = "-1"
    self        = "false"
    to_port     = "0"
  }

  ingress {
    cidr_blocks = ["5.183.248.13/32"]
    from_port   = "22"
    protocol    = "tcp"
    self        = "true"
    to_port     = "22"
  }

  name = "kenzo-test-sg"

  tags = {
    Import = "Kenzo"
  }

  tags_all = {
    Import = "Kenzo"
  }

  vpc_id = "vpc-0d1707c7f95afd95b"
}
