// src/components/discussion/DiscussionList.jsx
import DiscussionCard from "./DiscussionCard";

function DiscussionList({ discussions }) {
  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <DiscussionCard key={discussion._id} discussion={discussion} />
      ))}
    </div>
  );
}

export default DiscussionList;
