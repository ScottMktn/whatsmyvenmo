import axios from "axios";

export interface Trip {
  uuid: string;
  people: {
    name: string;
    amount: number;
  }[];
}

const getTrip = async (id: string) => {
  const res = await axios.get(`/api/trips/${id}`);
  return res.data;
};

const createTrip = async (req: Trip) => {
  const res = await axios.post("/api/trips", req);
  if (res.status === 200) {
    return req;
  } else {
    throw new Error("Failed to create new trip");
  }
};

export { getTrip, createTrip };
