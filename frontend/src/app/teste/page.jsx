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
	GridToolbarColumnsButton,
	GridToolbarFilterButton,
	GridToolbarExport,
	GridToolbarDensitySelector,
	GridToolbarQuickFilter,
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
import { useRouter } from "next/navigation";

function CustomToolbar(props) {
	const { push } = useRouter();
	const { setRows, setRowModesModel, rows } = props;
	const handleClick = () => {
		const id = rows[rows.length - 1].id + 1;
		setRows((oldRows) => [
			...oldRows,
			{
				id: id,
				produto: "",
				validade: "",
				quantidade: 1,
				usuario_editou: "",
				usuario_criou: "",
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
	const logout = () => {
		localStorage.clear("auth");
		push("/login");
	};
	return (
		<GridToolbarContainer className="gridToolBar">
			<section>
				<Button onClick={handleClick} color="primary" startIcon={<AddIcon />}>
					Add Produto
				</Button>
				<GridToolbarColumnsButton />
				<GridToolbarFilterButton />
				<GridToolbarDensitySelector />
				<GridToolbarExport />
			</section>
			<div>
				<GridToolbarQuickFilter />
				<button className="btnSair" onClick={logout}>
					SAIR
				</button>
			</div>
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
		const promise = await fetch("http://localhost:3333/deletarProdutos/" + id, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${auth.adminToken}`,
			},
		});

		if (promise.ok == true) {
			setRows(rows.filter((row) => row.id !== id));
			return;
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
		{ field: "produto", headerName: "Produto", width: 370, editable: true },
		{
			field: "validade",
			headerName: "Validade",
			type: "date",
			width: 150,
			editable: true,
			valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
		},
		{
			field: "quantidade",
			headerName: "Quantidade",
			width: 150,
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
			editable: true,
			valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
		},
		{
			field: "usuario_editou",
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
			const adicionarProdutos = async (produto) => {
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
					body: JSON.stringify(produto),
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
			const novaRow = { ...updatedRow, isNew: false };
			novaRow.validade = validade;
			novaRow.data_de_criacao = dataCriacao;
			novaRow.data_de_edicao = dataEdicao;
			novaRow.id = rows[rows.length - 2].id + 1;
			novaRow.usuario_criou = user.email;
			novaRow.usuario_editou = user.email;

			const produtoAdicionado = await adicionarProdutos(novaRow);
			if (produtoAdicionado.ok == false) {
				localStorage.clear("auth");
				push("/login");
			}

			setRows(rows.map((row) => (row.id === updatedRow.id ? novaRow : row)));
			setSnackbar({ children: "Produto adicionado", severity: "success" });
			return { ...novaRow, isNew: false };
		}

		const dataEdicao =
			new Date().getFullYear() +
			"/" +
			(new Date().getMonth() + 1) +
			"/" +
			new Date().getDate();

		const novaRow = { ...updatedRow, isNew: true };

		novaRow.usuario_editou = user.email;
		novaRow.data_de_edicao = dataEdicao;

		if (!user.email) {
			const email = localStorage.getItem("email");
			novaRow.usuario_editou = email;
		}
		const editarProdutos = async () => {
			const novoToken = setarTokenLocal();

			setLoading(true);
			const data = await fetch(
				"http://localhost:3333/atualizarProdutos/" + novaRow.id,
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
					body: JSON.stringify(novaRow),
				}
			);
			setLoading(false);

			return data;
		};

		const editado = await editarProdutos();
		if (editado.ok == false) {
			localStorage.clear("auth");
			push("/login");
		}
		if (updatedRow.quantidade == "") {
			updatedRow.quantidade = 0;
		}
		setRows(rows.map((row) => (row.id === novaRow.id ? novaRow : row)));
		setSnackbar({ children: "Produto salvo", severity: "success" });

		return novaRow;
	};
	const handleProcessRowUpdateError = React.useCallback((error) => {
		setSnackbar({ children: error.message, severity: "error" });
	}, []);
	const onFilterChange = React.useCallback((filterModel) => {
		// Here you save the data you need from the filter model
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
			setLoading(false);
		};
		func();
	}, []);

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
					onFilterModelChange={onFilterChange}
					rowModesModel={rowModesModel}
					onRowModesModelChange={handleRowModesModelChange}
					onRowEditStop={handleRowEditStop}
					processRowUpdate={processRowUpdate}
					getRowId={(r) => r.id}
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
					slots={{ toolbar: CustomToolbar }}
					slotProps={{
						toolbar: {
							setRows,
							setRowModesModel,
							rows,
						},
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
