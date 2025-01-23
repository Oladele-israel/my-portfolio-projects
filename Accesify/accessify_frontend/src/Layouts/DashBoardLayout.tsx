import Sidebar from "../components/DashbaordComponent/Sidebar";
import { Outlet } from "react-router-dom";

const DashBoardLayout = () => {
  return (
    <div className="flex flex-col lg:flex-row  lg:gap-1 ">
      <aside className="">
        <Sidebar />
      </aside>
      <main className="flex-1  lg:ml-16 ">
        <Outlet />
      </main>
    </div>
  );
};

export default DashBoardLayout;
