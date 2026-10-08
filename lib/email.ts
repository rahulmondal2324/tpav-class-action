import "server-only";

import { AppError, baseUrl } from "./security";
import { cleanHtml } from "./validation";


/* =========================================================
   HTML ESCAPE
========================================================= */

export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        } as Record<string, string>
      )[char]!,
  );
}


/* =========================================================
   EMAIL TEMPLATE
========================================================= */

export function emailFrame(
  heading: string,
  content: string,
  buttonText?: string,
  buttonUrl?: string,
  unsubscribeUrl?: string,
) {
  const safeHeading = escapeHtml(heading);

  const button =
    buttonText && buttonUrl
      ? `
        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          style="margin:28px 0 24px;"
        >
          <tr>
            <td
              style="
                background:#001c3f;
                border-radius:8px;
              "
            >
              <a
                href="${escapeHtml(buttonUrl)}"
                style="
                  display:inline-block;
                  padding:14px 24px;
                  color:#ffffff;
                  font-family:Arial,sans-serif;
                  font-size:14px;
                  font-weight:700;
                  text-decoration:none;
                "
              >
                ${escapeHtml(buttonText)}
              </a>
            </td>
          </tr>
        </table>
      `
      : "";

  const unsubscribeText = unsubscribeUrl
    ? `
      You are receiving this email because you requested
      Class Action Against TPAV updates.
      <a
        href="${escapeHtml(unsubscribeUrl)}"
        style="color:#315d89;text-decoration:underline;"
      >
        Unsubscribe
      </a>
    `
    : `
      If you did not request this email, you can safely ignore it.
    `;

  return `
    <!doctype html>

    <html>
      <head>
        <meta charset="utf-8" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />

        <title>${safeHeading}</title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f2f6fd;
          font-family:Arial,Helvetica,sans-serif;
          color:#011b3e;
        "
      >

        <table
          width="100%"
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          style="
            width:100%;
            background:#f2f6fd;
          "
        >
          <tr>
            <td
              align="center"
              style="
                padding:35px 18px;
              "
            >

              <table
                width="100%"
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                style="
                  width:100%;
                  max-width:600px;
                  background:#ffffff;
                  border-radius:16px;
                  overflow:hidden;
                  box-shadow:0 12px 35px rgba(1,27,62,.08);
                "
              >

                <!-- HEADER -->

                <tr>
                  <td
                    style="
                      background:#001c3f;
                      padding:25px 32px;
                    "
                  >

                    <div
                      style="
                        color:#ffffff;
                        font-size:21px;
                        font-weight:800;
                        letter-spacing:1px;
                      "
                    >
                      TPAV
                    </div>

                    <div
                      style="
                        margin-top:2px;
                        color:#b9c7d8;
                        font-size:8px;
                        font-weight:700;
                        letter-spacing:3px;
                      "
                    >
                      CLASS ACTION
                    </div>

                  </td>
                </tr>


                <!-- CONTENT -->

                <tr>
                  <td
                    style="
                      padding:35px 32px 30px;
                    "
                  >

                    <div
                      style="
                        margin-bottom:10px;
                        color:#d7971e;
                        font-size:10px;
                        font-weight:700;
                        letter-spacing:2px;
                      "
                    >
                      CLASS ACTION AGAINST TPAV
                    </div>

                    <h1
                      style="
                        margin:0 0 20px;
                        color:#011b3e;
                        font-size:27px;
                        line-height:1.25;
                      "
                    >
                      ${safeHeading}
                    </h1>

                    <div
                      style="
                        color:#52647a;
                        font-size:14px;
                        line-height:1.75;
                      "
                    >
                      ${cleanHtml(content)}
                    </div>

                    ${button}

                  </td>
                </tr>


                <!-- FOOTER -->

                <tr>
                  <td
                    style="
                      padding:20px 32px 27px;
                      border-top:1px solid #e7edf4;
                    "
                  >

                    <p
                      style="
                        margin:0 0 10px;
                        color:#78879a;
                        font-size:11px;
                        line-height:1.6;
                      "
                    >
                      ${unsubscribeText}
                    </p>

                    <p
                      style="
                        margin:0;
                        color:#8b98a8;
                        font-size:11px;
                        line-height:1.6;
                      "
                    >
                      <a
                        href="${escapeHtml(
    `${baseUrl()}/privacy-policy`,
  )}"
                        style="
                          color:#315d89;
                          text-decoration:none;
                        "
                      >
                        Privacy Policy
                      </a>

                      &nbsp;·&nbsp;

                      <a
                        href="${escapeHtml(
    `${baseUrl()}/terms-of-service`,
  )}"
                        style="
                          color:#315d89;
                          text-decoration:none;
                        "
                      >
                        Terms of Service
                      </a>
                    </p>

                    <p
                      style="
                        margin:12px 0 0;
                        color:#9aa6b4;
                        font-size:10px;
                      "
                    >
                      © ${new Date().getFullYear()}
                      Class Action Against TPAV
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;
}


/* =========================================================
   CONFIGURATION CHECK
========================================================= */

export function assertEmailConfigured() {
  if (process.env.EMAIL_PROVIDER !== "resend") {
    throw new AppError(
      "Email provider is not configured.",
      503,
    );
  }

  if (!process.env.RESEND_API_KEY) {
    throw new AppError(
      "Resend API key is not configured.",
      503,
    );
  }

  if (!process.env.EMAIL_FROM) {
    throw new AppError(
      "Email sender address is not configured.",
      503,
    );
  }
}


/* =========================================================
   SEND EMAIL
========================================================= */

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  key: string,
  unsubscribeUrl?: string,
) {
  assertEmailConfigured();

  try {
    const message: Record<string, unknown> = {
      from: process.env.EMAIL_FROM!,
      to: [to],
      subject,
      html,
    };


    /* -------------------------------------------------------
       REPLY TO
    ------------------------------------------------------- */

    if (process.env.EMAIL_REPLY_TO) {
      message.reply_to =
        process.env.EMAIL_REPLY_TO;
    }


    /* -------------------------------------------------------
       UNSUBSCRIBE HEADERS

       Only include these headers for emails where an
       unsubscribe URL actually exists.
    ------------------------------------------------------- */

    if (unsubscribeUrl) {
      const oneClickUrl =
        unsubscribeUrl.replace(
          "/unsubscribe?",
          "/api/unsubscribe?",
        );

      message.headers = {
        "List-Unsubscribe":
          `<${oneClickUrl}>`,

        "List-Unsubscribe-Post":
          "List-Unsubscribe=One-Click",
      };
    }


    /* -------------------------------------------------------
       RESEND API
    ------------------------------------------------------- */

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${process.env.RESEND_API_KEY}`,

          "Content-Type":
            "application/json",

          "Idempotency-Key":
            key,
        },

        body: JSON.stringify(message),

        signal:
          AbortSignal.timeout(15000),
      },
    );


    /* -------------------------------------------------------
       RESEND ERROR
    ------------------------------------------------------- */

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Resend API error:",
        {
          status:
            response.status,

          response:
            errorText,

          recipient:
            to,

          subject,
        },
      );

      throw new AppError(
        `Email provider rejected the request (${response.status}).`,
        502,
      );
    }


    /* -------------------------------------------------------
       SUCCESS
    ------------------------------------------------------- */

    const data =
      (await response.json()) as {
        id: string;
      };

    console.log(
      "Email sent successfully:",
      {
        id: data.id,
        recipient: to,
        subject,
      },
    );

    return data.id;

  } catch (error) {

    /*
     * Preserve our own controlled errors.
     */

    if (error instanceof AppError) {
      throw error;
    }


    /*
     * Timeout / network / DNS errors.
     */

    console.error(
      "Email delivery failed:",
      error,
    );

    throw new AppError(
      "Unable to connect to the email provider. Please try again.",
      502,
    );
  }
}