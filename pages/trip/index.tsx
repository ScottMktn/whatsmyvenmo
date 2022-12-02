import { useRouter } from "next/router";
import BasePage from "../../components/shared/BasePage";
import FloatingNav from "../../components/shared/FloatingNav";

interface TripPageProps {}

const TripPage = (props: TripPageProps) => {
  const {} = props;
  const router = useRouter();

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

        <span className="isolate grid grid-cols-2 rounded-md shadow-sm w-full mt-16 h-56">
          <button
            onClick={() => router.push("/trip/calculate")}
            type="button"
            className="relative items-center text-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-xl font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            Calculate
          </button>

          <button
            onClick={() => router.push("/trip/select")}
            type="button"
            className="relative -ml-px items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-xl font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            Existing Trip
          </button>
        </span>
      </div>
      <FloatingNav />
    </BasePage>
  );
};

export default TripPage;
