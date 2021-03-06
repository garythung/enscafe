import { useEffect, useState } from "react";

type Props = {
  query: any;
};

export const NameList = ({ query }: Props) => {
  const [state, setState] = useState([]);

  useEffect(() => {
    // useIndexer("/tokens", {
    //   params: {
    //     ...query,
    //     collection: getCollection(),
    //   },
    // }).then((res) => {
    //   setState(res.data.tokens);
    // });
  }, []);

  return (
    <div>
      {state.map((item: any, index: number) => {
        return <div key={index}>{item.token.name}</div>;
      })}
    </div>
  );
};
