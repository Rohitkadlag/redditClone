// src/components/discussion/DiscussionCard.jsx
import { Link } from "react-router-dom";
import { ChatIcon, UserIcon } from "@heroicons/react/outline";
import { formatDistanceToNow } from "date-fns";

function DiscussionCard({ discussion }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <Link to={`/discussions/${discussion._id}`} className="block">
        <h2 className="text-lg font-semibold mb-2">{discussion.title}</h2>

        <div className="text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <UserIcon className="h-4 w-4 mr-1" />
            Posted by u/{discussion.author.username}
            {" • "}
            {formatDistanceToNow(new Date(discussion.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <p className="text-gray-700 mb-3 line-clamp-2">{discussion.content}</p>

        <div className="flex items-center text-gray-500 text-sm">
          <ChatIcon className="h-4 w-4 mr-1" />
          {discussion.commentCount || 0} comments
        </div>
      </Link>
    </div>
  );
}

export default DiscussionCard;
