import { addData, getAllData } from "./mongodb.js";

const test = async () => {
  try {
    const insertedId = await addData({
      id: 1,
      Firstname: "Anna",
      Surname: "Korhonen",
      userid: 42,
    });
    console.log("Вставлен документ с _id:", insertedId);

    const data = await getAllData();
    console.log("Все данные в коллекции 'data':", data);
  } catch (err) {
    console.error("Ошибка при тестировании:", err);
  }
};

test();
