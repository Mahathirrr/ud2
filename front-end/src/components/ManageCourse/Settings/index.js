import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Switch from "@mui/material/Switch";

import DropdownInput from "src/components/DropdownInput";
import FormPageLayout from "src/components/FormPageLayout";

import { getAddedInstructors } from "redux/slice/instructor";
import { updateCourse } from "redux/slice/course";

const Settings = ({ setIsPristine }) => {
  const dispatch = useDispatch();
  const {
    data,
    update: { updating },
  } = useSelector((state) => state.courses.course);
  const { loading, instructors } = useSelector((state) => state.instructor);

  useEffect(() => {
    if (!instructors.length) {
      dispatch(getAddedInstructors());
    }
  }, [dispatch, instructors]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      details: {
        instructors: "",
        published: false,
      },
    },
  });

  useEffect(() => {
    setValue("details", {
      instructors: data?.instructors[0],
      published: data?.published,
    });
  }, [data, setValue]);

  useEffect(() => {
    setIsPristine(!isDirty);
  }, [setIsPristine, isDirty]);

  const onSubmit = (formData) => {
    dispatch(
      updateCourse({
        ...formData.details,
        instructors: [formData.details.instructors],
        _id: data._id,
      }),
    );
    setIsPristine(true);
  };

  const renderField = (label, Component) => {
    return (
      <div className="grid md:grid-cols-2 items-center">
        <p className="text-labelText mb-1 md:mb-0">{label}</p>
        {Component}
      </div>
    );
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {renderField(
          "Instructor",
          <Controller
            name="details.instructors"
            control={control}
            rules={{
              required: "This field is required.",
            }}
            render={({ field, fieldState: { error } }) => (
              <DropdownInput
                data={instructors}
                loading={loading}
                error={!!error}
                helperText={error ? error.message : null}
                value={field.value}
                handleChange={field.onChange}
                valueExtractor={(i) => i._id}
                labelExtractor={(i) => i.name}
              />
            )}
          />,
        )}

        {renderField(
          "Course status",
          <Controller
            name="details.published"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-1">
                <p>Unpublished</p>
                <Switch checked={field.value} onChange={field.onChange} />
                <p>Published</p>
              </div>
            )}
          />,
        )}
      </form>
    );
  };

  return (
    <FormPageLayout
      title="Settings"
      handleSave={handleSubmit(onSubmit)}
      loading={updating}
    >
      {renderForm()}
    </FormPageLayout>
  );
};

export default Settings;
