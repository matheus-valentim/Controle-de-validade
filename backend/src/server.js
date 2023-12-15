const app = require("./app");
require("dotenv").config();
const porta = process.env.PORT || 3333;

app.listen(porta, () => {
	console.log("servidor ligado");
});
