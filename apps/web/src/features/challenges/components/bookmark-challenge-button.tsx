import { useBookmarkChallenge } from "@/shared/hooks/use-bookmark-challenge"
import { Bookmark } from "lucide-react"

export const BookmarkChallengeButton = ({ challengeId }: { challengeId: string }) => {
	const {
		isPending,
		isBookmarked,
		mutate: toggleBookmark
	} = useBookmarkChallenge({ challengeId })

	return (
		<button type="button" onClick={() => toggleBookmark()} disabled={isPending}>
			{isBookmarked ? <Bookmark className="fill-white" /> : <Bookmark />}
		</button>
	)
}
