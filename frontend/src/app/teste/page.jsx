"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./styles.scss";
import {
	GridRowModes,
	DataGrid,
	GridToolbarContainer,
	GridActionsCellItem,
	GridRowEditStopReasons,
	ptBR,
	GridToolbar,
} from "@mui/x-data-grid";

import {
	randomCreatedDate,
	randomTraderName,
	randomId,
	randomArrayItem,
} from "@mui/x-data-grid-generator";
import { UserProvider, userContext } from "@/contexts/userContext";
import moment from "moment/moment";
import { authContext } from "@/contexts/authContext";
import setarTokenLocal from "../setarToken";
import { useRouter } from "next/navigation";

const initialRows = [
	{
		id: 0,
		produto: "marcos",
		validade: randomCreatedDate(),
		criacaoData: new Date("2002/08/21"),
		quantidade: 21,
		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},
	{
		id: 1,
		produto: "marcelo",
		validade: new Date("2024/02/21"),
		criacaoData: new Date("2024/08/21"),
		quantidade: 21,

		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},
	{
		id: 2,
		produto: "mathias",
		validade: randomCreatedDate(),
		criacaoData: randomCreatedDate(),
		quantidade: 21,

		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},
	{
		id: 3,
		produto: "marlon",
		validade: randomCreatedDate(),
		criacaoData: randomCreatedDate(),
		quantidade: 21,

		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},
	{
		id: 4,
		produto: "matheus",
		validade: randomCreatedDate(),
		criacaoData: randomCreatedDate(),
		quantidade: 21,

		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},
	{
		id: 5,
		produto: "tiago",
		validade: randomCreatedDate(),
		criacaoData: randomCreatedDate(),
		quantidade: 21,

		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},
	{
		id: 6,
		produto: "carlos",
		validade: randomCreatedDate(),
		criacaoData: randomCreatedDate(),
		quantidade: 21,

		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},

	{
		id: 7,
		produto: "camilo",
		validade: randomCreatedDate(),
		criacaoData: randomCreatedDate(),
		quantidade: 21,

		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},
	{
		id: 8,
		produto: "miguel",
		validade: randomCreatedDate(),
		criacaoData: randomCreatedDate(),
		quantidade: 21,

		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},
	{
		id: 9,
		produto: "jair",
		validade: randomCreatedDate(),
		criacaoData: randomCreatedDate(),
		quantidade: 21,

		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},
	{
		id: 10,
		produto: "cristian",
		validade: randomCreatedDate(),
		criacaoData: randomCreatedDate(),
		quantidade: 21,

		edicaoData: randomCreatedDate(),
		usuario: "kant",
	},
];

function EditToolbar(props) {
	const { setRows, setRowModesModel } = props;

	const handleClick = () => {
		const id = randomId();
		setRows((oldRows) => [
			...oldRows,
			{
				id,
				produto: "",
				validade: "",
				quantidade: "",
				usuario_editou: "matheus32",
				usuario_criou: "matheus",
				data_de_criacao: new Date().toLocaleDateString(),
				data_de_edicao: new Date().toLocaleDateString(),
				isNew: true,
			},
		]);
		setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: "produto" },
		}));
	};

	return (
		<GridToolbarContainer>
			<Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
				Add Produto
			</Button>
			<GridToolbar></GridToolbar>
		</GridToolbarContainer>
	);
}

export default function FullFeaturedCrudGrid() {
	const [loading, setLoading] = React.useState(true);
	const [rows, setRows] = React.useState([]);
	const [rowModesModel, setRowModesModel] = React.useState({});
	const [snackbar, setSnackbar] = React.useState(null);
	const { user, setUser } = React.useContext(userContext);
	const { auth, setAuth } = React.useContext(authContext);
	const { push } = useRouter();

	const setarTokenLocal = () => {
		if (auth == "") {
			const token = JSON.parse(localStorage.getItem("auth"));
			if (token != null) {
				console.log("dwqnbecfivuebnvfreunfure", token.adminToken);
				setAuth(() => token);
				return token;
			}
		}
	};

	const handleCloseSnackbar = () => setSnackbar(null);
	const handleRowEditStop = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleEditClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleDeleteClick = (id) => async () => {
		console.log(auth.adminToken, "fnreoinfeiornvrjnvrbnibniog");

		const promise = await fetch("http://localhost:3333/deletarProdutos/" + id, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${auth.adminToken}`,
			},
		});
		console.log(promise.ok);
		if (promise.ok == true) {
			setRows(rows.filter((row) => row.id !== id));
		}
		localStorage.clear("auth");
		push("/login");
	};

	const handleCancelClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const editedRow = rows.find((row) => row.id === id);
		if (editedRow.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const handleRowModesModelChange = (newRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columns = [
		{ field: "produto", headerName: "Produto", width: 180, editable: true },
		{
			field: "validade",
			headerName: "Validade",
			type: "date",
			width: 180,
			editable: true,
			valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
		},
		{
			field: "quantidade",
			headerName: "Quantidade",
			width: 220,
			editable: true,
			type: "number",
		},
		{
			field: "data_de_criacao",
			headerName: "Data De Criação",
			type: "date",
			width: 180,
			editable: false,
			valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
		},

		{
			field: "data_de_edicao",
			headerName: "Data De Edição",
			type: "date",
			width: 180,
			editable: false,
			valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
		},
		{
			field: "usuario_criou",
			headerName: "Usuário",
			width: 220,
			editable: false,
		},
		{
			field: "acoes",
			type: "actions",
			headerName: "Ações",
			width: 100,
			cellClassName: "actions",
			getActions: ({ id }) => {
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<SaveIcon />}
							label="Save"
							sx={{
								color: "primary.main",
							}}
							onClick={handleSaveClick(id)}
						/>,
						<GridActionsCellItem
							icon={<CancelIcon />}
							label="Cancel"
							className="textPrimary"
							onClick={handleCancelClick(id)}
							color="inherit"
						/>,
					];
				}

				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						label="Edit"
						className="textPrimary"
						onClick={handleEditClick(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Delete"
						onClick={handleDeleteClick(id)}
						color="inherit"
					/>,
				];
			},
		},
	];
	const processRowUpdate = async (updatedRow, originalRow) => {
		if (
			updatedRow.produto.trim() == "" ||
			updatedRow.quantidade == "" ||
			updatedRow.quantidade == null ||
			updatedRow.validade == null ||
			updatedRow.validade == ""
		) {
			setSnackbar({
				children: "O campo não pode estar vazio",
				severity: "error",
			});
			return originalRow;
		}
		if (updatedRow.isNew == true) {
			const adicionarProdutos = async () => {
				const novoToken = setarTokenLocal();
				setLoading(true);
				const data = await fetch("http://localhost:3333/adicionarProdutos", {
					method: "POST",
					mode: "cors",
					cache: "no-cache",
					credentials: "same-origin",
					headers: {
						"Content-Type": "application/json",
						authorization: `Bearer ${
							auth.adminToken == undefined
								? novoToken.adminToken
								: auth.adminToken
						}`,
					},

					redirect: "follow",
					referrerPolicy: "no-referrer",
					body: JSON.stringify(novaLinha),
				});
				setLoading(false);
				return data;
			};
			const validade =
				new Date(updatedRow.validade).getFullYear() +
				"/" +
				(new Date(updatedRow.validade).getMonth() + 1) +
				"/" +
				new Date(updatedRow.validade).getDate();

			const dataCriacao =
				new Date(updatedRow.data_de_criacao).getFullYear() +
				"/" +
				(new Date(updatedRow.data_de_criacao).getMonth() + 1) +
				"/" +
				new Date(updatedRow.data_de_criacao).getDate();

			const dataEdicao =
				new Date(updatedRow.data_de_edicao).getFullYear() +
				"/" +
				(new Date(updatedRow.data_de_edicao).getMonth() + 1) +
				"/" +
				new Date(updatedRow.data_de_edicao).getDate();

			const novaLinha = { ...updatedRow };
			novaLinha.validade = validade;
			novaLinha.data_de_criacao = dataCriacao;
			novaLinha.data_de_edicao = dataEdicao;
			const produtoAdicionado = await adicionarProdutos();
			if (produtoAdicionado.ok == false) {
				localStorage.clear("auth");
				push("/login");
			}
			console.log(produtoAdicionado);
			setSnackbar({ children: "User successfully saved", severity: "success" });
			return { ...updatedRow, isNew: false };
		}
		const editarProdutos = async () => {
			const novoToken = setarTokenLocal();
			console.log(updatedRow.isNew, auth, "frnvuierhbeuir");

			setLoading(true);
			const data = await fetch(
				"http://localhost:3333/atualizarProdutos/" + updatedRow.id,
				{
					method: "PUT",
					mode: "cors",
					cache: "no-cache",
					credentials: "same-origin",
					headers: {
						"Content-Type": "application/json",
						authorization: `Bearer ${
							auth.adminToken == undefined
								? novoToken.adminToken
								: auth.adminToken
						}`,
					},

					redirect: "follow",
					referrerPolicy: "no-referrer",
					body: JSON.stringify(updatedRow),
				}
			);
			setLoading(false);

			return data;
		};
		const editado = await editarProdutos();
		console.log(editado);
		if (editado.ok == false) {
			localStorage.clear("auth");
			push("/login");
		}
		const teste = { ...updatedRow, isNew: false };
		setRows(rows.map((row) => (row.id === updatedRow.id ? teste : row)));
		setSnackbar({ children: "Produto salvo", severity: "success" });

		return teste;
	};
	const handleProcessRowUpdateError = React.useCallback((error) => {
		setSnackbar({ children: error.message, severity: "error" });
	}, []);
	const onFilterChange = React.useCallback((filterModel) => {
		// Here you save the data you need from the filter model
		console.log(filterModel);
	}, []);
	React.useEffect(() => {
		const func = async () => {
			setLoading(true);
			const novoToken = setarTokenLocal();
			const data = await fetch("http://localhost:3333/teste", {
				headers: {
					"Content-Type": "application/json",
					authorization: `Bearer ${
						auth.adminToken == undefined
							? novoToken.adminToken
							: auth.adminToken
					}`,
				},
			});
			const linha = await data.json();
			setRows(linha);
			console.log(linha);
			setLoading(false);
		};
		func();
	}, []);
	React.useEffect(() => {
		console.log(user);
	}, [user]);
	return (
		<div>
			<Box
				sx={{
					height: "100vh",
					width: "100%",
					"& .actions": {
						color: "text.secondary",
					},
					"& .textPrimary": {
						color: "text.primary",
					},
				}}
			>
				<DataGrid
					localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
					rows={rows}
					columns={columns}
					editMode="row"
					filterMode="server"
					onFilterModelChange={onFilterChange}
					rowModesModel={rowModesModel}
					onRowModesModelChange={handleRowModesModelChange}
					onRowEditStop={handleRowEditStop}
					processRowUpdate={processRowUpdate}
					onProcessRowUpdateError={handleProcessRowUpdateError}
					getRowClassName={(params) => {
						return moment(params.row.validade).isBefore(new Date())
							? "invalido"
							: "";
					}}
					sx={{
						"& .invalido:hover": {
							backgroundColor: "rgba(255, 85, 85, 0.748)", // Or 'transparent' or whatever color you'd like
						},
					}}
					slots={{
						toolbar: EditToolbar,
						GridToolbar,
					}}
					slotProps={{
						toolbar: { setRows, setRowModesModel, showQuickFilter: true },
					}}
				/>
				{!!snackbar && (
					<Snackbar
						open
						anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
						onClose={handleCloseSnackbar}
						autoHideDuration={6000}
					>
						<Alert {...snackbar} onClose={handleCloseSnackbar} />
					</Snackbar>
				)}
			</Box>
		</div>
	);
}
