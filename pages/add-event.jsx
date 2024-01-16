import { Fragment, useEffect, useRef, useState } from "react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import Swal from "sweetalert2";
import Link from "next/link";
import "tippy.js/dist/tippy.css";
import sortBy from "lodash/sortBy";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { getSession } from "next-auth/react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import IconX from "@/components/Icon/IconX";
import ImagePicker from "@/components/image-picker/ImagePicker";
import Image from "next/image";
import IconPencil from "@/components/Icon/IconPencil";
import IconTrashLines from "@/components/Icon/IconTrashLines";
import Tippy from "@tippyjs/react";
import AllEvents from "@/components/data-tables/AllEvents";
import { useRouter } from "next/router";

const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const AddEventPage = (props) => {
  const [modal1, setModal1] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const eventNameInputRef = useRef();
  const eventSlugInputRef = useRef();

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

  useEffect(() => {
    const getAdminSession = async () => {
      const session = await getSession();

      if(session.user.name !== 'admin') {
        signOut();
      }
    }

    getAdminSession()
  },  []);

  const submitFormHandler = async (event) => {
    event.preventDefault();

    const eventName = eventNameInputRef.current.value;
    const eventSlug = eventSlugInputRef.current.value;

    if (eventName.trim() === "" || eventSlug.trim() === "") {
      setErrorMessage("Please enter all the input fields");
    }

    const data = {
      eventName,
      eventSlug,
    };
    // const formData = new FormData();
    // formData.append("eventTitle", eventTitle);
    // formData.append("eventName", eventName);
    // formData.append("eventDate", eventDate);
    // formData.append("eventLocation", eventLocation);
    //formData.append("eventImage", eventImage);

    const response = await fetch("/api/events/create-event", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        //"Content-Type": "multipart/form-data;  boundary=MINE_BOUNDARY",
      },
    });

    if (!response.ok) {
      response.json().then((data) => setErrorMessage(data.message));
    }

    if (response.ok) {
      eventNameInputRef.current.value = "";
      eventSlugInputRef.current.value = "";
      response.json().then((data) => submitForm(data.message));
    }
  };

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
            <span>Add Event</span>
          </li>
        </ul>

        <div className="pt-5">
          <div className="mb-6 grid gap-6 xl:grid-cols-5">
            <div className="panel h-full xl:col-span-2">
              {errorMessage && (
                <p className="mb-5 text-red-600">{errorMessage}</p>
              )}
              <form className="space-y-5" onSubmit={submitFormHandler}>
                <div>
                  <label htmlFor="eventName">Event Name</label>
                  <input
                    id="eventName"
                    type="text"
                    name="eventName"
                    placeholder="Enter Event Name"
                    className="form-input"
                    ref={eventNameInputRef}
                  />
                </div>
                <div>
                  <label htmlFor="eventSlug">
                    Event Slug
                  </label>
                  <input
                    id="eventSlug"
                    type="text"
                    name="eventSlug"
                    placeholder="Enter Event Slug"
                    className="form-input"
                    ref={eventSlugInputRef}
                  />
                </div>
                {/* <div>
                  <label htmlFor="eventDate">Event Date</label>
                  <input
                    id="eventDate"
                    type="text"
                    name="eventDate"
                    className="form-input"
                    ref={eventDateInputRef}
                  />
                </div> */}
                {/* <div>
                  <label htmlFor="date">Event Date</label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    className="form-input"
                    ref={dateInputRef}
                  />
                </div>
                <div>
                  <label htmlFor="eventLocation">Event Location</label>
                  <input
                    id="eventLocation"
                    type="text"
                    name="eventLocation"
                    placeholder="Enter Event Location"
                    className="form-input"
                    ref={eventLocationInputRef}
                  />
                </div>
                <div>
                  <input
                    type="hidden"
                    name="eventImage"
                    value={imagePath}
                    ref={eventImageInputRef}
                  /> */}
                {/* <div className="mb-5">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setModal1(true)}
                      >
                        Add Image
                      </button>
                      {imagePath && (
                        <Image
                          src={`https://construction-network-bucket.s3.ap-south-1.amazonaws.com/${imagePath}`}
                          width={150}
                          height={140}
                          alt={imagePath}
                          className="mx-2"
                        />
                      )}
                      {imagePath && (
                        <span onClick={emptyImagePath}>
                          <IconX />
                        </span>
                      )}
                    </div>
                    <Transition appear show={modal1} as={Fragment}>
                      <Dialog
                        as="div"
                        open={modal1}
                        onClose={() => setModal1(false)}
                      >
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                          <div className="flex min-h-screen items-start justify-center px-4">
                            <Transition.Child
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0 scale-95"
                              enterTo="opacity-100 scale-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100 scale-100"
                              leaveTo="opacity-0 scale-95"
                            >
                              <Dialog.Panel
                                as="div"
                                className="panel my-8 w-full max-w-screen-2xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark"
                              >
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                  <div className="text-lg font-bold">Media</div>
                                  <button
                                    type="button"
                                    className="text-white-dark hover:text-dark"
                                    onClick={() => setModal1(false)}
                                  >
                                    <IconX />
                                  </button>
                                </div>
                                <div className="p-5">
                                  <ImagePicker
                                    images={props.contents}
                                    getImage={getImage}
                                  />
                                  <div className="mt-8 flex items-center justify-end">
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger"
                                      onClick={() => setModal1(false)}
                                    >
                                      Discard
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                      onClick={() => setModal1(false)}
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </Dialog.Panel>
                            </Transition.Child>
                          </div>
                        </div>
                      </Dialog>
                    </Transition>
                  </div>
                </div> */}
                {/* <div>
                  <label htmlFor="eventImage">Event Image</label>
                  <input
                    id="eventImage"
                    type="file"
                    name="eventImage"
                    className="form-input"
                    ref={eventImageInputRef}
                  />
                </div> */}
                <button type="submit" className="btn btn-primary !mt-6">
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div>
            <AllEvents />
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
// console.log(session)
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
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

// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });

//   const command = new ListObjectsV2Command({
//     Bucket: "construction-network-bucket",
//     MaxKeys: 1,
//   });

//   let isTruncated = true;

//   console.log("Your bucket contains the following objects:\n");
//   let contents = [];
//   let data = {};

//   while (isTruncated) {
//     const { Contents, IsTruncated, NextContinuationToken } = await client.send(
//       command
//     );
//     //const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
//     //contents += contentsList + "\n";
//     Contents.map((content) => contents.push(content.Key));
//     isTruncated = IsTruncated;
//     command.input.ContinuationToken = NextContinuationToken;
//   }

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/auth/login",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { session, contents },
//   };
// }

export default AddEventPage;
