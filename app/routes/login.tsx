import {Form} from "@remix-run/react";
import type {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";

export async function loader({request}: LoaderFunctionArgs) {
    return await authenticator.isAuthenticated(request, {
        successRedirect: "/dashboard",
    });
};

export function action({request}: ActionFunctionArgs) {
    return authenticator.authenticate("microsoft", request);

}

export default function Login() {
    return (
        <div>
            <Form method="post">
                <button type="submit">Login</button>
            </Form>
        </div>
    );
}
