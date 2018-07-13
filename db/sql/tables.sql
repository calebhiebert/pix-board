-- DROP TABLE pix;

CREATE TABLE IF NOT EXISTS pix (
  id      SERIAL        PRIMARY KEY,
  x       INTEGER       NOT NULL,
  y       INTEGER       NOT NULL,
  pix     SMALLINT      NOT NULL,
  user_id VARCHAR(255)  NOT NULL,
  time    TIMESTAMP(3)  NOT NULL      DEFAULT NOW()
);