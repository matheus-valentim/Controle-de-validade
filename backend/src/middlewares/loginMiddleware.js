const undefinedFieldLogin = (req, res, next) => {
	const { body } = req;
	if (
		body.email == undefined ||
		body.email.trim() == "" ||
		body.senha == undefined ||
		body.senha.trim() == ""
	) {
		return res
			.status(400)
			.json({ message: "Preencha todos os campos.", status: 400 });
	}
	next();
};

module.exports = undefinedFieldLogin;
