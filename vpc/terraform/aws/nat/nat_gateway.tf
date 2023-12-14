resource "aws_nat_gateway" "tfer--nat-002D-0adc7721f8e63f22b" {
  allocation_id     = "eipalloc-053043c877d4a6b11"
  connectivity_type = "public"
  private_ip        = "10.0.60.153"
  subnet_id         = "subnet-0e4b385c4702b7d5e"

  tags = {
    Import = "Kenzo"
    Name   = "kenzo-test-nat"
  }

  tags_all = {
    Import = "Kenzo"
    Name   = "kenzo-test-nat"
  }
}
