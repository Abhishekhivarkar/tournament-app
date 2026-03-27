import SibApiV3Sdk from "sib-api-v3-sdk";
import "dotenv/config";
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendResetPasswordMail = async ({
  userEmail,
  userName,
  resetLink,
}) => {
  try {
    const response = await emailApi.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },
      to: [{ email: userEmail }],
      subject: "🔐 BattleNex | Reset Your Password",
      htmlContent: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset Password</title>
</head>
<body style="margin:0; padding:0; background-color:#0b0f19; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0f19; padding:30px 0;">
    <tr>
      <td align="center">
        
        <!-- Main Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#121826; border-radius:12px; padding:30px; color:#ffffff;">
          
          <!-- Logo / Title -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h1 style="margin:0; color:#00e0ff; font-size:28px; letter-spacing:1px;">
                BattleNex Tournament
              </h1>
              <p style="margin:5px 0 0; color:#9aa4bf; font-size:14px;">
                Competitive Gaming Platform
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td>
              <hr style="border:none; height:1px; background:#1f2a44; margin:20px 0;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="font-size:16px; line-height:26px; color:#e5e7eb;">
              <p>Hey <strong style="color:#ffffff;">${userName}</strong>,</p>

              <p>
                We received a request to reset your password for your 
                <strong>BattleNex Gaming Tournament</strong> account.
              </p>

              <p>
                Click the button below to securely reset your password and get back into the game.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding:30px 0;">
              <a href="${resetLink}"
                 style="
                   background:linear-gradient(90deg,#00e0ff,#0066ff);
                   color:#ffffff;
                   text-decoration:none;
                   padding:14px 32px;
                   border-radius:8px;
                   font-size:16px;
                   font-weight:bold;
                   display:inline-block;
                 ">
                🔐 Reset Password
              </a>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="font-size:14px; color:#9aa4bf; line-height:22px;">
              <p>
                If you didn’t request this, you can safely ignore this email.  
                Your account remains protected.
              </p>

              <p>
                ⏱️ This reset link will expire for security reasons.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:20px; font-size:12px; color:#6b7280;">
              <hr style="border:none; height:1px; background:#1f2a44; margin:20px 0;">
              <p style="margin:0;">
                © 2026 BattleNex Tournaments  
              </p>
              <p style="margin:5px 0 0;">
                Play Hard • Compete Fair • Win Big 🏆
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`,
    });
    console.log("MAIL SENT RESPONSE:", response);
  } catch (error) {
    console.error("❌ Reminder Mail Error:", error);
  }
};

export const sendTournamentRoomMail = async ({
  userEmail,
  userName,
  tournamentTitle,
  map,
  startTime,
  roomId,
  roomPassword,
}) => {
  try {
    const response = await emailApi.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },

      to: [{ email: userEmail }],

      subject: `🎮 BattleNex | Room Details for ${tournamentTitle}`,

      htmlContent: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Tournament Room Details</title>
</head>

<body style="margin:0; padding:0; background-color:#0b0f19; font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0f19; padding:30px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#121826; border-radius:12px; padding:30px; color:#ffffff;">

<tr>
<td align="center" style="padding-bottom:20px;">
<h1 style="margin:0; color:#00e0ff; font-size:28px;">
BattleNex Tournament
</h1>
<p style="margin:5px 0 0; color:#9aa4bf;">
Your Match Room is Ready
</p>
</td>
</tr>

<tr>
<td>
<hr style="border:none; height:1px; background:#1f2a44; margin:20px 0;">
</td>
</tr>

<tr>
<td style="font-size:16px; line-height:26px; color:#e5e7eb;">

<p>Hey <strong>${userName}</strong>,</p>

<p>
Your <strong>${tournamentTitle}</strong> match will start soon.
Please join the room using the details below.
</p>

</td>
</tr>

<tr>
<td>

<table width="100%" cellpadding="10" style="background:#0b0f19; border-radius:8px; margin:20px 0;">

<tr>
<td style="color:#9aa4bf;">Map</td>
<td style="color:#ffffff;"><strong>${map}</strong></td>
</tr>

<tr>
<td style="color:#9aa4bf;">Match Time</td>
<td style="color:#ffffff;"><strong>${startTime}</strong></td>
</tr>

<tr>
<td style="color:#9aa4bf;">Room ID</td>
<td style="color:#00e0ff;"><strong>${roomId}</strong></td>
</tr>

<tr>
<td style="color:#9aa4bf;">Password</td>
<td style="color:#00e0ff;"><strong>${roomPassword}</strong></td>
</tr>

</table>

</td>
</tr>

<tr>
<td style="font-size:14px; color:#9aa4bf;">

<p>
⚠️ Room will be active for limited time.  
Please join before the match starts.
</p>

<p>
Good luck and play fair! 🏆
</p>

</td>
</tr>

<tr>
<td align="center" style="padding-top:20px; font-size:12px; color:#6b7280;">

<hr style="border:none; height:1px; background:#1f2a44; margin:20px 0;">

<p style="margin:0;">© 2026 BattleNex Tournaments</p>

<p style="margin:5px 0 0;">
Play Hard • Compete Fair • Win Big 🎮
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
    });

    console.log("ROOM MAIL SENT:", response);
  } catch (error) {
    console.error("❌ Room Mail Error:", error);
  }
};
