/**
 * my files
 * shared files
 * links
 * activity
 * setting
 * upload
 */
import { useState } from "react";
import { Files, Share2, Link as LinkIcon, Activity, Cog } from "lucide-react";

const links = [
  { name: "Files", path: "/files", icon: <Files /> },
  { name: "Share", path: "/share", icon: <Share2 /> },
  { name: "Link", path: "/link", icon: <LinkIcon /> },
  { name: "Activity", path: "/activity", icon: <Activity /> },
  { name: "Settings", path: "/settings", icon: <Cog /> },
];

const Sidebar = () => {
  const [active, setActive] = useState("/files");

  return (
    <>
      {/* mobile side bar */}
      <div className="fixed bottom-0 w-full h-16 border-t border-slate-500 lg:hidden ">
        <div className="bg-[#FFFFFF] opacity-5 w-full h-full absolute" />
        <div className="flex p-4 justify-between">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={() => setActive(link.path)}
              className={`flex flex-col items-center text-[#42B8AA] hover:text-black ${
                active === link.path
                  ? "bg-[#42B8AA] text-white rounded-lg p-2"
                  : ""
              }`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      {/* the desktop */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen w-16 ">
        <div className="bg-[#FFFFFF] opacity-5 w-full h-full absolute" />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">My App</h1>
          <div className="flex flex-col gap-16 p-4 justify-between items-center">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setActive(link.path)}
                className={`flex flex-col items-center text-[#42B8AA] hover:text-black ${
                  active === link.path
                    ? "bg-[#42B8AA] text-white rounded-lg p-5"
                    : ""
                }`}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
