-- Create initial database
CREATE DATABASE IF NOT EXISTS wmsinventory CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE wmsinventory;

-- Drop Tables if Existing
DROP TABLE IF EXISTS Containers;
DROP TABLE IF EXISTS CategorizedBy;
DROP TABLE IF EXISTS ContainedBy;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Parts; 
DROP TABLE IF EXISTS Categories;

-- Create Category table
CREATE TABLE Categories (
	categoryID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) UNIQUE NOT NULL
);

-- Create Part table
CREATE TABLE Parts (
	partID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL
);

-- Create Container table
CREATE TABLE Containers (
	containerID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) UNIQUE NOT NULL,
	size int DEFAULT NULL,
	location varchar(255) NOT NULL,
	description varchar(255) DEFAULT NULL
);

-- Create User table
CREATE TABLE Users (
	userID int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	partID int NULL,
	username varchar(255) UNIQUE NOT NULL,
	password varchar(255) NOT NULL
);


-- Create table for mapping parts with categories
CREATE TABLE CategorizedBy (
	partID int NOT NULL, 
	categoryID int NOT NULL,
	PRIMARY KEY (partID, categoryID),
	FOREIGN KEY (partID) REFERENCES Parts(partID),
	FOREIGN KEY (categoryID) REFERENCES Categories(categoryID)
);

-- Create table for mapping parts with containers
CREATE TABLE ContainedBy (
	partID int NOT NULL,
	containerID int NOT NULL,
	identifier varchar(255) NOT NULL DEFAULT '',
	quantity float DEFAULT 0,
	PRIMARY KEY (partID, containerID, identifier),
	FOREIGN KEY (partID) REFERENCES Parts(partID),
	FOREIGN KEY (containerID) REFERENCES Containers(containerID)
);
