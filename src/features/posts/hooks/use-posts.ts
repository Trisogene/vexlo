import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/services/api";
import type { Database } from "@/lib/database.types";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
	users: { email: string } | null;
};

export function usePosts() {
	return useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const { data } = await api.get<Post[]>(
				"/posts?select=*,users(email)&order=created_at.desc",
			);
			return data;
		},
		// Ensure we refetch when the page mounts so posts are fetched on navigation
		refetchOnMount: "always",
	});
}

export function useCreatePost() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (content: string) => {
			const { useAuthStore } = await import("@/lib/stores/auth");
			const userId = useAuthStore.getState().user?.id;

			if (!userId) throw new Error("User not found");

			const { data } = await api.post<Post>("/posts", {
				content,
				user_id: userId,
			});
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});
}
