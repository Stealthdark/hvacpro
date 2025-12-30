# Quick Setup Guide - HVACPro Website

## ⚡ Quick Start (5 Minutes)

### Step 1: Test the Website Locally

1. Open `index.html` in your web browser
2. Navigate through all three pages
3. Test the contact form (it's in demo mode)
4. Check browser console (F12) to see form data

### Step 2: Add Your Logo

1. Create or prepare your logo (PNG format, ~200x60px)
2. Save it as `assets/images/logo.png`
3. Refresh the website

### Step 3: Update Contact Information

Search for these placeholders and replace them:

**In all HTML files (index.html, products.html, contact.html):**
- `123 HVAC Street, City` → Your address
- `+1 234 567 8900` → Your phone number
- `info@hvacpro.com` → Your email
- Social media links in footer

## 📊 Google Sheets Data Collection Setup

### Complete Setup in 10 Minutes

#### Part 1: Create Your Spreadsheet (2 min)

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click "+ Blank" to create new spreadsheet
3. Name it "HVACPro Leads"
4. In Row 1, add these headers:

   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | Timestamp | Full Name | Email | Contact Number | Product Interest | Has Address | Resident 2+ Years | Page URL |

#### Part 2: Create Apps Script (3 min)

1. In your spreadsheet, click **Extensions → Apps Script**
2. Delete any existing code
3. Copy and paste this code:

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

4. Click the **Save** icon (💾)
5. Name the project "HVACPro Form Handler"

#### Part 3: Deploy the Script (3 min)

1. Click **Deploy** button (top right)
2. Select **New deployment**
3. Click the gear icon ⚙️ next to "Select type"
4. Choose **Web app**
5. Fill in:
   - **Description:** "HVACPro Lead Collection"
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
6. Click **Deploy**
7. Click **Authorize access**
8. Choose your Google account
9. Click **Advanced** → **Go to HVACPro Form Handler (unsafe)**
10. Click **Allow**
11. **COPY THE WEB APP URL** - it looks like:
    ```
    https://script.google.com/macros/s/LONG_STRING_HERE/exec
    ```

#### Part 4: Connect to Your Website (2 min)

1. Open `assets/js/script.js` in a text editor
2. Find this line (around line 17):
   ```javascript
   const SPREADSHEET_WEBHOOK_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with your copied URL:
   ```javascript
   const SPREADSHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec';
   ```
4. Save the file

## ✅ Testing Your Setup

### Test Form Submission

1. Open `index.html` in your browser
2. Scroll to the contact form
3. Fill out all fields:
   - Full Name: Test User
   - Email: test@example.com
   - Contact: 1234567890
   - Product: Any product
   - Check both consent boxes
4. Click **Submit Inquiry**
5. You should see a success message
6. Check your Google Sheet - a new row should appear!

### Verify Data

Your Google Sheet should now have:
- Timestamp
- All form field data
- Page URL where form was submitted

## 🚀 Deploy to Internet

### Option 1: Netlify (Easiest - Free)

1. Go to [netlify.com](https://netlify.com)
2. Sign up (free)
3. Click "Add new site" → "Deploy manually"
4. Drag your entire project folder into the upload area
5. Wait 30 seconds
6. Your site is live!
7. You'll get a URL like: `https://random-name-123.netlify.app`

**Custom Domain:**
1. Click "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to connect your domain

### Option 2: GitHub Pages (Free)

1. Create GitHub account at [github.com](https://github.com)
2. Create new repository
3. Upload all your files
4. Go to Settings → Pages
5. Select branch to deploy
6. Your site will be at: `https://username.github.io/repo-name`

### Option 3: Vercel (Free)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"
6. Done! You'll get a URL instantly

## 📧 Email Notifications (Optional)

### Get Emails When Forms Are Submitted

Add this to your Google Apps Script (after the `sheet.appendRow` line):

```javascript
// Send email notification
MailApp.sendEmail({
  to: "your-email@example.com",
  subject: "New HVACPro Lead: " + data.fullName,
  body: "New lead received!\n\n" +
        "Name: " + data.fullName + "\n" +
        "Email: " + data.email + "\n" +
        "Phone: " + data.contactNo + "\n" +
        "Product Interest: " + data.productInterest + "\n\n" +
        "View all leads: [YOUR_SPREADSHEET_URL]"
});
```

Replace `your-email@example.com` with your actual email.

## 🎨 Customization Quick Tips

### Change Colors

Edit `assets/css/style.css` (lines 7-11):

```css
:root {
    --primary-green: #2d8659;      /* Change this */
    --secondary-yellow: #f5b800;   /* Change this */
    --accent-maroon: #800020;      /* Change this */
}
```

### Change Business Info

Edit the footer in all HTML files:
- Search for "123 HVAC Street"
- Search for "+1 234 567"
- Search for "info@hvacpro.com"
- Replace with your info

### Add Product Images

Save images as:
- `assets/images/daikin-central.jpg`
- `assets/images/lg-split.jpg`
- etc.

## 🐛 Common Issues

### Form Shows "Demo Mode" Success Message

✅ **This is normal!** It means Contact Form 7 API is not set up yet, but the form is working.

To fix:
1. Set up Contact Form 7 (see README.md)
2. OR leave it in demo mode and use only Google Sheets (works great!)

### Data Not Appearing in Google Sheets

Check these:
1. ✅ Script deployed with "Anyone" access
2. ✅ Correct URL pasted in script.js
3. ✅ No typos in the URL
4. ✅ Check browser console for errors (F12)

### Submit Button Stays Disabled

✅ Both checkboxes must be checked to enable submit button. This is intentional!

### Console Shows Errors

✅ If form still submits successfully, you can ignore CORS warnings. They're expected.

## 📱 Mobile Testing

Test on mobile:
1. Deploy to Netlify/Vercel
2. Open site on your phone
3. Test all pages
4. Test form submission
5. Verify responsiveness

## 🔐 Security Notes

**Important:**
- Google Apps Script URL is safe to expose
- No API keys needed for basic setup
- All validation happens client-side
- Add server-side validation for production use

## 📞 Need Help?

1. **Form not working?**
   - Check browser console (F12)
   - Test in demo mode first
   - Verify spreadsheet URL

2. **Styling issues?**
   - Clear browser cache
   - Check CSS file path
   - Try different browser

3. **Deployment issues?**
   - Ensure all files uploaded
   - Check file paths are relative
   - Test locally first

## ✅ Launch Checklist

Before going live:

- [ ] Logo added
- [ ] Contact info updated (all 3 pages)
- [ ] Google Sheets connected and tested
- [ ] Form tested on desktop
- [ ] Form tested on mobile
- [ ] All links work
- [ ] Social media links updated
- [ ] Product images added (optional)
- [ ] Custom domain connected (optional)
- [ ] Email notifications set up (optional)

## 🎉 You're Done!

Your website is ready to collect leads!

**What happens when someone submits the form:**
1. ✅ They see a success message
2. ✅ Data is saved to your Google Sheet
3. ✅ (Optional) You receive an email notification
4. ✅ You can export data anytime from Google Sheets

---

Need the full documentation? See [README.md](README.md)
