# HVACPro - Air Conditioning Solutions Website

A modern, responsive lead generation website for HVACPro showcasing premium air conditioning systems and collecting customer inquiries.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Contact Form 7 API Integration](#contact-form-7-api-integration)
- [Google Sheets Integration](#google-sheets-integration)
- [Alternative Form Solutions](#alternative-form-solutions)
- [Customization](#customization)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

HVACPro is a 3-page static website designed for lead generation. The website showcases:

- **10 Premium AC Products** (5 Centralized + 5 Split AC Systems)
- **Lead Capture Forms** with validation and consent checkboxes
- **Responsive Design** optimized for desktop and mobile
- **Modern UI/UX** with green, yellow, maroon, and white color scheme

## ✨ Features

### Pages

1. **Homepage** (`index.html`)
   - Hero banner
   - About Us section
   - Areas of Expertise
   - Product grid (8 products)
   - Contact form

2. **Products Page** (`products.html`)
   - Centralized AC Systems (5 products in accordion format)
   - Split AC Systems (5 products in accordion format)
   - Detailed product specifications
   - Contact form

3. **Contact Page** (`contact.html`)
   - Business information
   - Contact details
   - Business hours
   - Google Maps integration
   - Contact form

### Form Features

- **Required Fields:**
  - Full Name
  - Email Address
  - Contact Number (10-digit validation)
  - Product Selection (dropdown with 10 options)

- **Consent Checkboxes:**
  - Physical address confirmation
  - 2+ years residency confirmation
  - Submit button enabled only when both are checked

- **Validation:**
  - Real-time form validation
  - Bootstrap validation styling
  - Custom error messages

## 📁 Project Structure

```
hvacpro-air-solution-website/
├── index.html              # Homepage
├── products.html           # Products page
├── contact.html            # Contact page
├── README.md               # This file
├── assets/
│   ├── css/
│   │   └── style.css       # Custom styles
│   ├── js/
│   │   └── script.js       # Form logic & API integration
│   └── images/             # Logo and product images
└── docs/                   # Additional documentation (optional)
```

## 🚀 Setup Instructions

### 1. Basic Setup

1. Clone or download this repository
2. Open `index.html` in a web browser to preview
3. Host on any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

### 2. Add Your Logo

Place your logo image in `assets/images/logo.png`

The logo should be:
- Format: PNG with transparent background
- Size: Approximately 200x60px
- Aspect ratio: Landscape orientation

### 3. Update Contact Information

Edit the following files to update contact details:

- `index.html` (Footer section)
- `products.html` (Footer section)
- `contact.html` (Contact info sections and footer)

Replace:
- Phone numbers
- Email addresses
- Physical address
- Social media links

## 📧 Contact Form 7 API Integration

Contact Form 7 is a WordPress plugin. If you have a WordPress site, follow these steps:

### Step 1: Install Contact Form 7 on WordPress

1. Log in to your WordPress admin panel
2. Go to **Plugins → Add New**
3. Search for "Contact Form 7"
4. Install and activate the plugin

### Step 2: Create a Contact Form

1. Go to **Contact → Contact Forms**
2. Click "Add New"
3. Create a form with these fields:
   ```
   [text* fullName placeholder "Full Name"]
   [email* email placeholder "Email Address"]
   [tel* contactNo placeholder "Contact Number"]
   [select* productInterest "Select a product" "Daikin Centralized AC" "Carrier Centralized AC" ...]
   [checkbox* hasAddress "I confirm that I have a physical address"]
   [checkbox* residentDuration "I confirm that I have been a resident for 2+ years"]
   [submit "Submit Inquiry"]
   ```

### Step 3: Enable REST API

1. Install "Contact Form 7 REST API" plugin
2. Or use the built-in REST API (available in CF7 5.4+)

### Step 4: Get Your API Endpoint

Your endpoint will be:
```
https://your-wordpress-site.com/wp-json/contact-form-7/v1/contact-forms/{form-id}/feedback
```

To find your form ID:
- Go to Contact → Contact Forms
- Your form ID is shown in the list

### Step 5: Update JavaScript Configuration

Edit `assets/js/script.js`:

```javascript
const CF7_API_ENDPOINT = 'https://your-site.com/wp-json/contact-form-7/v1/contact-forms/123/feedback';
```

Replace:
- `your-site.com` with your WordPress domain
- `123` with your actual form ID

## 📊 Google Sheets Integration

Collect form submissions in a Google Spreadsheet automatically.

### Option 1: Google Apps Script (Free)

#### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "HVACPro Leads"
3. Add headers in Row 1:
   - A1: Timestamp
   - B1: Full Name
   - C1: Email
   - D1: Contact Number
   - E1: Product Interest
   - F1: Has Address
   - G1: Resident 2+ Years
   - H1: Page URL

#### Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete existing code and paste:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.fullName,
      data.email,
      data.contactNo,
      data.productInterest,
      data.hasAddress,
      data.residentDuration,
      data.pageUrl
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Save the script (name it "HVACPro Form Handler")

#### Step 3: Deploy as Web App

1. Click **Deploy → New Deployment**
2. Select type: **Web app**
3. Configuration:
   - Description: "HVACPro Form Submission"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the **Web app URL**

#### Step 4: Update JavaScript

Edit `assets/js/script.js`:

```javascript
const SPREADSHEET_WEBHOOK_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Replace with your deployed web app URL.

### Option 2: Zapier Integration

1. Create a free [Zapier](https://zapier.com) account
2. Create a new Zap:
   - Trigger: **Webhooks by Zapier** → Catch Hook
   - Action: **Google Sheets** → Create Spreadsheet Row
3. Copy the webhook URL
4. Update `SPREADSHEET_WEBHOOK_URL` in `script.js`

### Option 3: Make.com (Integromat)

1. Create a free [Make.com](https://make.com) account
2. Create a scenario:
   - Trigger: **Webhooks** → Custom Webhook
   - Action: **Google Sheets** → Add a Row
3. Copy the webhook URL
4. Update `SPREADSHEET_WEBHOOK_URL` in `script.js`

## 🔄 Alternative Form Solutions

If you don't want to use Contact Form 7, here are alternatives:

### 1. FormSpree (Easiest - Free Tier Available)

```javascript
// In script.js
const USE_ALTERNATIVE_ENDPOINT = true;
const ALTERNATIVE_API_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
```

Setup:
1. Go to [FormSpree.io](https://formspree.io)
2. Create a free account
3. Create a new form
4. Copy your form endpoint
5. Update the code above

### 2. Netlify Forms (If hosting on Netlify)

Add to your form tag:
```html
<form name="contact" method="POST" data-netlify="true">
```

No JavaScript needed - Netlify handles it automatically.

### 3. Getform.io

Similar to FormSpree:
```javascript
const ALTERNATIVE_API_ENDPOINT = 'https://getform.io/f/YOUR_FORM_ID';
```

### 4. Email.js (Send directly to email)

1. Sign up at [EmailJS](https://emailjs.com)
2. Set up email service
3. Use their JavaScript SDK
4. Forms sent directly to your email

### 5. Custom Backend

Create your own API endpoint using:
- Node.js + Express
- Python + Flask
- PHP
- Serverless functions (AWS Lambda, Vercel Functions, etc.)

## 🎨 Customization

### Color Scheme

The website uses CSS variables. Edit `assets/css/style.css`:

```css
:root {
    --primary-green: #2d8659;      /* Main green */
    --secondary-yellow: #f5b800;   /* Accent yellow */
    --accent-maroon: #800020;      /* Highlight maroon */
    --white: #ffffff;              /* White */
}
```

### Product Images

Add product images to `assets/images/` with these names:
- `daikin-central.jpg`
- `carrier-central.jpg`
- `mitsubishi-central.jpg`
- `trane-central.jpg`
- `york-central.jpg`
- `lg-split.jpg`
- `samsung-split.jpg`
- `blue-star-split.jpg`
- `voltas-split.jpg`
- `hitachi-split.jpg`

Recommended size: 600x400px

### Adding More Products

Edit the HTML files and add new product cards following the existing format.

## 🌐 Deployment

### GitHub Pages (Free)

1. Push code to GitHub repository
2. Go to repository Settings
3. Navigate to Pages
4. Select branch to deploy (usually `main`)
5. Your site will be live at `https://username.github.io/repo-name`

### Netlify (Free - Recommended)

1. Sign up at [Netlify](https://netlify.com)
2. Drag and drop your project folder
3. Site goes live instantly
4. Get custom domain or use provided subdomain

### Vercel (Free)

1. Sign up at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Deploy with one click
4. Automatic deployments on every push

### Traditional Web Hosting

Upload files via FTP to any web hosting service:
- HostGator
- Bluehost
- GoDaddy
- SiteGround
- Any hosting provider with static file support

## 🐛 Troubleshooting

### Form Not Submitting

1. **Check browser console** for errors (F12 → Console tab)
2. **Verify API endpoint** is configured in `script.js`
3. **Check CORS settings** if using external API
4. **Test in demo mode** first (default behavior)

### Spreadsheet Not Receiving Data

1. **Verify Google Apps Script** is deployed as "Anyone" access
2. **Check script execution permissions**
3. **Test webhook URL** directly with tools like Postman
4. **Check spreadsheet sharing permissions**

### Validation Not Working

1. **Ensure Bootstrap JS** is loaded (check browser console)
2. **Verify checkbox IDs** match JavaScript selectors
3. **Check form ID** is `contactForm`

### Styling Issues

1. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check Bootstrap CSS** is loading
3. **Verify custom CSS** path is correct
4. **Check for CSS conflicts**

## 📝 Form Data Collection Checklist

- [ ] Set up Contact Form 7 API endpoint (or alternative)
- [ ] Create Google Sheet for data collection
- [ ] Deploy Google Apps Script web app
- [ ] Update API endpoints in `script.js`
- [ ] Test form submission
- [ ] Verify data appears in spreadsheet
- [ ] Set up email notifications (optional)
- [ ] Configure auto-response emails (optional)

## 🔒 Security Considerations

1. **Never expose API keys** in client-side code
2. **Use environment variables** for sensitive data
3. **Implement rate limiting** on your backend
4. **Validate data** on the server side
5. **Use HTTPS** for production
6. **Sanitize user inputs** before storing

## 📞 Support & Questions

For questions about this website:
- Check the documentation above
- Review code comments in `script.js`
- Test in demo mode first

For Contact Form 7 support:
- [Contact Form 7 Documentation](https://contactform7.com/docs/)

For Google Sheets integration:
- [Google Apps Script Documentation](https://developers.google.com/apps-script)

## 📄 License

This project is provided as-is for HVACPro. Customize as needed for your business.

---

**Built with:** HTML5, CSS3 (Bootstrap 5), JavaScript
**Version:** 1.0.0
**Last Updated:** 2024
