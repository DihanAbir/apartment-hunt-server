const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const { ObjectID } = require("express");
const port = 5000;
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.syaaq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
    const hotelsCollection = client.db(`${process.env.DB_NAME}`).collection("hotels");

    app.get("/", (req, res) => {
        res.send("hello from db");
    });

    //to add hotels data
    app.post("/addHotels", (req, res) => {
        const hotels = req.body;
        console.log(hotels);
        hotelsCollection.insertMany(hotels).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    //to add booking data
    app.post("/addHotels", (req, res) => {
        const hotels = req.body;
        console.log(hotels);
        hotelsCollection.insertMany(hotels).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    //to show hotels data
    app.get("/showHotels", (req, res) => {
        hotelsCollection.find({}).toArray((error, documents) => {
            res.send(documents);
        });
    });
});

app.listen(process.env.PORT || port, () => console.log("server listening at " + port));
