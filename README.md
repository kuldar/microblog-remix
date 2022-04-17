# Microblog

No guarantees that any of this works. I'm new at this and experimenting. Built on top of [Remix's](https://remix.run/) Indie Stack. Database query organisation might be a hot mess. Uses Nodemailer to send email confirmation codes.

👉 **[Microblog Staging Demo]**(https://microblog-staging.fly.dev/)

![Screenshot 2022-04-17 at 13 11 57](https://user-images.githubusercontent.com/1710629/163710101-c837af81-608a-47e8-9829-bb7182180f10.png)

## Features
Not all "Popular Microblogging Site" features are replicated, but here's what currently should work:

- Creating accounts and sending verification emails
- Deleting accounts (and all their posts)
- Creating posts
- Deleting posts (and all it's likes)
- Liking/unliking posts
- Reposting/unreposting posts
- Following/unfollowing users
- Verification badges for users
- Replying to posts
- Seeing replies to a post
- Seeing list of people who liked a post
- Seeing list of people who reposted a post
- Seeing a list of users followings
- Seeing a list of users followers
- Updating profile info (name, bio, website, avatar url, cover url, etc)
- Automatic dark/light mode support
- Somewhat reasonable responsiveness
- Most if not all features work with JavaScript disabled

## Development

- Initial setup:

  ```sh
  npm install
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

  - Delete and reset database:

  ```sh
  rm prisma/data.db
  npx prisma db push
  npx prisma db seed
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a few new users with some data you can use to get started:

Users:

- Saul: `saul@email.com / password`
- Mike: `mike@email.com / password`
- Lalo: `lalo@email.com / password`

## ENV

Create .env file with

```
DATABASE_URL="file:./data.db?connection_limit=1"
SESSION_SECRET="some-random-secret"
GMAIL_EMAIL="your@gmail.com"
GMAIL_PASSWORD="your-gmail-password"
```

## Deployment

Two GitHub Actions handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly create microblog
  fly create microblog-staging
  ```

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app microblog
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app microblog-staging
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/generate-password) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app microblog
  fly volumes create data --size 1 --app microblog-staging
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
