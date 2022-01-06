import { useEagerConnect } from "~/hooks/useEagerConnect";
import { useInactiveListener } from "~/hooks/useInactiveListener";

export default function Web3ReactManager({ children }) {
  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  return children;
}
