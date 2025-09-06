-- Create database
CREATE DATABASE IF NOT EXISTS server_health;

-- Create user and grant privileges
CREATE USER IF NOT EXISTS 'dashboard_user'@'%' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON server_health.* TO 'dashboard_user'@'%';
FLUSH PRIVILEGES;

-- Use the database
USE server_health;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
