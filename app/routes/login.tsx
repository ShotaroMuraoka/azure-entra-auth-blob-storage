import { Form } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
}

export function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate("microsoft", request);
}

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Login Card */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Login
        </h1>
        <Form method="post" className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </Form>
      </div>
    </div>
  );

}
