const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://admin:admin@cluster0.wdkwv.mongodb.net/Session7_FullStackTeamwork?retryWrites=true&w=majority";
const client = new MongoClient(url);
 
 // The database to use
 const dbName = "Session7_FullStackTeamwork";
                      
 async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);

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
         console.log(myDoc);

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);