import { useSession } from "next-auth/react";
import Navigation from "./Navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  return (
    <div className="flex h-screen w-screen flex-col items-center overflow-x-hidden bg-gray-50">
      {session.status === "authenticated" && <Navigation />}
      {children}
    </div>
  );
};

export default Layout;
