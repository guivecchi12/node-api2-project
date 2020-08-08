const express = require("express")
const users = require("./data/db")

const server = express()
const port = 4000

server.use(express.json())

server.get("/posts", (req, res) => {
    users.find()
        .then((users) => {
            res.status(200).json(users)
        })
        .catch(() =>{
            res.status(500).json({
                error: "The posts information could not be retrieved." 
            })
        })
})

server.post("/posts", (req, res) => {
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ 
            errorMessage: "Please provide title and contents for the post." 
        })
    }
    else{
        users.insert(req.body)
            .then((user)=>{
                res.status(201).json(user)
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    error: "There was an error while saving the post to the database"
                })
            })
    }
    
})

server.get("/posts/:id", (req, res) => {
    users.findById(req.params.id)
        .then((posts) => {
            if(posts.length === 0){
                res.status(404).json({
                    message: "The post with the specified ID does not exist."  
                })
            }
            else{
                res.status(201).json(posts)
            }
        })
        .catch(() => {
            res.status(500).json({ 
                error: "The comments information could not be retrieved." 
            })
        })
})


server.get("/posts/:id/comments", (req, res) => {
    users.findCommentById(req.params.id)
        .then((users) => {
            console.log("the comments: ", users)
            res.status(200).json(users)
        })
})

server.post("/posts/:id/comments", (req, res) => {
    const { id } = req.params;
    const comment = {...req.body, post_id: id} 
    users.findById(req.params.id)
        .then((post) => {
            if(post.length === 0){
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
            else if(!req.body.text){
                res.status(400).json({
                    errorMessage: "Please provide text for the comment."
                })
            }
            else{
                users.insertComment(comment)
                    .then((newComment) => {
                        if(newComment){
                            res.status(201).json({
                                message: "created and posted",
                                comment
                            })
                        }
                        else{
                            res.status(500).json({
                                error: "There was an error while saving the comment to the database"
                            })
                        }
                    })
                    .catch(() => {
                        res.status(500).json({
                            error: "There was an error while saving the comment to the database"
                        })
                    })
            }
        })
    .catch(() => {
        res.status(500).json({
            error: "There was an error while saving the comment to the database"
        })
    })
})
        
server.delete("/posts/:id", (req, res) => {
    const id = req.params.id;

    users.findById(id)
        .then((post) => {
            if(post.length === 0){
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
            else{
                users.remove(id)
                    .then(() => {
                        res.status(200).json({
                            message: "User deleted"
                        })
                    })
                    .catch(() => {
                        res.status(500).json({
                            error: "The post could not be removed" 
                        })
                    })
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: "Could not find ID" 
            })
        })
})

server.put("/posts/:id", (req, res) => {
    const id = req.params.id
    const title = req.body.title
    const contents = req.body.contents
    const newPost = {...req.body}

    let post = users.findById(id)
        .then((post) => {
            if(post.length === 0){
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
            else{
                if(!title || !contents){
                    res.status(400).json({
                        errorMessage: "Please provide title and contents for the post."
                    })
                }
                else{
                    users.update(id, newPost)
                        .then((updated) => {
                            res.status(200).json(updated)
                        })
                        .catch(()=>{
                            res.status(500).json({
                                error: "The post information could not be modified."
                            })
                        })
                }
            }
        })
})



server.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`)
})