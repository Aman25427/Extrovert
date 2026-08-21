# Extrovert — Signup Wizard

A modern, responsive signup experience designed for **Extrovert**, an offline-first social platform focused on helping people discover real-world plans, people, and experiences around them.

The project replicates a polished multi-step onboarding journey with a strong focus on **visual fidelity, usability, validation, and smooth user flow**.

---

## ✨ Overview

**Extrovert** is designed around the idea:

> **More stories. Less scrolling.**

Instead of endless social-media scrolling, the experience encourages users to connect with people and discover plans and activities happening around them.

The signup wizard guides a new user through a structured onboarding flow before creating their profile.

---

## 🚀 Signup Flow

The application follows a **4-step onboarding process**:

### 1. Email Registration

Users begin by entering their email address.

* Email input validation
* Clean and minimal interface
* Continue action
* One-time-code based authentication flow

### 2. Email Verification

Users verify their email using a **six-digit OTP**.

* Six-digit verification interface
* OTP validation
* Resend code option
* Back navigation
* Verification feedback

### 3. Personal Information

Users provide basic profile information.

* Full name
* Date of birth
* Age validation
* Pronoun selection
* Form validation
* Continue navigation

### 4. Location & Interests

Users personalize their profile by providing:

* State
* City
* College / University
* Preferred interests

Available interest categories include:

* Live Music
* Food Spots
* Fitness
* Art & Culture
* Game Nights
* Weekend Trips

After completing the onboarding flow, the user receives a confirmation screen indicating that their profile has been successfully created.

---

## 🎨 Design

The interface follows a distinctive visual system built around:

* Dark UI
* Vibrant purple gradient visuals
* Neon lime primary actions
* Pink accent elements
* Large editorial typography
* Rounded input controls
* Minimal navigation
* Step-progress indicators
* Responsive layout

The left side of the experience uses the **"Life happens outside."** visual message, while the right side contains the interactive signup workflow. The provided reference screens show this layout consistently across the onboarding stages.

---

## 🧩 Key Features

* ✅ Multi-step signup wizard
* ✅ Email input
* ✅ OTP verification interface
* ✅ Resend OTP interaction
* ✅ Personal information form
* ✅ Date-of-birth validation
* ✅ Pronoun selection
* ✅ State and city selection
* ✅ College / university selection
* ✅ Interest selection
* ✅ Back and forward navigation
* ✅ Step progress indicator
* ✅ Form validation
* ✅ Completion / success screen
* ✅ Responsive UI
* ✅ Modern dark-themed design
* ✅ User-friendly onboarding experience

---

## 🛠️ Tech Stack

* **Frontend:** React / JavaScript
* **Styling:** CSS
* **Runtime:** Node.js
* **Development Environment:** VS Code
* **Version Control:** Git & GitHub

---

## 📁 Project Structure

```text
Extroverts/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── ...
│
├── package.json
├── server.mjs
├── README.md
├── .gitignore
└── ...
```

> The exact folder structure may vary depending on the implementation.

---

## ⚙️ Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

Verify your installation:

```bash
node --version
npm --version
git --version
```

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/Aman25427/Extrovert.git
```

Navigate into the project:

```bash
cd Extrovert
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run the Project

Start the development server:

```bash
npm start
```

The application will be available at:

```text
http://localhost:4173
```

---

## 🔄 User Journey

```text
Landing Page
     │
     ▼
Start Signup
     │
     ▼
Enter Email
     │
     ▼
Verify OTP
     │
     ▼
Enter Personal Details
     │
     ▼
Select Location
     │
     ▼
Select Interests
     │
     ▼
Create Profile
     │
     ▼
Signup Complete
```

---

## 🎯 Project Objective

The primary objective of this project is to build a **high-fidelity signup wizard** that combines:

* Strong visual design
* Clear information architecture
* Progressive user onboarding
* Input validation
* Responsive interaction
* Consistent component behavior

The result is a streamlined signup experience that minimizes friction while collecting the information required to personalize a user's experience.

---

## 🔐 Validation & UX

The onboarding flow is designed to prevent incomplete or invalid submissions.

Examples include:

* Valid email requirement
* Six-digit OTP verification
* Date-of-birth eligibility validation
* Required profile information
* Controlled selection of pronouns
* Location selection
* Interest selection

The reference flow also communicates OTP expiration and provides a **resend-code** action to improve recovery from verification failures.

---

## 📸 UI Flow

The reference design demonstrates the following screens:

| Step | Screen                   |
| ---- | ------------------------ |
| 01   | Start with your email    |
| 02   | Check your inbox         |
| 03   | Put a face to the invite |
| 04   | Where do we find you?    |
| ✓    | You're on the list       |

The final screen confirms successful onboarding and presents the newly created profile before allowing the user to continue into the experience.

---

## 🌐 Repository

**GitHub:**
https://github.com/Aman25427/Extrovert

---

## 🔮 Future Enhancements

Potential improvements include:

* Backend-powered authentication
* Real email OTP delivery
* Persistent user profiles
* Database integration
* Social login
* Location-based recommendations
* Event discovery
* User matching
* Profile editing
* Production deployment
* Automated testing

---

## 👨‍💻 Author

**Aman Singhania**

Computer Science Engineering Student
Interested in Software Development, Web Development, QA, and Application Engineering.

---

## 📄 License

This project was developed for educational, portfolio, and assessment purposes.

---

## ⭐ Acknowledgement

Inspired by the provided Extrovert signup experience and its visual onboarding flow.

**Life happens outside.**
