const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const { Client } = require("pg")
dotenv.config()

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
})

client.connect()
    .then(() => console.log("Connected to database"))
    .catch((err) => console.error("Connection error", err.stack))

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve the users.html file on root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "users.html"))
})

// API route to fetch users
app.get("/users", (req, res) => {
    const query = "SELECT * FROM users ORDER BY id ASC"
    client.query(query)
        .then(result => res.json(result.rows))
        .catch(err => {
            console.error("Error fetching users", err.stack)
            res.status(500).send("Error fetching users")
        })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})