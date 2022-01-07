import Link from "next/link";

import LinkButton from "~/components/LinkButton";
import SearchBar from "~/components/SearchBar";
import Wallet from "~/components/Wallet";
import { LINKS } from "~/constants/links";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-2 grid-rows-1 justify-between items-center px-4 py-5 border-b-1 border-black gap-y-4 md:gap-x-24 md:grid-rows-1 md:grid-cols-header md:px-10 md:py-6 md:h-32 md:border-0">
        <div>
          <Link href="/" passHref>
            <a className="font-semibold text-3xl">ens cafe</a>
          </Link>
        </div>
        <div className="row-start-2 row-end-3 col-span-2 md:col-auto md:row-auto">
          <SearchBar />
        </div>
        <div className="col-start-2 col-end-3 justify-self-end md:col-auto">
          <Wallet />
        </div>
      </div>
      <div className="px-4 md:px-10">{children}</div>
      <div className="px-4 md:px-10 pb-8 mt-auto pt-8">
        <a
          className="text-primary-blue font-semibold"
          target="_blank"
          rel="noopener noreferrer"
          href={LINKS.notion}
        >
          faq
        </a>
        <a
          className="text-primary-blue font-semibold ml-4"
          target="_blank"
          rel="noopener noreferrer"
          href={LINKS.github}
        >
          github
        </a>
        <a
          className="text-primary-blue font-semibold ml-4"
          target="_blank"
          rel="noopener noreferrer"
          href={LINKS.twitter}
        >
          twitter
        </a>
      </div>
    </div>
  );
};

export default Layout;
