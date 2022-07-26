const fs = require("fs");
const path = require("path");

const saveImage = (req, res, next) => {
  const { file, files } = req;
  req.imagePaths = [];

  if (files || file) {
    const filesToUpload = file ? [file] : files;
    filesToUpload.forEach((fileToUpload) => {
      const newFileName = `${Date.now()}-${fileToUpload.originalname}`;
      fs.rename(
        path.join("uploads", "locations", fileToUpload.filename),
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
