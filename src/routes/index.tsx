import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Code2, Rocket, Sparkles, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const navigate = useNavigate();

	return (
		<div className="flex-1 flex flex-col">
			{/* Hero Section */}
			<main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
				<div className="max-w-3xl mx-auto text-center">
					<motion.h1
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-5 leading-tight"
					>
						Build apps by describing
						<br />
						<span className="text-primary">what you want</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.2 }}
						className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed"
					>
						Vexlo is the starter kit for entrepreneurs. No coding required —
						describe your features in plain English and let AI do the rest.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.3 }}
						className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 sm:mb-16"
					>
						{isAuthenticated ? (
							<Button
								size="lg"
								className="w-full sm:w-auto px-6 h-11"
								onClick={() => navigate({ to: "/posts" })}
							>
								Open Dashboard
							</Button>
						) : (
							<>
								<Button
									size="lg"
									className="w-full sm:w-auto px-6 h-11"
									onClick={() => navigate({ to: "/register" })}
								>
									<Rocket className="w-4 h-4 mr-2" />
									Start Building
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="w-full sm:w-auto px-6 h-11"
									onClick={() => navigate({ to: "/login" })}
								>
									Sign In
								</Button>
							</>
						)}
					</motion.div>

					{/* Feature Cards */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
					>
						<FeatureCard
							icon={<Zap className="w-5 h-5" />}
							title="Fast Setup"
							description="One command to start"
						/>
						<FeatureCard
							icon={<Code2 className="w-5 h-5" />}
							title="Vibe Coding"
							description="Describe, don't code"
						/>
						<FeatureCard
							icon={<Sparkles className="w-5 h-5" />}
							title="Ready to Ship"
							description="Auth & database included"
						/>
					</motion.div>
				</div>
			</main>

			{/* Footer */}
			<footer className="py-5 text-center text-sm text-muted-foreground border-t border-border">
				Made for builders 🚀
			</footer>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="p-4 sm:p-5 rounded-xl bg-card border border-border transition-colors">
			<div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
				{icon}
			</div>
			<h3 className="font-medium text-sm mb-1">{title}</h3>
			<p className="text-xs text-muted-foreground">{description}</p>
		</div>
	);
}
