const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3636;
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors({origin: "*"}))

const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://saoudh20:GEo3HSO0Xfg0lVDS@cluster0.npb6zj7.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const carsSchema = new mongoose.Schema({
    title: String,
    photo: String,
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}
});
const Cars = mongoose.model("Cars", carsSchema);

const usersSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    userAdress: String,
});
const Users = mongoose.model("Users", usersSchema);

// async function updateusers(){
//     let allCars = [];
//     let ox = await Cars.find();
//     allCars.push(ox);
//     console.log(allCars[0]);
//     for (let i = 0; i < allCars[0].length; i++) {
//         const newCar = {
//
//             "title": allCars[0][i].title,
//             "photo": allCars[0][i].photo,
//             "owner": "64ba68dd268aa4f9d31ce8c2"
//         };
//         await Cars.updateOne({_id: allCars[0][i]._id}, {
//             title: newCar.title,
//             photo: newCar.photo,
//             owner: newCar.owner.toString()
//         });
//
//     }
//
// }
// app.use(updateusers);
// updateusers();
app.get('/Cars', async (req, res) => {
    let allCars = await Cars.find().populate('owner')
    res.send(allCars);
})
app.post('/Cars/addbody', async (req, res) => {

    let obj = req.body
    let title = obj.title
    let photo = obj.photo
    let owner = obj.owner
    let newCar = new Cars({title: title, photo: photo, owner: owner})
    await newCar.save();
    res.send({message: "new car inserted to mongoDB"});
})
app.post('/Cars/add/:title&:url&:ownetr', async (req, res) => {
    let title = req.params.title
    let photo = req.params.url
    let owner = req.params.owner
    let newCar = new Cars({title: title, photo: photo, owner: owner})
    await newCar.save();
    res.send({message: "new car inserted to mongoDB"})
})
app.put('/Cars/update/:id', async (req, res) => {
    let id = req.params.id
    let newCar = req.body
    await Cars.updateOne({_id: id}, {
        title: newCar.title,
        photo: newCar.photo,
        owner: newCar.owner
    });

    res.send("car updated")
})

app.delete('/Cars/delete/:id', async (req, res) => {
    let id = req.params.id;
    await Cars.deleteOne({_id: id});
    res.send("car deleted");
})
app.get('/Users', async (req, res) => {
    let allusers = await Users.find();
    res.send(allusers);
})
app.post('/Users/addbody', async (req, res) => {

    let obj = req.body

    let name = obj.name
    let lastname = obj.lastname
    let userAdress = obj.userAdress
    let newUser = new Users({name: name, lastname: lastname, userAdress: userAdress})
    await newUser.save();
    res.send({message: "new user inserted to mongoDB"});
})

app.put('/Users/update/:id', async (req, res) => {
    let id = req.params.id
    let newUser = req.body
    await Users.updateOne({_id: id}, {
        name: newUser.name,
        lastname: newUser.lastname,
        userAdress: newUser.userAdress
    });

    res.send("user updated")
})
app.delete('/Users/delete/:id', async (req, res) => {
    let id = req.params.id;
    await Users.deleteOne({_id: id});
    res.send("user deleted");
})

app.listen(port, () => {
    console.log("server started at ", port)
})