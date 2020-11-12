-- Create initial database
CREATE DATABASE IF NOT EXISTS WMSInventory CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE WMSInventory;

-- Drop Tables if Existing
DROP TABLE IF EXISTS Containers;
DROP TABLE IF EXISTS CategorizedBy;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Parts; 
DROP TABLE IF EXISTS Categories;

-- Create Part table
CREATE TABLE Parts (
	partID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	category varchar(255) DEFAULT NULL,
	name varchar(255) NOT NULL,
	partQuantity int NOT NULL,
	partLocation varchar(255) DEFAULT NULL
);

-- Create Category table
CREATE TABLE Categories (
	categoryID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL
);

-- Create User table
CREATE TABLE Users (
	userID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	partID int,
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL
);

-- Create Container table
CREATE TABLE Containers (
	containerID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	partID int,
	quantity int DEFAULT NULL,
	size int NOT NULL,
	location varchar(255) NOT NULL,
	description varchar(255) DEFAULT NULL
);

-- Create CategorizedBy table
CREATE TABLE CategorizedBy (
	partID int NOT NULL, 
	categoryID int NOT NULL,
	PRIMARY KEY (partID, categoryID),
	FOREIGN KEY fk_partID(partID) REFERENCES Parts(partID)
	ON DELETE CASCADE,
	FOREIGN KEY fk_categoryID(categoryID) REFERENCES Categories(categoryID)
	ON DELETE CASCADE
);

-- Create Relationships
-- Users
ALTER TABLE Users
ADD CONSTRAINT user_fk_partID
FOREIGN KEY (partID) REFERENCES Parts(partID)
ON DELETE CASCADE;

-- Containers
ALTER TABLE Containers
ADD CONSTRAINT container_fk_partID
FOREIGN KEY (partID) REFERENCES Parts(partID)
ON DELETE CASCADE;
