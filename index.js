const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qp55ast.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const shopByConditionCollection = client.db("online-pharmacy-db").collection("shopByCondition");
        const sexualWellnessCollection = client.db("online-pharmacy-db").collection("sexualWellness");
        const birthControlCollection = client.db("online-pharmacy-db").collection("birthControl");
        const vitaminsAndSupplementsCollection = client.db("online-pharmacy-db").collection("vitaminsAndSupplements");
        const medicalDevicesCollection = client.db("online-pharmacy-db").collection("medicalDevices");
        const cartCollection = client.db("online-pharmacy-db").collection("cartCollection");

        app.get("/shopByCondition", async (req, res) => {
            const result = await shopByConditionCollection.find().toArray();
            res.send(result);
        })

        app.get("/shopByCondition/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await shopByConditionCollection.findOne(query);
            res.send(result);
        })

        app.get("/sexualWellness", async (req, res) => {
            const result = await sexualWellnessCollection.find().toArray();
            res.send(result);
        })

        app.get("/sexualWellness/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: id};
            const result = await sexualWellnessCollection.findOne(query);
            res.send(result);
        })

        app.get("/birthControl", async (req, res) => {
            const result = await birthControlCollection.find().toArray();
            res.send(result);
        })

        app.get("/birthControl/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: id};
            const result = await birthControlCollection.findOne(query);
            res.send(result);
        })

        app.get("/vitaminsAndSupplements", async (req, res) => {
            const result = await vitaminsAndSupplementsCollection.find().toArray();
            res.send(result);
        })

        app.get("/vitaminsAndSupplements/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: id};
            const result = await vitaminsAndSupplementsCollection.findOne(query);
            res.send(result);
        })

        app.get("/medicalDevices", async (req, res) => {
            const result = await medicalDevicesCollection.find().toArray();
            res.send(result);
        })

        app.get("/medicalDevices/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: id}
            const result = await medicalDevicesCollection.findOne(query);
            res.send(result);
        })

        app.post("/carts", async (req, res) => {
            const items = req.body;
            // console.log(items);
            const result = await cartCollection.insertOne(items);
            res.send(result);
        })

        app.get("/carts", async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([]);
            }
            const query = { userEmail: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })

        app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


//get korbe server side a dekhar jonno (mane database er data get kore localhost:5000 a dekhar jonno)
app.get('/', (req, res) => {
    res.send('Online pharmacy server is running.')
})

//listen korbe console a(mane command prompt a) dekhar jonno
app.listen(port, () => {
    console.log(`Online pharmacy is running on ${port}`)
})