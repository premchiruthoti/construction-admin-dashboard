import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import EventDashboardLayout from "@/components/Layouts/EventDashboardLayout";
import IconPencil from "@/components/Icon/IconPencil";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import IconTrashLines from "@/components/Icon/IconTrashLines";

function ManageImagesPage(props) {
  const [eventShortName, setEventShortName] = useState([]);
  const [imagesData, setImagesData] = useState([]);

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

  useEffect(() => {
    const getImagesData = async () => {
      const imagesArray = [];
      const response = await fetch(
        `http://localhost:4000/api/events/manage-images?slug=${eventSlug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        data.map((item) => {
          imagesArray.push(item);
        });
        setImagesData(imagesArray);
      }
    };

    getImagesData();
  }, [eventSlug]);

  const isFeaturedChangeHandler = async (event, edition_id) => {
    const data = {
      editionId: edition_id,
      isFeatured: event.target.checked,
    };
    console.log(data);
    const response = await fetch("/api/events/manage-images/manage-images", {
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
      <div className="pt-5">
        <div className="mb-6 grid gap-6 xl:grid-cols-1">
          <div className="panel h-full xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">
                Manage Main Website Images
              </h5>
              <Link
                href={{
                  pathname: "/[events]/manage-images/main-website-image/add",
                  query: { events: eventSlug },
                }}
                className="btn btn-primary"
              >
                Add
              </Link>
            </div>
            <div className="table-responsive mb-5">
              <table className="table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Short Name</th>
                    <th>Image</th>
                    <th>Alt Title</th>
                    <th>Featured</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {imagesData.map((data, index) => {
                    return (
                      <tr key={data.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="whitespace-nowrap">
                            {data.edition_id}
                          </div>
                        </td>
                        <td>
                          <Image
                            src={`https://construction-network-bucket.s3.ap-south-1.amazonaws.com/${data.event_image_path}`}
                            width={100}
                            height={100}
                            alt={data.event_image_alt_text}
                          />
                        </td>
                        <td>{data.event_image_alt_text}</td>
                        <td>
                          <label className="relative h-6 w-12">
                            <input
                              type="checkbox"
                              className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                              id="custom_switch_checkbox1"
                              onChange={(event) => {
                                isFeaturedChangeHandler(event, data.id);
                              }}
                              defaultChecked={
                                data.is_featured === 1 ? true : false
                              }
                            />
                            <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                          </label>
                        </td>
                        <td className="text-center">
                          <Link
                            className="inline-block text-center text-green-500"
                            href={{
                              pathname:
                                "/[events]/manage-images/main-website-image/edit/[editionId]",
                              query: { events: eventSlug, editionId: data.id },
                            }}
                          >
                            <IconPencil />
                          </Link>
                          <Link
                            className="ml-2 inline-block text-center text-red-500"
                            href={{
                              pathname:
                                "/[events]/manage-images/main-website-image/",
                              query: { events: eventSlug },
                            }}
                          >
                            <IconTrashLines />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ManageImagesPage.getLayout = (page) => {
  return <EventDashboardLayout>{page}</EventDashboardLayout>;
};

export async function getServerSideProps(context) {
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

export default ManageImagesPage;
