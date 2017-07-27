
CREATE TABLE "user"
(
  id bigserial NOT NULL,
  email character varying(60),
  firstname character varying(250),
  lastname character varying(250),
  username character varying(250),
  password character varying(150),
  CONSTRAINT user_pkey PRIMARY KEY (id)
);
CREATE TABLE "company"
(
  id bigserial NOT NULL,
  name character varying(60),
  admin character varying(250),
  CONSTRAINT company_pkey PRIMARY KEY (id)
);

CREATE TABLE "device"
(
  id bigserial NOT NULL,
  name character varying(60),
  sku character varying(250),
  CONSTRAINT device_pkey PRIMARY KEY (id)
);
CREATE TABLE "logs"
(
  id bigserial NOT NULL,
  server_logs text,
  CONSTRAINT logs_pkey PRIMARY KEY (id)
);




CREATE TABLE "user"
(
  id bigserial NOT NULL,
  customerid bigint,
  employeeid bigint,
  firstname character varying(250),
  lastname character varying(250),
  age integer,
  address character varying(300),
  username character varying(250),
  password character varying(150),
  email character varying(60),
  mobilenumber character varying(15),
  userroleid integer,
  operationbynumber character varying(20),
  operationbyname character varying(250),
  operation character varying(2),
  "timestamp" timestamp without time zone DEFAULT now(),
  logintimestamp timestamp without time zone,
  deleted boolean DEFAULT false,
  invalidloginattempt integer,
  zone character varying(45),
  dccenter character varying(45),
  storecode character varying(45),
  designation character varying(45),
  imeinumber character varying(45),
  usercol character varying(45),
  sapid character varying(15),
  alert integer DEFAULT 0,
  CONSTRAINT user_pkey PRIMARY KEY (id)
)