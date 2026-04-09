# Qubi Agentic AI Platform - Dynamic Page Setup Guide

## Problem
The page is showing **static components** instead of **dynamic content from WordPress admin**.

## Root Cause
The ACF field `page_sections` on the WordPress page is currently **empty** (set to `false`). No sections have been added to the page yet.

## Solution: Add Sections in WordPress Admin

### Step 1: Go to WordPress Page Editor
1. Navigate to: **WordPress Admin → Pages → Qubi (Agentic AI Platform)**
2. Scroll down to the **"Page Sections"** field in the ACF section

### Step 2: Add Sections
The page is set up to render these section types. Add them to the `page_sections` flexible content field:

#### Available Section Types:
- `qubi_banner_section` - Hero banner section with title, subtitle, button, and image
- `problem_section` - Problem statement section
- `capabilities_section` - Capabilities showcase
- `outcomes_section` - Outcomes/results section
- `how_it_works_section` - How it works process
- `use_cases_section` - Use cases showcase
- `integrations_section` - Integrations section
- `human_in_loop_section` - Human in loop section
- `analytics_section` - Analytics section
- `cta_section` - Call to action section

### Step 3: Configure Banner Section (Example)
If adding a banner section, fill in:
- **Title**: Your banner title (e.g., "Orchestrate AI Agents, Bots, Systems & People with qubi")
- **Sub Title**: Subtitle/description
- **Description**: Additional description text
- **Button**: 
  - URL: Link destination
  - Title: Button text (e.g., "Book a Demo")
- **Image**: Upload or select banner image

## Frontend Code Structure

### Current Files:
- `page.js` - Server component that fetches data from WordPress and passes to client component
- `QubiNext15Client.js` - Client component that renders sections based on ACF layout type
- `components/HeroSection.js` - Accepts ACF data and renders dynamically

### How It Works:
1. **Server Component** (`page.js`) fetches page data from WordPress
2. **Console logs** show:
   - Number of sections found
   - Section layout types
   - Data structure
3. **Client Component** maps `acf_fc_layout` to React components
4. **Each component** receives ACF data and renders dynamically

## Debugging

### Check Console Logs
When you visit the page, open the console to see:
```
✅ ACF page_sections found: X sections
🎯 First section layout: qubi_banner_section
```

### If sections show as "unknown layout type"
- Verify the section layout type in WordPress matches the expected values
- Check the field name is exactly `page_sections` in ACF

### If no sections appear
- Go to WordPress admin page editor
- Check the `page_sections` field has rows added
- Save the page
- Clear browser cache and reload

## Environment Details
- **WordPress API URL**: https://qbadevadmin.unitdtechnologies.com/wp-json
- **Fetch endpoint**: `/wp/v2/pages?slug=qubi-agentic-ai-platform`
- **Dev server**: http://localhost:3001

## Next Steps
1. Go to WordPress admin
2. Edit the "Qubi" page
3. Add sections to the "Page Sections" ACF field
4. Save the page
5. Reload http://localhost:3001/solutions/qubi-agentic-ai-platform
6. You should now see dynamic content from your admin configuration!
