const { initializeApp } = require("firebase/app");
const path = require("path");
const fs = require("fs");
const {
  uploadBytes,
  ref,
  getDownloadURL,
  getStorage,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBzqwLi41ifR4-N8rHAtVIYsDRP93PJZmU",
  authDomain: "trippy-379d5.firebaseapp.com",
  projectId: "trippy-379d5",
  storageBucket: "trippy-379d5.appspot.com",
  messagingSenderId: "565389079021",
  appId: "1:565389079021:web:c718eca574586acb63b7e4",
};

const firebaseApp = initializeApp(firebaseConfig);

const saveImage = async (storage, file, fileName) => {
  const storageRef = ref(storage, fileName);
  const metadata = {
    contentType: "image",
  };
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
};

const firebaseImage = async (req, res, next) => {
  const { file, files } = req;

  if (file || files) {
    const storage = getStorage(firebaseApp);
    req.firebaseImagesUrls = [];

    req.imagePaths.map(async (image) => {
      fs.readFile(
        path.join("uploads", "locations", image),
        async (readError, readFile) => {
          if (readError) {
            next(readError);
          }

          const firebaseFileURL = await saveImage(storage, readFile, image);
          req.firebaseImagesUrls.push(firebaseFileURL);
          if (req.firebaseImagesUrls.length === req.imagePaths.length) {
            next();
          }
        }
      );
    });
  } else {
    next();
  }
};

module.exports = firebaseImage;
