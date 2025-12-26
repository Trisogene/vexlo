import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useAuthStore } from "@/lib/stores/auth";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export function RegisterForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const setSession = useAuthStore((state) => state.setSession);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Passwords don't match");
			return;
		}
		if (password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		setLoading(true);
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			toast.error(error.message);
		} else {
			const session = (data as { session?: Session })?.session ?? null;
			setSession(session);
			if (session) {
				toast.success("Account created!");
				navigate({ to: "/posts" });
			} else {
				toast.success("Check your email to verify");
				navigate({ to: "/login" });
			}
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
						<CardTitle className="text-xl">Create account</CardTitle>
						<CardDescription className="mt-1 text-sm">
							Start building your ideas
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="pt-2">
					<form onSubmit={handleRegister} className="space-y-4">
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
						<div className="space-y-1.5">
							<Label htmlFor="confirm" className="text-sm">
								Confirm password
							</Label>
							<Input
								id="confirm"
								required
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="h-10"
							/>
						</div>
						<Button className="w-full h-10" type="submit" disabled={loading}>
							{loading ? (
								"Creating..."
							) : (
								<>
									Create account
									<ArrowRight className="w-4 h-4 ml-1.5" />
								</>
							)}
						</Button>
						<p className="text-center text-sm text-muted-foreground pt-1">
							Already have an account?{" "}
							<button
								type="button"
								className="text-primary hover:underline font-medium"
								onClick={() => navigate({ to: "/login" })}
							>
								Sign in
							</button>
						</p>
					</form>
				</CardContent>
			</Card>
		</motion.div>
	);
}
