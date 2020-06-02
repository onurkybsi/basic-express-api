exports.requestValidator = (req, res, next, rules) => {
  let requiredKeys = Object.keys(rules);

  let validationOfRequestBody = validateRequestBody(req.body, requiredKeys);
  let validationOfObject = validateObject(req.body, rules);

  if (!validationOfRequestBody.isValid || !validationOfObject.isValid) {
    let inCorrectValidation = validationOfRequestBody.isValid
      ? validationOfRequestBody
      : validationOfObject;

    console.error(inCorrectValidation.message);
    res.status(404).send(inCorrectValidation);
  }

  next();
};

validateRequestBody = (requestBody, requiredKeys) => {
  let requestKeys = Object.keys(requestBody.body);

  if (requestKeys.length !== requiredKeys.length) {
    return {
      isValid: false,
      message: "Sorry, request body is not true!",
    };
  }
  requiredKeys.forEach((key) => {
    if (!requestKeys.includes(key)) {
      return {
        isValid: false,
        message: `Sorry ${key} can't find!`,
      };
    }
  });
};

validateObject = (object, rules) => {
  for (let key in rules) {
    if (object[key] === null || object[key] === undefined) {
      return {
        isValid: false,
        message: `Sorry, ${key} cannot be null or undefined!`,
      };
    }
    if (rules[key].hasOwnProperty("required")) {
      if (object[key] === "") {
        return {
          isValid: false,
          message: `Sorry, ${key} cannot be empty!`,
        };
      }
    }
    if (rules[key].hasOwnProperty("minLength")) {
      if (String(object[key]).length < rules[key].minLength) {
        console.log(object[key].length);
        console.log(rules[key].minLength);
        return {
          isValid: false,
          message: `Sorry, length of ${key} cannot be less than ${rules[key].minLength}!`,
        };
      }
    }
    if (rules[key].hasOwnProperty("onlyLetter")) {
      if (String(object[key]).match(/\d+/g) != null) {
        return {
          isValid: false,
          message: `Sorry, ${key} cannot contain numerical characters`,
        };
      }
    }
    if (rules[key].hasOwnProperty("email")) {
      if (!String(object[key]).endsWith("@onurkayabasi.com")) {
        return {
          isValid: false,
          message: `Sorry, ${key} have to be ends with '@onurkayabasi.com'`,
        };
      }
    }
    if (rules[key].hasOwnProperty("date")) {
      let date_regex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
      let dayOfMounth = parseInt(object[key].substring(5, 7)) > 12;
      let mounth = parseInt(object[key].substring(8, 10)) > 31;

      if (!date_regex.test(object[key]) || dayOfMounth || mounth) {
        return {
          isValid: false,
          message: `Sorry, ${key} have to be date like: '1997-08-03'`,
        };
      }
    }
  }
  return {
    isValid: true,
    message: "Successful!",
  };
};
