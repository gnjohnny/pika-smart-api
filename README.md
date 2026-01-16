# 🍲 PikaSmart API

PikaSmart API is an **AI-powered RESTful service** that generates **simple, affordable Kenyan recipes** based on the ingredients a user already has and a specified budget.

Built with the **MERN stack** and powered by **Google Gemini Pro**, the API intelligently creates realistic home-cooked meals suitable for students and households, while enforcing budget constraints and local food preferences.

---

## 🚀 Features

- 🥘 Generate recipes from available ingredients
- 💰 Budget-aware meal generation (KES)
- 🇰🇪 Kenyan-local food focus
- 🤖 AI-powered using Google Gemini Pro
- 🔌 Clean RESTful API
- 🗃 MongoDB data models with Mongoose
- 📦 Developer-friendly JSON responses

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **AI:** Google Gemini Pro
- **Auth (planned):** JWT
- **Deployment:** vercel

---

## 🎯 Use Cases

- University students on a tight budget
- Households with limited ingredients
- Meal planning applications
- Food-tech startups
- AI-powered cooking assistants

---

## 📦 API Usage

- create a **.env** and add the following
  ```
  PORT=5000
  GEMINI_API_KEY=your_gemini_api_key_here
  MONGO_URI=your_mongodb_connection_string
  ```

### ▶️ Running Locally

```
 npm install
 npm run dev
```
### Generate Recipe

**Endpoint**
