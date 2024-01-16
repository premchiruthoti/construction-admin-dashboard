import { useEffect, useRef, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Link from "next/link";
import ImagePicker from "@/components/image-picker/ImagePicker";
import IconX from "@/components/Icon/IconX";
import axios from "axios";
import Swal from "sweetalert2";
import EventDashboardLayout from "@/components/Layouts/EventDashboardLayout";
import AddImage from "@/components/AddImage";

const AddImagePage = () => {
  return (
    <>
      <div>
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link href="/" className="text-primary hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Add Images</span>
          </li>
        </ul>
        <div className="pt-5">
          <div className="mb-6 grid gap-6 xl:grid-cols-4">
            <div className="panel h-full xl:col-span-2">
              <AddImage />
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link href="/" className="text-primary hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Add Images</span>
          </li>
        </ul>
        <div className="pt-5">
          <div className="mb-6 grid gap-6 xl:grid-cols-4">
            <div className="panel h-full xl:col-span-2">
              <form className="space-y-5" onSubmit={submitFormHandler}>
                <div>
                  <label htmlFor="image">Event Image</label>
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
          </div>
        </div>
      </div> */}
    </>
  );
};

AddImagePage.getLayout = (page) => {
  return <EventDashboardLayout>{page}</EventDashboardLayout>;
};

export default AddImagePage;
