// Inicializujeme vykonnou tridu
let tischtennis = new Tischtennis();

Evnt
    .onAll(
        "#main #scoreboard-set .score-current .score", "click", (e) => {
            tischtennis.markPoint(e.target);
        }
    )
    .on(
        "#main #scoreboard-set .serving", "click", () => tischtennis.servingChange()
    )
    .on(
        "#btn-undo", "click", () => tischtennis.undoLastChange()
    )
    .on(
        "#btn-fullscreen", "click", () => tischtennis.toggleFullscreen()
    );

if (Elem.isFullscreenEnabled()) {
    document.addEventListener("fullscreenchange", Tischtennis.onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", Tischtennis.onFullscreenChange);
    document.addEventListener("msfullscreenchange", Tischtennis.onFullscreenChange);
    document.addEventListener("mozfullscreenchange", Tischtennis.onFullscreenChange);
    Evnt.on("#btn-fullscreen", "click", () => tischtennis.toggleFullscreen());
    Elem.from("#btn-fullscreen").attr("data-fullscreen", "false");
}
