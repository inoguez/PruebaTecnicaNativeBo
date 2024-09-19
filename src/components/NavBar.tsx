import React from "react";

export default function NavBar() {
	return (
		<nav className="flex gap-2 text-lg justify-center items-center h-full">
			<a className="hover:underline" href="/PruebaTecnicaNativeBo/">
				Home
			</a>
			<a className="hover:underline" href="/PruebaTecnicaNativeBo/favorites">
				Favorites
			</a>
		</nav>
	);
}
