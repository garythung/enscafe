const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        header: "auto 1fr auto",
      },
      animation: {
        "spin-slow-x": "spin-x 3.5s infinite linear",
        "spin-slow-y": "spin-y 3.5s infinite linear",
      },
      keyframes: {
        "spin-x": {
          "100%": {
            transform: "rotateX(0deg) rotateY(360deg)",
          },
        },
        "spin-y": {
          "100%": {
            transform: "rotateX(360deg) rotateY(0deg)",
          },
        },
      },
      backgroundImage: {
        gradient: "linear-gradient(92.93deg, #BBCAFF 0%, #C9FFBB 100%)",
      },
      padding: {
        112: "28rem",
        128: "32rem",
        144: "36rem",
        full: "100%",
      },
      borderWidth: {
        1: "1px",
      },
      fontFamily: {
        ...fontFamily,
        sans: ['"DM Sans"', ...fontFamily.sans],
        mono: ['"DM Mono"', ...fontFamily.mono],
        pressura: ['"GT Pressura"', ...fontFamily.sans],
      },
      colors: {
        "primary-blue": "#3E6CE3",
        "accent-blue": "#0066FF",
        "cafe-blue": "#6EFDFF",
        "cafe-green": "#B4FF6E",
        "cafe-purple": "#706EFF",
        "cafe-orange": "#FFB96E",
        "cafe-pink": "#FF706E",
        seafoam: "#F4FCFE",
        bluegray: "#F0F2F7",
        "badge-green": "#D0F5E4",
        "badge-green-text": "#016644",
        "badge-yellow": "#FFF1CC",
        "badge-yellow-text": "#A1780F",
        "secondary-gray": "#F3F3F5",
        background: "#FCFCFC",
        "badge-purple": "#F3F5F9",
        "badge-purple-text": "#003171",
        "button-gray-background": "#F5F5F7",
        "button-gray-background-border": "#E1E3E8",
        link: "#529BDE",
      },
      spacing: {
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
        176: "44rem",
        192: "48rem",
      },
      width: {
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
        176: "44rem",
        192: "48rem",
        208: "52rem",
        224: "56rem",
        240: "60rem",
      },
      minWidth: {
        0: "0",
        "1/4": "25%",
        "1/3": "33.333%",
        "1/2": "50%",
        "2/3": "66.667%",
        "3/4": "75%",
        full: "100%",
        64: "16rem",
        80: "20rem",
        96: "24rem",
        112: "28rem",
        128: "32rem",
        144: "36rem",
      },
      maxWidth: {
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
        176: "44rem",
        192: "48rem",
        208: "52rem",
        224: "56rem",
        240: "60rem",
      },
      maxHeight: {
        "50vh": "50vh",
        "75vh": "75vh",
      },
      minHeight: {
        0: "0",
        "1/4": "25%",
        "1/3": "33.333%",
        "1/2": "50%",
        "2/3": "66.667%",
        "3/4": "75%",
        full: "100%",
        112: "28rem",
        128: "32rem",
        144: "36rem",
      },
      boxShadow: {
        card: "0px 0px 1px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  variants: {
    extend: {},
  },
};
