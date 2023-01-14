import type { NextPage } from "next";
import { useState } from "react";
import FloatingNav from "../components/shared/FloatingNav";
import BasePage from "../components/shared/BasePage";
import { CakeIcon, TruckIcon } from "@heroicons/react/24/outline";
import { clsx } from "../components/shared/clsx";
import Link from "next/link";

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
  const [people, setPeople] = useState<string>("");

  return (
    <BasePage className="min-h-screen items-center justify-center">
      <div className="p-4 text-4xl md:text-6xl">
        <p className=" md:mt-0 text-left font-light md:font-medium md:text-center">
          Welcome to{" "}
          <span className="inline-block mt-2 md:inline md:mt-0 font-bold bg-blue-300 text-black p-2 rounded-lg">
            Whats My Venmo
          </span>
        </p>
        <p className="mt-8 text-2xl md:text-3xl text-left font-light sm:text-center">
          Need some help with math? Let us do it.
        </p>
        <ul
          role="list"
          className="max-w-3xl mx-auto mt-16 grid grid-cols-1 gap-8 border-t border-b border-gray-200 py-6 sm:grid-cols-2"
        >
          {items.map((item, itemIdx) => (
            <li key={itemIdx} className="flow-root">
              <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-200">
                <div
                  className={clsx(
                    item.background,
                    "flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-lg"
                  )}
                >
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    <Link href={item.link || ""} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <span>{item.title}</span>
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <FloatingNav />
    </BasePage>
  );
};

export default HomePage;
