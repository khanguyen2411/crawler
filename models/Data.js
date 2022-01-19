const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
    {
        from : {
            type: String,
            required: true,
            trim: true,
            unique: true
        }
    }
)

const Data = mongoose.model("Data", DataSchema);
module.exports = Data