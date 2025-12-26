export function Logo({ className }: { className?: string }) {
	// Prefer public /logo.png if present; fallback to inline SVG if missing
	return (
		<div className={`inline-flex items-center`}>
			<img
				src="/logo.png"
				alt="Vexlo"
				className={`${className ?? "h-9 w-auto"} rounded-md`}
				onError={(e) => {
					const target = e.currentTarget as HTMLImageElement;
					target.style.display = "none";
					const wrapper = target.parentElement;
					if (wrapper) {
						wrapper.insertAdjacentHTML(
							"beforeend",
							`\n            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" role="img" aria-label="Vexlo"><defs><linearGradient id="g2" x1="0" x2="1"><stop offset="0%" stop-color="#7C3AED" /><stop offset="100%" stop-color="#06B6D4" /></linearGradient></defs><circle cx="18" cy="18" r="16" fill="url(#g2)"/></svg>\n          `,
						);
					}
				}}
			/>
		</div>
	);
}
