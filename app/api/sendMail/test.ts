// sendEmail.ts

const RESEND_API_KEY = "re_C721zumG_JkBYo51YHqkqLL6JESQyuitg"; // replace with your actual API key
const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendEmail({
  to,
  subject,
  html,
  from = "info@leaqx.com", // ✅ use your verified domain sender
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Resend API error:", errorData);
    throw new Error(errorData.error?.message || "Failed to send email");
  }

  return await response.json();
}
// // Example usage
// sendEmail({
//   to: "oscar.vanvelsen@gmail.com",
//   subject: "Test Email",
//   html: "<p>This is a test email from the application.</p>",
// })
//   .then((result) => console.log("Email sent successfully:", result))
//   .catch((error) => console.error("Failed to send email:", error));
