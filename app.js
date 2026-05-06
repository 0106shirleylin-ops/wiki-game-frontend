let startTitle = "";
let targetTitle = "";
let currentTitle = "";
let stepCount = 0;
let seconds = 0;
let timerId = null;

// 暫時假資料：之後等後端給 wiki links API 再換掉
const fakeLinks = {
    "台灣": ["台北市", "中華民國", "日本", "中國", "太平洋"],
    "台北市": ["台灣", "新北市", "捷運", "中華民國"],
    "中華民國": ["台灣", "中國", "台北市", "歷史"],
    "日本": ["台灣", "東京", "亞洲"],
    "中國": ["台灣", "北京", "亞洲"],
    "太平洋": ["台灣", "海洋", "日本"]
};

document.getElementById("startBtn").addEventListener("click", startGame);

async function startGame() {
    resetGame();

    try {
        const response = await fetch("http://localhost:5000/api/get_question");
        const json = await response.json();

        if (json.status !== "success") {
            alert("取得題目失敗");
            return;
        }

        startTitle = json.data.start_title;
        targetTitle = json.data.end_title;
        currentTitle = startTitle;

        document.getElementById("targetTitle").innerText = targetTitle;
        document.getElementById("currentTitle").innerText = currentTitle;
        document.getElementById("gameArea").classList.remove("hidden");

        startTimer();
        renderLinks(currentTitle);

    } catch (error) {
        console.error(error);
        alert("無法連到後端 API，請確認 Flask 有沒有啟動");
    }
}

function resetGame() {
    stepCount = 0;
    seconds = 0;

    clearInterval(timerId);
    timerId = null;

    document.getElementById("stepCount").innerText = "0";
    document.getElementById("timer").innerText = "0";
    document.getElementById("resultArea").classList.add("hidden");
    document.getElementById("linkList").innerHTML = "";
}

function startTimer() {
    timerId = setInterval(() => {
        seconds++;
        document.getElementById("timer").innerText = seconds;
    }, 1000);
}

function renderLinks(title) {
    const linkList = document.getElementById("linkList");
    linkList.innerHTML = "";

    const links = fakeLinks[title] || ["台灣", "台北市", "中華民國", "日本", "中國"];

    links.forEach(link => {
        const li = document.createElement("li");
        li.innerText = link;

        li.addEventListener("click", () => {
            goToPage(link);
        });

        linkList.appendChild(li);
    });
}

function goToPage(title) {
    currentTitle = title;
    stepCount++;

    document.getElementById("currentTitle").innerText = currentTitle;
    document.getElementById("stepCount").innerText = stepCount;

    if (currentTitle === targetTitle) {
        finishGame();
        return;
    }

    renderLinks(currentTitle);
}

function finishGame() {
    clearInterval(timerId);

    document.getElementById("finalSteps").innerText = stepCount;
    document.getElementById("finalTime").innerText = seconds;
    document.getElementById("resultArea").classList.remove("hidden");

    alert("恭喜抵達目標頁面！");
}