import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "./hooks/use-posts";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

export function CreatePost() {
	const [content, setContent] = useState("");
	const { mutate, isPending } = useCreatePost();
	const maxLength = 500;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) return;

		mutate(content, {
			onSuccess: () => {
				setContent("");
				toast.success("Posted!");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.2 }}
		>
			<Card className="border-border">
				<CardHeader className="pb-3 pt-4 px-4">
					<CardTitle className="text-sm font-medium">New post</CardTitle>
				</CardHeader>
				<CardContent className="pt-0 px-4 pb-4">
					<form onSubmit={handleSubmit} className="space-y-3">
						<div className="relative">
							<Textarea
								placeholder="Share your progress, ideas, or questions..."
								value={content}
								onChange={(e) => setContent(e.target.value)}
								className="min-h-[80px] resize-none text-sm"
								maxLength={maxLength}
							/>
							<span
								className={`absolute bottom-2 right-2 text-xs ${
									content.length > maxLength * 0.9
										? "text-destructive"
										: "text-muted-foreground"
								}`}
							>
								{content.length}/{maxLength}
							</span>
						</div>
						<div className="flex justify-end">
							<Button
								type="submit"
								size="sm"
								disabled={isPending || !content.trim()}
							>
								{isPending ? (
									"Posting..."
								) : (
									<>
										<Send className="w-3.5 h-3.5 mr-1.5" />
										Post
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</motion.div>
	);
}
