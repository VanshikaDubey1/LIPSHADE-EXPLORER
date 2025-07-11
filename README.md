# ✨ lipshade Explorer: AI-Powered Lipstick Finder

ShadeMatch is a modern web application that helps users discover their perfect lipstick shade. By uploading a photo or using their camera, users can get an instant AI-powered analysis of a lipstick color and receive a recommendation for a matching product from popular brands.


*A placeholder for your app's screenshot. Replace this with a real image of your running application!*

---

## 💄 Key Features

-   **AI-Powered Color Detection:** Utilizes Google's Gemini model to accurately identify the hex code of the lipstick from an image.
-   **Intelligent Product Matching:** A secondary AI flow compares the detected color against a database of over 500 lipsticks to find the best product match.
-   **Dual Image Input:** Users can either upload a file or use their device's camera for a live capture.
-   **Interactive UI:** Built with modern React components, featuring smooth animations and a user-friendly interface.
-   **Mock Authentication:** Includes functional, though mock, login and signup pages to demonstrate a complete user flow.
-   **Responsive Design:** A beautiful and consistent experience across desktop and mobile devices.

---

## 🛠️ Tech Stack

This project is built with a modern, production-ready tech stack:

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **UI Library:** [React](https://react.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
-   **AI/Generative:** [Google Gemini](https://ai.google.dev/) via [Genkit](https://firebase.google.com/docs/genkit)
-   **State Management:** React Hooks & Server Actions

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/VanshikaDubey1/LIPSHADE-EXPLORER.git
    cd LIPSHADE-EXPLORER
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Google AI API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```env
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Run the development server:**
    The application requires two development servers to run concurrently: one for the Next.js frontend and one for the Genkit AI flows.

    -   In your first terminal, start the Next.js app:
        ```sh
        npm run dev
        ```

    -   In a second terminal, start the Genkit development server:
        ```sh
        npm run genkit:dev
        ```

5.  **Open the app:**
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## 🤖 How the AI Works

The core functionality is powered by two Genkit flows that chain together:

1.  **`detectLipstickColor`**: This flow takes the user's image and uses the Gemini vision model to analyze the lips and return the dominant color as a hex code.
2.  **`matchLipstickShade`**: This flow receives the hex code, searches a mock database for the top 3 closest color matches, and then uses a second prompt to have the AI act as a beauty expert, selecting the single best product to recommend to the user. A fallback is in place to always return the closest match if the AI fails.
