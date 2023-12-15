const express = require("express");
const login = require("./controllers/loginControllers");
const undefinedFieldLogin = require("./middlewares/loginMiddleware");
const produtoMiddleware = require("./middlewares/produtoMiddleware");
const bcrypt = require("bcrypt");
const router = express.Router();
const produtos = require("./controllers/produtosController");
const { authenticateToken } = require("./middlewares/authMiddleware");

router.post("/loginadmin", undefinedFieldLogin, login);

router.get("/", async (req, res) => {
	res.status(200).send(require("crypto").randomBytes(64).toString("hex"));
});

router.get("/teste", authenticateToken, produtos.PegarProduto);

router.post(
	"/adicionarProdutos",
	authenticateToken,
	produtoMiddleware.AdicionarProduto,
	produtos.CriarProdutos
);

router.delete(
	"/deletarProdutos/:id",
	authenticateToken,
	produtos.DeletarProdutos
);

router.put(
	"/atualizarProdutos/:id",
	authenticateToken,
	produtoMiddleware.AtualizarProduto,
	produtos.AtualizarProdutos
);
module.exports = router;
