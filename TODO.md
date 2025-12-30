# HVACPro Website - Action Items

## 🎯 Immediate Tasks (Before Launch)

### 1. Branding & Assets
- [ ] Create/add company logo (`assets/images/logo.png`)
- [ ] Add product images to `assets/images/` folder
  - [ ] daikin-central.jpg
  - [ ] carrier-central.jpg
  - [ ] mitsubishi-central.jpg
  - [ ] trane-central.jpg
  - [ ] york-central.jpg
  - [ ] lg-split.jpg
  - [ ] samsung-split.jpg
  - [ ] blue-star-split.jpg
  - [ ] voltas-split.jpg
  - [ ] hitachi-split.jpg
- [ ] Add about-us image (`assets/images/about-us.jpg`)

### 2. Contact Information Updates

**Update in ALL three files (index.html, products.html, contact.html):**

- [ ] Replace "123 HVAC Street, City" with your actual address
- [ ] Replace "+1 234 567 8900" with your phone number
- [ ] Replace "info@hvacpro.com" with your email address
- [ ] Update social media links (Facebook, Twitter, Instagram, LinkedIn)
- [ ] Update Google Maps embed in contact.html with your location

**Specific Changes Needed:**

**Footer Section (all 3 files):**
```html
<!-- Find and replace -->
<li class="mb-2"><i class="fas fa-map-marker-alt me-2"></i> YOUR_ADDRESS</li>
<li class="mb-2"><i class="fas fa-phone me-2"></i> YOUR_PHONE</li>
<li class="mb-2"><i class="fas fa-envelope me-2"></i> YOUR_EMAIL</li>
```

**Social Links (all 3 files):**
```html
<!-- Update href="#" with your actual URLs -->
<a href="YOUR_FACEBOOK_URL" class="text-white me-3">
<a href="YOUR_TWITTER_URL" class="text-white me-3">
<a href="YOUR_INSTAGRAM_URL" class="text-white me-3">
<a href="YOUR_LINKEDIN_URL" class="text-white">
```

**Contact Page - Business Hours:**
- [ ] Update business hours in contact.html if different
- [ ] Update emergency service number if you have one

### 3. Google Sheets Integration (For Lead Collection)

- [ ] Create Google Sheet named "HVACPro Leads"
- [ ] Add column headers (see SETUP_GUIDE.md)
- [ ] Create Google Apps Script (copy from SETUP_GUIDE.md)
- [ ] Deploy Apps Script as web app
- [ ] Copy deployment URL
- [ ] Update `SPREADSHEET_WEBHOOK_URL` in `assets/js/script.js`
- [ ] Test form submission → Check Google Sheet receives data

### 4. Contact Form 7 Setup (Optional - WordPress Required)

**Only if you have a WordPress site:**

- [ ] Install WordPress (if not already)
- [ ] Install Contact Form 7 plugin
- [ ] Create contact form with required fields
- [ ] Get form ID
- [ ] Enable REST API
- [ ] Update `CF7_API_ENDPOINT` in `assets/js/script.js`

**Alternative (If no WordPress):**

- [ ] Choose alternative: FormSpree, Netlify Forms, or Getform
- [ ] Sign up for chosen service
- [ ] Get API endpoint
- [ ] Update `ALTERNATIVE_API_ENDPOINT` in `assets/js/script.js`
- [ ] Set `USE_ALTERNATIVE_ENDPOINT = true`

### 5. Content Customization

- [ ] Review and update "About Us" section text
- [ ] Verify product descriptions are accurate
- [ ] Update copyright year in footer if needed
- [ ] Add any additional products if you have more than 10

### 6. Testing

- [ ] Test website on desktop (Chrome, Firefox, Safari)
- [ ] Test website on mobile devices
- [ ] Test all navigation links
- [ ] Test contact form submission
- [ ] Verify data appears in Google Sheets
- [ ] Test all three pages load correctly
- [ ] Check all images display properly
- [ ] Verify form validation works
- [ ] Test consent checkboxes enable/disable submit button

### 7. SEO & Meta Tags (Optional but Recommended)

- [ ] Update meta descriptions in all HTML files
- [ ] Add Google Analytics tracking code (if desired)
- [ ] Create favicon.ico and add to root folder
- [ ] Add robots.txt file
- [ ] Add sitemap.xml file

### 8. Deployment

- [ ] Choose hosting platform:
  - [ ] Netlify (recommended, free)
  - [ ] Vercel (free)
  - [ ] GitHub Pages (free)
  - [ ] Traditional hosting
- [ ] Deploy website
- [ ] Test live site
- [ ] Connect custom domain (if you have one)
- [ ] Set up SSL/HTTPS (usually automatic with Netlify/Vercel)

## 📧 Optional Enhancements

### Email Notifications
- [ ] Add email notification code to Google Apps Script
- [ ] Update recipient email address
- [ ] Test email notifications work

### Advanced Features
- [ ] Add Google Analytics for tracking visitors
- [ ] Set up Google Search Console
- [ ] Add live chat widget (Tawk.to, Intercom, etc.)
- [ ] Create thank you page after form submission
- [ ] Add email auto-responder to confirm inquiry received

### Marketing
- [ ] Create social media accounts
- [ ] Add Facebook Pixel (if running Facebook ads)
- [ ] Set up Google Ads conversion tracking
- [ ] Create business listing on Google My Business

## 🔄 Ongoing Maintenance

### Monthly
- [ ] Review Google Sheets data
- [ ] Follow up with leads
- [ ] Update product information if needed
- [ ] Check all forms are working

### As Needed
- [ ] Add new products
- [ ] Update pricing (if you add it later)
- [ ] Update contact information
- [ ] Refresh product images

## 📝 Quick Reference

### Files to Edit

1. **For Contact Info:**
   - `index.html` - Lines: Footer section (~350-400)
   - `products.html` - Lines: Footer section (~450-500)
   - `contact.html` - Lines: Contact info sections (~50-150) + Footer

2. **For API Configuration:**
   - `assets/js/script.js` - Lines: 7-12

3. **For Styling:**
   - `assets/css/style.css` - Lines: 7-14 (color variables)

4. **For Logo:**
   - Save as: `assets/images/logo.png`

### Important URLs to Keep

After setup, save these:
- [ ] Live website URL: _________________
- [ ] Google Sheet URL: _________________
- [ ] Apps Script URL: _________________
- [ ] Hosting dashboard: _________________

## ✅ Pre-Launch Checklist

Before announcing your website:

- [ ] All contact information is updated
- [ ] Logo is in place
- [ ] Forms are tested and working
- [ ] Google Sheets is receiving data
- [ ] Website is deployed and accessible
- [ ] All pages load without errors
- [ ] Mobile version looks good
- [ ] SSL certificate is active (https://)
- [ ] You can access leads in Google Sheets
- [ ] Email notifications work (if set up)

## 🎉 Launch Day

- [ ] Make final test submission
- [ ] Share website URL with team
- [ ] Post on social media
- [ ] Add to email signature
- [ ] Update business cards/marketing materials
- [ ] Monitor first few submissions closely

---

## 📞 Getting Help

**Refer to:**
- `SETUP_GUIDE.md` - Quick setup instructions
- `README.md` - Full documentation
- Browser console (F12) - For debugging errors

**Common Support Resources:**
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Google Apps Script Guide](https://developers.google.com/apps-script)
- [Netlify Documentation](https://docs.netlify.com/)

---

**Start with Section 1 (Branding & Assets) and work your way down!**

Good luck with your HVACPro website! 🚀
