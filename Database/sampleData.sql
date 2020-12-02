USE WMSInventory;

-- Insert Example Parts
INSERT INTO Parts (category, name, partQuantity, partLocation)
VALUES ("Screw", "ScrewA", 5, "A1");

INSERT INTO Parts (category, name, partQuantity, partLocation)
VALUES ("Screw", "ScrewB", 25, "A1");

INSERT INTO Parts (category, name, partQuantity)
VALUES ("Screw", "ScrewC", 3);

INSERT INTO Parts (category, name, partQuantity, partLocation)
VALUES ("Hammer", "Ballpeen", 2, "garage");


-- Insert Example Categegory
INSERT INTO Categories (name)
VALUES ("Screw");

INSERT INTO Categories (name)
VALUES ("Hammer");


-- Insert Example Container
INSERT INTO Containers (name, partId, quantity, size, location, description)
VALUES ("Toolbox", 1, 2, 15, "A1", "A1 container");

INSERT INTO Containers (name, partId, quantity, size, location)
VALUES ("Cardboard Box", 2, 2, 15, "A1");

INSERT INTO Containers (name, partId, quantity, size, location, description)
VALUES ("Red Box", 2, 1, 25, "A2", "A2 container");

-- Insert Example User
INSERT INTO Users (username, password)
VALUES ("Fred", "P@ssw0rd");

INSERT INTO Users (username, password)
VALUES ("Mickey", "ClubH0u$3");
