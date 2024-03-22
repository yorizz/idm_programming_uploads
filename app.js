const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

const flash = require("express-flash");
const session = require("express-session");
const fileUpload = require("express-fileupload");

require("dotenv").config();
const router = require("./routes/routes");

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(express.json());

app.use(
	fileUpload({
		limits: {
			fileSize: 2000000, // Around 2MB
		},
		abortOnLimit: true,
		limitHandler: fileTooBig,
	})
);
app.use(express.static(path.join(__dirname, "./assets")));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(flash());
app.use(router);

app.listen(port, () => {
	console.log(`application running on http://localhost:${port}`);
});

function fileTooBig(req, res, next) {
	console.log("Your file is too big");
	res.render("templates/index.ejs", {
		title: "Uploads",
		page: "uploadform.ejs",
		messages: { error: "Your file is too big" },
	});
}
