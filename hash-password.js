import bcrypt from "bcryptjs";

const password = "admin@admin.com"; // jo password DB me dalna hai

const run = async () => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log("Hashed Password:");
  console.log(hash);
};

run();
