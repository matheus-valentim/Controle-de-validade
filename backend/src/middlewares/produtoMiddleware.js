const format = require("date-fns/format");
const isValid = require("date-fns/isValid");

const AdicionarProduto = (req, res, next) => {
	const { body } = req;
	const validade =
		new Date(body.validade).getFullYear() +
		"/" +
		(new Date(body.validade).getMonth() + 1) +
		"/" +
		new Date(body.validade).getDate();

	const dataCriacao =
		new Date().getFullYear() +
		"/" +
		(new Date().getMonth() + 1) +
		"/" +
		new Date().getDate();

	const dataEdicao =
		new Date().getFullYear() +
		"/" +
		(new Date().getMonth() + 1) +
		"/" +
		new Date().getDate();
	body.validade = validade;
	body.data_de_criacao = dataCriacao;
	body.data_de_edicao = dataEdicao;

	try {
		const validade = format(new Date(body.validade), "yyyy/MM/dd");
		const data_de_edicao = format(new Date(body.data_de_edicao), "yyyy/MM/dd");

		if (
			body.produto === undefined ||
			body.validade === undefined ||
			body.quantidade === undefined ||
			body.data_de_edicao === undefined ||
			body.usuario_criou === undefined ||
			body.usuario_editou === undefined ||
			body.produto.trim() === "" ||
			body.validade === "" ||
			body.quantidade === "" ||
			body.data_de_edicao === "" ||
			body.usuario_criou.trim() === "" ||
			body.usuario_editou.trim() === "" ||
			body.quantidade < 0 ||
			isValid(new Date(validade)) === false ||
			isValid(new Date(data_de_edicao)) === false
		) {
			return res.status(400).json({ mensage: "Preencha todos os campos." });
		}
	} catch {
		return res.status(400).json({ mensage: "Data inválida." });
	}
	next();
};
const AtualizarProduto = (req, res, next) => {
	const { body } = req;
	if (body.validade) {
		try {
			const validade = format(new Date(body.validade), "yyyy/MM/dd");
			if (isValid(new Date(validade)) === false) {
				return res.status(400).json({ mensage: "Data inválida" });
			}
		} catch {
			return res.status(400).json({ mensage: "Data inválida." });
		}
	}

	next();
};
module.exports = { AdicionarProduto, AtualizarProduto };
