CREATE TABLE companies (
  handle TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  num_employees INTEGER,
  description TEXT, 
  logo_url TEXT
);

INSERT INTO companies (handle, name, num_employees, description, logo_url)
VALUES ('BEEF', 'Andrews Hot Beef', '2', 'We make beef', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg');

INSERT INTO companies (handle, name, num_employees, description, logo_url)
VALUES ('CHKN', 'Viveks Fried Chicken', '1', 'We only sell beef', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg');

INSERT INTO companies (handle, name, num_employees, description, logo_url)
VALUES ('AAPL', 'Apple Computers', '30000', 'We make computers, not beef', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg');

INSERT INTO companies (handle, name, num_employees, description, logo_url)
VALUES ('GOOG', 'Google', '20000', 'We make software, not beef', 'https://www.google.com/');



CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  salary FLOAT NOT NULL,
  equity FLOAT NOT NULL,
  company_handle TEXT REFERENCES companies(handle) ON DELETE CASCADE, 
  date_posted TIMESTAMP
);

INSERT INTO jobs (title, salary, equity, company_handle, date_posted)
VALUES ('Andrews Assistant', 150000, 0.0, 'BEEF', current_timestamp);

INSERT INTO jobs (title, salary, equity, company_handle, date_posted)
VALUES ('Viveks Assistant', 150001, 0.4, 'CHKN', current_timestamp);