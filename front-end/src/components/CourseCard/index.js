import React from "react";
import Image from "next/image";
import { getYouTubeThumbnail } from "../../utils";

const CourseCard = (props) => {
  const { course, handleClick, hoverText } = props;

  return (
    <div className="relative">
      <div className="border border-solid border-border rounded-md cursor-pointer">
        <Image
          src={getYouTubeThumbnail(course.previewMedia)}
          alt={course.title}
          width="250"
          height="130"
          objectFit="cover"
        />
        <div className="px-2 pb-3">
          <h2>{course.title}</h2>
          <p className="text-labelText">{course.category}</p>
        </div>
      </div>
      <div
        className="cursor-pointer flex justify-center items-center absolute w-full h-full top-0 backdrop-blur-md opacity-0 hover:opacity-90"
        onClick={handleClick}
      >
        <p>{hoverText}</p>
      </div>
    </div>
  );
};

export default CourseCard;
