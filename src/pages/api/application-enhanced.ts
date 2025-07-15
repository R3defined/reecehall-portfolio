import type { APIRoute } from 'astro';
import { Resend } from 'resend';

interface ApplicationData {
  name: string;
  email: string;
  applicationReason: string;
  message: string;
  howDidYouFindMe: string;
  links: string;
}

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: ApplicationData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'applicationReason', 'message', 'howDidYouFindMe'];
    const missingFields = requiredFields.filter(field => !data[field as keyof ApplicationData]?.trim());

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          missingFields 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const timestamp = new Date().toISOString();

    // 1. SAVE TO NOTION DATABASE (Recommended)
    try {
      await saveToNotion({
        ...data,
        applicationId,
        timestamp,
        status: 'New'
      });
    } catch (notionError) {
      console.error('Notion save failed:', notionError);
      // Continue with email - don't fail the whole request
    }

    // 2. SEND EMAIL NOTIFICATIONS
    const emailTasks = [
      // Email to you
      resend.emails.send({
        from: 'Application Form <applications@reecehall.com>',
        to: ['Reece@redefinedlabs.io'],
        subject: `🚀 New ${data.applicationReason} application from ${data.name}`,
        html: createNotificationEmail(data, applicationId),
        // Add reply-to for easy responses
        reply_to: data.email,
        headers: {
          'X-Application-ID': applicationId,
          'X-Priority': data.applicationReason === 'services' ? 'high' : 'normal'
        }
      }),

      // Confirmation to applicant
      resend.emails.send({
        from: 'Reece Hall <noreply@reecehall.com>',
        to: [data.email],
        subject: `Application Received - ${applicationId}`,
        html: createConfirmationEmail(data, applicationId)
      })
    ];

    // 3. OPTIONAL: SLACK NOTIFICATION FOR URGENT ITEMS
    if (data.applicationReason === 'services') {
      try {
        await sendSlackNotification(data, applicationId);
      } catch (slackError) {
        console.error('Slack notification failed:', slackError);
      }
    }

    // 4. OPTIONAL: WEBHOOK TO ZAPIER/MAKE FOR AUTOMATION
    try {
      await sendWebhook({
        ...data,
        applicationId,
        timestamp,
        source: 'portfolio_application_form'
      });
    } catch (webhookError) {
      console.error('Webhook failed:', webhookError);
    }

    await Promise.all(emailTasks);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application submitted successfully',
        applicationId: applicationId
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Application submission error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Unable to process application at this time'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// NOTION DATABASE INTEGRATION
async function saveToNotion(applicationData: any) {
  if (!import.meta.env.NOTION_API_KEY || !import.meta.env.NOTION_DATABASE_ID) {
    throw new Error('Notion credentials not configured');
  }

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: import.meta.env.NOTION_DATABASE_ID },
      properties: {
        'Application ID': {
          title: [{ text: { content: applicationData.applicationId } }]
        },
        'Name': {
          rich_text: [{ text: { content: applicationData.name } }]
        },
        'Email': {
          email: applicationData.email
        },
        'Purpose': {
          select: { name: applicationData.applicationReason }
        },
        'Status': {
          select: { name: 'New' }
        },
        'Message': {
          rich_text: [{ text: { content: applicationData.message } }]
        },
        'Source': {
          rich_text: [{ text: { content: applicationData.howDidYouFindMe } }]
        },
        'Links': {
          url: applicationData.links || null
        },
        'Submitted': {
          date: { start: applicationData.timestamp }
        },
        'Priority': {
          select: { 
            name: applicationData.applicationReason === 'services' ? 'High' : 'Normal' 
          }
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }

  return response.json();
}

// SLACK NOTIFICATION FOR HIGH-PRIORITY ITEMS
async function sendSlackNotification(data: ApplicationData, applicationId: string) {
  if (!import.meta.env.SLACK_WEBHOOK_URL) {
    return;
  }

  const slackMessage = {
    text: `🚨 High Priority Application: ${data.name}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `🚀 New ${data.applicationReason} Application`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Name:*\n${data.name}`
          },
          {
            type: "mrkdwn",
            text: `*Email:*\n${data.email}`
          },
          {
            type: "mrkdwn",
            text: `*ID:*\n${applicationId}`
          },
          {
            type: "mrkdwn",
            text: `*Source:*\n${data.howDidYouFindMe}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Message:*\n${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}`
        }
      }
    ]
  };

  await fetch(import.meta.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slackMessage)
  });
}

// WEBHOOK FOR ZAPIER/MAKE AUTOMATION
async function sendWebhook(data: any) {
  if (!import.meta.env.ZAPIER_WEBHOOK_URL) {
    return;
  }

  await fetch(import.meta.env.ZAPIER_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// EMAIL TEMPLATE FUNCTIONS
function createNotificationEmail(data: ApplicationData, applicationId: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New Application Submission</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
      .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
      .section { margin-bottom: 25px; }
      .label { font-weight: 600; color: #495057; margin-bottom: 5px; }
      .value { color: #212529; margin-bottom: 15px; }
      .priority { background: ${data.applicationReason === 'services' ? '#28a745' : data.applicationReason === 'collaboration' ? '#007bff' : '#ffc107'}; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; }
      .reply-button { background: #007bff; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🚀 New Application Submission</h1>
        <p>Application ID: ${applicationId}</p>
        <span class="priority">${data.applicationReason.toUpperCase()}</span>
      </div>
      <div class="content">
        <div class="section">
          <h3>👤 Contact Information</h3>
          <div class="label">Name:</div>
          <div class="value">${data.name}</div>
          <div class="label">Email:</div>
          <div class="value">${data.email}</div>
        </div>
        
        <div class="section">
          <h3>🎯 Application Details</h3>
          <div class="label">What brings them here:</div>
          <div class="value">${data.applicationReason}</div>
          <div class="label">How they found you:</div>
          <div class="value">${data.howDidYouFindMe}</div>
          ${data.links ? `<div class="label">Links provided:</div><div class="value"><a href="${data.links}" target="_blank" style="color: #007bff;">${data.links}</a></div>` : ''}
        </div>
        
        <div class="section">
          <h3>💭 Vision / Challenge / Idea</h3>
          <div class="value" style="background: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${data.message}</div>
        </div>
        
        <div class="section">
          <a href="mailto:${data.email}?subject=Re: Your Application - ${applicationId}" class="reply-button">
            Quick Reply to ${data.name}
          </a>
        </div>
        
        <div class="section">
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Next Steps:</strong> Review and respond within 24-48 hours</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

function createConfirmationEmail(data: ApplicationData, applicationId: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
      .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✅ Application Received</h1>
        <p>Thank you for your interest, ${data.name}!</p>
      </div>
      <div class="content">
        <p>Your application for <strong>${data.applicationReason}</strong> has been successfully submitted.</p>
        
        <p><strong>Application ID:</strong> ${applicationId}</p>
        
        <p><strong>What happens next?</strong></p>
        <ul>
          <li>I'll review your application within 24-48 hours</li>
          <li>If it's a good fit, I'll reach out to schedule a consultation call</li>
          <li>We'll discuss your project in detail and create a custom proposal</li>
        </ul>
        
        <p>In the meantime, feel free to explore my portfolio and recent projects at <a href="https://reecehall.com">reecehall.com</a>.</p>
        
        <p>Best regards,<br>
        <strong>Reece Hall</strong><br>
        Lead System Architect, Redefined Solutions</p>
      </div>
    </div>
  </body>
  </html>
  `;
}