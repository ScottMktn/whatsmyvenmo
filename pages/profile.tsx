import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import BasePage from "../components/shared/BasePage";
import FloatingNav from "../components/shared/FloatingNav";
import { supabaseClient } from "../services/server/supabaseClient";

interface ProfileProps {
  userTrips: any[];
}

const Profile = (props: ProfileProps) => {
  const { userTrips } = props;
  const router = useRouter();

  return (
    <BasePage
      metaData={{ title: "Profile | Whats My Venmo" }}
      className="min-h-screen sm:px-20 max-w-5xl mx-auto"
    >
      <div className="p-4">
        <p className="mt-2 sm:mt-8 text-2xl text-left font-semibold">
          Your Trip Keys
        </p>
        {userTrips.length === 0 ? (
          <button
            onClick={() => router.push("/trip/calculate")}
            type="button"
            className="mt-4 relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              You do not have any trips. Create one now!
            </span>
          </button>
        ) : (
          <ul
            role="list"
            className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {userTrips.map((trip) => (
              <li
                key={trip.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white border border-gray-300"
              >
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-md font-medium text-gray-900">
                        {trip.trip_name}
                      </h3>
                      <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        {trip.type}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-xs text-gray-500">
                      Created on{" "}
                      {new Date(trip.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      Last updated{" "}
                      {new Date(trip.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            `https://whatsmyvenmo.com/trip/${trip.id}`
                          );

                          alert("Copied to clipboard!");
                        }}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        <ArrowTopRightOnSquareIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-3">Share</span>
                      </button>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      <Link
                        href={`/trip/${trip.id}`}
                        className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        <PaperAirplaneIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-3">View </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <FloatingNav />
    </BasePage>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      props: {
        userTrips: [],
      },
    };
  }

  const { data, error } = await supabaseClient
    .from("trips")
    .select("*")
    .eq("user_id", session.user.id);

  let trips = [...(data || [])];
  trips.forEach((trip) => {
    trip.type = "trip";
  });
  return {
    props: {
      userTrips: trips,
    },
  };
}

export default Profile;
