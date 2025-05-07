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

const insertUserQuery = `
    insert into users (name, email)
    values('john does', 'john@example.com')
    returning *;
`

client.connect()
    .then(() => console.log("connected to database"))
    .catch((err) => console.error("connection error", err.stack))

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"))
})
app.get("/users", (req, res) => { 
    const query = "select * from users order by id asc"
    client.query(query)
        .then(result => { 
            res.jsong(result.rows)
        })
        .catch(er => {
            console.errror("error fetching users", er.stack)
            res.status(500).send("Error fetching users")
        })
})

app.listen(PORT, () => () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})