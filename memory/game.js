var container = document.getElementById("container");
card_names = ["Chrysanthemum", "Desert", "Hydrangeas", "Jellyfish", "Koala", "Lighthouse", "Penguins", "Tulips"];
// double the array of card names so there are two of every card
card_names.push.apply(card_names, card_names);
shuffle(card_names);

card_list = "<ul>";

for (var i = 0; i < card_names.length; i++) {
    card_list += "<li><div class='" + card_names[i] + "'><img src='assets/" + card_names[i] + ".jpg' /></div></li>";
}
card_list += "</ul>";

container.innerHTML = card_list;

$("img").hide();
firstGuess = true;
score = 0;
win = card_names.length / 2;
unmatched = false;

$("li").click(function() {
    
    if (unmatched) {
        currentImage.hide();
        currentImage.removeClass("face-up");
        firstCard.children("img").hide();
        firstCard.children("img").removeClass();
        unmatched = false;
    }
    if (firstGuess) {
        if (!$(this).children("div").children("img").hasClass("face-up")) {
            currentDiv = $(this).children("div");
            currentImage = currentDiv.children("img")
            currentImage.show();
            currentImage.addClass("face-up");
            firstCard = currentDiv;
            firstGuess = false;
        }
    } else {
        if (!$(this).children("div").children("img").hasClass("face-up")) {
            currentDiv = $(this).children("div");
            currentImage = currentDiv.children("img")
            currentImage.show();
            currentImage.addClass("face-up");
            if (firstCard.attr("class") == currentDiv.attr("class")) {
                score += 1;
                if (score == win) {
                    alert("you win!");
                }
            } else {
                unmatched = true;
            }
            firstGuess = true;
        }
    }
});


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}