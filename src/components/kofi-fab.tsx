export function KofiFab() {
	const kofiUrl = "https://ko-fi.com/danieldallimore";

	return (
		<a
			href={kofiUrl}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Support via Ko-fi"
			className="fixed right-4 bottom-6 z-50 inline-flex items-center gap-3 rounded-full bg-amber-400/95 text-black px-4 py-2 shadow-lg hover:shadow-xl transition-opacity hover:opacity-95"
		>
			<span className="text-xl">☕</span>
			<span className="hidden sm:inline font-medium">Buy me a coffee</span>
		</a>
	);
}

export default KofiFab;
