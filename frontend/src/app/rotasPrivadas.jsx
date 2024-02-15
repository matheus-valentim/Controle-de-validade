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
	if (typeof window !== "undefined") {
		const token = JSON.parse(localStorage.getItem("auth"));
		var auth = token ? token : false;
	}

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
			{typeof window !== "undefined" ? !auth.adminToken && null : null}
			{typeof window !== "undefined" ? auth.adminToken && children : null}
		</>
	);
};
module.exports = { checarRotas, RotaPrivada };
