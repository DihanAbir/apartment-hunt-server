const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const { ObjectID } = require("express");
const port = 5000;
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uefml.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
    const hotelsCollection = client.db(`${process.env.DB_NAME}`).collection("hotels");
    const customerRentsCollection = client.db(`${process.env.DB_NAME}`).collection("customerRents");
    const singleRentCollection = client.db(`${process.env.DB_NAME}`).collection("singleRent");

    app.get("/", (req, res) => {
        res.send("hello from db");
    });

    //to add hotels data
    app.post("/addHotels", (req, res) => {
        const hotels = req.body;
        hotelsCollection.insertMany(hotels).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    //to add booking data
    app.post("/addRentsInfo", (req, res) => {
        const customerRents = req.body;
        customerRentsCollection.insertOne({ status: "Pending" }).then((result) => {
            res.send(result);
        });
    });

    // to add new apartment by admin
    app.post("/addApartments", (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const location = req.body.location;
        const bedroom = req.body.bedroom;
        const bathroom = req.body.bathroom;
        const price = req.body.price;
        const newImg = file.data;
        const encImg = newImg.toString("base64");

        var image1 = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, "base64"),
        };

        singleRentCollection.insertOne({ name, location, bedroom, bathroom, image1, price }).then((result) => {
            res.send(result.insertedCount > 0);
            console.log(result);
        });
    });

    //to show hotels data
    app.get("/showHotels", (req, res) => {
        hotelsCollection.find({}).toArray((error, documents) => {
            res.send(documents);
        });
    });

    //to show customer booking data
    app.get("/showCustomerBooking", (req, res) => {
        customerRentsCollection.find({}).toArray((error, documents) => {
            res.send(documents);
        });
    });

    // to update booking status
    app.patch("/statusUpdate", (req, res) => {
        ordersCollection
            .updateOne(
                { _id: ObjectID(req.body.id) },
                {
                    $set: { status: req.body.status },
                }
            )
            .then((result) => {
                res.send(result.modifiedCount > 0);
            })
            .catch((err) => console.log(err));
    });
});

app.listen(process.env.PORT || port, () => console.log("server listening at " + port));
