import { getSession, signOut } from "next-auth/react";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const getAdminSession = async () => {
      const session = await getSession();

      if(session.user.name !== 'admin') {
        signOut();
      }
    }

    getAdminSession()
  },  []);

  return (
    <>
      <div>
        <h1>starter page</h1>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

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

export default Index;
