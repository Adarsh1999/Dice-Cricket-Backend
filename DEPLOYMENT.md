# Backend Deployment (Azure Web App)

This API deploys to Azure App Service (Linux) via GitHub Actions. The workflow file is `.github/workflows/azure-webapps-node.yml`.

## Prerequisites
- Azure Web App: `dice-cricket-api-ag` in resource group `DiceCricketRG` (Linux, Node 20).
- Azure App Service Plan: currently `DiceCricketPlanFree2` on tier **B1** (Basic) to avoid daily free-tier quota stops.
- GitHub secret `AZUREAPPSERVICE_PUBLISHPROFILE` containing the publish profile XML from the Web App.
- App setting `MONGODB_URL` configured on the Web App (portal or `az webapp config appsettings set`).
- CORS on the Web App includes the Static Web App origin (`https://white-forest-04ae3e10f.3.azurestaticapps.net`).

## What the workflow does
1) Triggers on push to `main` (or manual dispatch).
2) `npm ci --omit=dev` (build if defined) then zips the entire app **including `node_modules`**.
3) Deploys the ZIP via `azure/webapps-deploy@v2` using the publish profile secret.

## Secrets to set (GitHub → repo → Settings → Secrets → Actions)
- `AZUREAPPSERVICE_PUBLISHPROFILE`: latest publish profile XML for `dice-cricket-api-ag` production slot.

## How to refresh the publish profile
1) In Azure Portal: Web App → Overview → `Reset publish profile`, then `Download publish profile`.
2) Update `AZUREAPPSERVICE_PUBLISHPROFILE` with the new XML content.
3) Re-run the GitHub Action (or push) to redeploy.

## App settings (Azure Web App)
- `MONGODB_URL`: MongoDB Atlas connection string.
- `CORS_ORIGINS`: comma-separated allowed origins (e.g., `https://white-forest-04ae3e10f.3.azurestaticapps.net,http://localhost:3000`).

## How to redeploy
- Push to `main` in `Adarsh1999/Dice-Cricket-Backend`, or
- Manually run the workflow from the Actions tab.

## Troubleshooting
- **QuotaExceeded / 403 deploy:** the free plan can stop the app; keep plan at B1 or move to another free plan after reset.
- **Publish profile invalid:** reset/download a new profile and update the secret.
- **CORS errors from frontend:** update `CORS_ORIGINS` and ensure Azure CORS allowlist includes the Static Web App origin.
- **Runtime missing modules:** we now zip `node_modules`; if you change deps, let the workflow run to rebuild and deploy.
