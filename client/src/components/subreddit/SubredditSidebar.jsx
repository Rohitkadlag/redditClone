// src/components/subreddit/SubredditSidebar.jsx
import { Link } from "react-router-dom";
import { UsersIcon } from "@heroicons/react/outline";
import Loading from "../common/Loading";

// function SubredditSidebar({ subreddits, loading }) {
//   if (loading) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow border border-reddit-border">
//         <h2 className="text-lg font-semibold mb-4">Popular Communities</h2>
//         <Loading />
//       </div>
//     );
//   }

//   if (!subreddits || subreddits.length === 0) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow border border-reddit-border">
//         <h2 className="text-lg font-semibold mb-4">Popular Communities</h2>
//         <p className="text-gray-500 text-sm">No communities found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow border border-reddit-border">
//       <h2 className="text-lg font-semibold mb-4">Popular Communities</h2>

//       <ul className="space-y-3">
//         {subreddits.map((subreddit) => (
//           <li key={subreddit._id}>
//             <Link
//               to={`/r/${subreddit.name.toLowerCase()}`}
//               className="flex items-center hover:bg-gray-50 p-2 rounded-md transition-colors"
//             >
//               <div
//                 className="w-8 h-8 rounded-full bg-cover bg-center mr-3"
//                 style={{
//                   backgroundColor: "#FF4500",
//                   backgroundImage: subreddit.icon
//                     ? `url(${subreddit.icon})`
//                     : "none",
//                 }}
//               ></div>

//               <div className="flex-1 min-w-0">
//                 <p className="font-medium truncate">r/{subreddit.name}</p>
//                 <div className="flex items-center text-xs text-gray-500">
//                   <UsersIcon className="h-3 w-3 mr-1" />
//                   {subreddit.subscribers.toLocaleString()} members
//                 </div>
//               </div>
//             </Link>
//           </li>
//         ))}
//       </ul>

//       <div className="mt-4 pt-3 border-t">
//         <Link
//           to="/subreddits"
//           className="text-sm text-reddit-orange hover:underline"
//         >
//           View All Communities
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default SubredditSidebar;

function SubredditSidebar({ subreddits, loading }) {
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-reddit-border">
        <h2 className="text-lg font-semibold mb-4">Popular Communities</h2>
        <Loading />
      </div>
    );
  }

  if (!subreddits || subreddits.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-reddit-border">
        <h2 className="text-lg font-semibold mb-4">Popular Communities</h2>
        <p className="text-gray-500 text-sm">No communities found</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-reddit-border">
      <h2 className="text-lg font-semibold mb-4">Popular Communities</h2>

      <ul className="space-y-3">
        {subreddits.map((subreddit) => (
          <li key={subreddit._id}>
            <Link
              to={`/r/${subreddit.name.toLowerCase()}`}
              className="flex items-center hover:bg-gray-50 p-2 rounded-md transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full bg-cover bg-center mr-3"
                style={{
                  backgroundColor: "#FF4500",
                  backgroundImage: subreddit.icon
                    ? `url(${subreddit.icon})`
                    : "none",
                }}
              ></div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{subreddit.name}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <UsersIcon className="h-3 w-3 mr-1" />
                  {subreddit.subscribers.toLocaleString()} members
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t">
        <Link
          to="/popular"
          className="text-sm text-reddit-orange hover:underline"
        >
          View All Communities
        </Link>
      </div>
    </div>
  );
}

export default SubredditSidebar;
