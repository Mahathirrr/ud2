import React from "react";
import DOMPurify from "dompurify";
import VideoPlayer from "src/components/VideoPlayer";

const LectureContent = ({ lecture }) => {
  if (!lecture) return null;

  const renderContent = () => {
    switch (lecture.class) {
      case "Lecture":
      case "Quiz":
        return <VideoPlayer url={lecture.embedUrl} />;
      case "Text":
        return (
          <div
            className="prose max-w-none p-6"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(lecture.textContent),
            }}
          />
        );
      default:
        return null;
    }
  };

  return <div className="w-full">{renderContent()}</div>;
};

export default LectureContent;
