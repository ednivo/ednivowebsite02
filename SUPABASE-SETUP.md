# Ednivo GCC SAT v5 — zero-budget setup

## Product scope
Student-only online SAT workspace for GCC students. Parent login/dashboard has been removed from the product.

## Free stack
- Supabase Free: PostgreSQL + Auth + APIs
- Cloudflare Pages: free static hosting
- No paid AI API required for the MVP
- Email OTP is used instead of SMS OTP to avoid SMS provider costs

## 1. Supabase
Create a free project at https://supabase.com/

## 2. Database
Run `supabase-schema-v5.sql` in Supabase SQL Editor.

The schema stores:
- student profiles
- diagnostic results
- practice attempts
- study plans
- mock results
- lead-magnet emails

It does not expose parent accounts or parent/student relationship tables.

## 3. Browser configuration
Put your Supabase Project URL and `anon` / public key into `supabase-config.js`.
Never put the `service_role` key in browser code.

## 4. Student authentication
`login.html` is the only student account entry point.

### New student
Full name → email → mobile with GCC country code → country → class/grade → email OTP → account/profile → dashboard.

### Returning student
Email → OTP → existing Supabase account → existing profile → dashboard.

### Google
Returning Google users go directly to the existing account. First-time Google users complete the profile once. Supabase's unique auth user/email identity prevents the frontend from creating a second account for the same email.

### Email OTP template
In Supabase Authentication → Email Templates, make sure the OTP token is included using `{{ .Token }}`. The frontend verifies it with `verifyOtp({ email, token, type: 'email' })`.

### Google provider
Enable Google in Supabase Authentication → Providers and add the deployed `login.html` URL to the Supabase Redirect URLs.

## 5. Student workspace
The logged-in student sees:
- Overview
- Practice
- Upcoming & Recordings
- SAT Syllabus
- SAT Score Calculator
- AI SAT Coach
- Profile icon
- Logout

The homepage's Student Login button changes to the student's account entry when a local session exists.

## 6. SAT syllabus lead magnet
`syllabus.html` asks for email and downloads `Ednivo-SAT-Complete-Syllabus-Study-Checklist.pdf`.

The PDF is an original Ednivo guide based on College Board's public content-domain framework. It does not modify, rebrand, or redistribute a College Board PDF. The page links to the official College Board structure page for verification.

## 7. Score calculator
`score-calculator.html` provides an Ednivo planning estimate based on SAT score, academic strength, profile strength and an illustrative university target. It is explicitly not an admissions probability or university prediction.

## 8. Production notes
- Replace placeholder/sample testimonials with verified GCC student testimonials before publishing them as real.
- Use original or properly licensed SAT questions and content.
- Do not copy College Board test questions or redistribute proprietary PDFs.
- The diagnostic is an Ednivo directional estimate, not the official College Board scoring algorithm.
- Add privacy/consent language appropriate for student/minor data in each GCC market before collecting production data.
- Add rate limiting and server-side protection for public lead capture before scaling.

## 9. Free hosting
Cloudflare Pages is a practical zero-budget option for this static frontend. Supabase provides the database/auth layer.
