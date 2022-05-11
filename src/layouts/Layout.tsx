import Link from "next/link";
import { useRouter } from "next/router";

import ConnectWalletButton from "~/components/ConnectWalletButton";
import SearchBar from "~/components/SearchBar";
import { LINKS } from "~/constants/links";

const FooterLink = ({ text, href }: { text: string; href: string }) => (
  <a
    className="text-primary-blue font-semibold"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {text}
  </a>
);

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-2 justify-between items-center px-4 py-5 border-b-1 border-black gap-y-2 md:gap-x-16 md:grid-cols-1 md:grid-rows-1 md:grid-cols-header md:px-10 md:py-6 md:h-32 md:border-0">
        <div>
          <Link passHref href="/">
            <a className="font-semibold text-3xl">ens cafe</a>
          </Link>
        </div>
        {router.pathname !== "/" && (
          <div className="row-start-3 row-end-3 col-span-2 md:col-auto md:row-auto">
            <SearchBar placeholder="→ your new ens..." />
          </div>
        )}
        <div className="row-start-1 col-start-2 justify-self-end md:col-start-3 md:col-end-4 md:col-auto md:row-start-1">
          <ConnectWalletButton />
        </div>
      </div>
      <div className="px-4 grow md:px-10">{children}</div>
      <div className="px-4 md:px-10 pb-8 pt-8 space-x-4">
        <FooterLink text="faq" href={LINKS.faq} />
        <FooterLink text="github" href={LINKS.github} />
        <FooterLink text="twitter" href={LINKS.twitter} />
      </div>
    </div>
  );
};

export default Layout;
