const express = require('express')
const routes = express.Router()
const person = require("./../Models/person")
const authenticateToken = require("../mddilewares/jwt");


routes.post("/", authenticateToken, async (req, res) => {
    try {
        let data = req.body;
        data.createdBy = req.user.id; 

        const newPerson = new person(data);
        const response = await newPerson.save();
        console.log("data saved");
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err),
            res.status(500).json({ err: " Error in saving data" })
    }
});

// get method to get all data from database

routes.get("/", authenticateToken, async (req, res) => {
    try {
        const response = await person.find({createdBy: req.user.id});
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Error in fetching data " });
    }
})

// GET method to get person Detail by Id from database
routes.get("/:id", authenticateToken,async (req, res) => {
    try {
        const personid = req.params.id;

        const response = await person.findById({ _id: personid });

        if (!response) {
            return res.status(404).json({ err: "ID not found" });
        }

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Error in fetching data" });
    }
});

 // PUT method to update person detail by id from database
routes.put("/:id",authenticateToken, async (req, res) => {
    try {
      const personid = req.params.id;  // use "_id" as per the route param
      const updatedata = req.body;
  
      const response = await person.findByIdAndUpdate(personid, updatedata, {
        new: true,
        runValidators: true,
      });
  
      if (!response) {
        return res.status(404).json({ err: "ID not found" });
      }
      console.log("Data updated");
      res.status(200).json(response);
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "Error in updating data" });
    }
  });
  

routes.delete("/:id", authenticateToken,  async (req, res) => {
    try {
        const personid = req.params.id;
        const response = await person.findByIdAndDelete(personid);

        if (!response) {
            return res.status(404).json({ err: "id not found " });
        }

        console.log("data deleted");
        res.status(200).json({ message: "person deleted Successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Error in deleting data " });
    }
});

// get method to get all data from database
routes.get("/admin", authenticateToken, async (req, res) => {
    try {

        const response = await auth.find({ role: "admin" });
        console.log("response data fetched ");
        res.status(200).json(response)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Error in fetching data  admin" });
    }
})



// 

routes.get ("/file", authenticateToken, async (req, res) => {
 try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    res.json({
      message: "Protected data accessed",
      userId: req.user.id,
      username: req.user.username,
      user: req.user,
    }); 
 } catch (error) {
    console.error("File route error:", error);
    res.status(500).json({ error: "Server error" });
  }
 });

module.exports = routes;