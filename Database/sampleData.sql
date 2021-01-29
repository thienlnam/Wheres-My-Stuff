USE WMSInventory;

-- Insert Example Categories
INSERT INTO Categories (name) VALUES ("Power Tools");
INSERT INTO Categories (name) VALUES ("Hardware");
INSERT INTO Categories (name) VALUES ("Paint");
INSERT INTO Categories (name) VALUES ("Building Supplies");

-- Insert Example Parts
INSERT INTO Parts (name) VALUES ("Screw A");
INSERT INTO Parts (name) VALUES ("Screw B");
INSERT INTO Parts (name) VALUES ("Power Drill");
INSERT INTO Parts (name) VALUES ("Black Spray Paint");

-- Assign parts with categories
INSERT INTO CategorizedBy (partID, categoryID) VALUES (1, 2);
INSERT INTO CategorizedBy (partID, categoryID) VALUES (2, 2);
INSERT INTO CategorizedBy (partID, categoryID) VALUES (1, 4);
INSERT INTO CategorizedBy (partID, categoryID) VALUES (2, 4);
INSERT INTO CategorizedBy (partID, categoryID) VALUES (3, 1);
INSERT INTO CategorizedBy (partID, categoryID) VALUES (4, 3);
INSERT INTO CategorizedBy (partID, categoryID) VALUES (4, 4);

-- Sample Containers
INSERT INTO Containers (name, size, location, description) VALUES ('Red Tool Box', 6, 'Garage', 'Red hexagon shaped box');
INSERT INTO Containers (name, size, location, description) VALUES ('Black Storage Cabinet', 3, 'Garage', 'Black cabinet in the left-corner of the garage');
INSERT INTO Containers (name, size, location, description) VALUES ('Black Storage Cabinet 2', 3, 'Living Room', 'Black cabinet next to the dining table');
INSERT INTO Containers (name, location, description) VALUES ('Living Room', 'Living Room', 'The Living Room');

-- Assign parts to Containers
INSERT INTO ContainedBy (partID, containerID, identifier, quantity) VALUES (1, 1, 'A1', 15);
INSERT INTO ContainedBy (partID, containerID, identifier, quantity) VALUES (1, 2, 'Top Drawer', 10);
INSERT INTO ContainedBy (partID, containerID, identifier, quantity) VALUES (2, 1, 'A2', 8);
INSERT INTO ContainedBy (partID, containerID, identifier, quantity) VALUES (3, 2, 'Second Drawer', 1);
INSERT INTO ContainedBy (partID, containerID, identifier, quantity) VALUES (3, 3, 'Top Drawer', 1);
INSERT INTO ContainedBy (partID, containerID, identifier, quantity) VALUES (4, 4, 'Left Corner', 2);

-- Insert Example User
INSERT INTO Users (username, password)
VALUES ("Fred", "P@ssw0rd");

INSERT INTO Users (username, password)
VALUES ("Mickey", "ClubH0u$3");
