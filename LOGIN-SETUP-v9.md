# Ednivo Login / OTP setup

The site is configured to use the supplied Supabase project and Google OAuth.

## Important: OTP email delivery

Supabase's built-in/default email provider is restricted and rate-limited. For real students, configure custom SMTP in:

Supabase Dashboard → Authentication → SMTP Settings

Recommended Gmail/Google Workspace SMTP values for `ednivo.education@gmail.com`:

- SMTP host: `smtp.gmail.com`
- Port: `465` (SSL) or `587` (STARTTLS)
- Username: `ednivo.education@gmail.com`
- Password: a Google **App Password** for this mailbox (not the normal Google password)
- Sender email: `ednivo.education@gmail.com`
- Sender name: `Ednivo`

Do not put the Gmail password or App Password in this website.

## Google OAuth

In Supabase → Authentication → Providers → Google, keep Google enabled.

In Google Cloud, the OAuth redirect URI must be the Supabase callback shown in the Supabase Google provider page, normally:

`https://rnajixdagzdfdgcelesv.supabase.co/auth/v1/callback`

In Supabase → Authentication → URL Configuration, add the deployed Ednivo login URL, e.g.:

`https://YOUR-DOMAIN/login.html`

as an allowed redirect URL, and set the production Site URL to your actual website.

## OTP template

If using a custom OTP email template, it must include the Supabase `{{ .Token }}` value so the student receives the six-digit code.

## What was fixed in v9

- More reliable Supabase client loading with CDN fallback.
- Clearer Supabase/SMTP errors instead of the generic "Google login needs Supabase configured."
- 60-second resend protection.
- OTP delivery status explicitly tells the student to check Inbox/Spam/Promotions.
- Existing Google users continue to their existing profile rather than creating a duplicate.
