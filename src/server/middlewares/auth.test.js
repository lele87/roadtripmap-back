const jwt = require("jsonwebtoken");
const auth = require("./auth");

describe("Given an auth function", () => {
  describe("When it receives a request with a valid token", () => {
    test("Then it should call next ", () => {
      jwt.verify = jest.fn().mockReturnValue(true);
      const next = jest.fn();

      const req = {
        headers: { authorization: "Bearer " },
      };

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with invalid token", () => {
    test("Then it should call next with error", () => {
      const req = {
        headers: { authorization: "InvalidToken" },
      };
      const next = jest.fn();
      const customError = new Error("invalid token");
      customError.statusCode = 401;

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
