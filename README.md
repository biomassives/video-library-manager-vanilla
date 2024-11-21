Base Styles

The foundational CSS ensures smooth transitions, consistent typography, and a modern look:

    Font and Transitions: Uses 'Poppins' font-family with a 0.3s ease for a polished user experience.
    Background: SVG-based background image ensures lightweight design with a customizable theme.

Dark Mode Integration

Leveraging CSS variables and utility classes for seamless toggling:

    Colors: Dark mode adjusts color schemes (--heading-color, inputs, modals) to enhance visibility.
    Dynamic Background: Different SVGs for light/dark modes to align with the theme.

Interactive Elements

Enhanced user interaction through pseudo-elements and transitions:

    Icon Buttons: Hover effects with gradient glows (::before) and responsive shadows.
    Nav Links: Scale and color change on hover to improve engagement.

Reusable Components

Utility-first approach with classes like:

    @apply for modular and reusable styles.
    Dark/light mode-specific selectors for flexible designs (.dark-mode input, .dark-mode .video-card).

Functional CSS

Implemented animated transitions:

    Drop-down Menus: Smooth scale and opacity animations for better user experience.
    Buttons: Gradient backgrounds, hover effects, and disabled states for accessibility.

Supabase API Integration

Backend integration using Supabase:

    API Endpoints:
        /api/feed.js: Fetches videos using environment variables for secure access.
        Error handling ensures robust responses.

Highlights

    Animations: Keyframes (@keyframes spin) for dynamic visuals.
    Dynamic UI: Smooth transitions in modals, dropdowns, and input fields.
    Responsive Design: CSS ensures usability across devices with a focus on accessibility.
