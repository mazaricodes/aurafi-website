Aurafi Studio - Coming Soon Landing Page

A premium, high-end "Coming Soon" landing page built for Aurafi Studio, an AI-powered branding & automation agency.

This project is designed as a zero-build static site, meaning it requires no complex Node.js environments or build steps. It is perfectly optimized to be deployed instantly on GitHub Pages.

✨ Features

Zero-Build Architecture: Built with pure HTML and Tailwind CSS (via CDN) for instant deployment.

3D Neural Background: Features an interactive, mouse-tracking 3D particle network powered by Three.js.

Custom Cursor: A sleek, custom cyan trailing cursor that adapts when hovering over interactive elements.

Dark-Theme Aesthetic: Deep blacks, subtle glowing orbs, and glassmorphism UI elements.

Intelligent Logo Adaptation: Uses CSS filters to dynamically invert black logo assets to pristine white while perfectly preserving the signature cyan brand accent.

Waitlist Integration: Pre-configured to work with Formspree to collect emails straight to your inbox without needing a backend server.

AI Chatbot Ready: Includes a designated, comment-marked section to easily drop in a pre-trained AI chatbot widget (e.g., Chatbase, Voiceflow).

📂 File Structure

To deploy this site, your repository should look exactly like this:

/ (Root Directory)
├── index.html       # The main landing page code
├── 7.png            # Main Aurafi Logo
├── 8.png            # Cyan Dot / Small Element
├── 9.png            # Aurafi "A" Mark 
└── 10.png           # Cyan Dot


🚀 Deployment Instructions (GitHub Pages)

Create a new repository on GitHub (e.g., aurafi-coming-soon).

Upload index.html and the four image assets (7.png, 8.png, 9.png, 10.png) directly to the main folder of the repository.

Go to your repository Settings > Pages (on the left sidebar).

Under "Build and deployment", set the Source to Deploy from a branch.

Select your main (or master) branch and click Save.

Wait 1-2 minutes. GitHub will provide you with a live URL where your site is hosted!

⚙️ Configuration

1. Setting up the Waitlist Form (Formspree)

Since GitHub Pages does not have a backend to process emails, this site uses Formspree to collect waitlist signups.

Go to Formspree.io and create a free account.

Create a "New Form".

Formspree will give you an Endpoint URL that looks like this: https://formspree.io/f/xyz123abc

Open index.html, find the <form> tag (around line 185), and replace YOUR_FORMSPREE_ID with your actual endpoint URL:

<form action="[https://formspree.io/f/xyz123abc](https://formspree.io/f/xyz123abc)" method="POST" ...>


2. Adding the Embedded AI Chatbot

To keep your API keys secure while hosting on a static site, it is highly recommended to use an embedded AI platform.

Sign up for an embedded bot platform like Chatbase, Voiceflow, or Botpress.

Train the bot on their platform by giving it your agency's information.

Copy the integration <script> tag they provide.

Scroll to the very bottom of index.html (just above </body>) and paste your script into the designated area:

<!-- EMBEDDED AI CHATBOT SCRIPT GOES HERE -->
<script src="[https://www.chatbase.co/embed.min.js](https://www.chatbase.co/embed.min.js)" chatbotId="YOUR_BOT_ID"></script>


🛠 Tech Stack

HTML5

Tailwind CSS (via CDN)

Three.js (for 3D graphics)

Lucide Icons (for crisp, lightweight SVG icons)
