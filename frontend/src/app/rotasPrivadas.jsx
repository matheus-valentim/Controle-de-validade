const { authContext } = require("@/contexts/authContext");
const { useRouter } = require("next/navigation");
const { useContext, useEffect } = require("react");

const rotasPublicas = [
	{
		login: "/login",
	},
];
const checarRotas = (rota) => {
	const valido = rotasPublicas.map((url) => {
		if (Object.values(url) == rota) {
			console.log("siiiiiimmmmmmmmmmm");
			return true;
		} else {
			console.log("naoooooooooooooo");
			return false;
		}
	});
	return valido[0];
};

const RotaPrivada = ({ children }) => {
	const { push } = useRouter();
	const token = JSON.parse(localStorage.getItem("auth"));
	const auth = token ? token : false;

	useEffect(() => {
		if (auth.adminToken == null || !auth) {
			push("/login");
			console.log("nao auth");
		} else {
			console.log("tem Auth");
		}
	}, [push]);

	return (
		<>
			{!auth.adminToken && null}
			{auth.adminToken && children}
		</>
	);
};
module.exports = { checarRotas, RotaPrivada };
