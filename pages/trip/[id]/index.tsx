import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import TripCalculator, {
  Entry,
} from "../../../components/templates/trips/TripCalculator";
import { supabaseClient } from "../../../services/server/supabaseClient";

interface TripIdPageProps {
  tripId: string;
  initialEntries: Entry[] | null;
}

const TripIdPage = (props: TripIdPageProps) => {
  const { tripId, initialEntries } = props;

  return (
    <>
      <TripCalculator
        tripId={tripId}
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

  let entries = null;
  if (data) {
    entries = data[0].entries;
  }

  return {
    props: {
      tripId: id,
      initialEntries: entries,
    },
  };
}
