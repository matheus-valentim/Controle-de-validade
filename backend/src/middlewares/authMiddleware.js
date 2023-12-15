const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	console.log("dfewfnhwbdiuewbcoebncuerniu", authHeader, token);
	jwt.verify(token, process.env.ADMIN_TOKEN, (err, user) => {
		if (err) {
			console.log(err);
			return res.status(403).json({ message: "token inválido", status: 403 });
		} else {
			req.email = user;
			next();
		}
	});
};
module.exports = { authenticateToken };
