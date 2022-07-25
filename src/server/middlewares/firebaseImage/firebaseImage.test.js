const fs = require("fs");
const path = require("path");
const firebaseImage = require("./firebaseImage");

jest.mock("firebase/storage", () => ({
  ref: jest.fn().mockReturnValue("ref"),
  uploadBytes: jest.fn().mockResolvedValue({}),
  getStorage: jest.fn(),
  getDownloadURL: jest.fn().mockResolvedValue("url"),
}));

const next = jest.fn();

describe("Given a imageConverter middleware", () => {
  describe("When it receives a request with a file and the readFile fails", () => {
    test("Then it should call the next received function", async () => {
      const req = { imagePaths: { filename: "file" } };

      jest
        .spyOn(path, "join")
        .mockReturnValue(path.join("uploads", "locations"));

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      jest.spyOn(fs, "readFile").mockImplementation((pathToRead, callback) => {
        callback("readFileError");
      });

      await firebaseImage(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with a file and the rename fails", () => {
    test("Then it should call the next received function", async () => {
      const req = { imagePaths: { filename: "file" } };

      jest
        .spyOn(path, "join")
        .mockReturnValue(path.join("uploads", "locations"));

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback("renameError");
        });

      await firebaseImage(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with no file", () => {
    test("Then it should call the next received function", async () => {
      const req = { file: null };

      await firebaseImage(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
