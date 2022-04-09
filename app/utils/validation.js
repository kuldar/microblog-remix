// Validate email
export function validateEmail(email) {
  // Check if email is a string
  if (typeof email !== "string") {
    return { error: "Email is required" };
  }

  // Format email input
  email = email.toLowerCase().trim();

  // Check if email length is long enough
  if (email.length < 6) {
    return { error: "Email must be at least 6 characters long" };
  }

  // Check if email includes @
  if (!email.includes("@")) {
    return { error: "Email is formatted incorrectly" };
  }

  return email;
}

// Validate password
export function validatePassword(password) {
  // Check if password is a string
  if (typeof password !== "string") {
    return { error: "Password is required" };
  }

  // Check if password is at least 8 characters long
  if (password.length < 8) {
    return { error: "Password needs to be at least 8 characters long" };
  }

  // Return validated password
  return password;
}

// Validate username
export function validateUsername(username) {
  // Check if username is a string
  if (typeof username !== "string") {
    return { error: "Username is required" };
  }

  // Format username input
  username = username.toLowerCase().trim();

  // Check if username is at least 3 characters long
  if (username.length < 3) {
    return { error: "Username must be at least 3 characters long" };
  }

  // Check if username is alphanumeric
  if (!/^[a-z0-9_.]+$/.test(username)) {
    return {
      error:
        "Username can only include letters, numbers, underscores and periods",
    };
  }

  // Return validated usename
  return username;
}
