// This code is used if we want to force a component to be rendered only on the client side (by wrapping it in <ClientOnly></ClientOnly>)

import dynamic from "next/dynamic";
import { FunctionComponent, PropsWithChildren } from "react";

const ClientOnly: FunctionComponent<PropsWithChildren> = ({ children }) =>
  children;

export default dynamic(() => Promise.resolve(ClientOnly), {
  ssr: false,
});
