export function useRipple() {
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.className = "absolute rounded-full bg-white/40 animate-ripple pointer-events-none";

        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) ripple.remove();

        circle.classList.add("ripple");
        button.appendChild(circle);
    }

    return { createRipple };
}
