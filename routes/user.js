const express = require('express');

const User = require("../models/userModel")


const router = express.Router();


router.get('/', async (req, res) => {
    // console.log(req.query)
    try {
        const usersData = await User.find();

        res.status(200).send(usersData);
    }
    catch (error) {
        console.log("there is an error"+error);
        res.status(500).send("error occured while querying")
        
    }
})

router.get("/:id", async(req, res) => {
    const uid = req.params.id;
    try {
        const user= await User.findById(uid);
        if(user){
            res.status(200).send(user);
        }
    } catch (error) {
        console.log("there is an error"+error);
        res.status(500).send("error occured while querying")
    }
})

router.post('/new', async (req, res) => {
    const newUser = new User({ userName: req.body.userName })
    await newUser.save();

    res.status(200).json({ message: "A new User Added" });
})

router.patch('/update/:id',async (req, res) => {
    try {
        const user= await User.findById(req.params.id);
          
        user.userName=req.body.userName;
        await user.save();
        res.status(200).json({ message: "user updated" });
    } catch (error) {
        console.log("there is an error"+error);
        res.status(500).send("error occured while querying")
    }
})

router.delete('/delete/:id',async (req, res) => {
    await User.findOneAndDelete(req.params.id);
    // await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user deleted" });
})

module.exports = router