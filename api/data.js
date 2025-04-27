import { Router } from "express";
import { getAllData, getDataById, addData, getUserData } from "../mongodb.js";
let router = Router();

router.get("/", async (req, res) => {
  res.json(await getAllData());
});

router.get("/:id", async (req, res) => {
  res.json(await getDataById(req.params.id));
});

router.post("/", async (req, res) => {
  let exist = await getDataById(req.body.id);
  if (exist[0]) {
    res.status(409).json({ error: "record already exists" });
  } else {
    let result = await addData(req.body);
    if (result.affectedRows) res.json(req.body);
    else res.status(500).json({ error: "unknown database error" });
  }
});

router.post("/rows/:count", async (req, res) => {
  const count = parseInt(req.params.count);
  if (isNaN(count) || count <= 0) {
    return res.status(400).json({ error: "Invalid row count" });
  }

  try {
    const result = await addDataRows(count);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//router for tehtävä 11

router.get("/users-data", async (req, res) => {
  console.log("Received request for /users-data");

  try {
    const result = await getUserData();
    console.log("User data retrieved:", result);

    if (!result || result.length === 0) {
      console.log("No data found for users.");
      return res.status(404).json({ error: "No user data found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error during getUserData:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

export default router;
