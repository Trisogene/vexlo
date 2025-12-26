import { LoginForm } from "@/features/auth/login-form";
import { useAuthStore } from "@/lib/stores/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	beforeLoad: () => {
		const { isAuthenticated } = useAuthStore.getState();
		if (isAuthenticated) {
			throw redirect({ to: "/posts" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	return (
		<div className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4">
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	);
}
