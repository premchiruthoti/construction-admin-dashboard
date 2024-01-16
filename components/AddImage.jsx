import { useEffect, useRef, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Link from "next/link";
import ImagePicker from "@/components/image-picker/ImagePicker";
import IconX from "@/components/Icon/IconX";
import axios from "axios";
import Swal from "sweetalert2";
import EventDashboardLayout from "@/components/Layouts/EventDashboardLayout";

const AddImage = () => {
  const imageInputRef = useRef();

  const submitFormHandler = async (event) => {
    event.preventDefault();

    const image = imageInputRef.current.files[0];

    const submitForm = (values) => {
      const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
      });
      toast.fire({
        icon: "success",
        title: values,
        padding: "10px 20px",
      });
    };

    // const response = await fetch("/api/events/add-image", {
    //   method: "POST",
    //   body: image,
    //   headers: {
    //     //"Content-Type": "application/json",
    //     "Content-Type": "multipart/form-data;  boundary=MINE_BOUNDARY",
    //   },
    // });
    // console.log(response)

    const formData = new FormData();
    formData.append("image", image);

    await axios
      .post("/api/events/add-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data;  boundary=MINE_BOUNDARY",
        },
      })
      .then((data) => {
        console.log(data);
        data.statusText === "OK" ? submitForm(data.data.success) : "";
      })
      .catch((err) => console.log(err.response.data));
  };

  return (
    <>
      <div>
        <form className="space-y-5" onSubmit={submitFormHandler}>
          <div>
            <label htmlFor="image">Add Image</label>
            <input
              id="image"
              type="file"
              name="image"
              className="form-input"
              ref={imageInputRef}
            />
          </div>
          <button type="submit" className="btn btn-primary !mt-6">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default AddImage;
