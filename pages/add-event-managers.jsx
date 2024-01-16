import IconCode from "@/components/Icon/IconCode";
import AllEventManagersTable from "@/components/data-tables/AllEventManagers";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

function AddEventManagers() {
  const [selectEvent, setSelectEvent] = useState([]);
  const [modal1, setModal1] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const eventSlugInputRef = useRef();
  const nameInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
    const getAdminSession = async () => {
      const session = await getSession();

      if (session.user.name !== "admin") {
        signOut();
      }
    };

    getAdminSession();
  }, []);

  useEffect(() => {
    const getAllEvents = async () => {
      const response = await fetch(
        "http://localhost:4000/api/events/create-event",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // console.log(data)
        setSelectEvent(data);
      }
    };

    getAllEvents();
  }, []);

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

  // const selectChangeHandler = (event) => {
  //   setSelectEventSlug(event.target.value);
  // };

  const submitFormHandler = async (event) => {
    event.preventDefault();

    const name = nameInputRef.current.value;
    const eventSlug = eventSlugInputRef.current.value;
    const username = usernameInputRef.current.value;
    const password = passwordInputRef.current.value;

    // console.log(eventName);

    if (
      name.trim() === "" ||
      eventSlug.trim() === "" ||
      username.trim() === "" ||
      password.trim() === ""
    ) {
      setErrorMessage("Please enter all the input fields");
    }

    const data = {
      eventSlug,
      name,
      username,
      password,
    };

    const response = await fetch("/api/events/add-event-manager", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      response.json().then((data) => setErrorMessage(data.message));
    }

    if (response.ok) {
      response.json().then((data) => submitForm(data.message));
      nameInputRef.current.value = "";
      usernameInputRef.current.value = "";
      passwordInputRef.current.value = "";
      eventSlugInputRef.current.value = "";
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
            <span>Add Event Managers</span>
          </li>
        </ul>

        <div className="pt-5">
          <div className="mb-6 grid gap-6 xl:grid-cols-5">
            <div className="panel h-full xl:col-span-2">
              {errorMessage && (
                <p className="mb-5 text-red-600">{errorMessage}</p>
              )}
              <form className="space-y-5" onSubmit={submitFormHandler}>
                <div id="tagging">
                  <label htmlFor="eventName">Event Name</label>
                  <div className="mb-5">
                    <select
                      id="eventSlug"
                      name="eventSlug"
                      className="form-select text-white-dark"
                      required
                      ref={eventSlugInputRef}
                    >
                      <option disabled value="">
                        Select an option
                      </option>
                      {selectEvent.length > 0 &&
                        selectEvent.map((item) => {
                          return (
                            <option value={item.slug} key={item.id}>
                              {item.event_name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    className="form-input"
                    required
                    ref={nameInputRef}
                  />
                </div>
                <div>
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    className="form-input"
                    required
                    ref={usernameInputRef}
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    className="form-input"
                    required
                    ref={passwordInputRef}
                  />
                </div>

                <button type="submit" className="btn btn-primary !mt-6">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="mb-6 grid gap-6 xl:grid-cols-1">
            <div className="panel h-full xl:col-span-2">
              <AllEventManagersTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  // const session = await getServerSession(context.req, context.res);

  // console.log(session);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default AddEventManagers;
