import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import FloatingNav from "../components/shared/FloatingNav";
import BasePage from "../components/templates/BasePage";

const HomePage: NextPage = () => {
  const [people, setPeople] = useState<string>("");

  return (
    <BasePage className="min-h-screen items-center justify-center">
      <div className="p-4">
        <h1 className="text-6xl text-left font-light sm:font-medium sm:text-center">
          Welcome to{" "}
          <span className="font-semibold sm:bg-blue-300 sm:p-2 sm:rounded-lg text-6xl">
            Whats My Venmo
          </span>
        </h1>
        <h6 className="mt-8 text-3xl text-left font-light sm:text-center">
          Had a fun night out with friends? Let us do the math.
        </h6>
      </div>
      <FloatingNav />
    </BasePage>
  );
};

export default HomePage;
