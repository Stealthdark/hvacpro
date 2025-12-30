# Contact Form Setup Guide - Email & Spreadsheet Integration

This guide will help you set up your HVACPro contact form to:
1. **Receive form submissions via email**
2. **Auto-populate a Google Spreadsheet**

---

## 🎯 Quick Overview

Your website currently has 3 contact forms:
- **Homepage** - Bottom of the page
- **Products Page** - Bottom of the page
- **Contact Page** - Main form

All forms collect: Full Name, Email, Phone, Product Interest, and 2 consent checkboxes.

---

## ✉️ Option 1: Email Setup Using FormSubmit (Easiest - No Sign-up Required)

### Step 1: Update JavaScript Configuration

Edit `assets/js/script.js` and find these lines (around line 16-17):

```javascript
const USE_ALTERNATIVE_ENDPOINT = false;
const ALTERNATIVE_API_ENDPOINT = 'YOUR_ALTERNATIVE_ENDPOINT_HERE';
```

**Change to:**

```javascript
const USE_ALTERNATIVE_ENDPOINT = true;
const ALTERNATIVE_API_ENDPOINT = 'https://formsubmit.co/your-email@example.com';
```

Replace `your-email@example.com` with **your actual email address**.

### Step 2: First Submission (Email Verification)

1. Upload your website files to your hosting
2. Submit a test form
3. **Check your email inbox** - You'll receive a verification email from FormSubmit
4. **Click the confirmation link** in the email
5. Done! All future submissions will be sent to your email

### Step 3: Customize Email Settings (Optional)

Add parameters to customize the form behavior:

```javascript
// Example with custom settings
const ALTERNATIVE_API_ENDPOINT = 'https://formsubmit.co/your-email@example.com?_subject=New HVACPro Lead&_template=table&_captcha=false';
```

**Available Parameters:**
- `_subject=New HVACPro Lead` - Custom email subject
- `_template=table` - Format email as a table (or `box`)
- `_captcha=false` - Disable captcha (or `true` to enable)
- `_cc=manager@example.com` - CC another email
- `_next=https://yoursite.com/thank-you.html` - Redirect after submission

**Example with all options:**
```javascript
const ALTERNATIVE_API_ENDPOINT = 'https://formsubmit.co/sales@hvacpro.com?_subject=New Lead from Website&_template=table&_captcha=true&_cc=manager@hvacpro.com';
```

### Benefits of FormSubmit:
✅ Completely free
✅ No account creation needed
✅ Instant email delivery
✅ Spam protection built-in
✅ Works with any email provider
✅ Professional email formatting

---

## 📧 Option 2: Email Setup Using EmailJS (More Control)

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Sign up for a **free account** (200 emails/month free)
3. Verify your email address

### Step 2: Connect Your Email Service

1. Go to **Email Services** in EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for personal)
   - **Outlook/Office 365** (recommended for business)
   - **Yahoo**
   - **Custom SMTP** (for any email provider)
4. Follow the connection wizard
5. **Note down your Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template

1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Use this template content:

**Template Name:** `hvacpro_lead_notification`

**Subject:** `New Lead from HVACPro Website`

**Email Body:**
```html
New lead submission from HVACPro website:

Full Name: {{fullName}}
Email: {{email}}
Phone: {{contactNo}}
Product Interest: {{productInterest}}

Has Physical Address: {{hasAddress}}
Resident for 2+ years: {{residentDuration}}

Submitted At: {{submittedAt}}
Page URL: {{pageUrl}}

---
This is an automated notification from your HVACPro website contact form.
```

4. Click **Save**
5. **Note down your Template ID** (e.g., `template_xyz789`)

### Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `user_abc123xyz`)
3. Copy it

### Step 5: Update Your Website

Replace the form submission code in `assets/js/script.js`:

**Find this section (around line 195-220):**

```javascript
async function submitToAPI(endpoint, data) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        return {
            success: response.ok,
            message: result.message,
            data: result
        };
    } catch (error) {
        console.error('API submission error:', error);
        return {
            success: false,
            message: error.message
        };
    }
}
```

**Replace with EmailJS code:**

```javascript
// Add EmailJS script to your HTML first
// Add this BEFORE closing </body> tag in index.html, products.html, contact.html:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_abc123';  // Your Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789'; // Your Template ID
const EMAILJS_PUBLIC_KEY = 'user_abc123xyz';   // Your Public Key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

async function submitToAPI(endpoint, data) {
    try {
        // Send email via EmailJS
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            data
        );

        return {
            success: true,
            message: 'Email sent successfully',
            data: response
        };
    } catch (error) {
        console.error('EmailJS error:', error);
        return {
            success: false,
            message: error.text || error.message
        };
    }
}
```

### Step 6: Add EmailJS Script

Add this line BEFORE the closing `</body>` tag in **all 3 HTML files** (index.html, products.html, contact.html):

```html
    <!-- EmailJS SDK -->
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

    <!-- Your existing scripts -->
    <script src="assets/js/script.js"></script>
</body>
```

### Benefits of EmailJS:
✅ 200 free emails/month
✅ Custom email templates
✅ Multiple email accounts
✅ Auto-reply to users
✅ Email analytics
✅ Spam protection

---

## 📊 Google Sheets Auto-Population Setup

### Method 1: Google Apps Script (Free, Unlimited)

#### Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create new spreadsheet
3. Name it: `HVACPro Leads`
4. Create headers in **Row 1**:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Full Name | Email | Phone | Product Interest | Has Address | 2+ Years Resident | Page URL |

#### Step 2: Open Apps Script Editor

1. In your spreadsheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy and paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);

    // Append new row with form data
    sheet.appendRow([
      new Date(),                    // Timestamp
      data.fullName,                 // Full Name
      data.email,                    // Email
      data.contactNo,                // Phone Number
      data.productInterest,          // Product Interest
      data.hasAddress,               // Has Physical Address
      data.residentDuration,         // 2+ Years Resident
      data.pageUrl                   // Page URL where form was submitted
    ]);

    // Optional: Send email notification
    // Uncomment the lines below to get email alerts for each submission
    /*
    MailApp.sendEmail({
      to: "your-email@example.com",
      subject: "New HVACPro Lead",
      body: "New lead received!\n\n" +
            "Name: " + data.fullName + "\n" +
            "Email: " + data.email + "\n" +
            "Phone: " + data.contactNo + "\n" +
            "Product: " + data.productInterest
    });
    */

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional)
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        fullName: "Test User",
        email: "test@example.com",
        contactNo: "1234567890",
        productInterest: "Daikin Centralized AC",
        hasAddress: "Yes",
        residentDuration: "Yes",
        pageUrl: "https://yoursite.com/test"
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. Click **Save** (💾 icon or `Ctrl+S`)
5. Name your project: `HVACPro Form Handler`

#### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the ⚙️ icon next to "Select type"
3. Choose **Web app**
4. Configure settings:
   - **Description:** `HVACPro Form Submission Handler`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone`
5. Click **Deploy**
6. **Grant permissions:**
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to HVACPro Form Handler (unsafe)**
   - Click **Allow**
7. **Copy the Web app URL** - It looks like:
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```

#### Step 4: Update Your Website

Edit `assets/js/script.js` and find this line (around line 246):

```javascript
const SPREADSHEET_WEBHOOK_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
```

**Replace with your Web App URL:**

```javascript
const SPREADSHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

#### Step 5: Test the Integration

1. Upload your updated website
2. Submit a test form
3. Check your Google Sheet - a new row should appear!

### Enable Email Notifications (Optional)

To get an email every time someone submits a form:

1. In your Apps Script code, find these commented lines:
   ```javascript
   /*
   MailApp.sendEmail({
   ```

2. Remove the `/*` before and `*/` after the email code to uncomment it

3. Change `your-email@example.com` to your actual email

4. Save and redeploy:
   - Click **Deploy** → **Manage deployments**
   - Click ✏️ Edit
   - Change version to **New version**
   - Click **Deploy**

---

### Method 2: Zapier (Easier but Limited Free Plan)

#### Step 1: Create Zapier Account

1. Go to [Zapier.com](https://zapier.com)
2. Sign up for free account (100 tasks/month)

#### Step 2: Create a Zap

1. Click **Create Zap**
2. **Trigger:**
   - Search for "Webhooks by Zapier"
   - Choose **Catch Hook**
   - Copy the webhook URL provided
3. **Action:**
   - Search for "Google Sheets"
   - Choose **Create Spreadsheet Row**
   - Connect your Google account
   - Select your spreadsheet: `HVACPro Leads`
   - Map the fields:
     - A → Timestamp (use `{{zap_meta_timestamp}}`)
     - B → Full Name (use `{{fullName}}`)
     - C → Email (use `{{email}}`)
     - D → Phone (use `{{contactNo}}`)
     - E → Product Interest (use `{{productInterest}}`)
     - F → Has Address (use `{{hasAddress}}`)
     - G → 2+ Years Resident (use `{{residentDuration}}`)
     - H → Page URL (use `{{pageUrl}}`)
4. Click **Test & Continue**
5. Turn on your Zap

#### Step 3: Update Website

Edit `assets/js/script.js`:

```javascript
const SPREADSHEET_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/';
```

---

### Method 3: Make.com / Integromat (Similar to Zapier)

1. Go to [Make.com](https://make.com)
2. Create free account (1,000 operations/month)
3. Create new scenario:
   - **Trigger:** Webhooks → Custom Webhook
   - **Action:** Google Sheets → Add a Row
4. Copy webhook URL
5. Update `SPREADSHEET_WEBHOOK_URL` in script.js

---

## 🔥 Complete Integration (Email + Spreadsheet)

### Recommended Setup for Best Results:

**For Email:** Use **FormSubmit** (easiest, instant)
**For Spreadsheet:** Use **Google Apps Script** (free, unlimited)

### Update your `script.js` configuration:

```javascript
// Email Setup (FormSubmit)
const USE_ALTERNATIVE_ENDPOINT = true;
const ALTERNATIVE_API_ENDPOINT = 'https://formsubmit.co/your-email@example.com?_subject=New HVACPro Lead&_template=table';

// Spreadsheet Setup (Google Apps Script)
const SPREADSHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

**This gives you:**
✅ Instant email notifications
✅ All submissions saved to Google Sheets
✅ Completely free
✅ No monthly limits
✅ Professional email formatting

---

## 📝 Testing Your Setup

### Test Checklist:

1. **Test Form Submission:**
   - Fill out all fields
   - Check both consent checkboxes
   - Click Submit
   - Should see success message

2. **Check Email:**
   - Open your email inbox
   - Look for form submission email
   - Verify all data is correct

3. **Check Spreadsheet:**
   - Open your Google Sheet
   - Check for new row
   - Verify all columns populated

4. **Test All 3 Forms:**
   - Homepage form
   - Products page form
   - Contact page form

---

## 🚨 Troubleshooting

### Email Not Received?

**FormSubmit:**
- Check spam/junk folder
- Verify email verification was completed
- Try different email address
- Check FormSubmit status: https://formsubmit.co/status

**EmailJS:**
- Check monthly quota (200 emails/month on free plan)
- Verify Service ID, Template ID, and Public Key are correct
- Check browser console for errors
- Test template in EmailJS dashboard

### Data Not in Spreadsheet?

**Google Apps Script:**
- Check deployment settings (should be "Execute as: Me" and "Who has access: Anyone")
- View execution logs: Apps Script editor → **Executions**
- Test the script manually using `testDoPost()` function
- Redeploy with new version

**Zapier/Make:**
- Check task history in dashboard
- Verify Zap is turned ON
- Check webhook URL is correct
- Test webhook in Zapier dashboard

### Form Validation Issues?

- Ensure both consent checkboxes are checked
- Phone number must be 10 digits
- Valid email format required
- All fields are required

---

## 💡 Pro Tips

### 1. Customize Form Responses

Edit the success message in `script.js` (line 172):

```javascript
showSuccessMessage(formMessage, 'Thank you! We will contact you within 24 hours.');
```

### 2. Add Auto-Reply Email

In Google Apps Script, add this after `sheet.appendRow()`:

```javascript
// Send auto-reply to customer
MailApp.sendEmail({
  to: data.email,
  subject: "Thank you for contacting HVACPro",
  body: "Dear " + data.fullName + ",\n\n" +
        "Thank you for your interest in our products. " +
        "Our team will contact you within 24 hours.\n\n" +
        "Best regards,\n" +
        "HVACPro Team"
});
```

### 3. Format Phone Numbers

Add this function in Apps Script:

```javascript
function formatPhone(phone) {
  var cleaned = phone.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

// Use it: formatPhone(data.contactNo)
```

### 4. Add Conditional Formatting to Sheet

In Google Sheets:
1. Select column B (Full Name)
2. Format → Conditional formatting
3. Format cells if "Is not empty"
4. Choose highlight color
5. This makes new leads stand out!

### 5. Create Data Validation

Prevent duplicate emails:
1. Select Email column
2. Data → Data validation
3. Criteria: Custom formula
4. Formula: `=COUNTIF(C:C, C1)=1`
5. Show warning on invalid data

---

## 📊 Analytics & Reporting

### Track Conversion Sources

The form automatically captures `pageUrl`. In Google Sheets, you can:

1. **Count leads per page:**
   ```
   =COUNTIF(H:H,"*index.html*")
   ```

2. **Weekly summary:**
   ```
   =QUERY(A:H,"SELECT COUNT(A) WHERE A >= date '"&TEXT(TODAY()-7,"yyyy-MM-dd")&"'")
   ```

3. **Most popular product:**
   ```
   =MODE(E:E)
   ```

---

## 🎯 Next Steps

After setup:

1. ✅ Test all 3 contact forms
2. ✅ Verify emails are received
3. ✅ Confirm data appears in spreadsheet
4. ✅ Set up email filters/labels for organization
5. ✅ Create automated response templates
6. ✅ Share Google Sheet with your sales team
7. ✅ Set up notification rules in Google Sheets

---

## 📞 Support Resources

- **FormSubmit Docs:** https://formsubmit.co/documentation
- **EmailJS Docs:** https://www.emailjs.com/docs/
- **Google Apps Script:** https://developers.google.com/apps-script
- **Zapier Help:** https://help.zapier.com
- **Make.com Docs:** https://www.make.com/en/help/

---

**Your contact forms are now ready to capture leads and grow your business!** 🚀

Choose your preferred setup method and follow the step-by-step instructions above.
