const express = require("express");
const db = require("./database");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());

app.get("/grid", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM grid").all();
    res.status(200).json({ grid: rows });
  } catch (error) {
    res.status(500).json({ message: "Error fetching grid data", error });
  }
});

app.post("/grid/update", express.json(), (req, res) => {
  try {
    const { x, y, color } = req.body;

    if (x === undefined || y === undefined || !color) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const statement = db.prepare(
      "UPDATE grid SET color = ? WHERE x = ? AND y = ?"
    );
    const result = statement.run(color, x, y);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Cell not found" });
    }

    const updatedCell = db
      .prepare("SELECT * FROM grid WHERE x = ? AND y = ?")
      .get(x, y);

    res.status(200).json({ cell: updatedCell });
  } catch (error) {
    res.status(500).json({ message: "Error updating grid data", error });
  }
});

app.post("/grid/clear", (req, res) => {
  try {
    const statement = db.prepare("UPDATE grid SET color = ?");
    statement.run("white");

    const rows = db.prepare("SELECT * FROM grid").all();
    res.status(200).json({ grid: rows });
  } catch (error) {
    res.status(500).json({ message: "Error clearing grid data", error });
  }
});

app.post("/grid/fill", express.json(), (req, res) => {
  try {
    const { color } = req.body;

    if (!color) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const statement = db.prepare("UPDATE grid SET color = ?");
    statement.run(color);

    const rows = db.prepare("SELECT * FROM grid").all();
    res.status(200).json({ grid: rows });
  } catch (error) {
    res.status(500).json({ message: "Error filling grid data", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
