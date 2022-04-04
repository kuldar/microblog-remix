import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main>
      {user ? (
        <Link to="/notes">View Notes for {user.email}</Link>
      ) : (
        <div>
          <Link to="/join">Sign up</Link>
          <Link to="/login">Log In</Link>
        </div>
      )}
    </main>
  );
}
