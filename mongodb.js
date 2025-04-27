import { MongoClient, ObjectId } from "mongodb";
const dbHost = "localhost:27017";
//const dbUser = "admin";
//const dbPassword = "admin";
const dbName = "testi2";
const dataCollection = "data";
const usersCollection = "users";
//const destConnString = `mongodb://${dbUser}:${dbPassword}@${dbHost}?authSource=${dbName}`;
const destConnString = `mongodb://${dbHost}`;
const dbServer = new MongoClient(destConnString);

let logonUsers = new Map();

// Method for connecting to the database
const openDbConn = async () => {
  try {
    await dbServer.connect();
    return dbServer.db(dbName);
  } catch (error) {
    console.error("Failed to conencto to the database", error);
    throw error;
  }
};

// Method for using a certain collection
const connDbCollection = async (collection) => {
  return db.collection(collection);
};

const sendQuery = async (query, toArray = false) => {
  try {
    const result = await query;
    if (toArray) return await result.toArray();
    else console.log("should do something");
  } catch (err) {
    console.error("Query execution failed", err);
    throw err;
  }
};

//const findOneUser = async (username) =>
// sendQuery(`SELECT * FROM users WHERE username = ?`, true, username);
const findOneUser = async (username) => {
  console.log(username);
  const usersCol = await connDbCollection(usersCollection);
  return sendQuery(
    usersCol
      .find(
        //find -> aggregate()
        { username }
      )
      .project({
        username: "$username",
        password: "$password",
        _id: 0,
      }),
    true
  );
};

const getAllData = async () => {
  const dataCol = await connDbCollection(dataCollection);
  return sendQuery(dataCol.find(), true);
};

const getDataById = async (id) => {
  const dataCol = await connDbCollection(dataCollection);
  const result = await dataCol.findOne({ id: id });
  return result;
};

const addData = async ({ id, Firstname, Surname, userid }) => {
  const dataCol = await connDbCollection(dataCollection);

  const newData = {
    id,
    Firstname,
    Surname,
    userid,
  };

  const result = await dataCol.insertOne(newData);
  return result.insertedId;
};

// Connect to database when the application starts
const db = await openDbConn();

const closeDbConnection = async () => {
  try {
    await dbServer.close();
    console.log("Database conenction closed");
  } catch (error) {
    console.error("Failed to close the database connection", error);
  }
};

//tehtävä 11
// SELECT a.username, count(b.userid) AS 'Users records' FROM users AS a JOIN data AS b ON a.username = b.userid GROUP BY a.username;
const getUserData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const db = await openDbConn();
    const usersCol = db.collection(usersCollection);
    const dataCol = db.collection(dataCollection);

    const result = await usersCol
      .aggregate([
        {
          $lookup: {
            from: "data",
            localField: "username",
            foreignField: "userid",
            as: "user_data",
          },
        },
        {
          $unwind: "$user_data",
        },
        {
          $group: {
            _id: "$username",
            users_records: { $sum: 1 },
          },
        },
        {
          $project: {
            username: "$_id",
            users_records: 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    return result;
  } catch (error) {
    console.error("Error during aggregation:", error);
    throw error;
  }
};

process.on("SIGINT", closeDbConnection);
process.on("SIGTERM", closeDbConnection);

export {
  findOneUser,
  logonUsers,
  getAllData,
  getDataById,
  addData,
  getUserData,
};
