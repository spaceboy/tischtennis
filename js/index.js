
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
    );
    // .on(
    //     "#btn-setup", "click", () => Tischtennis.enforceSetup()
    // )
    // .on(
    //     "#btn-play", "click", () => Tischtennis.enforcePlay()
    // );

