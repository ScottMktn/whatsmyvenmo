import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import TripCalculator, {
  Entry,
} from "../../../components/templates/trips/TripCalculator";
import { supabaseClient } from "../../../services/server/supabaseClient";

interface TripIdPageProps {
  tripId: string;
  tripName: string;
  initialEntries: Entry[] | null;
}

const TripIdPage = (props: TripIdPageProps) => {
  const { tripId, tripName, initialEntries } = props;

  return (
    <>
      <TripCalculator
        tripId={tripId}
        tripName={tripName}
        initialEntries={initialEntries || undefined}
      />
    </>
  );
};

export default TripIdPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  const { data, error } = await supabaseClient
    .from("trips")
    .select("*")
    .eq("id", id);

  let tripName = null;
  let entries = null;
  if (data) {
    tripName = data[0].trip_name;
    entries = data[0].entries;
  }

  return {
    props: {
      tripId: id,
      tripName,
      initialEntries: entries,
    },
  };
}
