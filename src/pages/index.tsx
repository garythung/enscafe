import { NameList } from "~/components/NameList";
import Layout from "~/layouts";

export default function Index() {
  return (
    <div className="flex flex-col mt-4 md:mt-8 md:px-8">
      <h1 className="text-3xl">Hot ENS Names</h1>
      {/* <NameList query={{ "attributes[Length]": 3, onSale: true }} />
      <NameList query={{ "attributes[Length]": 4, onSale: true }} />
      <NameList query={{ "attributes[Length]": 5, onSale: true }} /> */}
    </div>
  );
}

Index.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
