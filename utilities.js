exports.requestValidator = (req, res, next, rules) => {
  let requiredKeys = Object.keys(rules);

  let validationOfRequestBody = validateRequestBody(
    req.body,
    requiredKeys,
    req.method
  );

  if (!validationOfRequestBody.isValid) {
    res.status(400).send(validationOfRequestBody);
  }

  let validationOfObject = validateObject(req.body, rules);
  if (!validationOfObject.isValid) {
    res.status(400).send(validationOfObject);
  }

  next();
};

//#region private of requestValidator
validateRequestBody = (requestBody, requiredKeys, httpMethod) => {
  let requestKeys = Object.keys(requestBody);
  let validationResult = {
    isValid: true,
    message: "Successful!",
  };

  if (httpMethod === "POST") {
    validationResult = postRequestBodyValidate(requestKeys, requiredKeys);
  }

  if (httpMethod === "PUT") {
    validationResult = putRequestBodyValidate(requestKeys, requiredKeys);
  }

  return validationResult;
};

postRequestBodyValidate = (requestKeys, requiredKeys) => {
  if (requestKeys.length !== requiredKeys.length) {
    return {
      isValid: false,
      message: "Sorry, request body is not true!",
    };
  }

  for (let key in requiredKeys) {
    if (!requestKeys.includes(requiredKeys[key])) {
      return {
        isValid: false,
        message: `Sorry ${requiredKeys[key]} can't find!`,
      };
    }
  }

  return {
    isValid: true,
    message: "Successful!",
  };
};

putRequestBodyValidate = (requestKeys, requiredKeys) => {
  if (requestKeys.length === 0) {
    return {
      isValid: false,
      message: "Sorry, no value has been entered to be updated!",
    };
  }

  for (let key in requestKeys) {
    if (!requiredKeys.some((requiredKey) => requiredKey === requestKeys[key])) {
      return {
        isValid: false,
        message: `Sorry ${requestKeys[key]} is not available!`,
      };
    }
  }

  return {
    isValid: true,
    message: "Successful!",
  };
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
    if (rules[key].hasOwnProperty("phoneNumber")) {
      let phone_regex = /((1\s|\B)?\(?[0-9]{3}[-\s)]\s?[0-9]{3}[-\s][0-9]{4}|[0-9]{10})/g;

      if (!phone_regex.test(object[key])) {
        return {
          isValid: false,
          message: `Sorry, ${key} have to be phone number like: '(123)456-7891 or 123-456-7891'`,
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
//#endregion

exports.findObjectById = (id, dataStorage) => {
  if (dataStorage.filter((person) => person["id"] === id + 1).length === 1) {
    return {
      isItFound: true,
      object: dataStorage[id],
      message: "The person was found!",
    };
  } else {
    return {
      isItFound: false,
      object: null,
      message: "Sorry, the person was not found!",
    };
  }
};
