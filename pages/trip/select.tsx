import { useRouter } from "next/router";
import { useState } from "react";
import BasePage from "../../components/shared/BasePage";
import FloatingNav from "../../components/shared/FloatingNav";
import { getTrip } from "../../services/trips";

interface TripSelectPageProps {}

const TripSelectPage = (props: TripSelectPageProps) => {
  const router = useRouter();
  const [tripId, setTripId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();

  const viewTripHandler = async () => {
    const trip = await getTrip(tripId);
    if (trip) {
      router.push(`/trip/${tripId}`);
    } else {
      setErrorMessage(`Trip ID ${tripId} does not exist`);
    }
  };

  return (
    <BasePage
      metaData={{ title: "Whats My Venmo | Calculate" }}
      className="min-h-screen sm:px-36 max-w-4xl mx-auto"
    >
      <div className="p-4">
        <h1 className="mt-2 text-2xl text-left font-semibold">
          Had a long weekend trip?
        </h1>
        <h6 className="mt-2 text-lg text-left font-normal">
          Calculate who owes who what
        </h6>

        <div className="border border-gray-500 rounded-md p-2 mt-4 flex flex-col">
          <div className="flex flex-row">
            <label className="mt-1">Trip Id:</label>
            <input
              type="text"
              className="border border-black p-1 w-24 ml-2"
              onChange={(e) => setTripId(e.target.value)}
              value={tripId}
              placeholder="XXXX"
            />
          </div>
          {errorMessage && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              {errorMessage}
            </p>
          )}

          <button
            className="rounded-md bg-blue-500 px-4 py-2 mt-4 text-white font-medium mx-auto block"
            onClick={viewTripHandler}
          >
            View Trip
          </button>
        </div>
      </div>
      <FloatingNav />
    </BasePage>
  );
};

export default TripSelectPage;
