window.onload = function () {

    function getRandom(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function setOnePositionButtons(arr, step) {
        var i,
            j,
            elem,
            id,
            max = arr.length;
        for (i = 0; i < max; i++) {
            for (j = 0; j < max; j++) {
                if (arr[i][j] === 0) { continue; }
                id = (("" + arr[i][j]).length === 1) ? ("0" + arr[i][j]) : arr[i][j];
                id = "b" + id;
                elem = document.getElementById(id);
                elem.style.top = (i * step) + "px";
                elem.style.left = (j * step) + "px";
            }
        }
    }

    function fillArrayWithObj(arr, val, oI, oJ) {
        var o = {
                value : val,
                oI : oI,
                oJ : oJ
            };
        arr.push(o);
    }

    function createTempArr(arr, i, j, predI, predJ) {
        var tempArr = [],
            value;

        if (j + 1 <= 3) {
            value = arr[i][j + 1];
            if (i !== predI || (j + 1) !== predJ) {
                fillArrayWithObj(tempArr, value, i, j + 1);
            }
        }

        if (j - 1 >= 0) {
            value = arr[i][j - 1];
            if (i !== predI || (j - 1) !== predJ) {
                fillArrayWithObj(tempArr, value, i, j - 1);
            }
        }

        if (i + 1 <= 3) {
            value = arr[i + 1][j];
            if ((i + 1) !== predI || j !== predJ) {
                fillArrayWithObj(tempArr, value, i + 1, j);
            }
        }

        if (i - 1 >= 0) {
            value = arr[i - 1][j];
            if ((i - 1) !== predI || j !== predJ) {
                fillArrayWithObj(tempArr, value, i - 1, j);
            }
        }
        return tempArr;
    }

    function moveButtonInOneStep(arr, step, em, pr) {
        var _arrButtonsForRemove = createTempArr(arr, em.I, em.J, pr.I, pr.J),
            randomIndex = getRandom(0, _arrButtonsForRemove.length - 1),
            id = "b" + ((("" + _arrButtonsForRemove[randomIndex].value).length === 1) ? ("0" + _arrButtonsForRemove[randomIndex].value) : _arrButtonsForRemove[randomIndex].value),
            elem = document.getElementById(id),
            removeI = _arrButtonsForRemove[randomIndex].oI,
            removeJ = _arrButtonsForRemove[randomIndex].oJ;
        elem.style.top = (em.I * step) + "px";
        elem.style.left = (em.J * step) + "px";
        arr[em.I][em.J] = arr[removeI][removeJ];
        arr[removeI][removeJ] = 0;
        pr.I = em.I;
        pr.J = em.J;
        em.I = removeI;
        em.J = removeJ;

        //console.log("id = " + id);
    }

    function moveButtonAllSteps(elem, arr, step, em, pr, countsteps, speedmix) {
        var count = 0,
            start;
        setTimeout(function _mix() {
             moveButtonInOneStep(arr, step, em, pr);
             count++;
             if (count < countsteps) {
                 setTimeout(_mix, speedmix);
             } else {
                elem.innerHTML = "START";
             }
        }, speedmix);
    }

    function ifLeftEmpty(arr, i0, j0) {
        if ( (j0 - 1) >= 0 && arr[i0][j0 - 1] === 0) {
            arr[i0][j0 - 1] = arr[i0][j0];
            arr[i0][j0] = 0;
            return true;
        }
    }

    function ifRightEmpty(arr, i0, j0) {
        if ( (j0 + 1) <= 3 && arr[i0][j0 + 1] === 0) {
            arr[i0][j0 + 1] = arr[i0][j0];
            arr[i0][j0] = 0;
            return true;
        }
    }

    function ifTopEmpty(arr, i0, j0) {
        if ( (i0 - 1) >= 0 && arr[i0 - 1][j0] === 0) {
            arr[i0 - 1][j0] = arr[i0][j0];
            arr[i0][j0] = 0;
            return true;
        }
    }

    function ifBottomEmpty(arr, i0, j0) {
        if ( (i0 + 1) <= 3 && arr[i0 + 1][j0] === 0) {
            arr[i0 + 1][j0] = arr[i0][j0];
            arr[i0][j0] = 0;
            return true;
        }
    }

    function gameIsOver(arr) {
        if (arr[3][3] === 0) {
            if (arr.toString() === "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0") {
                return true;
            }
        }
        return false;
    }

    function getGameOver() {
        var elem,
            count = 0,
            opacity = 0,
            win = document.querySelector(".win");

            Id = ["b01",
                  "b02", "b05",
                  "b03", "b06", "b09",
                  "b04", "b07", "b10", "b13",
                  "b08", "b11", "b14",
                  "b12", "b15"];

        setTimeout(function _hidden() {
            elem = document.getElementById(Id[count]);

            elem.classList.remove("restart");    
            elem.classList.add("red_hidden");    
             
             count++;
             opacity += 0.0665;
             win.style.opacity = opacity;
             
             if (count < 15) {
                 setTimeout(_hidden, 400);
             }
        }, 400);
    }

    function setClassElem(elem, removeClass, addClass) {
        elem.classList.remove(removeClass);
        elem.classList.add(addClass);
    } 

    (function () {
        const   SPEED_MIX = 200,
                COUNT_STEPS = 21;
        var i,
            buttons = document.querySelectorAll(".button"),
            btnCount = buttons.length,
            startButton = document.querySelector(".btn"),
            empty = {I : 3, J : 3}, //объект с индексами пустого квадранта
            previous = {I : -1, J : -1}, //индексы кнопки, передвинутой на предыдущем этапе
            STEP_MOVE_BUTTON,
            arrValuesButtons = [ [ 1, 2, 3, 4],
                                 [ 5, 6, 7, 8],
                                 [ 9,10,11,12],
                                 [13,14,15, 0] ];


            var btnHeight = +document.getElementById('b01').offsetHeight;
            STEP_MOVE_BUTTON = Math.round(btnHeight + btnHeight/20);
            
            console.log(btnHeight);
            console.log(STEP_MOVE_BUTTON);
    
        function moveButtons(event) {
            var valueTopPx = event.target.style.top,
                indexTopPx = valueTopPx.indexOf("px"),
                valueLeftPx = event.target.style.left,
                indexLeftPx = valueLeftPx.indexOf("px"),
                i = (+valueTopPx.slice(0, indexTopPx)) / STEP_MOVE_BUTTON,
                j = (+valueLeftPx.slice(0, indexLeftPx) / STEP_MOVE_BUTTON);

            if (ifLeftEmpty(arrValuesButtons, i, j)) {
                this.style.left = (j * STEP_MOVE_BUTTON - STEP_MOVE_BUTTON) + "px";
            }

            if (ifRightEmpty(arrValuesButtons, i, j)) {
                this.style.left = (j * STEP_MOVE_BUTTON + STEP_MOVE_BUTTON) + "px";
            }

            if (ifTopEmpty(arrValuesButtons, i, j)) {
                this.style.top = (i * STEP_MOVE_BUTTON - STEP_MOVE_BUTTON) + "px";
            }

            if (ifBottomEmpty(arrValuesButtons, i, j)) {
                this.style.top = (i * STEP_MOVE_BUTTON + STEP_MOVE_BUTTON) + "px";
            }

            if (gameIsOver(arrValuesButtons)) {
                getGameOver();
            }
        }

        setOnePositionButtons(arrValuesButtons, STEP_MOVE_BUTTON);

        startButton.onclick = function () {

            if (this.classList.contains("mix")) {
                moveButtonAllSteps(startButton, arrValuesButtons, STEP_MOVE_BUTTON, empty, previous, COUNT_STEPS, SPEED_MIX);

                setClassElem(startButton, "mix", "start");

            }else if (this.classList.contains("start")) {
                for (i = 0; i < btnCount; i++) {
                    buttons[i].setAttribute("class", "button restart");
                    buttons[i].addEventListener("click", moveButtons, false);
                }               
                setClassElem(startButton, "start", "restart");
                startButton.innerHTML = "RESTART";

            }else if (this.classList.contains("restart")) {
                for (i = 0; i < btnCount; i++) {
                    buttons[i].removeEventListener("click", moveButtons, false);
                    buttons[i].setAttribute("class", "button remix");
                }
                setClassElem(startButton, "restart", "mix");
                startButton.innerHTML = "MIX PLEASE!";

                empty = {I : 3, J : 3};
                previous = {I : -1, J : -1};
                arrValuesButtons = [ [ 1, 2, 3, 4],
                                    [ 5, 6, 7, 8],
                                    [ 9,10,11,12],
                                    [13,14,15, 0] ];

                document.querySelector(".win").style.opacity = 0;
                
                setOnePositionButtons(arrValuesButtons, STEP_MOVE_BUTTON);
            }
        };
    }());

};
