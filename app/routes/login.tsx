import type { ActionFunction, HeadersFunction } from "@remix-run/node";
import { useActionData, Link, Form } from "@remix-run/react";
import { login, createUserSession, register } from "~/utils/session.server";
import slugify from "react-slugify";
import { db } from "~/utils/db.server";

export let headers: HeadersFunction = () => {
  return {
    "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${
      60 * 60 * 24 * 30
    }`,
  };
};

function validateUsername(userName: unknown) {
  if (typeof userName !== "string" || userName.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: { userName: string | undefined; password: string | undefined };
  fields?: { loginType: string; userName: string; password: string };
};

export let action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData> => {
  let { loginType, userName, password } = Object.fromEntries(
    await request.formData()
  );
  if (
    typeof loginType !== "string" ||
    typeof userName !== "string" ||
    typeof password !== "string"
  ) {
    return { formError: `Form not submitted correctly.` };
  }

  let fields = { loginType, userName, password };
  let fieldErrors = {
    userName: validateUsername(userName),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) return { fieldErrors, fields };

  switch (loginType) {
    case "login": {
      const user = await login({ userName, password });
      if (!user) {
        return {
          fields,
          formError: `Username/Password combination is incorrect`,
        };
      }
      return createUserSession(user.id, `/${slugify(userName)}`);
    }
    case "register": {
      let userExists = await db.user.findFirst({ where: { userName } });
      if (userExists) {
        return {
          fields,
          formError: `User with userName ${userName} already exists`,
        };
      }
      const user = await register({ userName, password });
      if (!user) {
        return {
          fields,
          formError: `Something went wrong trying to create a new user.`,
        };
      }
      return createUserSession(user.id, `/${slugify(userName)}`);
    }
    default: {
      return { fields, formError: `Login type invalid` };
    }
  }
};

export default function Login() {
  const actionData = useActionData<ActionData | undefined>();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <Form
          method="post"
          aria-describedby={
            actionData?.formError ? "form-error-message" : undefined
          }
        >
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />{" "}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="userName-input">Username</label>
            <input
              type="text"
              id="userName-input"
              name="userName"
              defaultValue={actionData?.fields?.userName}
              aria-invalid={Boolean(actionData?.fieldErrors?.userName)}
              aria-describedby={
                actionData?.fieldErrors?.userName ? "userName-error" : undefined
              }
            />
            {actionData?.fieldErrors?.userName ? (
              <p
                className="form-validation-error"
                role="alert"
                id="userName-error"
              >
                {actionData.fieldErrors.userName}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              defaultValue={actionData?.fields?.password}
              type="password"
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-describedby={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button red">
            Submit
          </button>
        </Form>
      </div>
      <br />
      <div>
        <Link to="/">Back home</Link>
      </div>
    </div>
  );
}
