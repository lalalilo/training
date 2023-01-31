resource "aws_network_interface" "tfer--eni-002D-0073414dd5071a00c" {
  attachment {
    device_index = "0"
    instance     = "i-07eb52721fbe16f76"
  }

  interface_type     = "interface"
  ipv4_prefix_count  = "0"
  ipv6_address_count = "0"
  ipv6_prefix_count  = "0"
  private_ip         = "10.0.20.94"
  private_ip_list    = ["10.0.20.94"]
  private_ips        = ["10.0.20.94"]
  private_ips_count  = "0"
  security_groups    = ["sg-0a3c553d02442aae7"]
  source_dest_check  = "true"
  subnet_id          = "subnet-0e4b385c4702b7d5e"

  tags = {
    Import = "Kenzo"
  }

  tags_all = {
    Import = "Kenzo"
  }
}

resource "aws_network_interface" "tfer--eni-002D-084a24edd877002b0" {
  attachment {
    device_index = "0"
    instance     = "i-00d041a39aa007654"
  }

  interface_type     = "interface"
  ipv4_prefix_count  = "0"
  ipv6_address_count = "0"
  ipv6_prefix_count  = "0"
  private_ip         = "10.0.129.143"
  private_ip_list    = ["10.0.129.143"]
  private_ips        = ["10.0.129.143"]
  private_ips_count  = "0"
  security_groups    = ["sg-0a3c553d02442aae7"]
  source_dest_check  = "true"
  subnet_id          = "subnet-029f5b744b711bf39"

  tags = {
    Import = "Kenzo"
  }

  tags_all = {
    Import = "Kenzo"
  }
}

resource "aws_network_interface" "tfer--eni-002D-0daecd77e5095db14" {
  description        = "Interface for NAT Gateway nat-0adc7721f8e63f22b"
  interface_type     = "nat_gateway"
  ipv4_prefix_count  = "0"
  ipv6_address_count = "0"
  ipv6_prefix_count  = "0"
  private_ip         = "10.0.60.153"
  private_ip_list    = ["10.0.60.153"]
  private_ips        = ["10.0.60.153"]
  private_ips_count  = "0"
  source_dest_check  = "false"
  subnet_id          = "subnet-0e4b385c4702b7d5e"

  tags = {
    Import = "Kenzo"
  }

  tags_all = {
    Import = "Kenzo"
  }
}
