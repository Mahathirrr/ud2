import PropTypes from "prop-types";
import classnames from "classnames";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";

export default function ChapterItem(props) {
  const { lecture, active } = props;

  const getIcon = () => {
    switch (lecture.class) {
      case "Lecture":
        return <OndemandVideoOutlinedIcon fontSize="small" />;
      case "Quiz":
        return <QuizOutlinedIcon fontSize="small" />;
      case "Text":
        return <TextSnippetOutlinedIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between gap-5 items-center xl:mx-6 group">
      <div className="flex gap-5 items-center">
        {getIcon()}
        <p
          className={classnames("break-all group-hover:text-labelText", {
            "underline text-primary": active,
          })}
        >
          {lecture.title}
        </p>
      </div>
      {lecture.duration && (
        <p className="text-labelText text-sm">{lecture.duration}</p>
      )}
    </div>
  );
}

ChapterItem.propTypes = {
  lecture: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
};
