import EventDashboardLayout from "@/components/Layouts/EventDashboardLayout";
import AllEvents from "@/components/data-tables/AllEvents";
import ManageEditionsTable from "@/components/data-tables/ManageEditionsDataTable";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

function ManageEditionsPage() {
  const router = useRouter();
  const eventSlug = router.query.events;

  return (
    <>
      <div className="panel mt-6">
        <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
          <h5 className="text-lg font-semibold dark:text-white-light">
            Manage Editions
          </h5>
          <Link
            href={{
              pathname: "/[events]/manage-editions/add",
              query: { events: eventSlug },
            }}
            className="btn btn-primary"
          >
            Add Edition
          </Link>
        </div>
        <ManageEditionsTable />
      </div>
    </>
  );
}

ManageEditionsPage.getLayout = (page) => {
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
    props: {},
  };
}

export default ManageEditionsPage;
