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

    // Create professional HTML email content
    const htmlContent = `
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
            <a href="mailto:${data.email}?subject=Re: Your Application - ${applicationId}&body=Hi ${data.name},%0D%0A%0D%0AThank you for your application (${applicationId}). I've reviewed your submission and would like to discuss your ${data.applicationReason} request further.%0D%0A%0D%0AWhen would be a good time for a brief call this week?%0D%0A%0D%0ABest regards,%0D%0AReece Hall" class="reply-button">
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

    try {
      // Send notification email to you
      const emailResult = await resend.emails.send({
        from: 'Application Form <applications@reecehall.com>',
        to: ['Reece@redefinedlabs.io'],
        subject: `🚀 New ${data.applicationReason} application from ${data.name}`,
        html: htmlContent,
        // Add reply-to for easy responses
        replyTo: data.email,
        headers: {
          'X-Application-ID': applicationId,
          'X-Priority': data.applicationReason === 'services' ? 'high' : 'normal'
        },
        text: `
New Application Submission - ${applicationId}

Contact Information:
- Name: ${data.name}
- Email: ${data.email}

Application Details:
- What brings them here: ${data.applicationReason}
- How they found you: ${data.howDidYouFindMe}
- Links provided: ${data.links || 'None'}

Vision/Challenge/Idea:
${data.message}

Submitted: ${new Date().toLocaleString()}
        `.trim(),
      });

      // Send confirmation email to applicant
      await resend.emails.send({
        from: 'Reece Hall <noreply@reecehall.com>',
        to: [data.email],
        subject: `Application Received - ${applicationId}`,
        html: `
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
        `,
      });

      console.log('Emails sent successfully:', emailResult);

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with success response even if email fails
      // You might want to implement a fallback notification system
    }

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