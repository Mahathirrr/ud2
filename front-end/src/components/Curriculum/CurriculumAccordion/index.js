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
import { calculateTotalDuration, getChapterDuration } from "src/utils/duration";

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
  const [activeChapter, setActiveChapter] = useState(null);

  const { data } = useSelector((state) => state.courses.course);

  useEffect(() => {
    if (activeChapterItem) {
      const chapterIndex = data?.curriculum.findIndex((chapter) =>
        chapter.content.some((item) => item._id === activeChapterItem._id),
      );
      if (chapterIndex !== -1 && !expanded.includes(chapterIndex)) {
        setExpanded([...expanded, chapterIndex]);
        setActiveChapter(chapterIndex);
      }
    }
  }, [activeChapterItem, data?.curriculum, expanded]);

  const handleAccordionChange = (index) => (event, newExpanded) => {
    setExpanded(
      newExpanded ? [...expanded, index] : expanded.filter((i) => i !== index),
    );
  };

  const renderLectures = (lectures, chapterIndex) => {
    return lectures.map((lecture, index) => {
      const handleClick = (event) => {
        if (viewOnly) {
          event.stopPropagation();
          handleItemClick(lecture);
        }
      };

      return (
        <AccordionDetails
          className={classnames({ "cursor-pointer": viewOnly })}
          onClick={handleClick}
          key={lecture._id || index}
        >
          <ChapterItem
            lecture={lecture}
            active={activeChapterItem?._id === lecture._id}
            chapterIndex={chapterIndex}
            lectureIndex={index}
            viewOnly={viewOnly}
          />
        </AccordionDetails>
      );
    });
  };

  const renderChapter = (chapter, index) => {
    const totalLectures = chapter.content.length;
    const chapterDuration = calculateTotalDuration(chapter.content);
    const totalDuration = getChapterDuration(chapterDuration);
    const lectureText = totalLectures === 1 ? "lecture" : "lectures";

    return (
      <div className="border border-solid border-border" key={index}>
        <Accordion
          expanded={expanded.includes(index)}
          onChange={handleAccordionChange(index)}
          TransitionProps={{ unmountOnExit: true }}
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
                {totalDuration && <p>• {totalDuration}</p>}
              </div>
            </div>
          </AccordionSummary>
          {chapter?.content && renderLectures(chapter.content, index)}
        </Accordion>
      </div>
    );
  };

  return (
    <div>
      {data?.curriculum.map((chapter, index) => renderChapter(chapter, index))}
    </div>
  );
}

CurriculumAccordion.propTypes = {
  viewOnly: PropTypes.bool,
  handleItemClick: PropTypes.func,
  activeChapterItem: PropTypes.object,
};
