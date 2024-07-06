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

    // Vymena stran po setu.
    switchSides = false;

    // Nastavení verbosity.
    verbosity = "v";

    // Nastavení ukládání.
    saveSettings = false;

    // Historie zapasu.
    gameHistory = [];

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

        // Zjistíme, zda je konec setu:
        if (points >= 11 && Tischtennis.#pointsDifference(points, oponentPoints) >= 2) {
            this.#finishSet();
            return;
        }

        // Zjistíme, zda další míček bude setball či gameball:
        this.checkSetballGameball(points, oponentPoints);
    }

    // Změna podání.
    changeServing () {
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

    // Kontroluje, zda se jedná o setball/matchball.
    checkSetballGameball (points, oponentPoints)
    {
        switch (this.verbosity) {
            case "quiet":
            case "v":
                // Nízká verbosita, nic neříkáme:
                return;
        }

        if (points < 10 && oponentPoints < 10) {
            // Nikdo nemá 10 bodů, setball to není:
            return;
        }
        if (Tischtennis.#pointsDifference(points, oponentPoints) === 0) {
            // Je shoda, setball to není:
            return;
        }

        if (
            (this.game.player1.sets === 2 && this.game.player1.points > this.game.player2.points)
            || (this.game.player2.sets === 2 && this.game.player2.points > this.game.player1.points)
        ) {
            document.getElementById("audio-matchball").play();
            return;
        }
        document.getElementById("audio-setball").play();
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

    // Nastavení přehazování stran po setu.
    toggleSwitchSides () {
        this.switchSides = !this.switchSides;

        this.showSwitchSides();
        this.settingsSave();
    }

    // Zobrazí nastavení přehazování stran po setu.
    showSwitchSides () {
        Elem.from("#switch-sides").attr("data-switch-sides", (this.switchSides ? "yes" : "no"));
    }

    // Přepíná verbositu.
    toggleVerbosity () {
        switch (this.verbosity) {
            case "vvv":
                this.verbosity = "quiet";
                break;
            case "vv":
                this.verbosity = "quiet";
                break;
            case "v":
                this.verbosity = "vv";
                break;
            case "quiet":
                this.verbosity = "v";
                break;
            default:
                this.verbosity = "v";
        }

        this.showVerbosity();
        this.settingsSave();
    }

    // Zobrazí nastavení verbosity.
    showVerbosity () {
        Elem.from("#verbosity").attr("data-verbosity", this.verbosity);
    }

    // Resetuje hru.
    resetGame () {
        this.game = {
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
        };

        this.#showScore(this.game);

        switch (this.verbosity) {
            case "v":
            case "vv":
            case "vvv":
                document.getElementById("audio-start").play();
                break;
        }
    }

    // Přepíná ukládání do cookies.
    toggleSave () {
        this.saveSettings = !this.saveSettings

        this.showSettingsSave();

        if (this.saveSettings) {
            this.settingsSave();
        } else {
            this.settingsClear();
        }
    }

    // Zobrazuje stav ukládání do cookies.
    showSettingsSave () {
        Elem.from("#save").attr("data-save", this.saveSettings ? "yes" : "no");
    }

    // Načte nastavení z cookie.
    settingsLoad () {
        for (let pair of document.cookie.split(";")) {
            let [key, val] = pair.split("=");
            switch (key.trim()) {
                case "verbosity":
                    if (val !== "") {
                        this.verbosity = val;
                        this.showVerbosity();
                    }
                    break;
                case "switchSides":
                    if (val !== "") {
                        this.switchSides = (val === "yes");
                        this.showSwitchSides();
                    }
                    break;
                case "saveSettings":
                    if (val !== "") {
                        this.saveSettings = (val === "yes");
                        this.showSettingsSave();
                    }
                    break;
            }
        }
    }

    // Uloží nastavení do cookie.
    settingsSave () {
        if (!this.saveSettings) {
            return;
        }

        let expires = new Date();
        expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);

        Tischtennis.cookiesSave(
            {
                "verbosity": this.verbosity,
                "switchSides": (this.switchSides ? "yes" : "no"),
                "saveSettings": (this.saveSettings ? "yes" : "no")
            },
            expires.toUTCString()
        );
    }

    // Vymaže nastavení v cookie.
    settingsClear () {
        Tischtennis.cookiesSave(
            {
                "verbosity": "",
                "switchSides": "",
                "saveSettings": ""
            },
            "Thu, 01 Jan 1970 00:00:00 UTC"
        );
    }

    // Uloží hodnoty do cookie.
    static cookiesSave (values, expires) {
        for (let i in values) {
            let cookie = [i + "=" + values[i]];
            cookie.push("expires=" + expires);
            cookie.push("path=/");
            document.cookie = cookie.join(";");
        }
    }

    // Event handler after fullscreen mode change.
    static onFullscreenChange () {
        Elem.from("#main #btn-fullscreen").attr(
            "data-fullscreen",
            (Elem.isFullscreenActive() ? "true" : "false")
        );
    }

    // Event handler kliknutí ta tlačítko "toggle fullscreen".
    static onToggleFullscreenClick () {
        switch (Elem.from("#main #btn-fullscreen").attr("data-fullscreen")) {
            case "true":
                Elem.exitFullscreen();
                break;
            case "false":
                Elem.from("#main").requestFullscreen();
                break;
            default:
        }
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
        switch(this.verbosity) {
            case "v":
            case "vv":
            case "vvv":
                document.getElementById("audio-applause").play();
                break;
        }

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
        } else {
            if (this.switchSides) {
                let elemMain = Elem.from("#main");
                elemMain.attr(
                    "data-switch-sides",
                    (elemMain.attr("data-switch-sides") === "switched" ? "" : "switched")
                );
            }
        }
    }

    // Ukončení hry
    #finishGame () {
        // Zobrazení výsledku zápasu:
        Elem.from("#main").attr("data-finished", "true");
        let target = Elem.from("#scoreboard-match .wrapper").html("").get();

        // Zkopírování hlavičky a vložení jména vítěze:
        let el = target.appendChild(
            Elem
                .from("#template-final-header")
                .clone(true)
                .attrRemove("id")
                .get()
        );
        Elem.from(el).html(this.game.player1.sets > this.game.player2.sets ? this.game.player1.name : this.game.player2.name);

        // Doplnění jednotlivých setů:
        for (let s of this.game.sets) {
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
