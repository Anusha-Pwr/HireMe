import { Outlet } from "react-router-dom";

import Header from "../components/Header";

export default function AppLayout() {
  return (
    <>
      <div className="background-container"></div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💖 by Anusha
      </div>
    </>
  );
}
