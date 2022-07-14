const User = require("../database/models/User");
const mockLocations = require("../mocks/mockLocations");
const { getUserLocations } = require("./locationControllers");

describe("Given a getPizzerias controller", () => {
  describe("When it's called on", () => {
    test("Then it should call the response method with a 200 and a json method with a list of pizzerias", async () => {
      const expectedStatus = 200;

      const req = {
        params: {
          userId: "1",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockReturnValue({
          locations: {
            features: mockLocations,
          },
        }),
      }));

      const expectedJsonMessage = {
        features: mockLocations,
      };

      await getUserLocations(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJsonMessage);
    });
  });
  describe("When it's invoked but there is an error", () => {
    test("Then the next function should be called ", async () => {
      const req = {
        params: {
          userId: "2",
        },
      };

      const next = jest.fn();

      await getUserLocations(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
