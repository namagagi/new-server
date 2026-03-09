
const bcrypt = require("bcrypt");
// Assume hashedPassword is the hashed password retrieved from the database
const hashedPassword =
  "$2b$10$FSpaQgYhVOOi7/7tsafD/.ml6GflSDxjqv0eU0.D1rQu5MGoNBFk";

// Compare the provided password with the hashed password
bcrypt.compare("test", hashedPassword, function (err, result) {
  if (err) {
    return;
  }

  if (result) {
    // Passwords match
    console.log("Password is correct");
  } else {
    // Passwords don't match
    console.log("Password is incorrect");
  }
});
