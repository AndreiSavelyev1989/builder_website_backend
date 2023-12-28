const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    id: String,
    filename: String,
    originalname: String,
    path: String,
});

const File = mongoose.model("File", fileSchema);

module.exports = File;