const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'unauthorized access' });
    }
    // bearer token
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: true, message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}

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

        const userCollection = client.db("online-pharmacy-db").collection("users");
        const shopByConditionCollection = client.db("online-pharmacy-db").collection("shopByCondition");
        const sexualWellnessCollection = client.db("online-pharmacy-db").collection("sexualWellness");
        const birthControlCollection = client.db("online-pharmacy-db").collection("birthControl");
        const vitaminsAndSupplementsCollection = client.db("online-pharmacy-db").collection("vitaminsAndSupplements");
        const medicalDevicesCollection = client.db("online-pharmacy-db").collection("medicalDevices");
        const personalCareCollection = client.db("online-pharmacy-db").collection("personalCare");
        const healthAndWellnessCollection = client.db("online-pharmacy-db").collection("healthAndWellness");
        const babyCareCollection = client.db("online-pharmacy-db").collection("babyCare");
        const cartCollection = client.db("online-pharmacy-db").collection("cartCollection");
        const orderCollection = client.db("online-pharmacy-db").collection("orders");
        const prescriptionCollection = client.db("online-pharmacy-db").collection("prescriptions")


        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1h' });
            res.send({ token });
        })

        // Warning: use verifyJWT before using verifyAdmin
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            if (user?.role !== 'admin') {
                return res.status(403).send({ error: true, message: 'forbidden message' });
            }
            next();
        }

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.get("/users", verifyJWT, verifyAdmin, async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        app.get('/users/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;

            if (req.decoded.email !== email) {
                res.send({ admin: false })
            }

            const query = { email: email }
            const user = await userCollection.findOne(query);
            const result = { admin: user?.role === 'admin' }
            res.send(result);
        })

        app.patch("/users/admin/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await userCollection.updateOne(query, updateDoc);
            res.send(result);
        })

        app.delete("/users/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id), role: { $ne: "admin" } }; // Ensure the user is not an admin
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

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
            const query = { _id: id };
            const result = await sexualWellnessCollection.findOne(query);
            res.send(result);
        })

        app.get("/birthControl", async (req, res) => {
            const result = await birthControlCollection.find().toArray();
            res.send(result);
        })

        app.get("/birthControl/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await birthControlCollection.findOne(query);
            res.send(result);
        })

        app.get("/vitaminsAndSupplements", async (req, res) => {
            const result = await vitaminsAndSupplementsCollection.find().toArray();
            res.send(result);
        })

        app.get("/vitaminsAndSupplements/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await vitaminsAndSupplementsCollection.findOne(query);
            res.send(result);
        })

        app.get("/medicalDevices", async (req, res) => {
            const result = await medicalDevicesCollection.find().toArray();
            res.send(result);
        })

        app.get("/medicalDevices/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id }
            const result = await medicalDevicesCollection.findOne(query);
            res.send(result);
        })

        app.get("/personalCare", async (req, res) => {
            const result = await personalCareCollection.find().toArray();
            res.send(result);
        })

        app.get("/personalCare/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id }
            const result = await personalCareCollection.findOne(query);
            res.send(result);
        })

        app.get("/healthAndWellness", async (req, res) => {
            const result = await healthAndWellnessCollection.find().toArray();
            res.send(result);
        })

        app.get("/healthAndWellness/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id }
            const result = await healthAndWellnessCollection.findOne(query);
            res.send(result);
        })

        app.get("/babyCare", async (req, res) => {
            const result = await babyCareCollection.find().toArray();
            res.send(result);
        })

        app.get("/babyCare/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await babyCareCollection.findOne(query);
            res.send(result);
        })

        app.post("/carts", async (req, res) => {
            const items = req.body;
            // console.log(items);
            const result = await cartCollection.insertOne(items);
            res.send(result);
        })

        app.get('/carts', verifyJWT, async (req, res) => {
            const email = req.query.email;

            if (!email) {
                res.send([]);
            }

            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ error: true, message: 'forbidden access' })
            }

            const query = { userEmail: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        });

        app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        app.post("/orders", async (req, res) => {
            const item = req.body;
            const result = await orderCollection.insertOne(item);
            res.send(result);
        })

        app.get("/allOrders", verifyJWT, verifyAdmin, async (req, res) => {
            const result = await orderCollection.find().toArray();
            res.send(result);
        })

        app.get("/orders", async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([]);
            }
            const query = { userEmail: email };
            const result = await orderCollection.find(query).toArray();
            res.send(result);
        })

        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/upload', async (req, res) => {
            const query = req.body;
            const result = await prescriptionCollection.insertOne(query);
            res.send(result);
        })

        app.get('/upload', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([])
            }
            const query = { userEmail: email }
            const result = await prescriptionCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/prescriptions', verifyJWT, verifyAdmin, async (req, res) => {
            const result = await prescriptionCollection.find().toArray();
            res.send(result);
        })

        app.delete("/prescriptions/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await prescriptionCollection.deleteOne(query);
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