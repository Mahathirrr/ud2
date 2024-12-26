import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import ChapterItem from "../ChapterItem";
import {
  calculateTotalDuration,
  getChapterDuration,
  calculateCourseStats,
} from "src/utils/duration";
import { scrollElementIntoView } from "src/utils";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
});

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1.3),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function CurriculumAccordion(props) {
  const { viewOnly, handleItemClick, activeChapterItem } = props;
  const [expanded, setExpanded] = useState([]);

  const { data, currChapterIndex } = useSelector(
    (state) => state.courses.course,
  );

  useEffect(() => {
    setExpanded([...expanded, currChapterIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currChapterIndex]);

  const renderCourseSummary = () => {
    if (!data?.curriculum?.length) return null;

    const { totalChapters, totalLectures, totalDuration } =
      calculateCourseStats(data.curriculum);
    const chapterText = totalChapters === 1 ? "chapter" : "chapters";
    const lectureText = totalLectures === 1 ? "lecture" : "lectures";
    const duration = getChapterDuration(totalDuration);

    return (
      <div className="mb-4 text-sm text-labelText">
        <p className="flex items-center gap-2">
          <span>
            {totalChapters} {chapterText}
          </span>
          <span>•</span>
          <span>
            {totalLectures} {lectureText}
          </span>
          {duration && (
            <>
              <span>•</span>
              <span>{duration} total</span>
            </>
          )}
        </p>
      </div>
    );
  };

  const renderLectures = (lectures) => {
    return lectures.map((lecture, index) => {
      const handleClick = (event) => {
        if (viewOnly) return null;

        event.stopPropagation();
        handleItemClick(lecture);
        scrollElementIntoView(lecture._id);
      };

      return (
        <AccordionDetails
          className={classnames({ "cursor-pointer": !viewOnly })}
          id={lecture._id}
          onClick={handleClick}
          key={index}
        >
          <ChapterItem
            lecture={lecture}
            active={activeChapterItem?._id === lecture._id}
          />
        </AccordionDetails>
      );
    });
  };

  const handleChange = (index) => (event, newExpanded) => {
    if (newExpanded) {
      setExpanded([...expanded, index]);
    } else {
      const updatedExpandedItems = expanded.filter((id) => id !== index);
      setExpanded(updatedExpandedItems);
    }
  };

  const renderChapter = (chapter, index) => {
    const totalLectures = chapter.content.length;
    const chapterDuration = calculateTotalDuration(chapter.content);
    const totalDuration = getChapterDuration(chapterDuration);
    const lectureText = totalLectures === 1 ? "lecture" : "lectures";

    return (
      <div className="border border-solid border-border">
        <Accordion
          expanded={expanded.includes(index)}
          onChange={handleChange(index)}
          TransitionProps={{ unmountOnExit: true }}
          key={index}
        >
          <AccordionSummary>
            <div className="flex flex-col gap-1 w-full pl-2">
              <p className="text-body break-all font-semibold">
                {chapter.chapterTitle}
              </p>
              <div className="flex gap-2 items-center text-labelText text-sm">
                <p>
                  {totalLectures} {lectureText}
                </p>
                {totalDuration && <p>&#8226; {totalDuration}</p>}
              </div>
            </div>
          </AccordionSummary>
          {chapter?.content && renderLectures(chapter.content, index)}
        </Accordion>
      </div>
    );
  };

  const renderAccordion = () => (
    <>
      {renderCourseSummary()}
      {data?.curriculum.map((chapter, index) => renderChapter(chapter, index))}
    </>
  );

  return <div>{renderAccordion()}</div>;
}

CurriculumAccordion.propTypes = {
  activeContent: PropTypes.shape({
    chapterId: PropTypes.string,
    lectureId: PropTypes.string,
  }),
  setActiveContent: PropTypes.func,
  viewOnly: PropTypes.bool,
};
