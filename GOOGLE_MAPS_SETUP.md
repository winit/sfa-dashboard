# Google Maps API Setup Instructions

## Current Issue
The Google Maps API key is present but not properly configured. The error "This page didn't load Google Maps correctly" indicates that the API key needs proper setup in Google Cloud Console.

## Your API Key
```
AIzaSyDBQbaTyJ_0_vkAYIGWY-WkNoFH0OU2bqE
```

## Step-by-Step Fix

### 1. Enable Required APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Library**
4. Search for and enable these APIs:
   - **Maps JavaScript API** (REQUIRED)
   - **Places API** (optional, for search features)
   - **Geocoding API** (optional, for address lookup)

### 2. Configure API Key
1. Go to **APIs & Services** > **Credentials**
2. Find your API key or create a new one
3. Click on the API key to edit it

### 3. Set Up Restrictions (Important for Security)
1. Under **Application restrictions**:
   - For development: Select "HTTP referrers (web sites)"
   - Add these referrers:
     ```
     http://localhost:*
     http://localhost:5173/*
     http://localhost:5174/*
     http://127.0.0.1:*
     ```
   - For production: Add your domain (e.g., `https://yourdomain.com/*`)

2. Under **API restrictions**:
   - Select "Restrict key"
   - Choose these APIs:
     - Maps JavaScript API
     - Places API (if needed)
     - Geocoding API (if needed)

### 4. Billing Setup (Required)
Google Maps requires a billing account, but offers $200 free credit monthly.

1. Go to **Billing** in Google Cloud Console
2. Set up a billing account if not already done
3. Link it to your project

### 5. Verify in Browser Console
Open browser DevTools (F12) and check for:
- `google.maps` object should be available
- No error messages about API key

## Testing the Fix
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Refresh the page
3. The map should now load properly

## Common Error Messages and Solutions

| Error | Solution |
|-------|----------|
| "This page didn't load Google Maps correctly" | Enable Maps JavaScript API and set up billing |
| "RefererNotAllowedMapError" | Add localhost to allowed referrers |
| "InvalidKeyMapError" | Check if API key is correct and active |
| "MissingKeyMapError" | API key not provided in .env file |
| "ApiNotActivatedMapError" | Enable Maps JavaScript API in Cloud Console |
| "OverQuotaMapError" | Billing not set up or quota exceeded |

## Alternative: Create a New API Key
If the current key doesn't work, create a new one:

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **API key**
3. Configure restrictions as above
4. Update `.env` file with new key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_new_key_here
   ```
5. Restart the development server

## Support Links
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation/javascript/get-api-key)
- [Error Messages Reference](https://developers.google.com/maps/documentation/javascript/error-messages)
- [Billing & Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)