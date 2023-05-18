/***********************************************
  グローバル変数
************************************************/

//カードの山（配列）
let cards = [];
// 自分のカード（配列）
let myCards = [];
// 相手のカード（配列）
let comCards = [];
// 勝敗決定フラグ（論理型）
let isGameOver = false;

/***********************************************
  イベントハンドラの割り当て
************************************************/
//ページの読み込みが完了したいとき実行する関数を登録
window.addEventListener("load", loadHandler);
// 「カードを引く」ボタンを押したときに実行する関数を登録
document.querySelector("#pick").addEventListener("click", clickPickHandler);
// 「勝負する！」ボタンを押したとき実行する関数を登録
document.querySelector("#judge").addEventListener("click", clickJudgeHandler);
//「もう一回遊ぶ」ボタンを押したとき実行する関数を登録
document.querySelector("#reset").addEventListener("click", clickResetHandler);

/***********************************************
  イベントハンドラ
************************************************/
// ●ページの読み込みが完了したとき実行する関数
function loadHandler() {
  // シャッフル
  shuffle();
  // ※シャッフル関数を呼び出す
  // 自分がカードを引く
  pickMyCard();
  // ※自分がカードを引く関数を呼び出す
  // 相手がカードを引く
  pickComCard();
  // ※相手がカードを引く関数を呼び出す
  // 画面を変更する
  updateView();
  // ※画面を更新する関数を呼び出す
}

// ●「カードを引く」ボタンを押したとき実行する関数
function clickPickHandler() {
  // 自分がカードを引く
  if (isGameOver == false) {
    // [ゲームが終了していなければ条件が成立]
    // 勝敗が未決定
    // 自分gなカードを引く
    pickMyCard();
    // 相手がカードを引く
    pickComCard();
    // 画面を更新する
    updateView();
  }
}

// ●「勝負する！」ボタンを押したとき実行する関数
function clickJudgeHandler() {
  let result = "";
  // 勝敗が未決定の場合
  if (isGameOver == false) {
    // 勝敗を判定する
    result = judge();
    // 勝敗を画面に表示する
    showResult(result);
    // 勝敗フラグを「決定」に変更
    isGameOver = true;
  }
}

// ●「もっかい遊ぶ」ボタンを押したとき実行する関数
function clickResetHandler() {
  // 画面を初期表示に戻す
  // 自分がカードを引く
  // reloadメソッドでページを再読込する
  location.reload();
}

/***********************************************
  ゲーム関数
************************************************/

// ●カードの山をシャッフルする関数
function shuffle() {
  for (let i = 1; i <= 52; i++) {
    cards.push(i);
    // ※カードの初期値を入れる
  }
  // 100回繰返す
  for (let i = 0; i < 100; i++) {
    // カードの山からランダムに選んだ2枚を入れ替える
    let j = Math.floor(Math.random() * 52);
    let k = Math.floor(Math.random() * 52);
    // ※０−５１のどれか
    let temp = cards[j];
    cards[j] = cards[k];
    cards[k] = temp;
    // ※カードjとカードkを交換
  }
}
// ●自分がカードを引く関数

function pickMyCard() {
  // 自分のカードの枚数が4枚以下
  // カードを引く
  if (myCards.length <= 4) {
    // カードの山（配列）から一枚取り出す
    // ※条件を式に置き換える
    let card = cards.pop();
    // ※取り出した要素が配列から消える
    // 取り出した1m祭を自分のカード（配列）に追加する
    myCards.push(card);
    // ※配列の最後尾に追加する
  }
}

// ●相手がカードを引く関数
function pickComCard() {
  // 相手がカードを引く
  // 相手のカードの枚数が4枚以下
  // ※ここでも条件を式に置き換える
  if (comCards.length <= 4) {
    // カードを引くかどうか考える
    if (pickAI(comCards)) {
      // ※考える関数を呼び出す
      //カードの山（配列）から一枚取り出す
      let card = cards.pop();
      // ※取り出した要素が配列から消える
      // 取り出した一枚を相手のカード（配列）に追加する
      comCards.push(card);
      // ※配列の最後尾に追加する
    }
  }
}

// ●カードを引くかどうか考える関数
function pickAI(handCards) {
  // 現在のカードの合計を求める
  // ※カードの合計を求める関数を呼び出す
  let total = getTotal(handCards);
  // 引くか惹かないかを戻り地で返す
  let isPick = false;
  // ※引くならtrue,引かんならfalse

  // 合計が１１以下なら引く
  if (total <= 11) {
    isPick = true;
    // ※AI「もし10をひいてもギリ21だから大丈夫絶対に引こう」
  }
  // 合計が12-14なら80％の確率で「引く」
  else if (total >= 12 && total <= 14) {
    if (Math.random() < 0.8) {
      isPick = true;
      // ※AI「8以上引いたら21を超えてしまう。かも８０％くらいの確率でひこう」
    }
  }
  // 合計が15〜17なら35％の確率で「引く」
  else if (total >= 15 && total <= 17) {
    if (Math.random() < 0.35) {
      isPick = true;
    }
  }
  // 合計が18以上なら引かない
  else if (total >= 18) {
    {
      isPick = false;
    }
  }
  // 引くか引かないかを戻り地で返す
  return isPick;
}

// ●カード合計を計算する関数
function getTotal(handCards) {
  let total = 0;
  // 計算した合計を入れる変数
  let number = 0;
  // カードの数字を入れる変数
  for (let i = 0; i < handCards.length; i++) {
    // ※配列要素を繰り返す
    // 13で割きったあまりを求める
    number = handCards[i] % 13;
    // ※あまりの計算
    // JQK（あまりが１１，１２，０のカードは10となる）
    if (number == 11 || number == 12 || number == 0) {
      total += 10;
    } else {
      total += number;
    }
  }

  // 「A」のカードを含んでる場合
  if (
    handCards.includes(1) ||
    handCards.includes(14) ||
    handCards.includes(27) ||
    handCards.includes(40)
  ) {
    // ※配列に1,14,27,40のどれかが入ってる
    // 「A」を11と数えても合計が21を超えなければ11と数える
    if (total + 10 <= 21) {
      total += 10;
    }
  }
  // 合計を返す
  return total;
}

// ●画面の表示をを更新する関数
function updateView() {
  // 画面を更新する
  // 自分のカードを表示する
  let myFields = document.querySelectorAll(".myCard");
  for (let i = 0; i < myFields.length; i++) {
    // 自分のカードの枚数がiより大きい場合
    // iを５回繰り返す
    if (i < myCards.length) {
      // 表面の画像を表示する
      myFields[i].setAttribute("src", getCardPath(myCards[i]));
    } else {
      // 裏側の画像を表示する
      myFields[i].setAttribute("src", "blue.png");
    }
  }

  // 相手のカードを表示する
  let comFields = document.querySelectorAll(".comCard");
  for (let i = 0; i < comFields.length; i++) {
    // iを５回繰り返す
    if (i < comCards.length) {
      // 相手のカードの枚数がiより大きい
      // 表面の画像を表示する
      comFields[i].setAttribute("src", getCardPath(comCards[i]));
    } else {
      // 裏側の画像を表示する
      comFields[i].setAttribute("src", "red.png");
    }
  }
  //カード合計を再計算する
  document.querySelector("#myTotal").innerText = getTotal(myCards);
  document.querySelector("#comTotal").innerText = getTotal(comCards);
}
// カードの画像パスを求める関数
function getCardPath(card) {
  // カードのパスを入れる変数
  let path = "";
  // カードの数値が一桁なら戦闘に零 -ZERO-を付ける
  if (card <= 9) {
    path = "0" + card + ".png";
  } else {
    path = card + ".png";
  }
  // カードのパスを返す
  return path;
}

// ●勝敗を判定する関数条件分岐
function judge() {
  // 勝敗をあらわす変数
  let result = "";
  // 自分のカードの合計を求める
  let myTotal = getTotal(myCards);
  // 相手のカードの合計を求める
  let comTotal = getTotal(comCards);
  // 勝敗のパターン表に当てはめて勝敗を決める
  if (myTotal > 21 && comTotal <= 21) {
    // 自分の合計が21を超えていれば負け
    result = "lose";
  } else if (myTotal <= 21 && comTotal > 21) {
    // 相手の合計が21を超えていれば勝ち
    result = "win";
  } else if (myTotal > 21 && comTotal > 21) {
    // 自分も相手も21を超えていれば引き分け
    result = "draw";
  } else {
    // 自分も相手も21を超えていない場合
    if (myTotal > comTotal) {
      // 自分の合計が相手の合計より大きければ勝ち
      result = "win";
    } else if (myTotal < comTotal) {
      // 自分の合計が相手の合計より小さければ負け
      result = "lose";
    } else {
      // 自分の合計が相手の合計とおんなじなら引き分け
      result = "draw";
    }
  }
  // 勝敗を呼び戻しもとに戻す
  return result;
}

// ●勝敗を画面に表示する関数
function showResult(result) {
  // メッセージを入れえる変数
  let message = "";
  {
    // 勝敗に応じてメッセージを決める
    switch (result) {
      case "win":
        message = "あなたの勝ちです!";
        break;
      case "lose":
        message = "あなたの負けです!";
        break;
      case "draw":
        message = "引き分けです!";
        break;
    }
  }
  // メッセージを表示する
  alert(message);
}

/***********************************************
  デバッグ関数
************************************************/
function debug() {
  console.log("カードの山", cards);
  console.log("自分のカード", myCards, "合計" + getTotal(myCards));
  console.log("相手のカード", comCards, "合計" + getTotal(comCards));
  console.log("勝敗決定フラグ", isGameOver);
}
