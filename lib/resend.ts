export async function resendMail(options: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: any[];
  tags?: Array<{ name: string; value: string }>;
  text?: string;
  replyTo?: string;
  [key: string]: any;
}): Promise<any> {
  const {
    to,
    subject,
    html,
    from = "info@leaqx.com",
    ...restOptions
  } = options;

  if (!to || !subject || !html) {
    throw new Error(
      "Missing required email parameters: to, subject, and html are required"
    );
  }

  const emailPayload = {
    from,
    to,
    subject,
    html,
    ...restOptions,
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,

        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to send email");
    }

    return await response.json();
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

// Test function to send an email
async function testResendMail() {
  try {
    console.log("Starting email test...");

    const result = await resendMail({
      to: "oscar.vanvelsen@gmail.com",
      subject: "Test Email from Resend API",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h1 style="color: #333;">Test Email</h1>
          <p>This is a test email sent using the Resend API integration.</p>
          <p>If you're seeing this, the email functionality is working correctly!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
          <hr>
          <p style="color: #777; font-size: 12px;">This is an automated test message.</p>
        </div>
      `,
      // Optional parameters
      text: "This is a test email sent using the Resend API integration. If you're seeing this, the email functionality is working correctly!",
    });

    console.log("Email sent successfully!");
    console.log("Response:", result);
    return result;
  } catch (error) {
    console.error("Failed to send test email:", error);
    throw error;
  }
}

// // Execute the test
// testResendMail()
//   .then(() => console.log("Test completed successfully"))
//   .catch((error) => console.error("Test failed:", error));
