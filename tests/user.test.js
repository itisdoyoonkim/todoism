const request = require("supertest");
const server = require("../server");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

const userId = new mongoose.Types.ObjectId();

const newUser = {
  _id: userId,
  name: "tester",
  email: "tester@test.com",
  password: "!!test??",
};

const authToken = jwt.sign({ _id: userId }, jwtSecret);
console.log(authToken);

beforeEach(async () => {
  await User.deleteMany();

  const user = new User(newUser);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  user.password = hashedPassword;

  await user.save();
});

test("Should sign up a new user", async () => {
  await request(server)
    .post("/users")
    .send({
      name: "lux",
      email: "lux@gmail.com",
      password: "1234567",
    })
    .expect(201);
});

test("Should not sign up using the email already in use", async () => {
  await request(server)
    .post("/users")
    .send({
      name: "tester",
      email: "tester@test.com",
      password: "!!test??",
    })
    .expect(400);
});

test("Should log in a user", async () => {
  await request(server)
    .post("/users/login")
    .send({
      email: newUser.email,
      password: newUser.password,
    })
    .expect(200);
});

test("Should not log in a non-existing user", async () => {
  await request(server)
    .post("/users/login")
    .send({
      email: "idontexist@exist.com",
      password: "blahmoneydoh",
    })
    .expect(400);
});

test("Should get user profile using token", async () => {
  await request(server)
    .get("/users/me")
    .set("Authorization", `Bearer ${authToken}`)
    .send()
    .expect(200);
});

test("Should not get user profile when incorrect token provided", async () => {
  await request(server)
    .get("/users/me")
    .set("Authorization", `Bearer 123`)
    .send()
    .expect(401);
});

test("Should not get user profile when no token provided", async () => {
  await request(server).get("/users/me").send().expect(401);
});
