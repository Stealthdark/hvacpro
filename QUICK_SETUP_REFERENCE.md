# Quick Setup Reference - Contact Forms

## 🚀 Fastest Setup (5 Minutes)

### Step 1: Email Delivery with FormSubmit

**Edit `assets/js/script.js` (lines 16-17):**

```javascript
const USE_ALTERNATIVE_ENDPOINT = true;
const ALTERNATIVE_API_ENDPOINT = 'https://formsubmit.co/YOUR-EMAIL@example.com';
```

Replace `YOUR-EMAIL@example.com` with your real email.

**That's it for email!** First submission will send you a verification email - click the link, and you're done.

---

### Step 2: Google Sheets Auto-Population

#### A. Create Google Sheet

1. Go to https://sheets.google.com
2. Create new spreadsheet: `HVACPro Leads`
3. Add headers in Row 1:

| Timestamp | Full Name | Email | Phone | Product Interest | Has Address | 2+ Years Resident | Page URL |
|-----------|-----------|-------|-------|------------------|-------------|-------------------|----------|

#### B. Create Apps Script

1. In sheet: **Extensions** → **Apps Script**
2. Paste this code:

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

3. **Save** (Ctrl+S)

#### C. Deploy

1. Click **Deploy** → **New deployment**
2. Click ⚙️ → **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **Authorize access** → Allow permissions
6. **Copy the URL** (looks like: `https://script.google.com/macros/s/AKfycbz.../exec`)

#### D. Update Website

**Edit `assets/js/script.js` (line 246):**

```javascript
const SPREADSHEET_WEBHOOK_URL = 'PASTE_YOUR_URL_HERE';
```

Paste your copied URL.

---

## ✅ Test It

1. Upload your website files
2. Submit test form
3. Check email inbox (and spam folder)
4. Check Google Sheet for new row

---

## 📧 Email Format Customization

Add parameters to FormSubmit URL:

```javascript
const ALTERNATIVE_API_ENDPOINT = 'https://formsubmit.co/your-email@example.com?_subject=New Lead&_template=table';
```

**Useful parameters:**
- `_subject=New Lead` - Custom email subject
- `_template=table` - Format as table
- `_cc=manager@email.com` - CC someone
- `_captcha=true` - Enable captcha

---

## 🔔 Get Email Alert for Each Submission

Add this to your Apps Script (after `sheet.appendRow(...)`):

```javascript
MailApp.sendEmail({
  to: "your-email@example.com",
  subject: "New HVACPro Lead",
  body: "Name: " + data.fullName + "\nEmail: " + data.email + "\nPhone: " + data.contactNo
});
```

Then redeploy (Deploy → Manage deployments → Edit → New version → Deploy).

---

## 🎯 Final Configuration Summary

**Your complete `script.js` configuration should look like:**

```javascript
// Line 16-17: Email Setup
const USE_ALTERNATIVE_ENDPOINT = true;
const ALTERNATIVE_API_ENDPOINT = 'https://formsubmit.co/your-email@example.com?_subject=New HVACPro Lead';

// Line 246: Spreadsheet Setup
const SPREADSHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

---

## 🚨 Common Issues

**No email received?**
- Check spam folder
- Verify FormSubmit email confirmation was clicked
- Wait 2-3 minutes for first submission

**No spreadsheet update?**
- Check Apps Script deployment settings
- Verify URL is correct in script.js
- Check Apps Script Executions log for errors

**Submit button stays disabled?**
- Check BOTH consent checkboxes must be checked
- Phone must be exactly 10 digits

---

## 📞 Need More Help?

See the complete guide: `CONTACT_FORM_SETUP_GUIDE.md`

**Alternative Services:**
- EmailJS: https://www.emailjs.com (200 emails/month free)
- Zapier: https://zapier.com (100 tasks/month free)
- Make.com: https://make.com (1000 ops/month free)
