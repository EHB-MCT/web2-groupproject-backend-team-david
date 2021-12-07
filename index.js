const fs = require('fs/promises');
const express = require('express');
const bodyParser = require('body-parser')
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require('dotenv').config();

// create the mongo Client to use
const client = new MongoClient(process.env.FINAL_URL2)


// https://www.npmjs.com/package/cors
// https://www.youtube.com/watch?v=_5uHZ6iOHeM&list=PLGsnrfn8XzXii2J5-Jpqufypu6upxcSGx&index=11
const app = express();
const port = process.env.PORT;
app.use(cors());




app.use(express.static("public"));
// alle code wordt eerst uitgevoerd door middelware (bodyParser) dan in functies
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.redirect("/info.html");
});

app.get('/api/challenges', async(req, res) => {
    try {
        await client.connect();

        // retrieve the boardgame collection data
        // find: not an async function => const bgs = client.db('session5').collection('boardgames').find({}).toArray(); => niet mogelijk
        console.log("Connected correctly to server");
        const db = client.db(process.env.DB);

        // Use the collection "people"
        const col = db.collection("challenges");

        const data =  await col.find({}).toArray();
        res.status(200).send(data);
    }catch(error)  {
        console.log(error);
        res.status(500).send({
            error: 'error',
            value: error
        });
    }finally  {
        await client.close();
    }
});



// https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/#h-name-collections-with-plural-nouns
// https://docs.mongodb.com/manual/tutorial/update-documents/
app.put('/api/challenges/:id', async function(req, res) {
    let id = req.params.id;
    
    try {
        await client.connect();

        // retrieve the boardgame collection data
        // find: not an async function => const bgs = client.db('session5').collection('boardgames').find({}).toArray(); => niet mogelijk
        console.log("Connected correctly to server");
        const db = client.db(process.env.DB);

        // Use the collection "people"
        const col = db.collection("challenges");


        const query = { _id: ObjectId(id)};
        const options = {
            $set: { "name": "lhjklhjhlkhlkjhlkhlhjj"}
          }

        const challenge = await col.update(query, options)
        res.status(200).send(challenge);
    }catch(error)  {
        console.log(error);
        res.status(500).send({
            error: 'error',
            value: error
        });
    }finally  {
        await client.close();
    }


    console.log(id)
});

// https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/#h-name-collections-with-plural-nouns

app.delete('/api/challenges/:id', async function(req, res) {
    let id = req.params.id.toString;
    try {
        await client.connect();

        // retrieve the boardgame collection data
        // find: not an async function => const bgs = client.db('session5').collection('boardgames').find({}).toArray(); => niet mogelijk
        console.log("Connected correctly to server");
        const db = client.db(process.env.DB);

        // Use the collection "people"
        const col = db.collection("challenges");

        const query = { _id: id };

        const challenge = await col.deleteOne(query)
        res.status(200).send(challenge);
    }catch(error)  {
        console.log(error);
        res.status(500).send({
            error: 'error',
            value: error
        });
    }finally  {
        await client.close();
    }


    console.log(id)
});


app.post('/api/saveChallenge', async (req, res)  =>  {    
    try  {
        await client.connect();
   
        // create the new challenge object
        let newChallenge  =  {
            name: req.body.name,
            points: req.body.points,
            course: req.body.course,
            session: req.body.session
        };

        const db = client.db(process.env.DB);

        // Use the collection "people"
        const col = db.collection("challenges");

        // Insert into the database
        let insertResult = await col.insertOne(newChallenge);
        console.log(`A document was inserted with the _id: ${insertResult.insertedId}`);


        // 201: data => updated
        res.status(201).send(`boardgame succesfully saved with id ${req.body.name}`);
    } catch(error)  {
        console.log(error);
        res.status(500).send({
            error: 'error',
            value: error
        });
    } finally  {
        await client.close();
    }
})


app.listen(port, () => {
  console.log(`My first REST API Example app listening at http://localhost:${port}`)
})