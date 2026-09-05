# Ednivo v10 — Apps Script OTP connected

The login page is connected to the supplied Google Apps Script Web App:
https://script.google.com/macros/s/AKfycbzES3-7gsMZEHcypqnYpIYp6897rw6Kz4XCVH_8yts40NPFXP-fZ2v31S9YOxASeMbi/exec

The Apps Script must be deployed as:
- Execute as: Me
- Who has access: Anyone

OTP flow:
1. Ednivo sends `sendOtp` to Apps Script.
2. Apps Script sends the OTP through the Google account that owns the script.
3. Ednivo sends `verifyOtp` to Apps Script.
4. On success, Ednivo creates the local student session used by the student portal.

Supabase remains configured for Google OAuth and database use where a Supabase-authenticated session exists. Apps Script OTP sessions use the site's local authenticated student session so no second Supabase email is triggered.
