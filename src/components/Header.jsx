import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Header = () => {
  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/">
          <img src="/hireme-logo.png" alt="logo image" className="h-20" />
        </Link>
        {/* <Button variant="outline">Login</Button> */}

        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>
    </>
  );
};

export default Header;
