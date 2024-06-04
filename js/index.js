// Inicializujeme vykonnou tridu
const tischtennis = new Tischtennis();

Evnt
    .onAll(
        // Po kliknuti na libovolny ukazatel skore nastava zmena:
        "#main #scoreboard-set .score-current .score", "click", (e) => tischtennis.markPoint(e.target)
    )
    .on(
        // Po kliknuti na palku resime zmenu podavani
        "#main #scoreboard-set .serving", "click", () => tischtennis.changeServing()
    )
    .on(
        "#btn-undo", "click", () => tischtennis.undoLastChange()
    )
    .on(
        "#setup #switch-sides .button", "click", () => tischtennis.toggleSwitchSides()
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
