const path = require("path");
const Location = require("../database/models/Location");
const User = require("../database/models/User");
const mockLocations = require("../mocks/mockLocations");
const {
  getUserLocations,
  createLocation,
  deleteLocation,
} = require("./locationControllers");

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  rename: jest.fn().mockReturnValue(true),
}));

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

describe("Given a createLocation controller", () => {
  const req = {
    body: {
      name: "Lele's home",
      description: "Carrer Templers Home",
      latitude: 41.38184338079825,
      longitude: 2.1788420566189455,
    },
    files: ["12798217782.jpg"],
    firebaseImagesUrls: ["12798217783.jpg"],
    params: {
      userId: "1",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  jest
    .spyOn(path, "join")
    .mockResolvedValueOnce("image")
    .mockReturnValueOnce(true)
    .mockResolvedValue(new Error());

  describe("When it's invoked with a request with the info to create", () => {
    test("Then it should call the response's method with a 201 and a json message with the new Location", async () => {
      const expectedStatus = 201;

      const user = {
        locations: {
          features: [],
        },
      };

      const expectedResponse = { new_location: mockLocations[0] };

      User.findById = jest.fn().mockResolvedValue(user);
      Location.create = jest.fn().mockResolvedValue(mockLocations[0]);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      await createLocation(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
  describe("When it's invoked but there is an error", () => {
    test("Then it should call the response's method with a 400 and a json message 'Unable to add new location", async () => {
      const expectedErrorMessage = "Unable to add new location";
      const expectedError = new Error(expectedErrorMessage);

      Location.create = jest.fn().mockRejectedValue();

      const next = jest.fn();

      await createLocation(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When it's invoked and the file fails to rename", () => {
    test("Then it should call the next funcion", async () => {
      const next = jest.fn();

      await createLocation(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a deleteLocation controller", () => {
  describe("When invoked with a request to delete the location with the id of the first location", () => {
    test("Then it should call the response's status method with 200, and json message with message that the location was deleted", async () => {
      const req = {
        params: {
          locationId: "1",
        },
        userId: "1",
      };

      const expectedMessage = {
        msg: "Location with ID 1 deleted",
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Location.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue(mockLocations.features[0]);

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      await deleteLocation(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
  describe("When it's invoked but there is an error", () => {
    test("Then the next function should be called ", async () => {
      const req = {
        params: {
          locationId: "2",
        },
      };

      const next = jest.fn();

      await deleteLocation(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
