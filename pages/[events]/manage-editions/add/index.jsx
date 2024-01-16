import EventDashboardLayout from "@/components/Layouts/EventDashboardLayout";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";

const CustomEditor = dynamic(
  () => {
    return import("../../../../components/custom-editor");
  },
  { ssr: false }
);

const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIASNTMHWBPIEFLT3OT",
    secretAccessKey: "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",
  },
});

function AddEditionsPage(props) {
  const [date, setDate] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});
  const [description, setdescription] = useState();
  
  const router = useRouter();

  const descriptionHandler = (data) => {
    setdescription(data);
  };

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

  

  const yearInputRef = useRef();
  const shortNameInputRef = useRef();
  const editionTitleInputRef = useRef();
  const mainTitleInputRef = useRef();
  const cityInputRef = useRef();
  const countryInputRef = useRef();
  const metaTitleInputRef = useRef();
  const metaKeywordsInputRef = useRef();
  const metaDescriptionInputRef = useRef();

  const manageEditionsFormHandler = async (event) => {
    event.preventDefault();

    const year = yearInputRef.current.value;
    const shortName = shortNameInputRef.current.value;
    const editionTitle = editionTitleInputRef.current.value;
    const mainTitle = mainTitleInputRef.current.value;
    const city = cityInputRef.current.value;
    const country = countryInputRef.current.value;
    const metaTitle = metaTitleInputRef.current.value;
    const metaKeywords = metaKeywordsInputRef.current.value;
    const metaDescription = metaDescriptionInputRef.current.value;

    if (
      year.trim() === "" ||
      shortName.trim() === "" ||
      mainTitle.trim() === "" ||
      date.length === 0 ||
      city.trim() === 0
    ) {
      setErrorMessage({
        year: "This field is required.",
        shortName: "This field is required.",
        mainTitle: "This field is required.",
        date: "This field is required.",
        city: "This field is required.",
      });
    }

    const data = {
      slug: router.query.events,
      year: year,
      shortName: shortName,
      editionTitle: editionTitle ? editionTitle : "",
      mainTitle: mainTitle,
      startDate: date.length > 0 ? date[0] : "",
      endDate: date.length > 0 ? date[1] : "",
      city: city,
      country: country,
      description: description ? description : "",
      metaTitle: metaTitle ? metaTitle : "",
      metaKeywords: metaKeywords ? metaKeywords : "",
      metaDescription: metaDescription ? metaDescription : "",
    };

    const response = await fetch("/api/events/manage-editions", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      setErrorMessage(data);
    } else if (response.ok) {
      const data = await response.json();
      setErrorMessage({
        year: "",
        shortName: "",
        mainTitle: "",
        date: "",
        city: "",
        message: "",
      });
      yearInputRef.current.value = "";
      shortNameInputRef.current.value = "";
      editionTitleInputRef.current.value = "";
      mainTitleInputRef.current.value = "";
      cityInputRef.current.value = "";
      countryInputRef.current.value = "";
      setDate("");
      setdescription("");
      metaTitleInputRef.current.value = "";
      metaKeywordsInputRef.current.value = "";
      metaDescriptionInputRef.current.value = "";
      submitForm(data.message);
    }
  };
  return (
    <>
      <div className="panel" id="forms_grid">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">
            Manage Editions - Add
          </h5>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
        <div className="mb-5">
          {errorMessage.message && (
            <span className="text-sm text-red-600">{errorMessage.message}</span>
          )}
          <form className="space-y-5" onSubmit={manageEditionsFormHandler}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="year">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  id="year"
                  type="text"
                  placeholder="Enter Year"
                  className="form-input"
                  ref={yearInputRef}
                />
                {errorMessage.year && (
                  <span className="text-sm text-red-600">
                    {errorMessage.year}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="shortName">
                  Short Name for Display (Speakers Dropdown){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="shortName"
                  type="text"
                  placeholder="Enter short name"
                  className="form-input"
                  ref={shortNameInputRef}
                />
                {errorMessage.shortName && (
                  <span className="text-sm text-red-600">
                    {errorMessage.shortName}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="editionTitle">Edition Title (Optional)</label>
                <input
                  id="editionTitle"
                  type="year"
                  placeholder="Enter Edition Title"
                  className="form-input"
                  ref={editionTitleInputRef}
                />
              </div>
              <div>
                <label htmlFor="mainTitle">
                  Main Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="mainTitle"
                  type="text"
                  placeholder="Enter Main Title"
                  className="form-input"
                  ref={mainTitleInputRef}
                />
                {errorMessage.mainTitle && (
                  <span className="text-sm text-red-600">
                    {errorMessage.mainTitle}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              <div className="md:col-span-2">
                <label htmlFor="dates">
                  Choose Start and End Date{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Flatpickr
                  options={{
                    mode: "range",
                    dateFormat: "Y-m-d",
                  }}
                  value={date}
                  className="form-input"
                  onChange={(date) => setDate(date)}
                />
                {errorMessage.date && (
                  <span className="text-sm text-red-600">
                    {errorMessage.date}
                  </span>
                )}
              </div>

              <div className="md:col-span-1">
                <label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Enter City"
                  className="form-input"
                  ref={cityInputRef}
                />
                {errorMessage.city && (
                  <span className="text-sm text-red-600">
                    {errorMessage.city}
                  </span>
                )}
              </div>
              <div className="md:col-span-1">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  placeholder="Enter Country"
                  className="form-input"
                  ref={countryInputRef}
                />
              </div>
            </div>
            <div>
              <label htmlFor="description">Description (About)</label>
              <CustomEditor id="description" description={descriptionHandler} />
            </div>
            <div>
              <label htmlFor="metaTitle">Meta Title</label>
              <input
                id="metaTitle"
                type="text"
                placeholder="Enter Meta Title"
                className="form-input"
                ref={metaTitleInputRef}
              />
            </div>
            <div>
              <label htmlFor="metaKeywords">Meta Keywords</label>
              <textarea
                name="metaKeywords"
                id="metaKeywords"
                rows="5"
                className="form-input"
                ref={metaKeywordsInputRef}
              ></textarea>
            </div>
            <div>
              <label htmlFor="metaDescription">Meta Description</label>
              <textarea
                name="metaDescription"
                id="metaDescription"
                rows="2"
                className="form-input"
                ref={metaDescriptionInputRef}
              ></textarea>
            </div>
            

            <button type="submit" className="btn btn-primary !mt-6">
              Submit
            </button>
          </form>
        </div>
      </div>
      
    </>
  );
}

AddEditionsPage.getLayout = (page) => {
  return <EventDashboardLayout>{page}</EventDashboardLayout>;
};

export async function getServerSideProps(context) {
  console.log(context.query.events);
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?event=" + context.query.events,
        permanent: false,
      },
    };
  }

  // if (session.user.name !== 'admin') {
  //   return {
  //     redirect: {
  //       destination: "/auth/login",
  //       permanent: true,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
}

export default AddEditionsPage;
