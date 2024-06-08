"use client";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

/**
 * @param {import("react").PropsWithChildren} props
 */
export default function RootLayoutProviders(props) {
  return (
    <TRPCReactProvider>
      <ThemeProvider attribute="class">
        {props.children}
        <Toaster />
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
