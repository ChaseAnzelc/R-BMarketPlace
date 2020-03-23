const router = require('express').Router();
const SHA256 = require("crypto-js/sha256");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
let User = require('../models/user.model');
const mailer = require('../mailer/mailer');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const passwordSalt = randomString.generate(32);
    const password = SHA256(req.body.password + passwordSalt);
    var emailToken = randomString.generate(5);
    const tokenTime = Date.now().toString().slice(0, -3); //generating a timestamp to attach to the email token
    //the first 5 characters of the token is the actual token, the rest is timestamp
    emailToken = emailToken + tokenTime;

    const newUser = new User({ email, firstName, lastName, passwordSalt, password, emailToken });
    newUser.save()
        .then(user => {
            const payload = { user: { id: user.email } };

            jwt.sign(
                payload,
                "thisisasecretkey", { expiresIn: 10000 },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({ token });
                }
            );
            const emailContent = '<h2> Welcome to R&B Marketplace! </h2>' +
                '<br/><br/> Please verify your email with the following token the next time you login: <br/>' +
                '<b>' + emailToken.substring(0, 5) + '</b>';
            const subject = "R&B Marketplace Account Confirmation";

            mailer.sendEmail(subject, email, emailContent);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/login").post((req, res) => {
    const email = req.body.email;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.status(401);
                res.send("Error: Email address is not registered");
            }
            else if (SHA256(req.body.password + user.passwordSalt).toString() === user.password) {
                if (user.active == false) {
                    res.status(401);
                    res.send("unverified");
                }
                const payload = { user: { email: user.email } };

                jwt.sign(
                    payload,
                    "thisisasecretkey", { expiresIn: 3600 },
                    (err, token) => {
                        if (err) throw err;
                        res.status(200).json({ token });
                    }
                );
            }
            else {
                res.status(401);
                res.send("Error: The email and password combination does not match!");
            }

        });
});

router.route("/verify").post((req, res) => {
    const email = req.body.email;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.status(404);
                res.send("Error: Invalid email!");
            }
            else if (user.active == true) {
                res.status(404);
                res.send("Error: Email is already verified.");
            }
            else if (req.body.emailToken === user.emailToken.substring(0, 5)) {
                if (parseInt(Date.now().toString().slice(0, -3)) - parseInt(user.emailToken.substring(5)) >= 3600) { //token expires in 1 hour
                    res.status(403);
                    res.send("Error: The token has expired!");
                }
                else {
                    user.active = true;
                    user.emailToken = '';
                    user.save();
                    res.status(200);
                    res.send("Successful: Email address verified successfully!");
                }

            }
            else {
                res.status(401);
                res.send("Error: Invalid token!");
            }

        });
});

router.route('/reemail').post((req, res) => {
    const email = req.body.email;

    var emailToken = randomString.generate(5);
    const tokenTime = Date.now().toString().slice(0, -3); //generating a timestamp to attach to the email token
    //the first 5 characters of the token is the actual token, the rest is timestamp
    emailToken = emailToken + tokenTime;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.status(404);
                res.send("Error: Invalid email!");
            }
            else if (parseInt(Date.now().toString().slice(0, -3)) - parseInt(user.emailToken.substring(5)) <= 300) { //token expires in 1 hour
                res.status(400);
                res.send("Eror: Please wait at least 5 minutes before a token resend.");
            }
            else {
                user.emailToken = emailToken;
                user.save();
                const emailContent = '<h2> R&B Marketplace Token </h2>' +
                    '<br/><br/> Please verify your email with the following token: <br/>' +
                    '<b>' + emailToken.substring(0, 5) + '</b>';
                const subject = "R&B Marketplace Account Confirmation";

                mailer.sendEmail(subject, email, emailContent);
                res.status(200);
                res.send("Successfully re-sent the token to the email address!");
            }
        })
});

router.route("/authToken").post((req, res) => {
    let email;
    try {
        const token = req.header("token");
        if (!token) return res.status(401).json({ message: "Auth Error" });

        try {
            const decoded = jwt.verify(token, "thisisasecretkey");
            email = decoded.user.email;
        } catch (e) {
            console.error(e);
            res.status(401).send({ message: "Invalid Token" })
        }

        User.findOne({ email: email })
            .then(user => res.json({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }))
            .catch(err => res.json(err));

    } catch (e) {
        res.send({ message: "Error in fetching user" });
    }
});

module.exports = router;
