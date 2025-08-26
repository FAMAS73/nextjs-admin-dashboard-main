"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, driver, signOut } = useAuth();
  const router = useRouter();

  // Default guest user for demo mode
  const guestUser = {
    name: "Guest User",
    email: "guest@demo.com",
    img: "/images/user/user-03.png",
  };

  // Use authenticated user data if available, otherwise use guest data
  const currentUser = driver ? {
    name: driver.display_name || driver.username,
    email: user?.email || "No email",
    img: driver.avatar_url || "/images/user/user-03.png",
  } : guestUser;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
      router.push('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSignIn = () => {
    setIsOpen(false);
    router.push('/auth');
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={currentUser.img}
            className="size-12"
            alt={`Avatar of ${currentUser.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{currentUser.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={currentUser.img}
            className="size-12"
            alt={`Avatar for ${currentUser.name}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {currentUser.name}
            </div>

            <div className="leading-none text-gray-6">{currentUser.email}</div>
            {driver && (
              <div className="text-xs text-primary">
                ELO: {driver.elo_rating} • {driver.total_races} races
              </div>
            )}
            {!driver && (
              <div className="text-xs text-orange-light">
                Demo Mode - Sign in for full features
              </div>
            )}
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          {driver ? (
            <button
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              onClick={handleSignOut}
            >
              <LogOutIcon />
              <span className="text-base font-medium">Sign out</span>
            </button>
          ) : (
            <button
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] bg-primary text-white hover:bg-primary/90"
              onClick={handleSignIn}
            >
              <UserIcon />
              <span className="text-base font-medium">Sign in with Steam</span>
            </button>
          )}
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
