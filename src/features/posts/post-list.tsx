import { usePosts } from "./hooks/use-posts";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";

export function PostList() {
	const { data: posts, isLoading, error } = usePosts();

	// No virtualization: render posts directly
	// Simpler list rendering — variable heights handled by normal flow

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
				<Loader2 className="w-6 h-6 animate-spin mb-2" />
				<p className="text-sm">Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 text-center rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-sm">
				Error: {(error as Error).message}
			</div>
		);
	}

	if (!posts || posts.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex flex-col items-center justify-center py-12 text-center"
			>
				<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
					<MessageSquare className="w-5 h-5 text-muted-foreground" />
				</div>
				<h3 className="font-medium text-sm mb-1">No posts yet</h3>
				<p className="text-muted-foreground text-xs">
					Be the first to share something
				</p>
			</motion.div>
		);
	}

	return (
		<div className="w-full">
			<div className="space-y-3">
				{posts.map((post) => {
					const userEmail = post.users?.email || "Anonymous";
					const userName = userEmail.split("@")[0];
					const userInitial = userName.charAt(0).toUpperCase();

					return (
						<motion.div
							key={post.id}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.02 * (posts.indexOf(post) % 10) }}
						>
							<Card className="border-border">
								<CardHeader className="flex flex-row items-center gap-3 pb-2 pt-3 px-4">
									<div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
										{userInitial}
									</div>
									<div className="flex flex-col min-w-0">
										<span className="font-medium text-sm truncate">
											{userName}
										</span>
										<span className="text-xs text-muted-foreground">
											{formatRelativeTime(new Date(post.created_at))}
										</span>
									</div>
								</CardHeader>
								<CardContent className="pt-0 px-4 pb-3">
									<p className="whitespace-pre-wrap text-sm leading-relaxed">
										{post.content}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}

function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSecs = Math.floor(diffMs / 1000);
	const diffMins = Math.floor(diffSecs / 60);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffSecs < 60) return "just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;

	return date.toLocaleDateString();
}
