# Signup Wizard Recording Guide

Run the project from the project folder:

```powershell
npm start
```

Then open `http://localhost:4173` in a browser.

Suggested under-five-minute walkthrough:

1. Show the landing page, Terms & privacy page, and required acceptance checkbox.
2. On email, enter an invalid address to show inline and toast validation. Enter `fail@example.com` to show the simulated send failure, then use any valid address.
3. On verification, paste an incomplete code and then a wrong six-digit code. Complete with `123456`.
4. On profile details, show the required-name state and an under-18 date of birth. Then enter a valid name, adult date, and pronouns.
5. On location, show city and college choices changing when the state changes. Show the required-interest state, then complete the form.
6. End on the confirmation screen. Resize to mobile width briefly to demonstrate the responsive layout.

The app is front-end only. Email delivery and profile creation are deliberate in-browser simulations so the success and failure paths are reproducible during the recording.
