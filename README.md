<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# rasanna-daeng---foodorder

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/eebaf7a3-aa84-4453-aaee-666ed6b22bc7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## GitHub Pages (static preview)

The `Deploy to GitHub Pages` workflow builds and publishes the frontend when changes are pushed to `main`. In the repository settings, open **Pages** and set the source to **GitHub Actions**. The first deployment may take a few minutes; then open the Pages URL shown in that settings page.

GitHub Pages only hosts static files. Since this app's products, sign-in, ordering, and admin features require the Express API and SQLite database, those features need the full-app deployment below and will not work on the static Pages preview.

## Deploy the full app

This app uses an Express API and SQLite database, so GitHub Pages cannot host the complete ordering flow. The included `render.yaml` configures a Render web service with persistent storage for the database and uploaded payment proofs.

1. Push this project to a GitHub repository.
2. In Render, create a new Blueprint and connect that repository.
3. Review the service and persistent-disk pricing in Render, then deploy.
4. Open the public URL Render provides. The frontend and API are served from the same URL.

The persistent disk is required so orders, accounts, and uploaded files survive service restarts.
