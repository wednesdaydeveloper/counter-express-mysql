CREATE DATABASE counter_db;

CREATE TABLE counter_db.counter (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    count INT,
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

INSERT INTO counter_db.counter (count) VALUES (0);

CREATE USER 'counter_user'@'nodeapi.counter-express-mysql_default' IDENTIFIED BY 'counter_userpass';
GRANT SELECT, UPDATE on counter_db.* TO 'counter_user'@'nodeapi.counter-express-mysql_default';
