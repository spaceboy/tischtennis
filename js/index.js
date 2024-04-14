// Inicializujeme vykonnou tridu
const tischtennis = new Tischtennis();

Evnt
    // Po kliknuti na libovolny ukazatel skore nastava zmena:
    .onAll(
        "#main #scoreboard-set .score-current .score", "click", (e) => {
            tischtennis.markPoint(e.target);
        }
    )
    // Po kliknuti na palku resime zmenu skore
    .on(
        "#main #scoreboard-set .serving", "click", () => tischtennis.changeServing()
    )
    .on(
        "#btn-undo", "click", () => tischtennis.undoLastChange()
    )
    .on(
        "#setup #verbosity .button", "click", () => tischtennis.toggleVerbosity()
    )
    .on(
        "#setup #reset .button", "click", () => tischtennis.resetGame()
    );

if (Elem.isFullscreenEnabled()) {
    Evnt.on(
        document,
        {
            "fullscreenchange": Tischtennis.onFullscreenChange,
            "webkitfullscreenchange": Tischtennis.onFullscreenChange,
            "msfullscreenchange": Tischtennis.onFullscreenChange,
            "mozfullscreenchange": Tischtennis.onFullscreenChange
        }
    )
    Evnt.on("#btn-fullscreen", "click", Tischtennis.onToggleFullscreenClick);
    Elem.from("#btn-fullscreen").attr("data-fullscreen", "false");
}
