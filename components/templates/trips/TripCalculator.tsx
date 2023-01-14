import {
  CurrencyDollarIcon,
  IdentificationIcon,
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { uuid } from "uuidv4";
import { supabaseClient } from "../../../services/server/supabaseClient";
import BasePage from "../../shared/BasePage";
import FloatingNav from "../../shared/FloatingNav";

interface CalculateProps {
  tripId?: string;
  initialEntries?: Entry[];
}

interface PaymentMap {
  name: string;
  amountOwe: number;
  amountPaid: number;
}

interface Output {
  total: number;
  average: number;
  paymentMap: PaymentMap[];
  decision: Decision[];
}

interface Decision {
  payer: string;
  recipient: string;
  amount: number;
}

export interface Entry {
  id: string;
  name: string;
  description: string;
  amount: number;
}

const randomEntry: Entry = {
  id: uuid(),
  name: "",
  description: "",
  amount: 0,
};

const TripCalculator = (props: CalculateProps) => {
  const { tripId, initialEntries } = props;
  const [entries, setEntries] = useState<Entry[]>(
    initialEntries || [randomEntry]
  );
  const [output, setOutput] = useState<Output>();
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>();

  const user = useUser();
  const router = useRouter();

  const nameHandler = (id: string, value: string) => {
    const copy = [...entries];
    copy.forEach((entry) => {
      if (entry.id === id) {
        entry.name = value;
      }
    });
    setEntries(copy);
  };

  const descriptionHandler = (id: string, value: string) => {
    const copy = [...entries];
    copy.forEach((entry) => {
      if (entry.id === id) {
        entry.description = value;
      }
    });
    setEntries(copy);
  };

  const amountHandler = (id: string, value: number) => {
    const copy = [...entries];
    copy.forEach((entry) => {
      if (entry.id === id) {
        entry.amount = value;
      }
    });
    setEntries(copy);
  };

  const onCalculate = () => {
    const total = entries.reduce((result, entry) => {
      return result + entry.amount;
    }, 0);

    // flatten duplicate names
    const flattenedEntries: Entry[] = [];
    entries.forEach((entry) => {
      const found = flattenedEntries.find((e) => e.name === entry.name);
      if (found) {
        const copy = { ...found, amount: found.amount + entry.amount };
        flattenedEntries.splice(flattenedEntries.indexOf(found), 1, copy);
      } else {
        flattenedEntries.push(entry);
      }
    });

    const average = Math.round((total / flattenedEntries.length) * 100) / 100;

    const paymentMap: PaymentMap[] = [];
    flattenedEntries.forEach((entry) => {
      const diff = entry.amount - average;
      paymentMap.push({
        name: entry.name,
        amountOwe: diff,
        amountPaid: entry.amount,
      });
    });
    paymentMap.sort((a, b) => a.amountOwe - b.amountOwe);

    const decision: {
      payer: string;
      recipient: string;
      amount: number;
    }[] = [];

    const paymentMapCopy = JSON.parse(JSON.stringify(paymentMap));

    let start = 0;
    let end = paymentMapCopy.length - 1;
    while (start < end) {
      const p1 = paymentMapCopy[start];
      const p2 = paymentMapCopy[end];
      if (-p1.amountOwe > p2.amountOwe) {
        // the person who owes owes more than the person receiving
        p1.amountOwe = p1.amountOwe + p2.amountOwe;
        decision.push({
          amount: p2.amountOwe,
          payer: p1.name,
          recipient: p2.name,
        });
        end--;
      } else if (-p1.amountOwe < p2.amountOwe) {
        // the person who owes owes LESS than the person receiving
        p2.amountOwe = p1.amountOwe + p2.amountOwe;
        decision.push({
          amount: -p1.amountOwe,
          payer: p1.name,
          recipient: p2.name,
        });
        start++;
      } else {
        start++;
        end--;
        decision.push({
          amount: p2.amountOwe,
          payer: p1.name,
          recipient: p2.name,
        });
      }
    }

    setOutput({
      total,
      average,
      decision,
      paymentMap,
    });
  };

  const onSaveTrip = async () => {
    if (initialEntries) {
      setFeedbackMessage(
        "Failed to save your trip. We are adding edit support soon!"
      );
      // if we are editing a trip, we don't need to save it again
      return;
    }
    const { data, error } = await supabaseClient
      .from("trips")
      .insert([{ id: uuid(), entries, user_id: user?.id || null }])
      .select();

    if (data) {
      router.push(`/trip/${data[0].id}`);
    }
    if (error) {
      setFeedbackMessage("Failed to save your trip. Please try again");
    }
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
        {
          <p className="mt-2 text-md text-left font-light max-w-xl">
            Trip Id: {tripId}
          </p>
        }
        <p className="mt-2 text-md text-left font-light max-w-xl">
          Note: Make sure the name is exactly the same for people with multiple
          entries.
        </p>

        <div className="border border-gray-500 rounded-lg p-2 mt-4">
          <div className="p-2 pb-4">
            <div className="text-sm md:text-md text-left font-semibold flex flex-row justify-between w-full">
              <div className="flex flex-row">
                <p className="mt-0.5 md:mt-1 text-xl">Entries</p>
                <button
                  className="ml-2 md:ml-4 flex rounded-md bg-green-500 px-4 py-2 md:text-md md:px-4 md:py-2 text-white font-medium hover:bg-green-700"
                  onClick={() => {
                    setEntries((entries) =>
                      entries.concat([
                        {
                          id: uuid(),
                          name: "",
                          description: "",
                          amount: 0,
                        },
                      ])
                    );
                  }}
                >
                  <PlusIcon className="text-white w-4 h-4 mt-0.5 mr-1" />
                  Add
                </button>
              </div>
            </div>
            {entries.length > 0 && (
              <div className="space-y-6 md:space-y-4 mt-2 divide-y-2 divide-black md:divide-none">
                {entries.map((entry, idx) => (
                  <div
                    className="pt-6 md:pt-2 grid grid-cols-12 gap-4"
                    key={idx}
                  >
                    <div className="col-span-6 md:col-span-3 relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                        <IdentificationIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        type="text"
                        className="border border-gray-300 w-full rounded-md py-1 h-10 pl-8"
                        onChange={(e) => nameHandler(entry.id, e.target.value)}
                        placeholder="Enter Name"
                        value={entry.name}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2 relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                        <CurrencyDollarIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        type="number"
                        min={0}
                        className="border border-gray-300 w-full rounded-md py-1 h-10 pl-8"
                        onChange={(e) =>
                          amountHandler(entry.id, +e.target.value)
                        }
                        value={entry.amount.toString()}
                      />
                    </div>
                    <div className="col-span-10 md:col-span-6 relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                        <PencilSquareIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        type="text"
                        className="border border-gray-300 w-full rounded-md py-1 h-10 pl-8"
                        onChange={(e) =>
                          descriptionHandler(entry.id, e.target.value)
                        }
                        placeholder="Enter description"
                        value={entry.description}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <button
                        onClick={() => {
                          setEntries((entries) => {
                            return entries.filter(
                              (current) => current.id !== entry.id
                            );
                          });
                        }}
                        type="button"
                        className="items-center border rounded-lg border-transparent bg-red-500 p-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-4 w-full justify-center mt-4">
          <button
            className="flex rounded-md bg-red-500 px-4 py-2 text-white font-medium hover:bg-red-700"
            onClick={onCalculate}
          >
            Calculate
          </button>
          <button
            className="flex rounded-md bg-blue-500 px-4 py-2 md:text-md md:px-4 md:py-2 text-white font-medium hover:bg-blue-700"
            onClick={onSaveTrip}
          >
            Save Trip
          </button>
        </div>
        {feedbackMessage && (
          <p className="text-center mt-4 text-red-500">{feedbackMessage}</p>
        )}
        {!!output && (
          <div className="border border-gray-500 rounded-md p-2 mt-4 flex flex-col">
            <ul className="">
              {output &&
                output.decision.map((d, idx) => (
                  <li key={idx}>
                    <p className="text-gray-600">
                      <span className="text-black font-bold">{d.payer} </span>
                      needs to send
                      <span className="text-black font-bold">
                        {" "}
                        {d.recipient}
                      </span>
                      {": "}
                      <span className="text-green-600 font-bold">
                        ${d.amount.toFixed(2)}
                      </span>
                    </p>
                  </li>
                ))}
            </ul>
            <button
              className="rounded-md bg-white px-2 py-1 mt-8 text-black text-sm font-medium mx-auto block border border-black"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              {showBreakdown ? "Hide Breakdown" : "Show Breakdown"}
            </button>
            {showBreakdown && (
              <div className="p-2 mt-2 flex flex-col border-t border-gray-300">
                <ul>
                  <li key="total">
                    <p>
                      Total:{" "}
                      <span className="font-semibold">${output.total}</span>
                    </p>
                  </li>
                  <li className="mb-4" key="average">
                    <p>
                      Average:{" "}
                      <span className="font-semibold">${output.average}</span>
                    </p>
                  </li>
                  {output.paymentMap.map((item, idx) => (
                    <li key={idx}>
                      {item.amountOwe >= 0 ? (
                        <p>
                          {item.name} is owed{" "}
                          <span className="text-green-400">
                            ${Math.round(item.amountOwe * 100) / 100}{" "}
                          </span>
                          <span className="text-black">
                            (Paid ${item.amountPaid} - avg ${output.average})
                          </span>
                        </p>
                      ) : (
                        <p>
                          {item.name} owes{" "}
                          <span className="text-red-400">
                            {" "}
                            ${Math.round(-item.amountOwe * 100) / 100}{" "}
                          </span>
                          <span className="text-black">
                            (Paid ${item.amountPaid} - avg ${output.average})
                          </span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <FloatingNav />
    </BasePage>
  );
};

export default TripCalculator;
