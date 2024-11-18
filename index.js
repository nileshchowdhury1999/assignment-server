const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const path = require("path");
//middleware
app.use(cors());
app.use(express.json());

// logger middleware
app.use((req, res, next) => {
  const logDetails = `Method: ${req.method}, URL: ${req.originalUrl}, Time: ${new Date().toISOString()}`;
  console.log(logDetails);
  next();
});

// Static File Middleware for Lesson Images
const imagesDir = path.join(__dirname, "./images");
app.use("/images", express.static(imagesDir, {
  fallthrough: false
}));

// Middleware to handle errors when an image file is not found
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ error: "Image file not found" });
  } else {
    next(err); // Pass other errors to the next error handler
  }
});


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mujahid.frqpuda.mongodb.net/?retryWrites=true&w=majority&appName=Mujahid`;
const uri = "mongodb+srv://weTech:CMPUtlR15jDNQtOF@cluster0.06pjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const courseCollection = client.db("weTech").collection("lessons");
    const cartCollection = client.db("weTech").collection("carts");
    const orderCollection = client.db("weTech").collection("orders");


    // get lessons
    app.get("/lessons", async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });
    // put ==> update lesson update
    app.put("/lessons/:id", async (req, res) => {
      const id = req.params.id;
      const findLesson = await courseCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!findLesson) {
        return res.status(404).send({ message: "Lesson not found" });
      }
      const updatedData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: false };
      const updateDoc = {
        $set: updatedData,
      };
      const result = await courseCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/search", async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running server");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});