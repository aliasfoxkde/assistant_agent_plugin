# Cloudflare Setup for Supabase Authentication

This document provides instructions for setting up Supabase authentication with Cloudflare Pages.

## Prerequisites

- A Supabase account and project
- A Cloudflare account with Pages enabled

## Setting Up Cloudflare Environment Variables

1. Log in to your Cloudflare dashboard
2. Navigate to Pages > Your Project > Settings > Environment variables
3. Add the following environment variables:

   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | SUPABASE_URL | Your Supabase URL (e.g., https://yourproject.supabase.co) | Production, Preview |
   | SUPABASE_ANON_KEY | Your Supabase anonymous key | Production, Preview |

## Deploying to Cloudflare Pages

1. Make sure your project is built using the build script:

   ```bash
   npm run build
   ```

2. Deploy to Cloudflare Pages:

   ```bash
   npm run deploy
   ```

   Or manually through the Cloudflare dashboard.

## Testing Authentication

1. After deployment, navigate to your Cloudflare Pages URL
2. Click on the "Account" tab in the application
3. Try signing up and logging in to verify that authentication is working correctly

## Troubleshooting

If authentication is not working:

1. Check the browser console for errors
2. Verify that the environment variables are set correctly in Cloudflare
3. Make sure the Supabase project is properly configured for authentication
4. Check that the Cloudflare Functions are deployed correctly

## Additional Resources

- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Functions Documentation](https://developers.cloudflare.com/pages/platform/functions/)
