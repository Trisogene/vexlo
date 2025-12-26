import { CreatePost } from "@/features/posts/create-post";
import { PostList } from "@/features/posts/post-list";
import { useAuthStore } from "@/lib/stores/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { usePosts } from "@/features/posts/hooks/use-posts";

export const Route = createFileRoute("/posts/")({
	beforeLoad: () => {
		const { isAuthenticated } = useAuthStore.getState();
		if (!isAuthenticated) {
			throw redirect({ to: "/login" });
		}
	},
	component: PostsPage,
});

function PostsPage() {
	const session = useAuthStore((s) => s.session);
	const userName = session?.user?.email?.split("@")[0] ?? "there";

	// Ensure posts are fresh when this page mounts (covers client-side navigation cases)
	const { refetch } = usePosts();
	useEffect(() => {
		void refetch();
	}, [refetch]);

	return (
		<div className="flex-1 flex flex-col">
			{/* Page header */}
			<div className="border-b border-border bg-card">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="container mx-auto py-6 sm:py-8 max-w-2xl px-4 sm:px-6"
				>
					<h1 className="text-xl sm:text-2xl font-semibold mb-1">
						Welcome back, {userName}
					</h1>
					<p className="text-sm text-muted-foreground">
						Share updates and see what others are building.
					</p>
				</motion.div>
			</div>

			{/* Scrollable content: create post + posts list */}
			<div className="flex-1 overflow-auto posts-scroll">
				<div className="container mx-auto py-5 max-w-2xl px-4 sm:px-6">
					<CreatePost />
				</div>

				<div className="container mx-auto max-w-2xl px-4 sm:px-6 pb-8">
					<PostList />
				</div>
			</div>
		</div>
	);
}
