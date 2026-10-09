const savedLessons = JSON.parse(
    localStorage.getItem("completedLessons") || "[]"
);

const completedLessons = new Set(savedLessons);

const quizAnswers = {
    basics: "monitor",
    mouse: "double",
    keyboard: "spacebar",
    files: "folder",
    internet: "browser"
};

const quizQuestions = {
    basics: {
        name: "basicsQuiz",
        result: "basicsResult",
        question: "Which part of the computer displays information?",
        options: [
            ["keyboard", "Keyboard"],
            ["monitor", "Monitor"],
            ["mouse", "Mouse"]
        ]
    },
    mouse: {
        name: "mouseQuiz",
        result: "mouseResult",
        question: "Which mouse action usually opens a file or program?",
        options: [
            ["left", "Left-click"],
            ["double", "Double-click"],
            ["right", "Right-click"]
        ]
    },
    keyboard: {
        name: "keyboardQuiz",
        result: "keyboardResult",
        question: "Which key adds a space between words?",
        options: [
            ["enter", "Enter"],
            ["backspace", "Backspace"],
            ["spacebar", "Spacebar"]
        ]
    },
    files: {
        name: "filesQuiz",
        result: "filesResult",
        question: "What helps organize files on a computer?",
        options: [
            ["folder", "Folders"],
            ["mouse", "A mouse"],
            ["monitor", "A monitor"]
        ]
    },
    internet: {
        name: "internetQuiz",
        result: "internetResult",
        question: "Which program can you use to visit websites?",
        options: [
            ["calculator", "Calculator"],
            ["browser", "A web browser"],
            ["notepad", "Notepad"]
        ]
    }
};

const quizScores = JSON.parse(
    localStorage.getItem("quizScores") || "{}"
);

function updateProgress() {
    const totalLessons = 5;
    const completed = completedLessons.size;
    const percentage = (completed / totalLessons) * 100;

    document.getElementById("progress-text").textContent =
        `Lessons completed: ${completed} of ${totalLessons}`;

    document.getElementById("progress-fill").style.width =
        percentage + "%";
}

function showLesson(lesson) {
    const lessonArea = document.getElementById("lesson");

    if (lesson === "basics") {
        lessonArea.innerHTML = `
            <h2>Computer Basics</h2>
            <p>A computer helps you work, learn, communicate, and find information.</p>
            <h3>The Main Parts of a Computer</h3>
            <ul>
                <li><strong>Monitor:</strong> Displays information.</li>
                <li><strong>Keyboard:</strong> Types letters and numbers.</li>
                <li><strong>Mouse:</strong> Points, clicks, and selects items.</li>
                <li><strong>Computer tower:</strong> Houses important desktop components.</li>
            </ul>
            ${makeQuiz("basics")}
        `;
    } else if (lesson === "mouse") {
        lessonArea.innerHTML = `
            <h2>Using a Mouse</h2>
            <p>A mouse lets you control the pointer on your screen.</p>
            <ul>
                <li><strong>Left-click:</strong> Select something.</li>
                <li><strong>Right-click:</strong> Open a menu of options.</li>
                <li><strong>Double-click:</strong> Usually opens a file or program.</li>
                <li><strong>Scroll wheel:</strong> Move up and down a page.</li>
            </ul>
            ${makeQuiz("mouse")}
        `;
    } else if (lesson === "keyboard") {
        lessonArea.innerHTML = `
            <h2>Using a Keyboard</h2>
            <p>A keyboard lets you enter letters, numbers, and commands.</p>
            <ul>
                <li><strong>Letter keys:</strong> Type words.</li>
                <li><strong>Spacebar:</strong> Add spaces between words.</li>
                <li><strong>Enter:</strong> Start a new line or confirm an action.</li>
                <li><strong>Backspace:</strong> Delete the character before the cursor.</li>
                <li><strong>Shift:</strong> Type a capital letter or upper symbol.</li>
            </ul>
            ${makeQuiz("keyboard")}
        `;
    } else if (lesson === "files") {
        lessonArea.innerHTML = `
            <h2>Files and Folders</h2>
            <p>Files hold documents, pictures, and videos. Folders help organize them.</p>
            <ol>
                <li>Open File Explorer.</li>
                <li>Choose a location, such as Documents.</li>
                <li>Right-click an empty area.</li>
                <li>Choose New, then Folder.</li>
                <li>Type a name and press Enter.</li>
            </ol>
            ${makeQuiz("files")}
        `;
    } else if (lesson === "internet") {
        lessonArea.innerHTML = `
            <h2>Using the Internet</h2>
            <p>The internet helps you find information, learn, and communicate.</p>
            <ol>
                <li>Open a browser, such as Microsoft Edge.</li>
                <li>Click the address bar at the top.</li>
                <li>Type a website address or search for a topic.</li>
                <li>Press Enter.</li>
            </ol>
            <p><strong>Safety tip:</strong> Don't share passwords with untrusted websites.</p>
            ${makeQuiz("internet")}
        `;
    }

    completedLessons.add(lesson);

    localStorage.setItem(
        "completedLessons",
        JSON.stringify([...completedLessons])
    );

    updateProgress();
}

function makeQuiz(lesson) {
    const quiz = quizQuestions[lesson];

    const options = quiz.options.map(([value, label]) => `
        <label>
            <input type="radio" name="${quiz.name}" value="${value}">
            ${label}
        </label><br>
    `).join("");

    return `
        <h3>Quick Quiz</h3>
        <p>${quiz.question}</p>
        ${options}
        <button onclick="checkQuiz('${lesson}')">Check Answer</button>
        <p id="${quiz.result}"></p>
    `;
}

function checkQuiz(lesson) {
    const quiz = quizQuestions[lesson];

    const selected = document.querySelector(
        `input[name="${quiz.name}"]:checked`
    );

    const result = document.getElementById(quiz.result);

    if (!selected) {
        result.textContent = "Please choose an answer first.";
        result.style.color = "#b45309";
        return;
    }

    const correct = selected.value === quizAnswers[lesson];

    if (correct) {
        result.textContent = "Correct! Great job!";
        result.style.color = "green";
    } else {
        result.textContent = "Not quite. Try again!";
        result.style.color = "red";
    }

    quizScores[lesson] = correct;

    localStorage.setItem("quizScores", JSON.stringify(quizScores));

    showFinalScore();
}

function showFinalScore() {
    const answered = Object.keys(quizScores).length;
    const correct = Object.values(quizScores).filter(
        answer => answer === true
    ).length;

    let scoreArea = document.getElementById("final-score");

    if (!scoreArea) {
        scoreArea = document.createElement("div");
        scoreArea.id = "final-score";
        scoreArea.style.maxWidth = "700px";
        scoreArea.style.margin = "20px auto";
        scoreArea.style.padding = "20px";
        scoreArea.style.backgroundColor = "#ffffff";
        scoreArea.style.borderRadius = "12px";
        scoreArea.style.textAlign = "center";

        document.getElementById("lesson").after(scoreArea);
    }

    scoreArea.innerHTML = `
        <h2>Your Quiz Score</h2>
        <p>You answered ${correct} out of ${answered} attempted quizzes correctly.</p>
        ${
            answered === 5
                ? `<h3>Final Score: ${correct} out of 5 (${correct * 20}%)</h3>`
                : `<p>Complete all five quizzes to get your final score out of 5.</p>`
        }
    `;

    updateCertificate(correct);
}

function updateCertificate(correct) {
    const certificateArea = document.getElementById("certificate-area");

    if (!certificateArea) {
        return;
    }

    if (Object.keys(quizScores).length !== 5 || correct !== 5) {
        certificateArea.innerHTML = `
            <p>Pass all five quizzes to unlock your certificate.</p>
        `;
        return;
    }

    certificateArea.innerHTML = `
        <div id="certificate">
            <h2>Certificate of Completion</h2>
            <p>This certificate is proudly presented to</p>

            <input
                type="text"
                id="learner-name"
                placeholder="Enter learner's full name"
                aria-label="Learner's full name"
            >

            <p>for successfully completing all five lessons in</p>
            <h3>Computer Learning Assistant</h3>
            <p>Final Quiz Score: 5 out of 5 (100%)</p>
            <p>Congratulations on your achievement!</p>

            <button onclick="printCertificate()">Print Certificate</button>
        </div>
    `;
}

function printCertificate() {
    const nameInput = document.getElementById("learner-name");
    const learnerName = nameInput.value.trim();

    if (!learnerName) {
        alert("Please enter the learner's name first.");
        nameInput.focus();
        return;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Your browser blocked the certificate window. Allow pop-ups for this page and try again.");
        return;
    }

    const safeName = learnerName.replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Certificate of Completion</title>
            <style>
                body {
                    font-family: Georgia, serif;
                    text-align: center;
                    padding: 40px;
                    color: #17365d;
                }
                .certificate {
                    border: 10px double #2864a5;
                    padding: 45px 25px;
                    max-width: 850px;
                    margin: 20px auto;
                }
                h1 { font-size: 38px; }
                .name {
                    font-size: 32px;
                    font-weight: bold;
                    border-bottom: 2px solid #2864a5;
                    padding: 12px;
                    margin: 25px auto;
                }
                p { font-size: 18px; }
                @media print {
                    body { padding: 0; }
                    .certificate { margin: 0 auto; }
                }
            </style>
        </head>
        <body>
            <div class="certificate">
                <h1>Certificate of Completion</h1>
                <p>This certificate is proudly presented to</p>
                <div class="name">${safeName}</div>
                <p>for successfully completing all five lessons in</p>
                <h2>Computer Learning Assistant</h2>
                <p>Final Quiz Score: 5 out of 5 (100%)</p>
                <p>Congratulations on your achievement!</p>
            </div>
            <script>
                window.onload = function () {
                    window.print();
                };
            <\/script>
        </body>
        </html>
    `);

    printWindow.document.close();
}

updateProgress();
showFinalScore();
