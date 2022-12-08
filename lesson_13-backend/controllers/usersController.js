const User = require("../models/User");
const Note = require("../models/Note"); // user Controller holeo .. amader ke Note model e
// refer kora lagte pare ..
const bcrypt = require("bcrypt"); // hash the password before save..
/**
 * async handler will keep us from using so many try catch blocks, as we use async methods
 * with
 */

// @desc Get all users             /// Shift Alt Down arrow to create copy of this line
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select("-password").lean();
    // please do not return the password .. lean() add korle she amader method gula
    // dey na .. just data dey .. lean data .. i mean json

    // If no users
    if (!users?.length) {
        return res.status(400).json({ message: "No users found" });
    }

    res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { username, password, roles } = req.body; // we will be receiving some data from the
    // front end ..

    // Confirm data // !Array.isArray(roles) .. mane roles jodi array na hoy .. etao ekta issue
    // abar or !roles.length mane roles er kono length jodi na thake .. taileo she kintu array na
    if (!username || !password) {
        // 400 mane holo bad request ..
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username })
        .collation({ locale: "en", strength: 2 })
        .lean() // jehetu amra er upor save ba onno kono method call korbo na ..
        .exec(); // if you use async await and wants to receive a promise in return then
    // you really need to call exec here at the end ..

    if (duplicate) {
        // 409 stands for conflict
        return res.status(409).json({ message: "Duplicate username" });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    // save korar age userObject define kora nilam ..
    const userObject =
        !Array.isArray(roles) || !roles.length
            ? { username, password: hashedPwd }
            : { username, password: hashedPwd, roles };

    // Create and store new user
    const user = await User.create(userObject);

    if (user) {
        //created
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: "Invalid user data received" });
    }
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    // Confirm data
    if (
        !id ||
        !username ||
        !Array.isArray(roles) || // roles er Array jodi na ashe ...
        !roles.length ||
        typeof active !== "boolean" // active er status jodi boolean na hoy
    ) {
        return res
            .status(400) // bad request ..
            .json({ message: "All fields except password are required" });
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec(); // exec because we are passing an a value
    // here and we do need receive that promise ..after that we are not calling lean bcz
    // we need this to be a mongoose document that does have save and the other methods ..

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        // id er shathe match kora mane hocche same current user er id .. tar information
        // update korbo ..
        return res.status(409).json({ message: "Duplicate username" });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        // Hash password // karon shob shomoy amra password update korbo na ..
        user.password = await bcrypt.hash(password, 10); // salt rounds
    }

    const updatedUser = await user.save(); // lean data er jonno request korle .. save method
    // petam na ..

    res.json({ message: `${updatedUser.username} updated` });
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: "User ID Required" });
    }

    // user er under e kono notes assign kora thakle .. amra user ke delete korbo na ..

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
        // notes?.length jodi thake .. taile user ke delete kora jabe na ..
        return res.status(400).json({ message: "User has assigned notes" });
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec(); // lean likhlam na .. karon

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const result = await user.deleteOne(); // result er moddhe deleted user er information thakbe

    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);
};

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
};
