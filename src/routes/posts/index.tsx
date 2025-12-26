import { CreatePost } from "@/features/posts/create-post";
import { PostList } from "@/features/posts/post-list";
import { useAuthStore } from "@/lib/stores/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";

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

			{/* Create post section */}
			<div className="container mx-auto py-5 max-w-2xl px-4 sm:px-6">
				<CreatePost />
			</div>

			{/* Posts list */}
			<div className="container mx-auto max-w-2xl px-4 sm:px-6 pb-8 flex-1">
				<PostList />
			</div>
		</div>
	);
}
