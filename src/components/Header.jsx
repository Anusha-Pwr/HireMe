import React from "react";
import { Link } from "react-router-dom";
import {Button} from "../components/ui/button";

const Header = () => {
  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link>
          <img src="/hireme-logo.png" alt="logo image" className="h-20" />
        </Link>
        <Button variant="outline">Login</Button>
      </nav>
    </>
  );
};

export default Header;
