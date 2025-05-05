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
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
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

// Lookup by UID
const ddd = async () => {
  const userRecord = await getAuth().getUserByEmail(
    "oscar.vanvelsen@gmail.com"
  );

  console.log("logged: userRecord", userRecord);
};
ddd();

// // Or lookup by email
// // const userRecord = await getAuth().getUserByEmail(email);

// console.log("Email verified:", userRecord.emailVerified);
