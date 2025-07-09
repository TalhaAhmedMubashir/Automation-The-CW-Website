# 🎬 CW E2E Automation Test Suite

This repository contains end-to-end (E2E) test cases written using [Playwright](https://playwright.dev/) to automate testing for the [CW TV](https://www.cwtv.com) website. It covers major sections like video player functionality, show listings, homepage features, channel streaming, and user interaction validations.

---

## 💼 Developer Note

This project serves as a **portfolio showcase** for my **Playwright automation skills**. It demonstrates how I build scalable, modular, and robust automated test suites using best practices in:

* 🎯 **End-to-End Testing** for public websites (CWTV.com used as demo)
* 🎥 **Video Player Automation** including ad playback, CC toggling, resolution handling, and keyboard shortcuts
* 🔍 **Search & Navigation Testing** using dynamic selectors, XPath, and assertion techniques
* 📊 **Allure Reporting Integration** for clean, interactive test reports
* 🧩 **Page Object Model (POM)** with TypeScript for maintainability
* 🛠 **Code Formatting & Linting** with Prettier + ESLint

> ⚠️ **Disclaimer**: This project is intended **only for educational and portfolio purposes**. It interacts with **publicly accessible features** of the CWTV.com site and does **not perform any destructive actions** or unauthorized access. No affiliation with CWTV is claimed.

---

## 📦 Project Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [Allure CLI](https://docs.qameta.io/allure/) for report generation:
  ```bash
  npm install -g allure-commandline
````

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd cw-e2e-tests
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run tests

* Run all tests in headless mode:

  ```bash
  npm test
  ```

* Run tests with browser UI:

  ```bash
  npm run test:ui
  ```

* Run tests in headed mode (browser visible):

  ```bash
  npm run test:headed
  ```

---

## 🧪 Test Reporting

This project uses [Allure](https://docs.qameta.io/allure/) for HTML test reports.

### Generate Allure Report

```bash
npm run report
```

* Generates the report from `/allure-results`
* Opens the report in your browser

---

## ⚙️ Environment Variables

You can store your base URL, credentials, and any configuration in a `.env` file.

Example `.env` file:

```env
BASE_URL=https://www.cwtv.com
```

> Make sure to load variables in `playwright.config.ts` or individual tests using `dotenv`.

---

## 🧹 Code Quality Tools

### ESLint

To lint your code for errors and best practices:

```bash
npm run lint
```

### Prettier

To format your code automatically:

```bash
npm run format
```

---

## 🧾 NPM Scripts

| Script                | Description                                 |
| --------------------- | ------------------------------------------- |
| `npm test`            | Run all tests (Playwright headless)         |
| `npm run test:ui`     | Launch the Playwright UI for test debugging |
| `npm run test:headed` | Run tests in headed (browser-visible) mode  |
| `npm run lint`        | Lint all `.ts` files using ESLint           |
| `npm run format`      | Format code with Prettier                   |
| `npm run report`      | Generate and open Allure HTML report        |

---

## 📁 Project Structure

```
cw-e2e-tests/
│
├── tests/               # Test cases
├── pages/               # Page Object Models
├── utils/               # Helper utilities (optional)
├── .env                 # Environment variables
├── .eslintrc.json       # ESLint config
├── .prettierrc          # Prettier config
├── playwright.config.ts # Playwright configuration
├── package.json         # Project metadata and scripts
└── README.md            # Project documentation
```

---

## 📌 Notes

* Tests cover UI validations, video player controls, banner links, channel listings, and keyboard interaction.
* Soft assertions are used for better failure isolation using `expect.soft`.

---

## 🙌 Contributors

* **Talha Ahmed** – QA Engineer, Automation Specialist at Avialdo Solutions

---

Let me know if you'd like to include screenshots, GitHub Actions CI instructions, or test coverage tips!

```

---

Would you like me to export this as a file (`README.md`) as well?
```
