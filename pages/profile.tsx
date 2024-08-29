import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import BasePage from "../components/shared/BasePage";
import FloatingNav from "../components/shared/FloatingNav";
import { supabaseClient } from "../services/server/supabaseClient";
import Button from "../components/shared/Button";

interface ProfileProps {
  userTrips: any[];
}

const Profile = (props: ProfileProps) => {
  const { userTrips } = props;
  const router = useRouter();
  const user = useUser();

  return (
    <BasePage metaData={{ title: "Profile | Whats My Venmo" }}>
      <div className="px-4 py-16">
        <div className="flex w-full justify-between">
          <p className="text-xl text-left font-semibold">Your Trips</p>
          <Button
            variant="primary"
            onClick={async () => {
              if (!user) {
                alert("You must be logged in to create a trip.");
                return;
              }
              const { data, error } = await supabaseClient
                .from("trips")
                .insert({
                  user_id: user.id,
                })
                .select("*");

              if (error) {
                alert(error);
                return;
              }

              router.push(`/trip/${data[0].id}`);
            }}
          >
            Create New Trip
          </Button>
        </div>

        {userTrips.length === 0 ? (
          <div className="mt-4 relative block w-full rounded-lg border-2 border-dashed border-sky-300 p-12 text-center">
            <TruckIcon className="mx-auto h-12 w-12 text-sky-200" />
            <span className="mt-2 block text-sm font-semibold text-sky-200">
              You do not have any trips. Create one now!
            </span>
          </div>
        ) : (
          <ul role="list" className="mt-4 grid grid-cols-2 gap-4">
            {userTrips.map((trip) => (
              <button
                key={trip.id}
                className="whitespace-pre-wrap col-span-1 border border-sky-300 p-4 rounded-lg flex flex-col hover:bg-sky-500 hover:cursor-pointer"
                onClick={() => router.push(`/trip/${trip.id}`)}
              >
                <h3 className="text-lg font-semibold">{trip.name}</h3>
                <p className="text-sm text-sky-200 pt-4">
                  Created {new Date(trip.created_at).toLocaleDateString()}
                </p>
              </button>
            ))}
          </ul>
        )}
      </div>
    </BasePage>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // redirect to home page if user is not logged in
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { data, error } = await supabaseClient
    .from("trips")
    .select("*")
    .eq("user_id", session.user.id);

  if (error) {
    return {
      notFound: true, // Handle case where trip is not found
    };
  }

  return {
    props: {
      userTrips: data,
    },
  };
}

export default Profile;
