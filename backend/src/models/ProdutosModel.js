const conexao = require("./connection");
const format = require("date-fns/format");
const PegarProdutoModel = async () => {
	const [produtos] = await conexao.connection.execute(`SELECT * FROM produtos`);

	return produtos;
};

const CriarProdutos = async (produto) => {
	console.log("ISSO É UM TESTE");

	const data_de_criacao = new Date();
	const query =
		"INSERT INTO produtos(produto, validade, quantidade, data_de_edicao, data_de_criacao, usuario_criou, usuario_editou) VALUES (?, ?, ?,?,?,?,?)";
	const [produtoCriado] = await conexao.connection.execute(query, [
		produto.produto,
		format(new Date(produto.validade), "yyyy/MM/dd"),
		produto.quantidade,
		format(new Date(produto.data_de_edicao), "yyyy/MM/dd"),
		data_de_criacao,
		produto.usuario_criou,
		produto.usuario_editou,
	]);

	return { insertId: produtoCriado.insertId };
};

const DeletarProdutos = async (id) => {
	console.log(id, "AAAAAAAAAAAAAAAAAAAA");
	const [produto] = await conexao.connection.execute(
		"DELETE FROM produtos WHERE id = ?",
		[id]
	);
	console.log(produto);

	return produto;
};

const AtualizarProdutos = async (id, produto) => {
	const [dado] = await conexao.connection.execute(
		`SELECT * FROM produtos WHERE id =${id}`
	);
	console.log(dado);

	const escolhido = dado[0];
	const produto1 = () => {
		if (produto.produto && produto.produto != escolhido.produto) {
			return produto.produto;
		} else return escolhido.produto;
	};
	const validade = () => {
		if (produto.validade && produto.validade != escolhido.validade) {
			return format(new Date(produto.validade), "yyyy/MM/dd");
		} else return format(new Date(escolhido.validade), "yyyy/MM/dd");
	};
	const quantidade = () => {
		if (produto.quantidade && produto.quantidade != escolhido.quantidade) {
			return produto.quantidade;
		} else return escolhido.quantidade;
	};
	const usuario_editou = () => {
		console.log(produto.usuario_editou);
		if (
			produto.usuario_editou &&
			produto.usuario_editou != escolhido.usuario_editou
		) {
			return produto.usuario_editou;
		} else return escolhido.usuario_editou;
	};

	const query =
		"UPDATE produtos SET produto = ?, validade = ?, quantidade = ?, usuario_editou = ?, data_de_edicao = ?  WHERE id = ?";

	const [produtos] = await conexao.connection.execute(query, [
		produto1(),
		validade(),
		quantidade(),
		usuario_editou(),
		new Date(),
		id,
	]);
	return produtos;
};

module.exports = {
	PegarProdutoModel,
	DeletarProdutos,
	CriarProdutos,
	AtualizarProdutos,
};
