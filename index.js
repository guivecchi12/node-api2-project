const express = require("express")
const users = require("./data/db")

const server = express()
const port = 4000

server.use(express.json())

server.get("/", (req, res) => {
	res.json({
		message: "Welcome to our API",
	})
})

server.post("/posts", (req, res) => {
    users.insert(req.body)
      .then((user)=>{
          res.status(201).json(user)
      })
})






server.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`)
})