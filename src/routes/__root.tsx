import { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Toaster } from "sonner";
import { KofiFab } from "@/components/kofi-fab";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle/mode-toggle";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/stores/auth";
import { supabase } from "@/lib/supabase";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component: RootComponent,
});

function Header() {
	const navigate = useNavigate();
	const { isAuthenticated, session } = useAuthStore();
	const path = typeof window !== "undefined" ? window.location.pathname : "";

	// Hide header on auth pages
	if (path.startsWith("/login") || path.startsWith("/register")) return null;

	const handleLogout = async () => {
		await supabase.auth.signOut();
		navigate({ to: "/" });
	};

	const userEmail = session?.user?.email ?? "";
	// Get first letter of email username for cleaner initials
	const userName = userEmail.split("@")[0];
	const userInitial = userName ? userName.charAt(0).toUpperCase() : "?";

	// Ko-fi link (hardcoded)
	const kofiUrl = "https://ko-fi.com/danieldallimore";

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
			<div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
				{/* Left side - Logo */}
				<button
					type="button"
					onClick={() => navigate({ to: "/" })}
					className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
				>
					<Logo className="h-7 w-auto" />
					<span className="font-semibold text-base hidden sm:inline">
						Vexlo
					</span>
				</button>

				{/* Right side - Nav items */}
				<div className="flex items-center gap-1.5 sm:gap-2">
					{isAuthenticated ? (
						<>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<button
										type="button"
										className="rounded-full h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center transition-all hover:opacity-90 text-sm font-medium"
									>
										{userInitial}
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-52">
									<div className="px-3 py-2">
										<p className="text-sm font-medium truncate">{userName}</p>
										<p className="text-xs text-muted-foreground truncate">
											{userEmail}
										</p>
									</div>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => navigate({ to: "/posts" })}>
										<LayoutDashboard className="mr-2 h-4 w-4" />
										Dashboard
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={handleLogout}
										className="text-destructive focus:text-destructive"
									>
										<LogOut className="mr-2 h-4 w-4" />
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigate({ to: "/login" })}
								className="text-sm"
							>
								Sign in
							</Button>
							<Button
								size="sm"
								onClick={() => navigate({ to: "/register" })}
								className="text-sm"
							>
								Get Started
							</Button>
						</>
					)}
					<a
						href={kofiUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hidden sm:inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:opacity-90 transition"
						aria-label="Support via Ko-fi"
					>
						<span className="text-amber-400">☕</span>
						<span className="sr-only sm:not-sr-only">Buy me a coffee</span>
					</a>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}

function RootComponent() {
	return (
		<div className="min-h-dvh antialiased flex flex-col">
			<Header />
			<Outlet />
			<KofiFab />
			<Toaster
				theme="system"
				richColors
				position="bottom-right"
				toastOptions={{
					className: "bg-card text-card-foreground border-border",
				}}
			/>
		</div>
	);
}
