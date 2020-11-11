-- Create initial database
CREATE DATABASE IF NOT EXISTS WMSInventory CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE WMSInventory;

-- Create Part table
DROP TABLE IF EXISTS Parts; 

CREATE TABLE Parts (
	partID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	category varchar(255) DEFAULT NULL,
	name varchar(255) NOT NULL,
	partQuantity int NOT NULL,
	partLocation varchar(255) DEFAULT NULL
);

-- Create Category table
DROP TABLE IF EXISTS Categories;

CREATE TABLE Categories (
	categoryID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL
);

-- Create User table
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
	userID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL
);

-- Create Container table
DROP TABLE IF EXISTS Containers;

CREATE TABLE Containers (
	containerID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	partID int,
	quantity int DEFAULT NULL,
	size int NOT NULL,
	location varchar(255) NOT NULL,
	description varchar(255) DEFAULT NULL,
);

-- Create CategorizedBy table
DROP TABLE IF EXISTS CategorizedBy;

CREATE TABLE CategorizedBy (
	partID int NOT NULL, 
	categoryID int NOT NULL,
	PRIMARY KEY (partID, categoryID),
	FOREIGN KEY fk_partID(partID) REFERENCES Parts(partID)
	ON DELETE CASCADE,
	FOREIGN KEY fk_categoryID(categoryID) REFERENCES Categories(categoryID)
	ON DELETE CASCADE
);

-- Create Used table
DROP TABLE IF EXISTS Used;

CREATE TABLE Used (
	userID int NOT NULL,
	partID int NOT NULL,
	usedDate date
	PRIMARY KEY (userID, partId),
	FOREIGN KEY fk_userID(userID) REFERENCES User(userID)
	ON DELETE CASCADE,
	FOREIGN KEY fk_partID(partID) REFERENCES Parts(partID)
	ON DELETE CASCADE
);

-- Create Relationships
-- Containers
ALTER TABLE Containers
ADD CONSTRAINT fk_partID
FOREIGN KEY (partID) REFERENCES Parts(partID)
ON DELETE CASCADE;
