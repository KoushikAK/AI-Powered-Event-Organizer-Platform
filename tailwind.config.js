module.exports = {
    theme: {
        extend: {
            animation: {
                gradient: "gradientShift 5s ease infinite",
                ripple: "ripple 0.6s linear",
            },
            keyframes: {
                gradientShift: {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
                ripple: {
                    "0%": { transform: "scale(0)", opacity: "0.6" },
                    "100%": { transform: "scale(4)", opacity: "0" },
                },
            },
        },
    },
    plugins: [],
};
