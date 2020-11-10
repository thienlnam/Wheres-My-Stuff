USE wmsinventory;

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
INSERT INTO Containers (partId, quantity, size, reservedPart, location, description, isEmpty, isReserved)
VALUES (1, 2, 15, "ScrewA", "A1", "A1 container", FALSE, FALSE);

INSERT INTO Containers (partId, quantity, size, location)
VALUES (2, 2, 15, "A1");

INSERT INTO Containers (partId, quantity, size, reservedPart, location, description, isEmpty, isReserved)
VALUES (2, 1, 25, "ScrewAB", "A2", "A2 container", FALSE, FALSE);