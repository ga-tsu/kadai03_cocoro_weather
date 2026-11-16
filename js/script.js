
// =====================================
// 1. 質問データを用意する
// =====================================

// 10問の質問を配列にまとめる
// 1問ごとの情報はオブジェクトで管理する
// yesScore：YESを選んだときの点数
// noScore：NOを選んだときの点数

const questions = [

    {
        category: "仕事の意義",
        text: "私は今の仕事にやりがいを感じている",
        yesScore: 1,
        noScore: 0
    },

    {
        category: "仕事の意義",
        text: "自分の仕事が何の役に立っているかわからないことが多い",
        yesScore: 0,
        noScore: 1
    },

    {
        category: "成長実感",
        text: "仕事を通じて成長していると感じる",
        yesScore: 1,
        noScore: 0
    },

    {
        category: "成長実感",
        text: "最近の仕事では新しい学びがほとんどない",
        yesScore: 0,
        noScore: 1
    },

    {
        category: "強みの発揮",
        text: "自分の強みを仕事で発揮できている",
        yesScore: 1,
        noScore: 0
    },

    {
        category: "強みの発揮",
        text: "自分の能力を十分に生かせていないと感じる",
        yesScore: 0,
        noScore: 1
    },

    {
        category: "主体性",
        text: "自分の意思で仕事の進め方を工夫できている",
        yesScore: 1,
        noScore: 0
    },

    {
        category: "主体性",
        text: "仕事では自分の意見や判断を反映する余地がない",
        yesScore: 0,
        noScore: 1
    },

    {
        category: "仕事への意欲",
        text: "新しい仕事や挑戦に前向きである",
        yesScore: 1,
        noScore: 0
    },

    {
        category: "仕事への意欲",
        text: "仕事に取り組む意欲が湧かないことが多い",
        yesScore: 0,
        noScore: 1
    }

];


// =====================================
// 2. 現在の状態を管理する変数
// =====================================

// 現在表示している質問の番号
// 配列は0番目から始まる
let currentQuestion = 0;

// 回答を保存する配列
// nullは「まだ回答していない」という意味
let answers = [
    null, null, null, null, null,
    null, null, null, null, null
];

// 診断結果を保存する変数
// STEP 3以降で使用する
let currentResult = null;

// ページを開いたときにメモ欄を空にする
// （ブラウザが前回の入力を復元してしまうのを防ぐ）
$("#diary-memo").val("");


// =====================================
// 3. 画面を切り替える関数
// =====================================

function showScreen(screenId) {

    // すべての画面を非表示にする
    $(".screen").hide();

    // 指定された画面だけ表示する
    $(screenId).show();

    // 画面上部へ移動する
    $(window).scrollTop(0);

}


// =====================================
// 4. 質問を表示する関数
// =====================================

function showQuestion() {

    // 現在の質問データを取り出す
    const question = questions[currentQuestion];

    // 質問番号を表示する
    $("#question-number").text(
        "QUESTION " + (currentQuestion + 1)
    );

    // 観点の名前を表示する
    $("#question-category").text(question.category);

    // 質問文を表示する
    $("#question-text").text(question.text);

    // 選択状態を一度リセットする
    $(".answer-button").removeClass("selected");

    // 回答済みの質問に戻った場合
    // 前回選んだ回答を色で表示する
    if (answers[currentQuestion] !== null) {

        if (answers[currentQuestion] === question.yesScore) {

            $("#answer-yes").addClass("selected");

        } else {

            $("#answer-no").addClass("selected");

        }

    }

    // 1問目では戻るボタンを無効化する
    if (currentQuestion === 0) {

        $("#prev-button").prop("disabled", true);

    } else {

        $("#prev-button").prop("disabled", false);

    }

    // 回答進捗を更新する
    updateProgress();

    console.log("現在の質問番号:", currentQuestion);

}


// =====================================
// 5. 回答進捗を更新する関数
// =====================================

function updateProgress() {

    let count = 0;

    // 配列の中を順番に確認する
    for (let i = 0; i < answers.length; i++) {

        // nullでなければ回答済み
        if (answers[i] !== null) {

            count++;

        }

    }

    // 回答済みの数を表示する
    $("#progress-text").text(
        count + " / " + questions.length
    );

    // 進捗率を計算する
    const percent = count / questions.length * 100;

    // ゲージの横幅を変更する
    $("#progress-bar").css("width", percent + "%");

}


// =====================================
// 6. チェック開始ボタン
// =====================================

$("#start-button").on("click", function () {

    // 最初の質問に戻す
    currentQuestion = 0;

    // 過去の回答をリセットする
    answers = [
        null, null, null, null, null,
        null, null, null, null, null
    ];

    // 過去の診断結果もリセットする
    currentResult = null;

    // メモ欄をリセットする
    $("#diary-memo").val("");

    // 質問画面を表示する
    showScreen("#quiz-screen");

    // 最初の質問を表示する
    showQuestion();

});


// =====================================
// 7. YESボタンが押されたとき
// =====================================

$("#answer-yes").on("click", function () {

    // 現在の質問のYESの点数を取り出す
    const score = questions[currentQuestion].yesScore;

    // 回答を記録する
    saveAnswer(score);

});


// =====================================
// 8. NOボタンが押されたとき
// =====================================

$("#answer-no").on("click", function () {

    // 現在の質問のNOの点数を取り出す
    const score = questions[currentQuestion].noScore;

    // 回答を記録する
    saveAnswer(score);

});


// =====================================
// 9. 回答を記録して次の質問に進む
// =====================================

function saveAnswer(score) {

    // 現在の質問番号に対応する場所へ
    // 点数を保存する
    answers[currentQuestion] = score;

    console.log("回答データ:", answers);

    // 次の質問へ進む
    currentQuestion++;

    // まだ質問が残っている場合
    if (currentQuestion < questions.length) {

        showQuestion();

    } else {

        // すべて回答した場合
        updateProgress();

        // 採点する
        calculateResult();

    }

}


// =====================================
// 10. 前の質問に戻る
// =====================================

$("#prev-button").on("click", function () {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

});


// =====================================
// 11. 診断結果を計算する
// =====================================

// 既存のアプリの採点ロジックを再利用

function calculateResult() {

    // 5観点ごとの点数を計算する
    const meaning = answers[0] + answers[1];

    const growth = answers[2] + answers[3];

    const strength = answers[4] + answers[5];

    const autonomy = answers[6] + answers[7];

    const motivation = answers[8] + answers[9];

    // 総合点を計算する
    const score = meaning + growth + strength
        + autonomy + motivation;

    // 診断結果をオブジェクトにまとめる
    currentResult = {

        score: score,
        meaning: meaning,
        growth: growth,
        strength: strength,
        autonomy: autonomy,
        motivation: motivation

    };

    console.log("診断結果:", currentResult);

    $("#diary-memo").val("");

    // 結果画面を表示する
    showScreen("#result-screen");

    // 詳細な診断結果を表示する
    showResult();

}


// =====================================
// 12. ココロ日記を開く
// =====================================

$("#open-history").on("click", function () {

    showScreen("#history-screen");

    // 日記の内容を準備する
    prepareDiary();

    // 過去の記録だけを表示する
    $("#today-record").hide();

});


// =====================================
// 13. 最初に戻るボタン
// =====================================

$(".back-button").on("click", function () {

    showScreen("#start-screen");

});


// =====================================
// 14. ヘッダーのロゴ
// =====================================

$("#home-button").on("click", function (event) {

    // リンク本来の動作を止める
    event.preventDefault();

    showScreen("#start-screen");

});


// =====================================
// 15. 診断結果を天気で表示する
// =====================================

function showResult() {

    const score = currentResult.score;

    // 前回の天気の背景色をリセット
    $("#weather-result").removeClass(
        "sunny cloudy rainy"
    );


    // -----------------------------
    // 晴れ模様：8〜10点
    // -----------------------------

    if (score >= 8) {

        currentResult.level = "晴れ模様";

        $("#weather-result").addClass("sunny");

        $("#weather-icon").text("☀️");

        $("#weather-label").text("SUNNY");

        $("#weather-title").text("晴れ模様。");

        $("#weather-message").text(
            "今の仕事に、前向きなエネルギーが満ちているようです。"
        );

        $("#weather-advice").text(
            "今感じている充実感を大切に。小さな挑戦が、さらに可能性を広げてくれるかもしれません。"
        );

    }


    // -----------------------------
    // 晴れ、ときどき曇り：4〜7点
    // -----------------------------

    else if (score >= 4) {

        currentResult.level = "晴れ、ときどき曇り";

        $("#weather-result").addClass("cloudy");

        $("#weather-icon").text("🌤️");

        $("#weather-label").text("PARTLY CLOUDY");

        $("#weather-title").text(
            "晴れ、ときどき曇り。"
        );

        $("#weather-message").text(
            "充実していることも、少し気になることもあるようです。"
        );

        $("#weather-advice").text(
            "すべてを変えなくても大丈夫。今の仕事の中で、小さな楽しみをひとつ見つけてみましょう。"
        );

    }


    // -----------------------------
    // ひと休み日和：0〜3点
    // -----------------------------

    else {

        currentResult.level = "ひと休み日和";

        $("#weather-result").addClass("rainy");

        $("#weather-icon").text("🌧️");

        $("#weather-label").text("RESTFUL DAY");

        $("#weather-title").text("ひと休み日和。");

        $("#weather-message").text(
            "今は、仕事に向き合うエネルギーが少なくなっているのかもしれません。"
        );

        $("#weather-advice").text(
            "無理に前向きにならなくても大丈夫。まずは自分の気持ちや、置かれている環境に目を向けてみましょう。"
        );

    }


    // 総合点を表示する
    $("#total-score").text(score);

    // 5観点の結果を表示する
    showDimensions();

}


// =====================================
// 16. 5観点のアドバイスデータ
// =====================================

// 各配列の0番目が0点のアドバイス
// 1番目が1点、2番目が2点

const dimensionAdvice = {

    meaning: [

        "自分の仕事が誰の役に立っているのか、少し立ち止まって考えてみましょう。",

        "仕事の中で、意味や価値を感じられる瞬間を探してみましょう。",

        "仕事の意味を感じられているようです。その感覚を大切にしていきましょう。"

    ],

    growth: [

        "最近できるようになったことを、小さなことでも振り返ってみましょう。",

        "少しだけ新しいことを試すと、成長を感じるきっかけになるかもしれません。",

        "学びや成長を感じられているようです。次の小さな挑戦を楽しんでみましょう。"

    ],

    strength: [

        "自分が自然にできることや、周囲から感謝されたことを思い出してみましょう。",

        "得意なことを、今の仕事でもう少し活かせないか考えてみましょう。",

        "自分らしさを仕事で発揮できているようです。その強みをさらに育ててみましょう。"

    ],

    autonomy: [

        "今の環境の中で、自分で選べることや周囲に相談できることを探してみましょう。",

        "仕事の進め方を、自分なりに少し工夫してみるのもよさそうです。",

        "自分の意思で仕事に向き合えているようです。その主体性を大切にしましょう。"

    ],

    motivation: [

        "無理にやる気を出そうとせず、今の気持ちや疲れに目を向けてみましょう。",

        "少しでも興味を感じる仕事から取り組んでみるのもよさそうです。",

        "前向きなエネルギーがあるようです。好奇心を持って新しいことを楽しみましょう。"

    ]

};


// =====================================
// 17. 5観点の結果を表示する
// =====================================

function showDimensions() {

    // 観点の名前を配列にまとめる
    const dimensions = [
        "meaning",
        "growth",
        "strength",
        "autonomy",
        "motivation"
    ];

    // 5観点を順番に処理する
    for (let i = 0; i < dimensions.length; i++) {

        // 観点の名前を取り出す
        const key = dimensions[i];

        // 観点の点数を取り出す
        const score = currentResult[key];

        // 点数を表示する
        $("#" + key + "-score").text(
            score + " / 2"
        );

        // グラフの横幅を変更する
        $("#" + key + "-bar").css(
            "width", score * 50 + "%"
        );

        // 点数に合ったアドバイスを表示する
        $("#" + key + "-advice").text(
            dimensionAdvice[key][score]
        );

    }

    // 今のあなたへのヒントを表示する
    showPersonalHint();

}


// =====================================
// 18. 今のあなたへのヒント
// =====================================

function showPersonalHint() {

    // 5観点の名前
    const dimensions = [
        "meaning",
        "growth",
        "strength",
        "autonomy",
        "motivation"
    ];

    // 表示用の日本語名
    const dimensionNames = {

        meaning: "仕事の意義",
        growth: "成長実感",
        strength: "強みの発揮",
        autonomy: "主体性",
        motivation: "仕事への意欲"

    };

    // 最も点数の低い観点を探す
    let lowestKey = dimensions[0];

    for (let i = 1; i < dimensions.length; i++) {

        const key = dimensions[i];

        if (currentResult[key] <
            currentResult[lowestKey]) {

            lowestKey = key;

        }

    }


    // すべての観点が2点の場合
    if (currentResult.score === 10) {

        $("#personal-hint").text(
            "今の充実感を支えているものは何でしょうか。自分なりの良い習慣を大切にしてみましょう。"
        );

    } else {

        $("#personal-hint").text(

            "「" + dimensionNames[lowestKey] +
            "」について、少し目を向けてみませんか？ " +
            dimensionAdvice[lowestKey][
            currentResult[lowestKey]
            ]

        );

    }

}


// =====================================
// 19. 今日の一歩カードへ進む
// =====================================

$("#open-card").on("click", function () {

    showScreen("#card-screen");

    prepareCard();

});



// =====================================
// 20. 今日の一歩カードのデータ
// =====================================

const actionCards = {

    // -----------------------------
    // 晴れ模様：挑戦・可能性
    // -----------------------------

    sunny: [

        {
            icon: "🌱",
            title: "好奇心の種",
            message: "いつもと少し違うやり方を、ひとつだけ試してみよう。",
            phrase: "大きな変化は、小さな実験から。"
        },

        {
            icon: "🧭",
            title: "小さな冒険",
            message: "少し気になっていたことに、一歩踏み出してみよう。",
            phrase: "好奇心を、行動に。"
        },

        {
            icon: "☀️",
            title: "幸せのおすそ分け",
            message: "誰かに自分の学びや発見を共有してみよう。",
            phrase: "喜びは、分かち合うと広がる。"
        },

        {
            icon: "🌈",
            title: "未来への手紙",
            message: "1年後、どんな仕事をしていたいか考えてみよう。",
            phrase: "未来を想像することから始まる。"
        },

        {
            icon: "🚀",
            title: "小さな実験",
            message: "やってみないとわからないことを、無理のない範囲でひとつ試してみよう。",
            phrase: "試すことで、新しい景色が見える。"
        }

    ],


    // -----------------------------
    // 晴れ、ときどき曇り：発見・変化
    // -----------------------------

    cloudy: [

        {
            icon: "🌷",
            title: "小さな感謝",
            message: "身近な誰かに、ありがとうを伝えてみよう。",
            phrase: "日常の中に、小さな温かさを。"
        },

        {
            icon: "🍀",
            title: "自分を認める",
            message: "今日できたことを、ひとつだけ書き出してみよう。",
            phrase: "小さな前進も、立派な前進。"
        },

        {
            icon: "🌱",
            title: "楽しみの種",
            message: "今週の仕事の中に、小さな楽しみをひとつつくろう。",
            phrase: "楽しみは、自分でもつくれる。"
        },

        {
            icon: "🔍",
            title: "新しい視点",
            message: "いつもの仕事を、誰かの役に立つという視点から眺めてみよう。",
            phrase: "見方が変わると、景色も変わる。"
        },

        {
            icon: "💬",
            title: "ひとこと対話",
            message: "信頼できる人に、最近考えていることを話してみよう。",
            phrase: "話すことで、見えてくることがある。"
        }

    ],


    // -----------------------------
    // ひと休み日和：休息・自己理解
    // -----------------------------

    rainy: [

        {
            icon: "☕",
            title: "余白をつくる",
            message: "5分だけ、何もしない時間をつくってみよう。",
            phrase: "立ち止まることも、大切な一歩。"
        },

        {
            icon: "📝",
            title: "気持ちをほどく",
            message: "今の気持ちを、誰にも見せないメモに書いてみよう。",
            phrase: "答えを出さなくてもいい。"
        },

        {
            icon: "☁️",
            title: "ひと休み",
            message: "今日は、やらなくてもいいことをひとつ決めよう。",
            phrase: "自分をいたわる時間も大切に。"
        },

        {
            icon: "🌿",
            title: "環境を変える",
            message: "少しだけ席を離れて、いつもと違う場所で過ごしてみよう。",
            phrase: "小さな環境の変化が、気分を変える。"
        },

        {
            icon: "🍵",
            title: "自分にやさしく",
            message: "今日は自分にとって心地よいことを、ひとつ選んでみよう。",
            phrase: "自分を大切にすることから。"
        }

    ]

};



// =====================================
// 21. カードの状態を管理する
// =====================================

// 使用するカードグループ
let cardGroup = "";

// 現在表示しているカード
let drawnCard = null;

// 前回引いたカードの番号
let previousCardIndex = -1;


// =====================================
// 22. カード画面の準備
// =====================================

function prepareCard() {

    // 診断結果に応じて
    // カードのグループを選ぶ

    if (currentResult.score >= 8) {

        cardGroup = "sunny";

    } else if (currentResult.score >= 4) {

        cardGroup = "cloudy";

    } else {

        cardGroup = "rainy";

    }

    // カードの状態をリセット
    drawnCard = null;
    previousCardIndex = -1;

    // すでに今日の一歩を決めている場合
    if (currentResult.actionTitle) {

        $("#card-before").hide();
        $("#card-after").hide();

        $("#selected-action").text(
            currentResult.actionTitle
        );

        $("#card-complete").show();

    } else {

        // カードを引く前の状態にする
        $("#card-before").show();
        $("#card-after").hide();
        $("#card-complete").hide();

    }

    console.log("カードグループ:", cardGroup);

}


// =====================================
// 23. カードをランダムに引く関数
// =====================================

function drawActionCard() {

    // 診断結果に合ったカード配列を取得
    const cards = actionCards[cardGroup];

    // ランダムな番号を作る
    let index = Math.floor(
        Math.random() * cards.length
    );

    // 前回と同じカードだった場合
    // 次の番号のカードに変更する
    if (index === previousCardIndex) {

        index = (index + 1) % cards.length;

    }

    // 選ばれたカードを取得
    drawnCard = cards[index];

    // 今回のカード番号を記録
    previousCardIndex = index;


    // -----------------------------
    // カードの内容をHTMLに表示
    // -----------------------------

    $("#action-icon").text(
        drawnCard.icon
    );

    $("#action-title").text(
        drawnCard.title
    );

    $("#action-message").text(
        drawnCard.message
    );

    $("#action-phrase").text(
        drawnCard.phrase
    );


    // -----------------------------
    // カードの背景色を変更
    // -----------------------------

    $("#action-card").removeClass(
        "sunny-card cloudy-card rainy-card"
    );

    $("#action-card").addClass(
        cardGroup + "-card"
    );


    // -----------------------------
    // カードを表示する
    // -----------------------------

    $("#card-before").hide();

    $("#card-after").stop(true, true)
        .hide()
        .fadeIn(400);

    console.log("引いたカード:", drawnCard);

}


// =====================================
// 24. カードを引くボタン
// =====================================

$("#draw-card").on("click", function () {

    drawActionCard();

});


// =====================================
// 25. もう一枚引くボタン
// =====================================

$("#redraw-card").on("click", function () {

    drawActionCard();

});


// =====================================
// 26. 今日の一歩を決める
// =====================================

$("#select-card").on("click", function () {

    // 選んだカードの情報を
    // 診断結果のオブジェクトに追加

    currentResult.actionTitle =
        drawnCard.title;

    currentResult.actionMessage =
        drawnCard.message;

    currentResult.actionIcon =
        drawnCard.icon;


    // 選んだ行動を表示する

    $("#selected-action").text(
        drawnCard.title
    );


    // カード決定後の画面に切り替える

    $("#card-after").hide();

    $("#card-complete").fadeIn(400);

    console.log(
        "今日の一歩を含む診断結果:",
        currentResult
    );

});


// =====================================
// 27. 診断結果に戻る
// =====================================

$("#back-to-result").on("click", function () {

    showScreen("#result-screen");

});


// =====================================
// 28. ココロ日記に進む
// =====================================

$("#open-diary").on("click", function () {

    showScreen("#history-screen");

    prepareDiary();

});



// =====================================
// 29. ココロ日記のデータ管理
// =====================================

// localStorageで使用する保存先の名前
const diaryStorageKey = "kokoroWeatherDiary";

// 保存されている履歴を取得
const savedDiary = localStorage.getItem(
    diaryStorageKey
);

// 履歴を配列として管理
let diaryHistory = [];

if (savedDiary) {

    try {

        const loadedDiary = JSON.parse(savedDiary);

        if (Array.isArray(loadedDiary)) {

            diaryHistory = loadedDiary;

        }

    } catch (error) {

        console.error("履歴の読み込みエラー", error);

    }

}


// =====================================
// 30. 点数から天気の情報を取得
// =====================================

function getWeatherInfo(score) {

    if (score >= 8) {

        return {
            icon: "☀️",
            title: "晴れ模様",
            type: "sunny"
        };

    } else if (score >= 4) {

        return {
            icon: "🌤️",
            title: "晴れ、ときどき曇り",
            type: "cloudy"
        };

    } else {

        return {
            icon: "🌧️",
            title: "ひと休み日和",
            type: "rainy"
        };

    }

}


// =====================================
// 31. ココロ日記の画面準備
// =====================================

function prepareDiary() {

    // 今日の診断結果がある場合

    if (currentResult &&
        typeof currentResult.score === "number") {

        $("#today-record").show();

        const weather = getWeatherInfo(
            currentResult.score
        );

        $("#diary-weather-icon").text(
            weather.icon
        );

        $("#diary-weather-title").text(
            weather.title
        );

        $("#diary-score").text(
            currentResult.score + " / 10"
        );

        $("#diary-action-title").text(
            currentResult.actionTitle || "未選択"
        );

        $("#diary-action-message").text(
            currentResult.actionMessage || ""
        );


        // 保存済みの場合

        if (currentResult.saved) {

            $("#diary-memo")
                .val(currentResult.memo)
                .prop("disabled", true);

            $("#save-diary")
                .prop("disabled", true)
                .text("記録済み");

            $("#save-message").text(
                "今日の記録を保存しました。"
            );

        } else {

            $("#diary-memo")
                .prop("disabled", false);

            $("#save-diary")
                .prop("disabled", false)
                .text("今日の記録を残す");

            $("#save-message").text("");

        }

    } else {

        // 診断していない場合は
        // 今日の記録欄を表示しない

        $("#today-record").hide();

    }


    // 過去の履歴を表示

    showDiaryHistory();

}



// =====================================
// 32. 今日の記録を保存する
// =====================================

$("#save-diary").on("click", function () {

    // 診断結果がない場合や
    // すでに保存済みの場合は処理しない

    if (!currentResult ||
        typeof currentResult.score !== "number" ||
        currentResult.saved) {

        return;

    }


    // 入力されたメモを取得

    const memo = $("#diary-memo").val();


    // 現在の日時を取得

    const now = new Date();

    const date = now.toLocaleDateString("ja-JP");

    const shortDate =
        (now.getMonth() + 1) + "/" + now.getDate();


    // 保存するデータを作成

    const record = {

        date: date,

        shortDate: shortDate,

        score: currentResult.score,

        level: currentResult.level,

        meaning: currentResult.meaning,

        growth: currentResult.growth,

        strength: currentResult.strength,

        autonomy: currentResult.autonomy,

        motivation: currentResult.motivation,

        actionTitle: currentResult.actionTitle || "",

        actionMessage: currentResult.actionMessage || "",

        actionIcon: currentResult.actionIcon || "",

        memo: memo

    };


    // 配列の先頭に新しい記録を追加

    diaryHistory.unshift(record);


    // localStorageに保存

    try {

        localStorage.setItem(

            diaryStorageKey,

            JSON.stringify(diaryHistory)

        );

    } catch (error) {

        // 保存に失敗した場合は
        // 追加したデータを取り消す

        diaryHistory.shift();

        $("#save-message").text(
            "保存できませんでした。"
        );

        console.error(error);

        return;

    }


    // 保存済みの状態を記録

    currentResult.saved = true;

    currentResult.memo = memo;


    // 画面を更新する

    prepareDiary();

    console.log("保存した記録:", record);

    console.log("診断履歴:", diaryHistory);

});



// =====================================
// 33. 過去の日記を一覧表示する
// =====================================

function showDiaryHistory() {

    // 前回の表示をリセット

    $("#history-list").empty();


    // 記録件数を表示

    $("#history-count").text(
        "これまでの記録：" +
        diaryHistory.length + "回"
    );


    // 履歴がない場合

    if (diaryHistory.length === 0) {

        $("#history-list").text(
            "まだ記録がありません。"
        );

        showHistoryChart();

        return;

    }


    // 履歴を1件ずつ表示

    for (let i = 0; i < diaryHistory.length; i++) {

        const record = diaryHistory[i];

        const weather = getWeatherInfo(
            record.score
        );


        // 日記カードのHTMLを作成

        const item = $(`
            <div class="history-item">

                <div class="history-heading">
                    <span class="history-date"></span>
                    <span class="history-score"></span>
                </div>

                <div class="history-weather">

                    <span class="history-weather-icon">
                    </span>

                    <div>
                        <p class="history-weather-title">
                        </p>

                        <p class="history-action">
                        </p>
                    </div>

                </div>

                <p class="history-memo"></p>

            </div>
        `);


        // 日記カードにデータを入力

        item.find(".history-date").text(
            record.date
        );

        item.find(".history-score").text(
            record.score + " / 10"
        );

        item.find(".history-weather-icon").text(
            weather.icon
        );

        item.find(".history-weather-title").text(
            weather.title
        );

        item.find(".history-action").text(
            "今日の一歩：" +
            (record.actionTitle || "未選択")
        );

        item.find(".history-memo").text(
            record.memo || "メモなし"
        );


        // 日記一覧に追加

        $("#history-list").append(item);

    }


    // 推移グラフを表示

    showHistoryChart();

}



// =====================================
// 34. ココロの天気の推移グラフ
// =====================================

function showHistoryChart() {

    // 前回のグラフをリセット

    $("#history-chart").empty();


    // 履歴がない場合

    if (diaryHistory.length === 0) {

        $("#history-chart").append(
            '<p class="history-empty">' +
            '記録を重ねると、変化が見えてきます。' +
            '</p>'
        );

        return;

    }


    // 最新7件を取り出し
    // 古い順番に並べ替える

    const recentHistory = diaryHistory
        .slice(0, 7)
        .reverse();


    // 記録ごとにグラフを作成

    for (let i = 0; i < recentHistory.length; i++) {

        const record = recentHistory[i];

        const weather = getWeatherInfo(
            record.score
        );


        // 棒グラフのHTMLを作成

        const column = $(`
            <div class="chart-column">

                <div class="chart-icon"></div>

                <p class="chart-score"></p>

                <div class="chart-track">
                    <div class="chart-bar"></div>
                </div>

                <p class="chart-date"></p>

            </div>
        `);


        // グラフの内容を入力

        column.find(".chart-icon").text(
            weather.icon
        );

        column.find(".chart-score").text(
            record.score
        );

        column.find(".chart-bar")
            .addClass(weather.type)
            .css(
                "height",
                record.score * 10 + "%"
            );

        column.find(".chart-date").text(
            record.shortDate
        );


        // グラフに追加

        $("#history-chart").append(column);

    }

}



// =====================================
// 35. ココロ日記の履歴を削除
// =====================================

$("#delete-history").on("click", function () {

    // 履歴がない場合

    if (diaryHistory.length === 0) {

        alert("削除する記録がありません。");

        return;

    }


    // 削除前に確認する

    const answer = confirm(
        "すべてのココロ日記を削除しますか？"
    );


    // OKの場合のみ削除する

    if (answer) {

        try {

            localStorage.removeItem(
                diaryStorageKey
            );

        } catch (error) {

            alert("履歴を削除できませんでした。");

            console.error(error);

            return;

        }


        // 配列を空にする

        diaryHistory = [];


        // 今回の診断結果の保存状態も解除

        if (currentResult) {

            currentResult.saved = false;

        }


        // 画面を更新する

        prepareDiary();

        console.log("診断履歴を削除しました。");

    }

});


// =====================================
// 36. スタート画面から日記を見る
// =====================================

$("#view-history").on("click", function () {

    showScreen("#history-screen");

    prepareDiary();

    // 過去の記録だけを表示する

    $("#today-record").hide();

});

