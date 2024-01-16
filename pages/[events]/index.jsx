import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import EventDashboardLayout from "@/components/Layouts/EventDashboardLayout";

function FilteredEventsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  return (
    <>
      <h1>{router.query.events}</h1>
      <h1>Logged in</h1>
    </>
  );
}

FilteredEventsPage.getLayout = (page) => {
  return <EventDashboardLayout>{page}</EventDashboardLayout>;
};

export async function getServerSideProps(context) {
  console.log(context.query.events)
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
    props: {  },
  };
}

export default FilteredEventsPage;
