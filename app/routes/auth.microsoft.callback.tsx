// app/routes/auth/microsoft/callback.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export const loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate("microsoft", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};
