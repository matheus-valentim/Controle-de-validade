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
			return true;
		} else {
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
		}
	}, [push]);

	return (
		<>
			{typeof window !== "undefined"
				? !auth.adminToken && console.log("erradoddddd")
				: null}
			{typeof window !== "undefined" ? auth.adminToken && children : null}
		</>
	);
};
module.exports = { checarRotas, RotaPrivada };
