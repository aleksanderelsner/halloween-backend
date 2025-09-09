require("dotenv").config();
const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

app.get("/costumes", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM costumes ORDER BY id ASC");
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

app.post("/costumes", async (req, res) => {
	const { email, costume } = req.body;
	try {
		const result = await pool.query(
				"INSERT INTO costumes (email, costume) VALUES ($1, $2) RETURNING *",
				[email, costume]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

app.delete("/costumes/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await pool.query("DELETE FROM costumes WHERE id = $1", [id]);
		res.send(`Deleted costume with id ${id}`);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

app.listen(3000, () => {
	console.log("Server running on http://localhost:3000");
});
