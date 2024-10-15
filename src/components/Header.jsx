import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const {user} = useUser();

  useEffect(() => {
    searchParams.get("sign-in");
    if (searchParams.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [searchParams]);

  function overlayClickHandler(e) {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearchParams({});
    }
  }

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/">
          <img src="/hireme-logo.png" alt="logo image" className="h-14 sm:h-20" />
        </Link>

        <div className="flex gap-4 sm:gap-8">
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="purple" className="rounded-full text-xs sm:text-sm">
                  <PenBox className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Post Job
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 sm:w-10 sm:h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10"
          onClick={overlayClickHandler}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
