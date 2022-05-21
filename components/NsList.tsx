import Image from "next/image";
import React from "react";
import Namespace from "../models/Namespace";

const NsList: React.FC<{ namespaces: Namespace[] | null }> = (props) => {
  console.log(props.namespaces);
  if (props.namespaces) {
    return (
      <div>
        {props.namespaces.map((ns) => {
          return (
            <Image
              width='100'
              height='100'
              alt={ns.endpoint}
              key={ns.id}
              src={ns.img}
            />
          );
        })}
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default NsList;
