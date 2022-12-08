const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
/**
 * prottek note er jonno amader ekta ticket number dorkar.. automatic object id created with every record
 * thats what we are referencing here for the user .. mongo db object id is very long strings. .. oi ta
 * ashole ticket number hishebe use kora uchit hobe na .. amader sequential ekta ticket number dorkar ..
 *
 */
const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User", // ekta Schema ke refer korte hobe ..
        },
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

noteSchema.plugin(AutoIncrement, {
    // kichu options set kore dibo
    inc_field: "ticket", // increment field er name hobe ticket .. create a ticket field inside our note schema
    // inc_field e amader ke sequential number ta dibe...
    id: "ticketNums", // ei ta amra amader notes collection er moddhe dekhte parbo na ..
    // counter nam e ekta seperate collection create hobe .. amra ei ID ta shei counter collection er moddhe
    // dekhte parbo ..
    start_seq: 500, // ticket ta koto number theke shuru korte chai
});

module.exports = mongoose.model("Note", noteSchema);
