"use client";
import { useEffect, useState, useContext } from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";
import { userContext } from "@/contexts/userContext";
import { authContext } from "@/contexts/authContext";

export default function LoginAdmin() {
	const [senha, setSenha] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const { setUser } = useContext(userContext);
	const { auth, setAuth } = useContext(authContext);

	const router = useRouter();
	const autenticar = async () => {
		const url = `http://localhost:3333/loginadmin`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ senha, email }),
		});
		const dado = await response.json();

		if (dado.status == 400) {
			setError(() => dado.message);
			return;
		}
		setUser({ ...dado, email: email });
		setAuth({ adminToken: dado.adminToken, refreshToken: dado.refreshToken });
		localStorage.setItem("email", email);
		localStorage.setItem(
			"auth",
			JSON.stringify({
				adminToken: dado.adminToken,
				refreshToken: dado.refreshToken,
			})
		);
		router.push("/teste");

		// parses JSON response into native JavaScript objects
	};
	return (
		<section className="loginAdminPage">
			<main className="loginAdmincontainer">
				<h2>Login</h2>
				<section className="loginAdmin">
					<form
						action=""
						className="loginAdminForm"
						onSubmit={(e) => e.preventDefault()}
					>
						<fieldset className="loginAdminContent">
							<label htmlFor="email">Email:</label>
							<input
								id="email"
								type="text"
								onChange={(e) => {
									setEmail(e.target.value);
								}}
							/>
							{error ? <span className="loginAdminError">{error}</span> : null}
						</fieldset>
						<fieldset className="loginAdminContent">
							<label htmlFor="senha">Senha:</label>
							<input
								id="senha"
								type="password"
								onChange={(e) => {
									setSenha(e.target.value);
								}}
							/>
							{error ? <span className="loginAdminError">{error}</span> : null}
						</fieldset>
						<button
							className="loginAdminBotao"
							onClick={(e) => {
								e.preventDefault();
								autenticar();
							}}
						>
							Confirmar
						</button>
					</form>
				</section>
			</main>
		</section>
	);
}
