import bcrypt from "bcryptjs";

const password = "160122733304";

const run = async () => {
  const hashed = await bcrypt.hash(password, 10);
  console.log(hashed);
  console.log("hashed password")
};

run();
