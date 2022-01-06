import { COLLECTIONS } from "~/constants";

export const getCollection = () => COLLECTIONS[process.env.NEXT_PUBLIC_NETWORK];
