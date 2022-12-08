const express = require("express");
const router = express.Router();
const path = require("path");

// route gula ..  reg x niye kaj korte pare ..
router.get("^/$|/index(.html)?", (req, res) => {
    /**
     * ^ -> carat  -> at the beginning only
     * /$ -> at the end of the string only
     * | -> or
     * /index -> may be the would request more then just the slash ..
     * (.html)? -> optional .. thakteo pare .. abar na o thakte pare ..
     */
    // html file ta response hishebe back korbo.. error page ta arki ... maybe
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
