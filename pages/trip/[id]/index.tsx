import axios from "axios";
import TripCalculator, {
  Person,
} from "../../../components/templates/trips/TripCalculator";
import { getTrip } from "../../../services/trips";

interface TripSelectPageProps {
  id: string;
  people: Person[];
}

const TripSelectPage = (props: TripSelectPageProps) => {
  const { id, people } = props;

  return (
    <>
      <TripCalculator initialPeople={people} tripId={id} />
    </>
  );
};

export async function getServerSideProps(context: any) {
  const id = context.params.id;

  const res = await axios.get(`http://localhost:3000/api/trips/${id}`);
  const data = await res.data;

  if (!data) {
    return {
      redirect: {
        destination: "/trip",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id,
      people: data.people,
    }, // will be passed to the page component as props
  };
}

export default TripSelectPage;
