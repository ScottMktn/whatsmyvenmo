import {
  ArrowPathIcon,
  BarsArrowUpIcon,
  KeyIcon,
  PaperAirplaneIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import BasePage from "../../components/shared/BasePage";
import FloatingNav from "../../components/shared/FloatingNav";

interface TripPageProps {}

const TripPage = (props: TripPageProps) => {
  const {} = props;
  const router = useRouter();
  const [showSelectTrip, setShowSelectTrip] = useState(false);
  const [tripKey, setTripKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const supabaseClient = useSupabaseClient();

  const submitTripKey = async () => {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("trips")
      .select("*")
      .eq("id", tripKey);

    if (data) {
      router.push(`/trip/${tripKey}`);
    } else {
      setErrorMessage("Invalid trip key");
    }
    setLoading(false);
  };

  return (
    <BasePage
      metaData={{ title: "Whats My Venmo | Calculate" }}
      className="min-h-screen sm:px-20 max-w-5xl mx-auto"
    >
      <div className="p-4">
        <p className="mt-2 sm:mt-8 text-2xl text-left font-semibold">
          Trip Calculator
        </p>
        <p className="mt-2 text-lg text-left font-light max-w-xl">
          This calculator is ideal for trips/events with multiple people where
          each person has spent different amounts
        </p>
        <button
          className="mt-8 flex flex-row gap-4 px-6 py-4 rounded-lg border border-gray-300 text-xl text-black hover:bg-gray-100"
          onClick={() => router.push("/trip/calculate")}
        >
          <p className="font-bold">New Trip</p>
          <p className="font-light hidden sm:block">
            Create a new trip and calculate the total amount owed
          </p>
          <p className="font-light block sm:hidden">Create a new trip</p>
        </button>
        <button
          className="mt-8 flex flex-row gap-4 px-6 py-4 rounded-lg border border-gray-300 text-xl text-black hover:bg-gray-100"
          onClick={() => setShowSelectTrip(true)}
        >
          <p className="font-bold">Existing Trip</p>
          <p className="font-light hidden sm:block">
            Select an existing trip via a trip key
          </p>
          <p className="font-light block sm:hidden">View trip via key</p>
        </button>
        {showSelectTrip && (
          <>
            <label
              htmlFor="trip-key"
              className="block text-sm font-medium text-gray-700 mt-8"
            >
              Enter your trip key below
            </label>
            <div className="mt-1 flex rounded-lg max-w-xl">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="trip-key"
                  id="trip-key"
                  className="block w-full rounded-md border border-gray-300 pl-10 sm:text-md"
                  placeholder="Trip Key Here"
                  value={tripKey}
                  onChange={(e) => setTripKey(e.target.value)}
                />
              </div>
              <button
                className="ml-4 flex rounded-md bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-700"
                onClick={() => submitTripKey()}
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mt-0.5 mr-2 animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="text-white w-4 h-4 mt-1 mr-2" />
                    Go
                  </>
                )}
              </button>
            </div>
            <p className="block text-sm font-medium text-red-500 mt-1">
              {errorMessage}
            </p>
          </>
        )}
      </div>
      <FloatingNav />
    </BasePage>
  );
};

export default TripPage;
