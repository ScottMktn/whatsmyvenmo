import {
  MegaphoneIcon,
  XMarkIcon,
  GlobeAltIcon,
  CalculatorIcon,
  HomeIcon,
  TruckIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useState } from "react";
import Notification from "./Notification";

export default function Example() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 pb-2 sm:pb-5 sm:px-36">
        <div className="mx-auto max-w-4xl px-2 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-gray-900 p-2 shadow-lg sm:p-3 bg-opacity-80">
            <div className="hidden sm:flex items-center sm:px-2">
              <div className="flex w-0 flex-1 items-center">
                <button
                  className="flex rounded-md bg-black px-4 py-2 text-white font-semibold hover:bg-gray-800"
                  onClick={() => router.push("/")}
                >
                  <HomeIcon className="text-white w-4 h-4 mt-1 mr-2" />
                  Home
                </button>
                <div className="w-0.5 bg-gray-400 h-8 mx-4" />
                <button
                  className="flex rounded-md bg-black px-4 py-2 text-white font-semibold hover:bg-gray-800"
                  onClick={() => router.push("/trip")}
                >
                  <TruckIcon className="text-white w-4 h-4 mt-1 mr-2" />
                  Trip Calculator
                </button>
              </div>
              <button
                className="flex rounded-md bg-red-500 px-4 py-2 text-white font-medium ml-4 hover:bg-gray-800"
                onClick={() => {
                  navigator.clipboard.writeText(router.pathname);
                }}
              >
                Share
              </button>
            </div>
            <div className="flex sm:hidden items-center px-2">
              <div className="flex w-0 flex-1 items-center">
                <button
                  className="flex rounded-md bg-black p-2 text-white font-semibold hover:bg-gray-800"
                  onClick={() => router.push("/")}
                >
                  <HomeIcon className="text-white w-5 h-5" />
                </button>
                <div className="w-0.5 bg-gray-400 h-8 mx-4" />
                <button
                  className="flex rounded-md bg-black  p-2 text-white font-semibold hover:bg-gray-800"
                  onClick={() => router.push("/trip")}
                >
                  <TruckIcon className="text-white w-5 h-5" />
                </button>
              </div>
              <button
                className="flex rounded-md bg-red-500 px-4 py-2 text-white font-medium ml-4 hover:bg-red-800"
                onClick={() => {
                  setShow(true);
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
      <Notification show={show} setShow={setShow} />
    </>
  );
}
