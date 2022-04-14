## Adding email verification to signup

- Add "confirmationCode" and "status" fields to user table
- Add helper to generate confirmation code words
- Set a unique generated code on user table on signup
- On login, check if user exists, if login is correct and if user is active

---

- Send an email with
  - Confirmation code
  - Link to the confirmation page with confirmation code in url params
- On confirmation page, wait for user form submittion or autosubmit with url params
  - Find a user in database by confirmation code
  - If user exists, and their status is inactive, change it to active, (clear the confirmation code?) and redirect user to logged in page
  - If user exists but status is active, return an error (prevent random access through an old email)
  - If user does not exist, return an error
