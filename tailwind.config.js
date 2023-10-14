/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,tsx,jsx}", "./index.html"],
  theme: {
    extend: {
			color:{
				"cus-face-1":"var(--text-face-1)",
				"cus-face-2":"var(--text-face-2)",
			},
			backgroundColor:{
				"cus-face-1":"var(--bg-face-1)",
				"cus-face-2":"var(--bg-face-2)",
				"cus-face-3":"var(--bg-face-3)",
				"cus-face-4":"var(--bg-face-4)",
			}
		},
  },
  plugins: [],
};
