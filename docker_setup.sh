#!/bin/bash
# Docker and Docker Compose Setup on RHEL

# Update system
sudo yum update -y

# Install dependencies
sudo yum install -y yum-utils device-mapper-persistent-data lvm2 curl firewalld

# Add Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Install Docker Engine and Compose plugin
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to Docker group
sudo usermod -aG docker $USER

# Start and enable firewall
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Open ports for your app
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload

# Verify installation
docker --version
docker compose version
sudo firewall-cmd --list-ports


echo "Docker and Docker Compose setup is complete."
echo "Log out and back in, or run 'newgrp docker' to use Docker without sudo."

