exports.getAboutPage = (req, res) => {
	res.render('../view/about.ejs'); // about.ejs dosyasını göndermek
};

exports.getAddPage = (req, res) => {
	res.render('../view/addphoto.ejs'); // contact.ejs dosyasını göndermek
};
