const express = require('express');
const bodyParser = require('body-parser')
const { MongoClient } = require("mongodb");
require('dotenv').config();

// create the mongo Client to use
const client = new MongoClient(process.env.FINAL_URL2)

const app = express();
const port = process.env.PORT;


app.use(express.static("public"));
// alle code wordt eerst uitgevoerd door middelware (bodyParser) dan in functies
app.use(bodyParser.json());


app.get('/', async(req, res) => {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(process.env.DB);

        // Use the collection "people"
        const col = db.collection("challenges");

        // Construct a document                                                                                                                                                              
        let challengeDocument = {
            name: "Challenge2",
            points: 5,                                                                                                                             
            course: "web2",                                                                                                                                
            session: "s7a",
        }

        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(challengeDocument);
        // Find one document
        const myDoc = await col.findOne();
        // Print to the console
        res.send(myDoc);

       } catch (err) {
        console.log(err.stack);
    }

    finally {
       await client.close();
   }
});

app.listen(port, () => {
    console.log(`My first REST API Example app listening at http://localhost:${port}`)
  })