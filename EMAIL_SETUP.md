# Email Setup Guide for Application Form

## Overview
The application form now sends emails to `Reece@redefinedlabs.io` when someone submits an application. Here's how to set it up:

## 1. Get a Resend API Key

1. Go to [Resend.com](https://resend.com) and create an account
2. Navigate to **API Keys** in your dashboard
3. Click **Create API Key**
4. Give it a name like "Portfolio Application Form"
5. Copy the API key (starts with `re_`)

## 2. Configure Environment Variable

Add your Resend API key to the `.env` file:

```bash
# Replace 'your_resend_api_key_here' with your actual key
RESEND_API_KEY=re_your_actual_api_key_here
```

## 3. Domain Setup (Important!)

**For production:** You'll need to verify your domain with Resend:

1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `reecehall.com`)
3. Follow the DNS verification steps
4. Update the `from` addresses in `/src/pages/api/application.ts`:
   - Change `applications@reecehall.com` to your verified domain
   - Change `noreply@reecehall.com` to your verified domain

**For development:** You can use Resend's test domain initially.

## 4. Email Routing

Currently configured to send emails to:
- **Your notification email:** `Reece@redefinedlabs.io`
- **Applicant confirmation:** Goes to their provided email address

To change the destination email, edit line 113 in `/src/pages/api/application.ts`:
```typescript
to: ['your-desired-email@domain.com'],
```

## 5. Email Content

The system sends two emails:

### 📧 To You (Application Notification)
- Subject: `🚀 New [collaboration/mentorship/inquiry] application from [Name]`
- Contains all form data in a professional HTML format
- Includes application ID for tracking

### 📧 To Applicant (Confirmation)
- Subject: `Application Received - [Application ID]`
- Professional confirmation with next steps
- Includes link to your blog for engagement

## 6. Security Features

✅ **Server-side validation** - All required fields checked  
✅ **Email validation** - Proper email format required  
✅ **Rate limiting** - Built into Resend  
✅ **SSL encryption** - Automatic with Astro  
✅ **Privacy compliant** - Privacy notice included  

## 7. Testing

1. Start the dev server: `npm run dev`
2. Open the Connect.app from the dock
3. Fill out the form with test data
4. Check your email for notifications

## 8. Future Integrations

The API is ready for additional integrations:

- **CRM Systems:** Add webhook to Notion, Airtable, or HubSpot
- **Slack/Discord:** Add notification to team channels  
- **Analytics:** Track application sources and conversion rates
- **Database:** Store applications for future reference

## 9. Troubleshooting

**Email not sending?**
- Check your Resend API key is correct
- Verify domain is set up properly
- Check console logs for error messages

**Form validation errors?**
- Ensure all required fields are filled
- Check email format is valid
- Verify network connection

## 10. Application Tracking

Each submission gets a unique ID: `APP-{timestamp}-{random}`

This helps you:
- Track conversations with applicants
- Reference specific applications
- Maintain professional communication

---

**Need help?** Check the Resend documentation or contact support at support@resend.com