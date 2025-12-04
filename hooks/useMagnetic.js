export function useMagnetic(strength = 20) {
    function onMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        e.currentTarget.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
    }

    function onLeave(e) {
        e.currentTarget.style.transform = "translate(0px, 0px)";
    }

    return { onMove, onLeave };
}
