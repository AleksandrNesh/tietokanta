import app from "./apicalls.js";

app.listen(3000, () => {
  console.log("Listening on port 3000 ..");
});

import { getUserData } from "./mongodb.js";

const checkUserData = async () => {
  try {
    const result = await getUserData();
    console.log(result);
  } catch (error) {
    console.error("Error retrieving user data", error);
  }
};

checkUserData();
