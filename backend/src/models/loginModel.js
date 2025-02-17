const conexao = require("./connection");
const bcrypt = require("bcrypt");
const atualizarTokenAdmin = require("./auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginModel = async (user) => {
	const [hash] = await conexao.connection.execute("SELECT * FROM login");
	const acharUser = hash.find((pessoa) => pessoa.email === user.email);

	if (acharUser == undefined) {
		return undefined;
	}
	console.log(user.senha, hash[acharUser.id]);
	const resultado = await bcrypt.compare(user.senha, hash[acharUser.id].senha);
	if (!resultado) {
		return false;
	}

	const adminToken = await atualizarTokenAdmin(acharUser.email);
	const refreshToken = jwt.sign(
		acharUser.email,
		process.env.REFRESH_ADMIN_TOKEN
	);
	user.refreshToken = refreshToken;
	return { refreshToken, adminToken };
};

module.exports = loginModel;
