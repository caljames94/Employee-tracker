INSERT INTO department (name)
VALUES ('Creative'),
       ('Strategy'),
       ('Client Service'),
       ('Design'),
       ('Production');

INSERT INTO role (title, salary, department_id)
VALUES ('Executive Creative Director', 300000, 1),
       ('Copywriter', 90000, 1),
       ('Strategy Director', 150000, 2),
       ('Account Manager', 70000, 3),
       ('Client Partner', 130000, 3),
       ('Designer', 55000, 4),
       ('Producer', 110000, 5);

INSERT INTO employee (role_id, first_name, last_name, manager_id)
VALUES (1, 'Evan', 'Roberts', NULL),
       (2, 'Cat', 'Williams', 1),
       (3, 'Anna', 'Thairs', NULL),
       (4, 'Sophie', 'Tucker', 5),
       (5, 'Steph', 'Grant', NULL),
       (6, 'Chris', 'Mawson', 1),
       (7, 'Lisa', 'Brown', 1);


