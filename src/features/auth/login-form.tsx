import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/logo";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const setSession = useAuthStore((state) => state.setSession);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			toast.error(error.message);
		} else {
			setSession(data.session);
			toast.success("Welcome back!");
			navigate({ to: "/posts" });
		}
		setLoading(false);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="w-full border-border">
				<CardHeader className="space-y-3 text-center pb-4">
					<div>
						<CardTitle className="text-xl">Welcome back</CardTitle>
						<CardDescription className="mt-1 text-sm">
							Sign in to continue
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="pt-2">
					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-1.5">
							<Label htmlFor="email" className="text-sm">
								Email
							</Label>
							<Input
								id="email"
								placeholder="you@example.com"
								required
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-10"
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="password" className="text-sm">
								Password
							</Label>
							<Input
								id="password"
								required
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-10"
							/>
						</div>
						<Button className="w-full h-10" type="submit" disabled={loading}>
							{loading ? (
								"Signing in..."
							) : (
								<>
									Sign in
									<ArrowRight className="w-4 h-4 ml-1.5" />
								</>
							)}
						</Button>
						<p className="text-center text-sm text-muted-foreground pt-1">
							Don't have an account?{" "}
							<button
								type="button"
								className="text-primary hover:underline font-medium"
								onClick={() => navigate({ to: "/register" })}
							>
								Sign up
							</button>
						</p>
					</form>
				</CardContent>
			</Card>
		</motion.div>
	);
}
