import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main>
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <div>
          <Link to="/join">Sign up</Link>
          <Link to="/login">Log In</Link>
        </div>
      )}
    </main>
  );
}
