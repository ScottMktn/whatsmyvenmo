import type { NextPage } from "next";
import { useState } from "react";
import FloatingNav from "../components/shared/FloatingNav";
import BasePage from "../components/shared/BasePage";
import { CakeIcon, TruckIcon } from "@heroicons/react/24/outline";
import { clsx } from "../components/shared/clsx";
import Link from "next/link";
import { ArrowRightCircleIcon } from "@heroicons/react/20/solid";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import Button from "../components/shared/Button";

const items = [
  {
    title: "Trip Calculator",
    description: "Need to split purchases over a trip? We got you covered.",
    icon: TruckIcon,
    background: "bg-green-500",
    link: "/trip",
  },
  {
    title: "Dinner Calculator (coming soon)",
    description: "Split the dinner bill evenly between all your friends.",
    icon: CakeIcon,
    background: "bg-pink-500",
  },
];

const HomePage: NextPage = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  return (
    <BasePage className="min-h-screen">
      <section className="p-4 antialiased py-16 text-center space-y-8">
        <div className="flex flex-col space-y-8">
          <h1 className="text-6xl sm:text-8xl tracking-tight text-sky-100 font-extralight hero-font">
            Easily split expenses with friends
          </h1>
          <p className="text-xl sm:text-2xl font-light text-gray-100 tracking-tight">
            The lightweight alternative to Splitwise.
          </p>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={() => {
              if (user) {
                router.push("/profile");
              } else {
                supabase.auth.signInWithOAuth({
                  provider: "google",
                });
              }
            }}
            variant="primary"
            size="large"
          >
            Get Started
          </Button>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 pt-8">
          <div className="col-span-1 w-full h-96 bg-sky-100 flex flex-col space-y-4 items-center p-4 text-sm overflow-auto">
            <div className="h-24 w-full flex flex-col p-4">
              <p className="text-black font-bold text-left">$12.51 Total</p>
              <p className="text-black font-light text-left">
                Lunch at Tiffany's
              </p>
              <p className="text-black font-light text-left">- Scott</p>
            </div>
            <div className="h-24 w-full flex flex-col p-4">
              <p className="text-black font-bold text-left">$45.10 Total</p>
              <p className="text-black font-light text-left">
                Gas for the trip
              </p>
              <p className="text-black font-light text-left">- Jack</p>
            </div>{" "}
            <div className="h-24 w-full flex flex-col p-4">
              <p className="text-black font-bold text-left">$8.10 Total</p>
              <p className="text-black font-light text-left">
                Snacks for the road
              </p>
              <p className="text-black font-light text-left">- Emma</p>
            </div>
          </div>
          <div className="col-span-1 w-full h-96 bg-sky-300 flex items-center justify-center">
            <ArrowRightCircleIcon className="h-24 w-24 text-sky-500" />
          </div>
          <div className="col-span-1 w-full h-96 bg-sky-500 text-white flex flex-col items-center justify-center space-y-8">
            <p className="font-bold">Scott owes Jack $9.39</p>
            <p className="font-bold">Emma owes Jack $13.80</p>
          </div>
        </div>
      </section>
    </BasePage>
  );
};

export default HomePage;
