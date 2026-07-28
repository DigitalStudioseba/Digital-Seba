function closeWaChat() {
    let t = document.getElementById("waSupportBox");
    if (t) {
        t.style.opacity = "0";
        t.style.transform = "translateX(-50px)";
        setTimeout(() => {
            t.style.display = "none";
        }, 400);
    }
}
