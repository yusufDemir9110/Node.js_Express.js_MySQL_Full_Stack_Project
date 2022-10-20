import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbService from "./dbService.js";
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/insert", (req, res) => {
  const { name } = req.body;
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewName(name);

  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

//read
app.get("/getall", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllData();
  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

//update

app.patch("/update", (req, res) => {
  const { id, name } = req.body;
  const db = dbService.getDbServiceInstance();
  const result = db.updateRowById(id, name);
  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

//delete
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const result = db.deleteRowById(id);
  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

//search
app.get("/search/:name", (req, res) => {
  const { name } = req.params;
  const db = dbService.getDbServiceInstance();
  const result = db.searchByName(name);

  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

app.listen(5000, () => {
  console.log("app is running");
});
