// tailwind.config.js
import flowbitePlugin from 'flowbite/plugin';

export default {
    content: [
        './src/**/*.{html,js,vue}', // Adjust paths to match your project structure
        './node_modules/flowbite/**/*.js',
    ],
    theme: {
        fontFamily: {
            sans: ['Manrope', 'sans-serif'],
        },
        colors: {
            secondary: {
                DEFAULT: '#f7f3f2',
            },
            primary: {
                DEFAULT: '#E79AFD',
            },
            error: {
                DEFAULT: '#BB277B',
            },
            topBar: {
                DEFAULT: '#ff8a00',
            },


        },
    },
    plugins: [
        flowbitePlugin, // Include Flowbite plugin using ES2022 import
    ],
    darkMode: 'class', // Enable class-based dark mode support
};
