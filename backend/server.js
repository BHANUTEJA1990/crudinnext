// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
let users = [
    { id: 1, fullname: "John", lastname: "Doe", age: 25 }
];

// CREATE
app.post("/users", (req, res) => {
    try {
        const user = req.body;

        // ✅ Ensure fullname/lastname/age are present
        if (!user.fullname || !user.lastname || !user.age) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

        const newUser = { ...user, id: newId };
        users.push(newUser);

        res.json(newUser);
    } catch (err) {
        console.error("POST /users error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// READ
app.get("/users", (req, res) => {
    res.json(users);
});

// UPDATE
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const index = users.findIndex((u) => u.id == id);
    if (index !== -1) {
        users[index] = req.body;
        res.json(users[index]);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// DELETE
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    users = users.filter((u) => u.id != id);
    res.json({ message: "Deleted successfully" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
