const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../database/models/User");
const mockNewUser = require("../mocks/mockUsers");
const { userLogin, userRegister } = require("./userControllers");

const expectedToken = "1234567890";

jest.mock("../database/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(() => mockNewUser),
}));

jest.mock("bcrypt", () => ({ compare: jest.fn(), hash: jest.fn() }));

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
  describe("When it receives a request with a user present in the databse but with the wrong password", () => {
    test("Then it should call the next received function with a message 'Password incorrect'", async () => {
      const expectedErrorMessage = "Password incorrect";
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockReturnValue(false);

      await userLogin(req, res, next);

      const expectedError = new Error(expectedErrorMessage);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a userRegister function", () => {
  describe("When it is called on", () => {
    test("Then it should call the response method with a status 201 and the name created user", async () => {
      const req = {
        body: { username: "lele", password: "1234" },
      };

      User.findOne.mockImplementation(() => false);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedStatus = 201;
      const expectedJson = { username: "lele" };
      bcrypt.hash.mockImplementation(() => "hashedPassword");
      await userRegister(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });
  describe("When it is called with a user that is already in the database", () => {
    test("Then it should call the 'next' middleware with an error", async () => {
      const req = {
        body: { username: "lillo", password: "lillo" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockNext = jest.fn();
      User.findOne.mockImplementation(() => true);
      bcrypt.hash.mockImplementation(() => "hashedPassword");

      await userRegister(req, res, mockNext);
      const expectedError = new Error();
      expectedError.code = 409;
      expectedError.message = "This user already exists";

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When invoked with a req object with a correct username and a wrong password", () => {
    test("Then it should call the next function", async () => {
      const req = {
        body: { username: "lillo", password: "lillo" },
      };

      const expectedErrorMessage = "Wrong user data";
      const expectedError = new Error(expectedErrorMessage);

      User.findOne = jest.fn().mockResolvedValue(false);

      const next = jest.fn();

      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
