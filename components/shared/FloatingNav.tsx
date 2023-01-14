import {
  MegaphoneIcon,
  XMarkIcon,
  GlobeAltIcon,
  CalculatorIcon,
  HomeIcon,
  TruckIcon,
  FlagIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabaseClient } from "../../services/server/supabaseClient";
import Notification from "./Notification";

export default function Example() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const user = useUser();

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
                  Trip
                </button>
              </div>
              {!user && (
                <div className="text-white flex flex-row italic text-sm">
                  Make an account to save of your calculations{" "}
                  <ArrowRightIcon className="h-3 w-3 mt-1 ml-1" />
                </div>
              )}

              {user ? (
                <button
                  className="flex rounded-md bg-red-500 px-4 py-2 text-white font-medium ml-4 hover:bg-red-700"
                  onClick={() => {
                    supabaseClient.auth.signOut();
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  className="flex rounded-md bg-red-500 px-4 py-2 text-white font-medium ml-4 hover:bg-red-700"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Sign In
                </button>
              )}
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
              {user ? (
                <button
                  className="flex rounded-md bg-red-500 px-4 py-2 text-white font-medium ml-4 hover:bg-red-700"
                  onClick={() => {
                    supabaseClient.auth.signOut();
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  className="flex rounded-md bg-red-500 px-4 py-2 text-white font-medium ml-4 hover:bg-red-700"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Notification show={show} setShow={setShow} />
    </>
  );
}
