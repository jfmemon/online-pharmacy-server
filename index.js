const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get("/shopByCondition", async (req, res) => {
            const result = await shopByConditionCollection.find().toArray();
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