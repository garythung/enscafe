import { NameList } from "~/components/NameList";
import Home from "~/layouts/Home";
import SearchBar from "~/components/SearchBar";

export default function Index() {
  return (
    <div className="flex flex-col mt-4 md:mt-8 md:px-8">
      <div className="mt-16 md:mx-64">
        <h1 className="text-2xl mb-4">
          the best place to buy and sell ens names
        </h1>
        <SearchBar placeholder="888.eth" />
      </div>
    </div>
  );
}

Index.getLayout = function getLayout(page: React.ReactElement) {
  return <Home>{page}</Home>;
};
