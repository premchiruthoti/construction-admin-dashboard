import { Fragment, useEffect, useRef, useState } from "react";
import IconX from "@/components/Icon/IconX";
import EventDashboardLayout from "@/components/Layouts/EventDashboardLayout";
import Image from "next/image";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { useRouter } from "next/router";
import { Dialog, Transition, Tab } from "@headlessui/react";
import ImagePicker from "@/components/image-picker/ImagePicker";
import Swal from "sweetalert2";
import { getSession } from "next-auth/react";

const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIASNTMHWBPIEFLT3OT",
    secretAccessKey: "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",
  },
});

function UpdateimagesPage(props) {
  const [imageData, setImageData] = useState({});
  const [modal, setModal] = useState(false);
  const [key, setKey] = useState();
  const [showLinks, setShowLinks] = useState(false);
  const [eventShortName, setEventShortName] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});
  const [shortName, setShortName] = useState();
  const [altTitle, setAltTitle] = useState();

  const router = useRouter();
  const editionId = router.query.editionId;

  // const shortNameInputRef = useRef();
  // const altTitleInputRef = useRef();
  // const imagePathInputRef = useRef();

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

  const getImageKey = (key) => {
    setKey(key);
  };

  useEffect(() => {
    const getImageData = async () => {
      const response = await fetch(
        "http://localhost:4000/api/events/manage-images/edit?editionId=" +
          editionId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      data.map((item) => {
        setShortName(item.edition_id);
        setAltTitle(item.event_image_alt_text);
        setKey(item.event_image_path);
      });
    };

    getImageData();
  }, [editionId]);

  const submitFormHandler = async (event) => {
    event.preventDefault();

    if (shortName.trim() === "" || altTitle.trim() === "" || key === "") {
      setErrorMessage({
        shortName: shortName.trim() === "" ? "This field is required." : "",
        altTitle: altTitle.trim() === "" ? "This field is required." : "",
        imagePath: key.trim() === "" ? "This field is required." : "",
      });
      return;
    } else {
      const updatedData = {
        id: editionId,
        shortName,
        altTitle,
        key,
      };

      const response = await fetch("/api/events/manage-images/edit", {
        method: "PATCH",
        body: JSON.stringify(updatedData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(response.ok) {
        const data = await response.json();
        submitForm(data.message);
      }

    }
  };

  return (
    <>
      <div className="pt-5">
        <div className="mb-6 grid gap-6 xl:grid-cols-5">
          <div className="panel h-full xl:col-span-2">
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
            <form className="space-y-5" onSubmit={submitFormHandler}>
              <div>
                <label htmlFor="shortName">
                  Event Short Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="shortName"
                  type="text"
                  placeholder="Enter Alt Title"
                  className="form-input"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  // ref={shortNameInputRef}
                />
                {errorMessage.shortName && (
                  <span className="text-sm text-red-600">
                    {errorMessage.shortName}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="altTile">
                  Alt Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="altTile"
                  type="text"
                  placeholder="Enter Alt Title"
                  className="form-input"
                  value={altTitle}
                  onChange={(e) => setAltTitle(e.target.value)}
                  // ref={altTitleInputRef}
                />
                {errorMessage.altTitle && (
                  <span className="text-sm text-red-600">
                    {errorMessage.altTitle}
                  </span>
                )}
              </div>

              <div>
                <span className="text-sm text-red-600">
                  In event details in main website
                </span>
                <div className="flex gap-2">
                  <div>
                    <button
                      type="button"
                      onClick={() => setModal(true)}
                      className="btn btn-primary my-2"
                    >
                      Add Image
                    </button>
                  </div>
                  {key && (
                    <div className="flex">
                      <Image
                        width={100}
                        height={100}
                        src={`https://construction-network-bucket.s3.ap-south-1.amazonaws.com/${key}`}
                        alt=""
                      />
                      <span onClick={(e) => setKey("")}>
                        <IconX />
                      </span>
                      <input
                        type="hidden"
                        value={key === undefined ? "" : key}
                        // ref={imagePathInputRef}
                      />
                    </div>
                  )}
                </div>
                {errorMessage.imagePath && (
                  <span className="text-sm text-red-600">
                    {errorMessage.imagePath}
                  </span>
                )}
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Transition appear show={modal} as={Fragment}>
        <Dialog as="div" open={modal} onClose={() => setModal(false)}>
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
            <div className="flex min-h-screen items-center justify-center px-4">
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
                  className="panel my-8 min-h-full w-full overflow-auto rounded-lg border-0 p-0 text-black dark:text-white-dark"
                >
                  <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                    <h5 className="text-lg font-bold">Add Image</h5>
                    <button
                      type="button"
                      className="text-white-dark hover:text-dark"
                      onClick={() => setModal(false)}
                    >
                      <IconX />
                    </button>
                  </div>
                  <div className="p-5">
                    <ImagePicker
                      images={props.contents}
                      getImageKey={getImageKey}
                      showLink={setShowLinks}
                    />
                    <div className="mt-8 flex items-center justify-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => setModal(false)}
                      >
                        Discard
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={() => setModal(false)}
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
    </>
  );
}

UpdateimagesPage.getLayout = (page) => {
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

  const command = new ListObjectsV2Command({
    Bucket: "construction-network-bucket",
    MaxKeys: 1,
  });

  let isTruncated = true;

  console.log("Your bucket contains the following objects:\n");
  let contents = [];
  let data = {};

  while (isTruncated) {
    const { Contents, IsTruncated, NextContinuationToken } = await client.send(
      command
    );
    //const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
    //contents += contentsList + "\n";
    Contents.map((content) => contents.push(content.Key));
    isTruncated = IsTruncated;
    command.input.ContinuationToken = NextContinuationToken;
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
    props: { session, contents },
  };
}

export default UpdateimagesPage;
