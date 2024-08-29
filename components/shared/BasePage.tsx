import Head from "next/head";
import { ReactNode } from "react";
import { clsx } from "./clsx";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";

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

  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  return (
    <div className="bg-sky-600 text-white min-h-screen">
      <div
        className={clsx("flex flex-col w-full max-w-2xl mx-auto", className)}
      >
        <Head>
          <title>{metaData?.title || "Whats My Venmo"}</title>
          <link rel="icon" href="/blue.jpeg" />
        </Head>
        <nav className="flex items-center justify-between p-4 border-b-4 border-sky-100 text-md font-semibold">
          <Link href="/">WhatsMyVenmo</Link>
          <div className="flex items-center space-x-8">
            {user ? (
              <>
                <button
                  className="hover:underline"
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  className="hover:underline"
                  onClick={() => {
                    supabase.auth.signOut();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="hover:underline"
                  onClick={() => {
                    supabase.auth.signInWithOAuth({
                      provider: "google",
                    });
                  }}
                >
                  Login
                </button>
                <button
                  className="hover:underline"
                  onClick={() => {
                    supabase.auth.signInWithOAuth({
                      provider: "google",
                    });
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
};

export default BasePage;
