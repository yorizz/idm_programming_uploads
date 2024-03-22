const express = require("express");
const router = express.Router();
const sharp = require("sharp");
const fs = require("fs");

const acceptedMimeTypes = ["image/gif", "image/jpeg", "image/png"];

router.get("/", (req, res) => {
	console.log("in get /");
	res.render("templates/index.ejs", {
		title: "Uploads",
		page: "uploadform.ejs",
	});
});

router.post("/upload", async (req, res) => {
	console.log(req.body, req.files.picture);
	let image = req.files.picture;

	if (acceptedMimeTypes.indexOf(image.mimetype) >= 0) {
		// it's ok, we have an image that is not too large
		const imageDestinationPath =
			__dirname + "/../assets/uploads/" + image.name;
		await image.mv(imageDestinationPath);

		const resizedImagePath =
			__dirname + "/../assets/uploads/resized/" + image.name;
		await sharp(imageDestinationPath).resize(750).toFile(resizedImagePath);

		fs.unlink(imageDestinationPath, function (err) {
			if (err) throw err;
			console.log(imageDestinationPath + " deleted");
		});

		res.render("templates/index.ejs", {
			title: req.body.caption,
			caption: req.body.caption,
			page: "uploadedpicture.ejs",
			image: "/uploads/resized/" + image.name,
		});
	} else {
		// return an error flash message
		res.render("templates/index.ejs", {
			title: "Uploads",
			page: "uploadform.ejs",
			messages: { error: "Not an image" },
			caption: req.body.caption,
		});
	}
});

module.exports = router;
