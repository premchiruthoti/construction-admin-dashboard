import { useState, Fragment, useEffect } from "react";
import EventDashboardLayout from "@/components/Layouts/EventDashboardLayout";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import ImagePicker from "@/components/image-picker/ImagePicker";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import IconX from "@/components/Icon/IconX";
import Swal from "sweetalert2";

const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
function ViewLibrary(props) {
  const [key, setKey] = useState();
  const [showLinks, setShowLinks] = useState(false);
  const [modal2, setModal2] = useState(false);

  const router = useRouter();
  const eventSlug = router.query.events;

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

  const deleteImage = async (key) => {
    console.log(key);
    const data = {
      key: key,
    };
    const response = await fetch("/api/events/delete-image", {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setModal2(false);
      submitForm(data.message);
      router.reload();
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
            <span>View Library</span>
          </li>
        </ul>
        <div className="pt-5">
          <div className="mb-6 grid gap-6 xl:grid-cols-1">
            <div className="panel h-full xl:col-span-2">
              {showLinks && (
                <div className="flex gap-2">
                  <a
                    className="btn btn-primary btn-sm"
                    href={`https://construction-network-bucket.s3.ap-south-1.amazonaws.com/${key}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Image
                  </a>
                  {/* <Link
                  href={{
                    pathname: "/[events]/add-images",
                    query: { events: eventSlug },
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Add New Image
                </Link> */}
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setModal2(true)}
                  >
                    Permanently Delete
                  </button>
                </div>
              )}

              <div className="mt-5">
                <ImagePicker
                  images={props.contents}
                  getImageKey={getImageKey}
                  showLink={setShowLinks}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={modal2} as={Fragment}>
        <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
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
                  className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark"
                >
                  <div className="flex items-center justify-end bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                    <button
                      type="button"
                      className="text-white-dark hover:text-dark"
                      onClick={() => setModal2(false)}
                    >
                      <IconX />
                    </button>
                  </div>
                  <div className="p-5">
                    <p>
                      Are you sure, you want to delete the image permanently?
                    </p>
                    <div className="mt-8 flex items-center justify-end">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setModal2(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger ltr:ml-4 rtl:mr-4"
                        onClick={() => deleteImage(key)}
                      >
                        Delete
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

ViewLibrary.getLayout = (page) => {
  return <EventDashboardLayout>{page}</EventDashboardLayout>;
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

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

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?event=" + context.query.events,
        permanent: false,
      },
    };
  }

  return {
    props: { session, contents },
  };
}

export default ViewLibrary;
