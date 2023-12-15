const jwt = require("jsonwebtoken");
require("dotenv").config();

const atualizarTokenAdmin = async (user) => {
	return jwt.sign({ user: user }, process.env.ADMIN_TOKEN, {
		expiresIn: "15s",
	});
};
module.exports = atualizarTokenAdmin;
