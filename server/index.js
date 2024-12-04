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
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/users", async (req, res, next) => {
  res.send(await fetchUsers());
});
app.get("/api/products", async (req, res, next) => {
  res.send(await fetchProducts());
});
app.get("/api/users/:id/favorites", async (req, res, next) => {
  res.send(await fetchFavorites(req.params.id));
});

app.post("/api/users/:id/favorites", async (req, res, next) => {
  res.status(201).send(createFavorite(req.body.product_id, req.params.id));
});

app.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
  destroyFavorite(req.params.id, req.params.userId);
  res.sendStatus(204);
});

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
  app.listen(port, () => {
    console.log("Listening on port:", port);
  });
};

init();
