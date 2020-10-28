-- Create initial database
CREATE DATABASE WMSInventory;

USE WMSInventory;

-- Create Part table
DROP TABLE IF EXISTS Parts;

CREATE TABLE Parts (
	partId int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	category varchar DEFAULT NULL,
	name varchar NOT NULL,
	partQuantity int NOT NULL,
	partLocation varchar DEFAULT NULL
);


-- Create Category table
DROP TABLE IF EXISTS Categories;

CREATE TABLE Categories (
	categoryId int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar NOT NULL
);

-- Create User table
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
	userId int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	password varchar NOT NULL
);

-- Create Container table
DROP TABLE IF EXISTS Containers;

CREATE TABLE Containers (
	containerId int UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	partId int REFERENCES Parts(partId),
	quantity int DEFAULT NULL,
	size int NOT NULL,
	reservedPart varchar DEFAULT NULL,
	location varchar NOT NULL,
	description varchar DEFAULT NULL,
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