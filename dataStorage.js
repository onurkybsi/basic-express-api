const faker = require("faker");

let data = [];

faker.seed(100);

for (let i = 1; i <= 500; i++) {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  let birthDate = faker.date.between("1970-01-01", "2020-01-01");
  let phoneNumber = faker.phone.phoneNumberFormat(1);
  let email = faker.internet.email(firstName, lastName);
  let address = `${faker.address.streetAddress("###")} ${faker.address.secondaryAddress()} ${faker.address.city()}/${faker.address.country()}`
  
   data.push({
    id: i,
    firstName: firstName,
    lastName: lastName,
    birthDate: birthDate,
    phoneNumber: phoneNumber,
    email: email,
    address: address
  });
}

module.exports = function () {
  return data;
};
