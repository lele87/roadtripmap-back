const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../database/models/User");
const { userLogin } = require("./userControllers");

const expectedToken = "1234567890";

jest.mock("../database/models/User", () => ({
  findOne: jest.fn(),
}));

describe("Given a userLogin function", () => {
  const req = {
    body: {
      username: "lele",
      password: "lele",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When invoked with a req object with the correct username and password", () => {
    User.findOne = jest.fn().mockResolvedValue(true);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue(expectedToken);

    test("Then it should call res status method status with 200", async () => {
      const expectedStatus = 200;

      await userLogin(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
    test("Then it should call the res json method with an object with the generated token like property", async () => {
      await userLogin(req, res, null);

      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });
  });

  describe("When invoked with a req object with an incorrect username", () => {
    test("Then it should call the next function", async () => {
      const expectedErrorMessage = "User or password incorrect";
      const expectedError = new Error(expectedErrorMessage);

      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(false);

      await userLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
