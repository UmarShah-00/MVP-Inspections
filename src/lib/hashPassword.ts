const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

// test
async function test() {
  const myPass = "admin@admin.com";
  const hashed = await hashPassword(myPass);
  console.log("Original:", myPass);
  console.log("Hashed:", hashed);
}

test();
