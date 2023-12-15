const loginModel = require("../models/loginModel");
const loginAdmin = async (req, res) => {
	const user = await loginModel(req.body);
	if (user == undefined) {
		return res
			.status(400)
			.json({ message: "Esse email não existe.", status: 400 });
	}
	if (user) {
		return res.status(200).json({
			message: "Login feito com sucesso.",
			adminToken: user.adminToken,
			refreshToken: user.refreshToken,
			status: 200,
		});
	}
	return res.status(400).json({ message: "Senha incorreta.", status: 400 });
};
module.exports = loginAdmin;
