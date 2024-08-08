/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        "primary": {
          50: "#E4DCF9",
          100: "#C6BEEE",
          200: "#8881D5",
          300: "#4D4DB7",
          400: "#3A3F79",
          500: "#24283B",
          600: "#191B34",
          700: "#101028",
          800: "#0A091B",
          900: "#060410",
          950: "#030209"
        },
        "secondary": {
          50: "#F1F0FF",
          100: "#E1E0FF",
          200: "#C7CBFF",
          300: "#A8B5FF",
          400: "#8FA9FF",
          500: "#7AA2F7",
          600: "#295BFF",
          700: "#0021DB",
          800: "#000A94",
          900: "#010047",
          950: "#040024"
        }
      }
    },
  },
  plugins: [],
}

