import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../store";
import { useEffect, useRef, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import {
  setPageTitle,
  toggleLocale,
  toggleRTL,
} from "../../store/themeConfigSlice";
import { useRouter } from "next/router";
import BlankLayout from "@/components/Layouts/BlankLayout";
import IconLockDots from "@/components/Icon/IconLockDots";
import IconUser from "@/components/Icon/IconUser";

const LoginBoxed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState({});

  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const router = useRouter();

  console.log(router.query.event);
  const eventSlug = router.query.event;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Login Boxed"));
    getSession().then((session) => {
      if (session) {
        router.replace("/");
      } else {
        setIsLoading(false);
      }
    });
  }, [router, dispatch]);

  const submitForm = async (event) => {
    event.preventDefault();

    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (
      enteredUsername.trim().length === 0 ||
      enteredPassword.trim().length === 0
    ) {
      setErrorMessage({
        username: "Username is required",
        password: "Password is required",
      });
    } else {
      if (enteredUsername === "admin") {
        const result = await signIn("credentials", {
          redirect: false,
          username: enteredUsername,
          password: enteredPassword,
          slug: 'all',
        });

        if (!result.error) {
          router.replace("/");
        }

        if (result.status === 401) {
          setErrorMessage({
            auth: "Not authorized!",
          });
        }
      }
      else {
        const result = await signIn("credentials", {
          redirect: false,
          username: enteredUsername,
          password: enteredPassword,
          slug: eventSlug,
        });

        if (!result.error) {
          router.replace(`/${eventSlug}`);
        }

        if (result.status === 401) {
          setErrorMessage({
            auth: "Not authorized!",
          });
        }
      }
      
    }
  };

  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;

  const themeConfig = useSelector((state) => state.themeConfig);
  const setLocale = (flag) => {
    setFlag(flag);
    if (flag.toLowerCase() === "ae") {
      dispatch(toggleRTL("rtl"));
    } else {
      dispatch(toggleRTL("ltr"));
    }
  };
  const [flag, setFlag] = useState("");
  useEffect(() => {
    setLocale(localStorage.getItem("i18nextLng") || themeConfig.locale);
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="absolute inset-0">
        <img
          src="/assets/images/auth/bg-gradient.png"
          alt="image"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 sm:px-16 dark:bg-[#060818]">
        <img
          src="/assets/images/auth/coming-soon-object1.png"
          alt="image"
          className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
        />
        <img
          src="/assets/images/auth/coming-soon-object2.png"
          alt="image"
          className="absolute left-24 top-0 h-40 md:left-[30%]"
        />
        <img
          src="/assets/images/auth/coming-soon-object3.png"
          alt="image"
          className="absolute right-0 top-0 h-[300px]"
        />
        <img
          src="/assets/images/auth/polygon-object.svg"
          alt="image"
          className="absolute bottom-0 end-[28%]"
        />
        <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg lg:min-h-[758px] dark:bg-black/50">
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                  Sign in
                </h1>
                <p className="text-base font-bold leading-normal text-white-dark">
                  Enter your username and password to login
                </p>
                {errorMessage.auth && (
                  <p className="mt-3 text-red-700">{errorMessage.auth}</p>
                )}
                {errorMessage.username && (
                  <p className="mt-3 text-red-700">{errorMessage.username}</p>
                )}
                {errorMessage.password && (
                  <p className="mt-3 text-red-700">{errorMessage.password}</p>
                )}
              </div>
              <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                <div>
                  <label htmlFor="username">Username</label>
                  <div className="relative text-white-dark">
                    <input
                      id="username"
                      type="text"
                      placeholder="Enter Username"
                      name="username"
                      className="form-input ps-10 placeholder:text-white-dark"
                      ref={usernameInputRef}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                      <IconUser fill={true} />
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="Password">Password</label>
                  <div className="relative text-white-dark">
                    <input
                      id="Password"
                      type="password"
                      placeholder="Enter Password"
                      name="password"
                      className="form-input ps-10 placeholder:text-white-dark"
                      ref={passwordInputRef}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                      <IconLockDots fill={true} />
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-gradient !mt-6 w-full border-0 bg-purple-700 uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-purple-800 focus:ring-4 focus:ring-purple-300"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
LoginBoxed.getLayout = (page) => {
  return <BlankLayout>{page}</BlankLayout>;
};
export default LoginBoxed;
