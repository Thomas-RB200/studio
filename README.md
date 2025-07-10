# Padel Scoreboard Web App

This is a Next.js web application for managing and displaying padel match scoreboards.

## How to Download and Run This Project Locally

Follow these instructions to download the project code and run it on your own computer or deploy it to another hosting service.

### Step 1: Download the Code

1.  In the Firebase Studio interface, look for the main menu (usually a "hamburger" icon ☰ in the top-left).
2.  Find and select the **"Download"** or **"Export"** option. This will download a `.zip` file containing all the project files to your computer.
3.  Unzip the downloaded file in a folder where you want to work.

### Step 2: Install Prerequisites

To work with this project, you need [Node.js](https://nodejs.org/) installed on your computer. It comes with `npm` (Node Package Manager), which is necessary to install the project's dependencies.

-   You can download Node.js from its official website. Version 18 or newer is recommended.

### Step 3: Install Project Dependencies

1.  Open your computer's terminal or command prompt.
2.  Navigate to the folder where you unzipped the project files. For example: `cd path/to/your/project-folder`
3.  Once inside the project folder, run the following command to install all the necessary libraries and packages listed in `package.json`:

    ```bash
    npm install
    ```

    This might take a few minutes to complete.

### Step 4: Run in Development Mode (Local Machine)

To run the application in development mode on your local machine, use the following command in your terminal:

```bash
npm run dev
```

This will start a local server, usually at **`http://localhost:3000`**. You can open this URL in your browser to see and interact with the application. This URL is only accessible on your computer.

### Step 5: Building for Production

When you are ready to deploy the application to a live web server, you first need to create a "production build". This process optimizes the code for performance and speed.

Run this command in your terminal:

```bash
npm run build
```

This will create a new folder named `.next` in your project directory. This folder contains the optimized, production-ready version of your app.

### Step 6: Deploying to a Hosting Provider

You can deploy this Next.js application to any hosting provider that supports Node.js. The easiest and most recommended options are platforms specifically designed for this kind of app, like **Vercel** (created by the makers of Next.js) or **Netlify**.

**General Steps for Deployment (e.g., on Vercel):**

1.  **Push your code to a Git repository** (like GitHub, GitLab, or Bitbucket).
2.  **Sign up for a Vercel account** (you can use your GitHub account).
3.  **Import your Git repository** into Vercel.
4.  Vercel will automatically detect that it's a Next.js project. It will use the correct build command (`npm run build`) and output directory (`.next`).
5.  Click **"Deploy"**. Vercel will build your project and provide you with a public URL.

This process gives you a fully functional, live web application that you can share with anyone.

---

## Demo Credentials

A list of demo user accounts with different roles can be found in the `CREDENTIALS.md` file.
