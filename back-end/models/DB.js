const { Pool } = require("pg");
// const connectionString = process.env.DB_URL;
const connectionString = `postgres://bskrpvah:POYM1nhZbcvxlOBqkskbmEaem-QwE4oa@flora.db.elephantsql.com/bskrpvah`;
const pool = new Pool({
  connectionString,
});
pool
  .connect()
  .then((res) => {
    console.log(`project five DB connected to ${res.database}`);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = pool;

const createAllTables = () => {
  pool
    .query(
      `
   
      CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        role varchar(255)
      );
      
      CREATE TABLE permissions (
        id SERIAL PRIMARY KEY,
        role_id integer,
        permission varchar(255),
        FOREIGN KEY (role_id) REFERENCES roles(id)
      );
      
      CREATE TABLE regions (
        id SERIAL PRIMARY KEY,
        region varchar(255)
      );
      
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        region_id integer,
        role_id integer,
        first_name varchar(255),
        last_name varchar(255),
        nick_name varchar(255),
        email varchar(255) ,
        password varchar(255),
        active integer DEFAULT 1,
        is_deleted integer DEFAULT 0,
        longtitude integer DEFAULT 0,
        langtitude integer DEFAULT 0,
        image varchar(255) DEFAULT 'defaultUser.png',
        created_at timestamp DEFAULT now(),
        FOREIGN KEY (region_id) REFERENCES regions(id),
        FOREIGN KEY (role_id) REFERENCES roles(id)
      );
      
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name varchar(255),
        image varchar(255),
        is_deleted integer  DEFAULT 0,
        created_at timestamp DEFAULT now()
      );
      
      CREATE TABLE sub_categories (
        id SERIAL PRIMARY KEY,
        category_id integer,
        name varchar(255),
        image varchar(255),
        is_deleted integer  DEFAULT 0,
        created_at timestamp DEFAULT now(),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
      
      CREATE TABLE statuses (
        id SERIAL PRIMARY KEY,
        name varchar(255)
      );
      

      
      CREATE TABLE serverices (
        id SERIAL PRIMARY KEY,
        service_provider_id integer,
        category_id integer,
        sub_category_id integer,
        title VARCHAR,
        description TEXT,
        status_id integer,
        default_image varchar(255),
        is_deleted integer  DEFAULT 0,
        created_at varchar(255),
        FOREIGN KEY (service_provider_id) REFERENCES users(id),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id)
      );

  
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  poster_id integer, 
  category_id integer,
  sub_category_id integer,
  description TEXT,
  main_image varchar(255),
  created_at TIMESTAMP DEFAULT  now(),
  FOREIGN KEY (poster_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id)
);
      

CREATE TABLE serverices_images (
  id SERIAL PRIMARY KEY,
  image VARCHAR,
  service_id integer,
  created_at timestamp DEFAULT now(),
  FOREIGN KEY (service_id) REFERENCES serverices(id)
);

      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        poster_id integer, 
        category_id integer,
        sub_category_id integer,
        description TEXT,
        main_image varchar(255),
        created_at DEFAULT now(),
        FOREIGN KEY (poster_id) REFERENCES users(id),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id)
      );
      
      CREATE TABLE serverices_images (
        id SERIAL PRIMARY KEY,
        image VARCHAR,
        service_id integer,
        created_at varchar(255),
        FOREIGN KEY (service_id) REFERENCES serverices(id)
      );


CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id integer,
  commenter_id integer,
  comment TEXT,
  created_at timestamp DEFAULT now(),
  is_deleted integer DEFAULT 0,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (commenter_id) REFERENCES users(id)
);
      

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id integer,
  serverices_provider_id integer,
  status_id integer DEFAULT 1,
  sub_category_id integer,
  review varchar(255),
  created_at timestamp DEFAULT now(),
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (serverices_provider_id) REFERENCES users(id),
  FOREIGN KEY (status_id) REFERENCES statuses(id),
  FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id)
);

      
CREATE TABLE customer_provider_rate (
  id SERIAL PRIMARY KEY,
  customer_id integer,
  provider_id integer,
  rate decimal,
  created_at timestamp DEFAULT now(),
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (provider_id) REFERENCES users(id)
);
      
      CREATE TABLE provider_rate (
        id SERIAL PRIMARY KEYrs,
        provider_id integer,
        total_rate  SET DEFAULT 0,
        created_at  SET DEFAULT now(),
        FOREIGN KEY (provider_id) REFERENCES users(id)
      );
     );


     CREATE TABLE chats(
      id SERIAL PRIMARY KEY,
      chat_from_id integer,
      chat_to_id integer,
      created_at timestamp DEFAULT now(),
      FOREIGN KEY (chat_from_id) REFERENCES chatters_from(id),
      FOREIGN KEY (chat_to_id) REFERENCES chatters_to(id)
      );
      
      CREATE TABLE chatters_from(
      id SERIAL PRIMARY KEYrs,
      from_id integer,
      chat text,
      created_at SET DEFAULT now(),
      FOREIGN KEY (from_id) REFERENCES users(id)
      );
      
      CREATE TABLE chatters_to(
      id SERIAL PRIMARY KEY,
      to_id integer,
      chat text,
      created_at timestamp DEFAULT now(),
      FOREIGN KEY (to_id) REFERENCES users(id)
      );
      
     INSERT INTO roles (role) VALUES ('ADMIN'),('PROVIDER'),('CUSTOMER')

     INSERT INTO permissions (role_id, permission) VALUES (1, 'USER_CONTROL'),(1, 'COMMENT_CONTROL'),(1, 'SERVICE_CONTROL'),(1, 'POST_CONTROL'),(1, 'ORDER_CONTROL'),(1, 'CATEGORY_CONTROL'),
(2, 'USER_CONTROL'),(2, 'SERVICE_CONTROL'),(2, 'POST_CONTROL'),(2, 'ORDER_CONTROL'),(2, 'CATEGORY_CONTROL'),
(3, 'USER_CONTROL'),(3, 'COMMENT_CONTROL'),(3, 'SERVICE_CONTROL'),(3, 'POST_CONTROL'),(3, 'ORDER_CONTROL'),(3, 'CATEGORY_CONTROL')

INSERT INTO statuses (name) VALUES ('PENDING'), ('ACCEPTED'),('REJECTED'),('CANCELED')
  `
    )
    .then((result) => {
      console.log("result", result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// createAllTables();

exports.module = pool;

// const knex = require('knex');

// const db = knex({
//     client: 'mysql2',
//     connection: {
//       host : '127.0.0.1',
//     //   port : 3306,
//       user : 'root',
//       password : '',
//       database : 'tin_tin'
//     }
//   });

//   module.exports = db;