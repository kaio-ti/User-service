import express from "express";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as yup from "yup";
import { v4 as uuid4 } from "uuid";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();

const config = {
  secret: "my_very_secret_key",
  expiresIn: "1h",
};

const usersList = [];

const userSchema = yup.object().shape({
  uuid: yup
    .string()
    .default(() => {
      return uuid4();
    })
    .transform(() => {
      return uuid4();
    }),
  username: yup.string().required(),
  age: yup.number().positive().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }),
});

const validateSignUp = (userSchema) => async (req, res, next) => {
  const data = req.body;
  try {
    const userData = await userSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
    req.userData = userData;
    next();
  } catch (e) {
    res.status(422).json({ error: e.errors.join(",") });
  }
};

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const userAuth = usersList.find(
      (user) => user.username === decoded.username
    );
    req.userAuth = userAuth;
  });
  return next();
};

const isAuthorized = (req, res, next) => {
  const { uuid } = req.params;
  const { userAuth } = req;
  if (uuid !== userAuth.uuid) {
    return res.status(401).json({ message: "User not allowed" });
  } else {
    next();
  }
};

app.post("/signup", validateSignUp(userSchema), async (req, res) => {
  const { userData } = req;
  try {
    const passwordhash = await bcrypt.hash(userData.password, 10);
    const data = {
      username: userData.username,
      password: passwordhash,
      age: userData.age,
      email: userData.email,
      createdOn: userData.createdOn,
      uuid: userData.uuid,
    };
    data.password = passwordhash;
    usersList.push(data);
    const { password: data_password, ...nonSensibleInfo } = data;

    return res.status(201).json(nonSensibleInfo);
  } catch (e) {
    res.status(400).json({ message: "Unable to complete signup" });
  }
});

app.get("/users", isAuthenticated, (req, res) => {
  res.status(200).json(usersList);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await usersList.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ message: "User not in database" });
  }

  try {
    const compare = await bcrypt.compare(password, user.password);
    const token = jwt.sign(
      { username: username, uuid: user.uuid },
      config.secret,
      {
        expiresIn: config.expiresIn,
      }
    );
    if (compare) {
      res.status(200).json({ accessToken: token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (e) {
    res.status(400).json({ message: "Unable to complete login" });
  }
});

app.put(
  "/users/:uuid/password",
  isAuthenticated,
  isAuthorized,
  async (req, res) => {
    const { password } = req.body;
    const { userAuth } = req;
    const newHashedPassword = await bcrypt.hash(password, 10);
    userAuth.password = newHashedPassword;
    res.status(204).json([]);
  }
);

app.listen(3000);
