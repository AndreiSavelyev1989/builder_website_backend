const Router = require("express");
const File = require("../models/file");
const multer = require("multer");
const uuid = require("uuid");

const imagesRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + "-" + file.originalname); // Generating a unique file name
  },
});

const upload = multer({ storage: storage });

imagesRouter.post("/upload", upload.single("image"), async (req, res) => {
  const file = req.file;

  const newFile = new File({
    id: uuid.v4(),
    filename: file.filename,
    originalname: file.originalname,
    path: file.path,
  });

  try {
    const file = await newFile.save();
    console.log(`File saved successfully - ${file}`);
    res.send(file);
  } catch (error) {
    console.error("Error while saving the model:", error);
  }
});

module.exports = imagesRouter;
