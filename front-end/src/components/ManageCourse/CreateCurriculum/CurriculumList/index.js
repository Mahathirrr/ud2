import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import Button from "src/components/Button";
import ChapterItem from "../ChapterItem";
import {
  deleteChapter,
  setCurrChapterData,
  setCurrChapterIndex,
  setCurrLectureData,
  setIsEditMode,
  setRenderChapterForm,
  setRenderLectureForm,
} from "redux/slice/course";
import { getChapterDuration } from "src/utils";

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

export default function CurriculumList() {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState([]);

  const { data, currChapterIndex } = useSelector(
    (state) => state.courses.course,
  );

  useEffect(() => {
    if (currChapterIndex !== null && !expanded.includes(currChapterIndex)) {
      setExpanded((prev) => [...prev, currChapterIndex]);
    }
  }, [currChapterIndex, expanded]);

  const handleChapterClick = (index, chapter) => {
    dispatch(setCurrChapterIndex(index));
    dispatch(setCurrChapterData(chapter));
    if (chapter.content?.[0]) {
      dispatch(setCurrLectureData(chapter.content[0]));
    }
  };

  const handleEditChapter = (e, index, chapter) => {
    e.stopPropagation();
    dispatch(setCurrChapterIndex(index));
    dispatch(setCurrChapterData(chapter));
    dispatch(setIsEditMode(true));
    dispatch(setRenderChapterForm());
  };

  const handleDeleteChapter = (e, index) => {
    e.stopPropagation();
    dispatch(deleteChapter(index));
  };

  const handleAddChapterItem = (index) => {
    dispatch(setCurrChapterIndex(index));
    dispatch(setIsEditMode(false));
    dispatch(setRenderLectureForm());
  };

  const handleAccordionChange = (index) => (event, newExpanded) => {
    if (newExpanded) {
      setExpanded([...expanded, index]);
    } else {
      setExpanded(expanded.filter((i) => i !== index));
    }
  };

  const renderChapter = (chapter, index) => {
    const totalLectures = chapter.content.length;
    const totalDuration = getChapterDuration(chapter?.duration);
    const lectureText = totalLectures === 1 ? "lecture" : "lectures";

    return (
      <div className="border border-solid border-border" key={index}>
        <Accordion
          expanded={expanded.includes(index)}
          onChange={handleAccordionChange(index)}
          TransitionProps={{ unmountOnExit: true }}
          onClick={() => handleChapterClick(index, chapter)}
        >
          <AccordionSummary>
            <div className="flex gap-5 justify-between items-center w-full mr-5">
              <div className="flex flex-col gap-1">
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
            </div>
            <div className="flex gap-3">
              <IconButton
                aria-label="edit"
                size="small"
                onClick={(e) => handleEditChapter(e, index, chapter)}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={(e) => handleDeleteChapter(e, index)}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            </div>
          </AccordionSummary>
          {chapter?.content?.map((lecture, lectureIndex) => (
            <AccordionDetails key={lectureIndex}>
              <ChapterItem
                lecture={lecture}
                chapterIndex={index}
                lectureIndex={lectureIndex}
              />
            </AccordionDetails>
          ))}
        </Accordion>
        <Button
          label="Add Chapter Item"
          variant="transparent"
          className="w-full"
          startIcon={<AddIcon />}
          onClick={() => handleAddChapterItem(index)}
        />
      </div>
    );
  };

  return (
    <>
      {data?.curriculum?.map((chapter, index) => renderChapter(chapter, index))}
    </>
  );
}
