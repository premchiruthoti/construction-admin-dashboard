import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import EventDashboardLayout from "@/components/Layouts/EventDashboardLayout";
import { getSession } from "next-auth/react";
import { assignWith } from "lodash";

const CustomEditor = dynamic(
  () => {
    return import("../../../../components/custom-editor");
  },
  { ssr: false }
);

function EditEventPage() {
  const [date, setDate] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});
  const [description, setDescription] = useState();
  const [year, setYear] = useState();
  const [shortName, setShortName] = useState();
  const [editionTitle, setEditionTitle] = useState();
  const [mainTitle, setMainTitle] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [metaTitle, setMetaTitle] = useState();
  const [metaKeywords, setMetaKeywords] = useState();
  const [metaDescription, setMetaDescription] = useState();

  const dateInputRef = useRef();

  const router = useRouter();
  const eventId = router.query.eventId;

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

  const descriptionHandler = (data) => {
    setDescription(data);
  };

  console.log(date);

  useEffect(() => {
    const getEventEditionData = async () => {
      const response = await fetch(
        "http://localhost:4000/api/events/edit-editions?eventId=" + eventId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      data.map((item) => {
        setYear(item.year);
        setShortName(item.short_name);
        setEditionTitle(item.edition_title);
        setMainTitle(item.main_title);
        const startDate = item.start_date.split("T").shift();
        const endDate = item.end_date.split("T").shift();
        const defaultDate = [`${startDate}`, `${endDate}`];
        setDate(defaultDate);
        setCity(item.city);
        setCountry(item.country);
        setDescription(item.description !== null ? item.description : "");
        setMetaTitle(item.meta_title !== null ? item.meta_title : "");
        setMetaKeywords(item.meta_keywords !== null ? item.meta_keywords : "");
        setMetaDescription(
          item.meta_description !== null ? item.meta_description : ""
        );
      });
    };

    getEventEditionData();
  }, [eventId]);

  const submitFormHandler = async (event) => {
    event.preventDefault();

    console.log(dateInputRef.current.value);
    const data = {
      eventId: router.query.eventId,
      year: year,
      shortName: shortName,
      editionTitle: editionTitle,
      mainTitle: mainTitle,
      startDate: date.length > 0 ? date[0] : "",
      endDate: date.length > 0 ? date[1] : "",
      city: city,
      country: country,
      description: description,
      metaTitle: metaTitle,
      metaKeywords: metaKeywords,
      metaDescription: metaDescription,
    };

    const response = await fetch("/api/events/edit-editions", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      submitForm(data.message);
    }
  };

  return (
    <>
      <div className="panel" id="forms_grid">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">
            Manage Editions - Edit
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
          <form className="space-y-5" onSubmit={submitFormHandler}>
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
                  onChange={(e) => setYear(e.target.value)}
                  value={year}
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
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
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
                  value={editionTitle}
                  onChange={(e) => setEditionTitle(e.target.value)}
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
                  value={mainTitle}
                  onChange={(e) => setMainTitle(e.target.value)}
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
                  ref={dateInputRef}
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
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="description">Description (About)</label>
              <CustomEditor
                id="description"
                description={descriptionHandler}
                initialData={description}
              />
            </div>
            <div>
              <label htmlFor="metaTitle">Meta Title</label>
              <input
                id="metaTitle"
                type="text"
                placeholder="Enter Meta Title"
                className="form-input"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="metaKeywords">Meta Keywords</label>
              <textarea
                name="metaKeywords"
                id="metaKeywords"
                rows="5"
                className="form-input"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label htmlFor="metaDescription">Meta Description</label>
              <textarea
                name="metaDescription"
                id="metaDescription"
                rows="2"
                className="form-input"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary !mt-6">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-danger !mt-6"
                onClick={() => router.back()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

EditEventPage.getLayout = (page) => {
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
    props: {},
  };
}

export default EditEventPage;
