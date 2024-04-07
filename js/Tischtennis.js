class Tischtennis {
    // Dataobjekt pro ukladani stavu hry.
    game = {
        "player1": {
            "name": "PLAYER 1",
            "points": 0,
            "sets": 0
        },
        "player2": {
            "name": "PLAYER 2",
            "points": 0,
            "sets": 0
        },
        "serving": "player1",
        "sets": [],
        "history": []
    }

    // Konstruktor tridy.
    constructor () {
        screen.orientation.unlock();
    }

    // Zaznamená bod po kliknutí na target.
    markPoint (target) {
        let playerId = target.parentNode.getAttribute("id");

        // Zapíšeme do análů aktuální stav
        this.#writeToHistory();

        // Zjistíme počet bodů a zvedneme o jeden:
        let points = this.#getPointsByPlayerId(playerId) + 1;
        this.#setPointsByPlayerId(playerId, points);

        // Zjistíme stav setu
        let oponentId = Tischtennis.#getOponentId(playerId);
        let oponentPoints = this.#getPointsByPlayerId(oponentId);

        // Zjistíme, zda je změna podání
        if (
            ((points + oponentPoints) % 2 === 0)
            || (points >= 10 && oponentPoints >= 10)
        ) {
            this.#servingChange();
        }

        // Pokud není konec setu, nic dalšího už neřešíme:
        if (points < 11) {
            return;
        }

        // Zjistíme rozdíl, pokud je menší než 2, nic dalšího už neřešíme:
        if (Tischtennis.#pointsDifference(points, oponentPoints) < 2) {
            return;
        }

        // Set byl dohrán:
        this.#finishSet();
    }

    // Změna podání (na požádání).
    servingChange () {
        // Vynutit změnu podání kliknutím je možné jen na začátku setu.
        if (
            this.#getPointsByPlayerId("player1") !== 0
            || this.#getPointsByPlayerId("player2") !== 0
        ) {
            return;
        }

        this.#writeToHistory();
        this.#servingChange();
    }

    // Provede akci "undo".
    undoLastChange () {
        if (!this.game.history.length) {
            this.#setButtonUndoVisibility(false);
            return;
        }

        Elem.from("#main").attr("data-finished", "false");

        let score = this.game.history.pop();
        this.game.serving = score.serving;
        this.game.player1.sets = score.player1.sets;
        this.game.player2.sets = score.player2.sets;
        this.game.player1.points = score.player1.points;
        this.game.player2.points = score.player2.points;
        this.game.sets = score.sets;
        this.#showScore(score);

        if (!this.game.history.length) {
            this.#setButtonUndoVisibility(false);
        }
    }

    static enforceSetup () {

    }

    static enforcePlay () {

    }

    // Nastaví viditelnost tlačítka "Undo".
    #setButtonUndoVisibility (visible) {
        Elem.from("#main #btn-undo").attr("data-visible", visible ? "true" : "false");
    }

    // Zobrazí aktuální stav.
    #showScore (score) {
        Elem.byId("main").setAttribute("data-serving", score.serving);
        Elem.from("#main #scoreboard-game .player.player1 .set").html(score.player1.sets);
        Elem.from("#main #scoreboard-game .player.player2 .set").html(score.player2.sets);
        Elem.from("#main #scoreboard-set #player1 .score").html(score.player1.points);
        Elem.from("#main #scoreboard-set #player2 .score").html(score.player2.points);
    }

    // Vlastní provedení změny podání.
    #servingChange () {
        let servingPlayerId = this.game.serving;
        servingPlayerId = Tischtennis.#getOponentId(servingPlayerId);
        this.game.serving = servingPlayerId;
        Elem.byId("main").setAttribute("data-serving", servingPlayerId);
    }

    // Ukončení setu.
    #finishSet () {
        document.getElementById("audio-applause").play();

        let scorePlayer1 = this.#getPointsByPlayerId("player1");
        let scorePlayer2 = this.#getPointsByPlayerId("player2");
        let setWinner = (scorePlayer1 > scorePlayer2) ? "player1" : "player2";
        this.game[setWinner].sets++;
        this.game.player1.points = 0;
        this.game.player2.points = 0;
        this.game.sets.push([scorePlayer1, scorePlayer2]);
        this.game.serving = Tischtennis.#getOponentId(setWinner);
        this.#showScore(this.game);

        if (this.game[setWinner].sets === 3) {
            this.#finishGame();
        }
    }

    // Ukončení hry
    #finishGame () {
        // Zobrazení výsledku zápasu:
        Elem.from("#main").attr("data-finished", "true");
        let target = Elem.from("#scoreboard-match .wrapper").html("").get();
        target.appendChild(Elem.from("#template-final-header").clone(true).attrRemove("id").get());
        for(let s of this.game.sets) {
            let row = Elem.from("#template-final-row").clone(true).attrRemove("id").get();
            Elem.from(row, ".player1").html(s[0]);
            Elem.from(row, ".player2").html(s[1]);
            target.appendChild(row);
        }
    }

    // Zapíše aktuální stav do historie.
    #writeToHistory () {
        this.game.history.push(
            {
                "serving": this.game.serving,
                "player1": {
                    "sets": this.game.player1.sets,
                    "points": this.game.player1.points
                },
                "player2": {
                    "sets": this.game.player2.sets,
                    "points": this.game.player2.points
                },
                "sets": this.game.sets
            }
        );
        this.#setButtonUndoVisibility(true);
    }

    // Vrátí počet bodů hráče podle ID ("player1" | "player2").
    #getPointsByPlayerId (playerId) {
        return this.game[playerId].points;
    }

    // Nastaví počet bodů hráče podle ID ("player1" | "player2").
    #setPointsByPlayerId (playerId, points) {
        this.game[playerId].points = points;
        Elem.from("#main #scoreboard-set #" + playerId + " .score").html(points);
    }

    // Vrátí ID protihráče ("player1" | "player2").
    static #getOponentId (id) {
        switch (id) {
            case "player1":
                return "player2";
            case "player2":
                return "player1";
            default:
                return "";
        }
    }

    // Vrátí rozdíl bodů.
    static #pointsDifference (points1, points2) {
        return Math.abs(points1 - points2);
    }
}
