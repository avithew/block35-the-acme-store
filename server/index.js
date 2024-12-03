const {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
} = require("./db");
const express = require("express");
const app = express();

const init = async () => {
  client.connect();
  createTables();
  await Promise.all([
    createProduct("Cola"),
    createProduct("Bananas"),
    createProduct("Tomatoes"),
  ]);
  console.log(await fetchProducts());
  await Promise.all([
    createUser("Theo", "djaiw"),
    createUser("Willow", "eiw"),
    createUser("Max", "kjfse"),
  ]);
  console.log(await fetchUsers());
  await Promise.all([
    createFavorite(1, 3),
    createFavorite(3, 1),
    createFavorite(2, 2),
  ]);
  console.log(await fetchFavorites(2));
  await destroyFavorite(3, 2);
  console.log("test", await fetchFavorites(2));
};

init();
