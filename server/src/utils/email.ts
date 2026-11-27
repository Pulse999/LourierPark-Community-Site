
import { Resend } from "resend";

type AdminInvitationEmailOptions = {
  recipientEmail: string;
  recipientName: string;
  roleName: string;
  invitationUrl: string;
  expiresAt: Date;
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

export async function sendAdminInvitationEmail({
  recipientEmail,
  recipientName,
  roleName,
  invitationUrl,
  expiresAt,
}: AdminInvitationEmailOptions): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);

  const sender =
    process.env.EMAIL_FROM ||
    "LourierPark <onboarding@resend.dev>";

  const safeName = escapeHtml(recipientName);
  const safeRole = escapeHtml(roleName);
  const safeUrl = escapeHtml(invitationUrl);

  const expiryDate = expiresAt.toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const { data, error } = await resend.emails.send({
    from: sender,
    to: [recipientEmail],
    subject: "You're invited to manage the LourierPark community website",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #092b40;">
        <div style="background: #092b40; padding: 28px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0;">LourierPark</h1>
          <p style="color: #dce9df; margin-bottom: 0;">Our Neighbourhood, Our Home</p>
        </div>

        <div style="padding: 32px 24px; background: #f7f8f5;">
          <h2 style="margin-top: 0;">You're invited!</h2>

          <p>Hello ${safeName},</p>

          <p>
            You've been invited to join the LourierPark community
            administration team.
          </p>

          <p>
            <strong>Assigned role:</strong> ${safeRole}
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a
              href="${safeUrl}"
              style="display: inline-block; background: #277a43; color: #ffffff; padding: 14px 26px; text-decoration: none; border-radius: 6px; font-weight: bold;"
            >
              Accept invitation
            </a>
          </div>

          <p>
            This invitation expires on <strong>${expiryDate}</strong>.
          </p>

          <p style="font-size: 13px; color: #64748b;">
            If the button doesn't work, copy and paste this link into
            your browser:
            <br />
            <a href="${safeUrl}">${safeUrl}</a>
          </p>
        </div>

        <div style="padding: 18px; text-align: center; color: #64748b; font-size: 12px;">
          LourierPark Community Administration
        </div>
      </div>
    `,
    text: `
Hello ${recipientName},

You've been invited to join the LourierPark community administration team.

Assigned role: ${roleName}

Accept your invitation here:
${invitationUrl}

This invitation expires on ${expiryDate}.

LourierPark - Our Neighbourhood, Our Home
    `,
  });

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`);
  }

  if (!data?.id) {
  throw new Error("Resend did not return an email ID.");
}

return data.id;
}
