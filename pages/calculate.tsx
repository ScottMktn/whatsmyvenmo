import FloatingNav from "../components/shared/FloatingNav";
import BasePage from "../components/templates/BasePage";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Person {
  id: number;
  name: string;
  amount: number;
}

interface PaymentMap {
  name: string;
  amountOwe: number;
  amountPaid: number;
}

interface Decision {
  payer: string;
  recipient: string;
  amount: number;
}

interface Output {
  total: number;
  average: number;
  paymentMap: PaymentMap[];
  decision: Decision[];
}

const VotePage = () => {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [output, setOutput] = useState<Output>();
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const generatePeople = () => {
    const query: string = router.query["q"] as string;
    const arr = query.split("&");
    const people: Person[] = arr.map((a, index) => {
      const data = a.split("-");
      const amount = data[1];
      return {
        amount: parseInt(amount, 10),
        id: index,
        name: data[0],
      };
    });
    return people;
  };

  const nameHandler = (id: number, value: string) => {
    const copy = [...people];
    copy.forEach((person) => {
      if (person.id === id) {
        person.name = value;
      }
    });
    setPeople(copy);
  };

  const amountHandler = (id: number, value: number) => {
    const copy = [...people];
    copy.forEach((person) => {
      if (person.id === id) {
        person.amount = value;
      }
    });
    setPeople(copy);
  };

  const onCalculate = () => {
    const stringArr = people.map((p) => `${p.name}-${p.amount}`).join("&");
    router.query["q"] = stringArr;
    router.push(router);

    const total = people.reduce((result, person) => {
      return result + person.amount;
    }, 0);
    const average = Math.round((total / people.length) * 100) / 100;

    const paymentMap: PaymentMap[] = [];
    people.forEach((person) => {
      const diff = person.amount - average;
      paymentMap.push({
        name: person.name,
        amountOwe: diff,
        amountPaid: person.amount,
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

  useEffect(() => {
    if (router.query["q"]) {
      setPeople(generatePeople());
    }
  }, [router.query]);

  return (
    <BasePage
      metaData={{ title: "Do Math | Calculate" }}
      className="min-h-screen sm:px-36 max-w-4xl mx-auto"
    >
      <div className="p-4">
        <h1 className="mt-2 text-2xl text-left font-semibold">
          Calculate who owes who what
        </h1>
        <div
          id="config"
          className="border border-gray-500 rounded-md p-2 mt-4 flex flex-col"
        >
          <div className="flex flex-row mt-1">
            <label className="mt-1">Number of People:</label>
            <input
              type="number"
              className="border border-black p-1 w-12 ml-2"
              disabled={true}
              value={people.length}
            />

            <button
              onClick={() =>
                setPeople((people) => people.slice(0, people.length - 1))
              }
              className="flex rounded-md bg-gray-700 p-2 text-white font-semibold hover:bg-gray-800 ml-4"
            >
              <ChevronDownIcon className="text-white w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setPeople((people) =>
                  people.concat([{ amount: 0, id: people.length, name: "" }])
                )
              }
              className="flex rounded-md bg-gray-700 p-2 text-white font-semibold hover:bg-gray-800 ml-2"
            >
              <ChevronUpIcon className="text-white w-4 h-4" />
            </button>
          </div>
          <div className="border-t border-gray-400 w-full mt-4 pt-2">
            {people.length > 0 && (
              <div className="flex flex-row justify-between mt-2 py-2">
                <p>Name</p>
                <p>Amount Paid</p>
              </div>
            )}

            {people.map((p, idx) => (
              <div className="flex flex-row justify-between pb-3" key={idx}>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md py-1 px-2"
                  onChange={(e) => nameHandler(p.id, e.target.value)}
                  value={p.name}
                />
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                    <CurrencyDollarIcon
                      className="h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md py-1 pr-2 w-28 pl-8"
                    onChange={(e) =>
                      amountHandler(p.id, parseInt(e.target.value, 10))
                    }
                    value={p.amount.toString()}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="rounded-md bg-red-500 px-4 py-2 mt-4 text-white font-medium mx-auto block"
          onClick={onCalculate}
        >
          Calculate
        </button>
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

export default VotePage;
