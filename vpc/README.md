### Run a machine over the internet

The goal of this training is to create all the necessary networking resources to run both private and public ec2 instances.

1. Create a VPC over `10.0.0.0/16`
2. Create 2 Public Subnet
    1. Create IGW (Internet Gateway) & Attach to the VPC
    2. Create a route table
    3. Add Public Subnet (1a & 1b) in Route table
    4. Add IGW in Public Route table (0.0.0.0/0)
    5. Create a NAT Gateway in Public Subnet
3. Create 2 Private Subnet
    1. Create a route table
    2. Add Private Subnet in Private Route Table
    3. Add NAT GW into the Private Route Table

4. Validate your config
    1. Launch a public EC2 in your VPC
    2. Launch a private EC2 in your VPC
        1. You shouldn’t be able to connect over SSH to your private instance
        2. SSH into your public EC2 and from that instance SSH into the private one

        Here are the commands that I used:
        ```bash
        ssh -i /Users/kenzo/Downloads/kenzo-test\ \(1\).pem ec2-user@13.51.62.254
        sudo mkdir /home/kenzo
        sudo chown ec2-user /home/kenzo
        exit
        scp -i /Users/kenzo/Downloads/kenzo-test\ \(1\).pem /Users/kenzo/Downloads/kenzo-test\ \(1\).pem ec2-user@13.51.62.254:/home/kenzo
        ssh -i /Users/kenzo/Downloads/kenzo-test\ \(1\).pem ec2-user@13.51.62.254
        ssh -i /home/kenzo/kenzo-test\ \(1\).pem ec2-user@10.0.129.143
        ```


### Cleanup

1. Terminate EC2 instances, which will remove the network interface card (NIC), attached with Private or Public IP
2. Remove Elastic IPs
3. Terminate NAT Gateway
4. Detach Internet Gateway
5. Delete IGW
6. You should be able to delete your VPC which will take care of the rest
