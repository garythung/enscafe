import { NameList } from "~/components/NameList";
import Layout from "~/layouts/Layout";
import SearchBar from "~/components/SearchBar";

export default function Index() {
  return (
    <div className="flex flex-col md:mt-8 md:px-8">
      <div className="mt-24 md:mt-16 md:ml-40 md:mr-96">
        <h1 className="text-2xl mb-4">
          the best place to buy and sell ens names
        </h1>
        <SearchBar placeholder="anon.eth" />
      </div>
    </div>
  );
}

Index.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
