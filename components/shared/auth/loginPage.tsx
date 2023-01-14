import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthenticationForm, { AuthFormState } from "./AuthenticationForm";

export default function LoginPage() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const onSubmitHandler = (state: AuthFormState) => {
    supabaseClient.auth
      .signInWithPassword({
        email: state.email,
        password: state.password,
      })
      .then((resp) => {
        if (resp.error?.message) {
          setError(resp.error.message);
          return;
        }
        router.push("/");
      });
  };

  return (
    <AuthenticationForm
      authType="login"
      onSubmit={(state) => onSubmitHandler(state)}
      error={error}
      errorCallback={(error) => setError(error)}
    />
  );
}
