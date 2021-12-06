const fs = require('fs/promises');
const express = require('express');
const bodyParser = require('body-parser')
const { MongoClient } = require("mongodb");
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

app.get('/api/boardgame', async function(req, res) {
    let id = req.query.id;

    try{
        await client.connect();

        // retrieve the boardgame collection data
        // find: not an async function => const bgs = client.db('session5').collection('boardgames').find({}).toArray(); => niet mogelijk
        const collection = client.db('session5').collection('boardgames2');
        

        // https://docs.mongodb.com/drivers/node/current/usage-examples/findOne/
        const query = { bggid: Number(id) };
        const options = {
            // Include only the `title` and `imdb` fields in the returned document
            projection: { _id: 0},
        };

        const bg = await collection.findOne(query, options)

        if(bg)  {
            res.status(200).send(bg);
            return;
        }  else  {
            res.status(400).send('Boardgame could not found with id: ' + id);
        }
    }catch(error)  {
        console.log(error);
        res.status(500).send({
            error: 'error',
            value: error
        });
    }finally {
        await client.close();
    }
});


app.post('/api/saveChallenge', async (req, res)  =>  {    
    try  {
        await client.connect();
   
        // create the new boardgame object
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