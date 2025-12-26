import { RegisterForm } from "@/features/auth/register-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/lib/stores/auth";

export const Route = createFileRoute("/register")({
	beforeLoad: () => {
		const { isAuthenticated } = useAuthStore.getState();
		if (isAuthenticated) {
			throw redirect({ to: "/posts" });
		}
	},
	component: RegisterPage,
});

function RegisterPage() {
	return (
		<div className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4">
			<div className="w-full max-w-sm">
				<RegisterForm />
			</div>
		</div>
	);
}
