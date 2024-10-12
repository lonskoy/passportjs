const bookSchema = require("../models/books.model.js");

async function updateCounter(id) {
  try {
    await bookSchema.findByIdAndUpdate(
      id,                         
      { $inc: { favorite: 1 } },   // Оператор $inc увеличивает поле favorite на 1
      { new: true }                // Опция для возврата обновленного документа
    );

  }
   catch (error) {
    console.error('Ошибка обновления просмотров:', error);
  }
}

async function readCounter(id) {

}

module.exports = {
  updateCounter,
  readCounter,
};