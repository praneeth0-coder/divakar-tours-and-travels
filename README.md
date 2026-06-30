# Divakar Tours and Travels - Premium Landing Page

A premium, highly responsive single-page web application built for **Divakar Tours and Travels** to facilitate high-end vehicle rentals and travel bookings between Bangalore and Tirupati.

## ✨ Features

- **Fixed Glassmorphism Navigation Bar**: Modern scrolling response and mobile overlay drawer menu.
- **Hero Showcase**: Executive banner presenting flagship services.
- **Bento Grid Routes**: Clean card layouts presenting Bangalore-Tirupati daily transits and Tirupati local sightseeing disposal options.
- **Pillar Value Propositions**: Highlighting professional chauffeurs, meticulously maintained Toyota Innova Crysta fleets, and guaranteed punctuality.
- **Flagship Fleet Spec Details**: Visual highlights, specification lists, and custom rate inquiry paths.
- **Interactive Quick Inquiry Form**:
  - Full client-side inputs validator with wiggle animation feedback on errors.
  - Direct connection to a client-side database (`localStorage` integration).
  - Instant WhatsApp redirection pre-filling all booking data (Customer Name, Phone, Email, Pickup/Drop coordinates, Travel Date, Passengers, Notes) directly to the owner (+91 77023 25873).
- **Interactive Admin View**: Appending `?admin=true` to the URL displays a hidden database console listing all logged bookings, with refresh and clear actions.

## 🛠️ Built With

- **HTML5** & **CSS3** (Vanilla styling, responsive flexbox/grid layout)
- **JavaScript (ES6+)** (DOM event controls, Intersection Observer animations, Form validation, LocalStorage DB)
- **Google Fonts** (Manrope, Work Sans)
- **Material Symbols** (Icons)

## 🚀 How to Run Locally

You can open `index.html` directly in any web browser to view the static site. To run it on a local web server:

1. Open your terminal in the root directory.
2. Spin up a web server. E.g., using Python:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.
