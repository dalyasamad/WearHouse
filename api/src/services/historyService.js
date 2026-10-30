// Implements business logic between the API controllers and database repositories.


const historyRepository =
  require("../repositories/historyRepository");

// Retrieves all records associated with the current user.
async function getAll(userId) {
  return historyRepository.findByUser(userId);
}

module.exports = {
  getAll,
};