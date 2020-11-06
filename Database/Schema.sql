-- Create initial database
CREATE DATABASE wmsinventory CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE wmsinventory;

-- Create Part table
DROP TABLE IF EXISTS Parts; 

CREATE TABLE Parts (
	partId int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	category varchar(255) DEFAULT NULL,
	name varchar(255) NOT NULL,
	partQuantity int NOT NULL,
	partLocation varchar(255) DEFAULT NULL
);

-- Create Category table
DROP TABLE IF EXISTS Categories;

CREATE TABLE Categories (
	categoryId int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL
);

-- Create User table
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
	userId int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	password varchar(255) NOT NULL
);

-- Create Container table
DROP TABLE IF EXISTS Containers;

CREATE TABLE Containers (
	containerId int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	partId int REFERENCES Parts(partId),
	quantity int DEFAULT NULL,
	size int NOT NULL,
	reservedPart varchar(255) DEFAULT NULL,
	location varchar(255) NOT NULL,
	description varchar(255) DEFAULT NULL,
	isEmpty bool DEFAULT TRUE,
	isReserved bool DEFAULT FALSE
);

-- Create CategorizedBy table
DROP TABLE IF EXISTS CategorizedBy;

CREATE TABLE CategorizedBy (
	partId int REFERENCES Parts(partId), 
	categoryId int REFERENCES Categories(categoryId)
);

-- Create Used table
DROP TABLE IF EXISTS Used;

CREATE TABLE Used (
	userId int REFERENCES Users(userId),
	partId int REFERENCES Parts(partId),
	usedDate date
);