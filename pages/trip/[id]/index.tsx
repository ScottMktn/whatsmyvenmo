import { GetServerSideProps, GetServerSidePropsContext } from "next";
import TripCalculator from "../../../components/templates/trips/TripCalculator";
import BasePage from "../../../components/shared/BasePage";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface TripIdPageProps {
  tripId: string;
  tripName: string;
  expenses: any[];
}

const TripIdPage = (props: TripIdPageProps) => {
  const { tripId, tripName, expenses } = props;

  return (
    <BasePage>
      <TripCalculator
        tripId={tripId}
        tripName={tripName}
        initialValues={expenses}
      />
    </BasePage>
  );
};

export default TripIdPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  const supabase = createServerSupabaseClient(context);
  const tripId = id as string;

  // get the trip name from the data
  const { data: tripData, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single(); // assuming there's only one trip with this ID

  if (tripError) {
    return {
      notFound: true, // Handle case where trip is not found
    };
  }

  // Fetch expenses related to the trip
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select("*")
    .eq("trip_id", id);

  if (expensesError) {
    return {
      notFound: true, // Handle case where expenses data could not be fetched
    };
  }

  // Pass the data to the page via props
  return {
    props: {
      tripId,
      tripName: tripData.name || "",
      expenses: expensesData,
    },
  };
}
