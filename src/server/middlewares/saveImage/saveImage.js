const fs = require("fs");
const path = require("path");

const saveImage = (req, res, next) => {
  const { files } = req;
  req.imagePaths = [];

  if (files.length !== 0) {
    files.forEach((file) => {
      const newFileName = `${Date.now()}-${file.originalname}`;
      fs.rename(
        path.join("uploads", "locations", file.filename),
        path.join("uploads", "locations", newFileName),
        (error) => {
          if (error) {
            next(error);
          }
        }
      );
      req.imagePaths.push(newFileName);
    });
  }
  next();
};

module.exports = { saveImage };
