import Head from "next/head";
import { ReactNode } from "react";

interface MetaData {
  title: string;
}

interface BasePageProps {
  className?: string;
  children: ReactNode;
  metaData?: MetaData;
}

const BasePage = (props: BasePageProps) => {
  const { className, children, metaData } = props;

  return (
    <div className={`flex flex-col pb-24 ${className}`}>
      <Head>
        <title>{metaData?.title || "Whats My Venmo"}</title>
        <link rel="icon" href="/blue.jpeg" />
      </Head>
      {children}
    </div>
  );
};

export default BasePage;
