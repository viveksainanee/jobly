CREATE TABLE companies (
  handle TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  num_employees INTEGER,
  description TEXT, 
  logo_url TEXT
);

INSERT INTO companies (handle, name, num_employees, description, logo_url)
VALUES ('AAPL', 'Apple Computers', '30000', 'We make computers, not beef', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg');

INSERT INTO companies (handle, name, num_employees, description, logo_url)
VALUES ('GOOG', 'Google', '20000', 'We make software, not beef', 'https://www.google.com/');

