require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors({
	origin: process.env.FRONTEND_URL
}));
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

app.get("/emails", async (req, res) => {
	try {
		const result = await pool.query("SELECT DISTINCT email FROM costumes");
		const emails = result.rows.map(row => row.email);
		res.json(emails);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});


app.post("/costumes", async (req, res) => {
	const { email, costumes } = req.body;
	console.log(req.body);
	try {
		const promises = costumes.map((costume) =>
			 pool.query(
				"INSERT INTO costumes (email, costume) VALUES ($1, $2) RETURNING *",
				[email, costume]));
		console.log(promises);
		await Promise.all(promises);
		console.log("Successfully created costumes");
		res.status(200).end();
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
