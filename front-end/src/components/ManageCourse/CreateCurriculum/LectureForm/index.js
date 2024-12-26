import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import Button from "src/components/Button";
import DropdownInput from "src/components/DropdownInput";
import Input from "src/components/Input";

import { addLecture, editLecture } from "redux/slice/course";

// Function to extract video ID from YouTube URL
const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Function to format duration from YouTube API response
const formatDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = (match[1] || "").replace("H", "");
  const minutes = (match[2] || "").replace("M", "");
  const seconds = (match[3] || "").replace("S", "");

  const paddedHours = hours.padStart(2, "0");
  const paddedMinutes = minutes.padStart(2, "0");
  const paddedSeconds = seconds.padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

const LectureForm = () => {
  const dispatch = useDispatch();
  const { isEditMode, currLectureData } = useSelector(
    (state) => state.courses.course,
  );

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      class: "",
      duration: "",
      embedUrl: "",
    },
  });

  // Watch embedUrl field for changes
  const embedUrl = watch("embedUrl");

  useEffect(() => {
    if (embedUrl) {
      const videoId = getYouTubeVideoId(embedUrl);
      if (videoId) {
        // Fetch video duration from YouTube API
        fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.items && data.items[0]) {
              const duration = formatDuration(
                data.items[0].contentDetails.duration,
              );
              setValue("duration", duration);
            }
          })
          .catch((error) =>
            console.error("Error fetching video duration:", error),
          );
      }
    }
  }, [embedUrl, setValue]);

  useEffect(() => {
    if (isEditMode) {
      setValue("title", currLectureData.title, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("class", currLectureData.class, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("duration", currLectureData.duration, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("embedUrl", currLectureData.embedUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [isEditMode, setValue, currLectureData]);

  return (
    <div className="flex flex-col gap-3 h-min">
      <h2 className="text-lg font-semibold">
        {isEditMode ? "Edit Chapter Item" : "Add new Chapter Item"}
      </h2>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-2"
      >
        <Controller
          name="title"
          control={control}
          rules={{
            required: "Title is required.",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters.",
            },
            maxLength: {
              value: 80,
              message: "Title must be maximum 80 characters.",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              label="Title"
              type="text"
              placeholder="Title"
              error={!!error}
              helperText={error ? error.message : null}
              required
              {...field}
              className="w-full"
            />
          )}
        />

        <div className="flex items-center gap-5">
          <Controller
            name="class"
            control={control}
            rules={{
              required: "Class Type is required.",
            }}
            render={({ field, fieldState: { error } }) => (
              <DropdownInput
                label="Class Type"
                data={[{ title: "Lecture" }, { title: "Quiz" }]}
                error={!!error}
                helperText={error ? error.message : null}
                required
                value={field.value}
                handleChange={field.onChange}
                valueExtractor={(datum) => datum.title}
                labelExtractor={(datum) => datum.title}
                containerClass="w-1/2 mt-3"
              />
            )}
          />

          <Controller
            name="duration"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                label="Duration (Auto-detected)"
                type="time"
                inputProps={{ step: 2 }}
                placeholder="duration"
                error={!!error}
                helperText={error ? error.message : null}
                disabled
                {...field}
                className="w-1/2"
              />
            )}
          />
        </div>

        <Controller
          name="embedUrl"
          control={control}
          rules={{
            required: "YouTube URL is required.",
            pattern: {
              value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
              message: "Please enter a valid YouTube URL",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              label="YouTube URL"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              error={!!error}
              helperText={error ? error.message : null}
              required
              {...field}
              className="w-full"
            />
          )}
        />
      </form>

      <Button
        label={isEditMode ? "Update" : "Add"}
        className="w-min ml-auto"
        onClick={handleSubmit((data) => {
          isEditMode
            ? dispatch(editLecture({ data }))
            : dispatch(addLecture({ data }));

          reset();
        })}
      />
    </div>
  );
};

export default LectureForm;
