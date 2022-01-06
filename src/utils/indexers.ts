import { INDEXERS } from "~/constants";

export const getIndexer = () => INDEXERS[process.env.NEXT_PUBLIC_NETWORK];
