var intervalID;
var jokeObj;
var jokeArr = [];
var jokeHTML = "";
jQuery.support.cors = true;

function getRandomJoke() {
    $.ajax({
        url: "https://icanhazdadjoke.com/",
        data: {},
        crossDomain: true,
        type: "GET",
        dataType: "json",
        headers: { "Accept": "application/json", "User-Agent": "DadJokes (jbeaty1959@gmail.com)" },
        success: function (response, textStatus, jqXHR) {
            $("#lblJoke").text(response.joke);
        },
        error: function (error) {
            console.log('Error: ' + error.statusText + ' ' + error.status + ' ' + error.responseText);
        }

    });
}

function getSearchJokes(term) {
    $.ajax({
        url: "https://icanhazdadjoke.com/search",
        data: {"term": term, "limit": "30", "page": "1"},
        crossDomain: true,
        type: "GET",
        dataType: "json",
        headers: { "Accept": "application/json", "User-Agent": "DadJokes (jbeaty1959@gmail.com)" },
        success: function (response, textStatus, jqXHR) {
            if (response.results.length > 0) {
                //console.log(response);
                jokeArr = [];
                jokeHTML = "";
                response.results.forEach(writeResults);
                if (jokeArr.length > 0) {
                    jokeArr.sort(function (a, b) { return a.lgth - b.lgth; });
                    var breakAt = 0;
                    if (jokeArr[0].lgth < 10) {
                        breakAt = 10;
                        jokeHTML += "<tr><td><u>Short</u></td></tr>";
                    }
                    else if (jokeArr[0].lgth < 20) {
                        breakAt = 20;
                        jokeHTML += "<tr><td><u>Medium</u></td></tr>";
                    }
                    else {
                        breakAt = 1000;
                        jokeHTML += "<tr><td><u>Long</u></td></tr>";
                    }
                    for (i = 0; i < jokeArr.length; i++) {
                        if (jokeArr[i].lgth >= breakAt) {
                            breakAt += 10;
                            if (breakAt === 20) {
                                jokeHTML += "<tr><td><u>Medium</u></td></tr>";
                            }
                            else {
                                jokeHTML += "<tr><td><u>Long</u></td></tr>";
                                breakAt = 1000;
                            }
                        }
                        var fixedJoke = setHTMLJoke(term, jokeArr[i].jokeTxt);
                        jokeHTML += "<tr><td>" + fixedJoke + "</td></tr>";
                    }
                }
            }
            else {
                jokeHTML = "<tr><td>No Results Found!";
            }
            $("#tblSearch").html(jokeHTML);
        },
        error: function (error) {
            console.log('Error: ' + error.statusText + ' ' + error.status + ' ' + error.responseText);
        }

    });
}

function writeResults(x) {
    var numWords = x.joke.split(" ").length;
    jokeObj = { lgth: numWords, jokeTxt: x.joke };
    jokeArr.push(jokeObj);
}

function setHTMLJoke(term, joke) {
    var regTerm = new RegExp(term, "ig");
    return joke.replace(regTerm, "<b>" + term + "</b>");
}

$(document).ready(function () {
    if ($("#rdoRandom").prop("checked")) {
        getRandomJoke();
        intervalID = setInterval(getRandomJoke, 10 * 1000);
    }

    $("#rdoSearch").click(function (evt) {
        clearInterval(intervalID);
        $("#txtSearchWord").removeAttr("hidden");
        $("#btnSearch").removeAttr("hidden");
        $("#divRandom").attr("hidden", "hidden");
        $("#divSearch").removeAttr("hidden")
    });

    $("#rdoRandom").click(function (evt) {
        $("#txtSearchWord").attr("hidden", "hidden");
        $("#btnSearch").attr("hidden", "hidden");
        $("#divSearch").attr("hidden", "hidden");
        $("#divRandom").removeAttr("hidden")
        getRandomJoke();
        intervalID = setInterval(getRandomJoke, 10 * 1000);
    });

    $("#btnSearch").click(function (evt) {
        var searchTerm = $("#txtSearchWord").val();
        getSearchJokes(searchTerm);
    });
	
	$("#txtSearchWord").keydown(function(evt){
		if (evt.which == 13){
			$("#btnSearch").click();
			return false;
		}
		return true;
	});
});

