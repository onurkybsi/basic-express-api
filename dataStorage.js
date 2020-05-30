const faker = require("faker");

let data = [];

faker.seed(100);

for (let i = 1; i <= 500; i++) {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  let birthDate = faker.date.past((1950 + i) % 2005);
  let email = faker.internet.email(firstName, lastName);

  data.push({
    id: i,
    firstName: firstName,
    lastName: lastName,
    birthDate: birthDate,
    email: email,
  });
}

module.exports = function () {
  return data;
};
