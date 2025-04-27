import { MongoClient } from "mongodb";

async function createDatabase() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connection to MongoDB is established");

    const database = client.db("testi2");
    console.log("Database", database.databaseName, "is made");

    const collectionData = database.collection("data");
    const collectionUsers = database.collection("users");

    const sampleData = [
      { id: 1, FirstName: "Jimmy", Surname: "Hendrix", userid: "jk" },
      { id: 2, FirstName: "Jason", Surname: "Newstad", userid: "pl" },
      { id: 3, FirstName: "Steve", Surname: "Vai", userid: "pl" },
      { id: 4, FirstName: "Ritchie", Surname: "Blackmore", userid: "pl" },
    ];

    const sampleUsers = [
      { username: "jk", password: "sala" },
      { username: "pl", password: "pass" },
    ];

    await collectionData.insertMany(sampleData);
    console.log('Collection "data" populated');
    await collectionUsers.insertMany(sampleUsers);
    console.log('Collection "users" populated');
  } catch (error) {
    console.error("Error when connecting or creating a database:", error);
  } finally {
    await client.close();
  }
}

createDatabase().catch(console.error);
