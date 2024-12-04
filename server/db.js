const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);
const bcrypt = require("bcrypt");

const createTables = async () => {
  const SQL = `
        DROP TABLE IF EXISTS users CASCADE;
        DROP TABLE IF EXISTS products CASCADE;
        DROP TABLE IF EXISTS favorites CASCADE;
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE,
            password VARCHAR(255)
        );
        CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255)
        );
        CREATE TABLE favorites(
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id) NOT NULL,
            user_id INTEGER REFERENCES users(id) NOT NULL,
            CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
        );
    `;
  client.query(SQL);
};

const createProduct = async (name) => {
  const SQL = `
    INSERT INTO products(name) VALUES ($1) RETURNING *;
  `;
  const response = await client.query(SQL, [name]);
  return response.rows[0];
};

const createUser = async (username, password) => {
  const SQL = `
    INSERT INTO users(username, password) VALUES ($1,$2) RETURNING *;
  `;
  const passcrypt = bcrypt.hash(password, 10);
  const response = await client.query(SQL, [username, passcrypt]);
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT id, username FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
    SELECT * FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createFavorite = async (product_id, user_id) => {
  const SQL = `
    INSERT INTO favorites(product_id, user_id) VALUES ($1, $2) RETURNING *;
  `;
  const response = await client.query(SQL, [product_id, user_id]);
  return response.rows[0];
};

const fetchFavorites = async (user_id) => {
  const SQL = `
    SELECT * FROM favorites
    WHERE user_id=$1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const destroyFavorite = async (id, user_id) => {
  const SQL = `
    DELETE FROM favorites
    WHERE id=$1 AND user_id=$2
  `;
  const response = await client.query(SQL, [id, user_id]);
};

module.exports = {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};
