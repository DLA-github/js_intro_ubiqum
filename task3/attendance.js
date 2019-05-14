/////////////////// INIT ///////////////////////////////////////////////////////

allMembers = data.results[0].members; //simplified acces to data.


//calculate numbers of members for each party

var statistics = {
    "Least Engaged": [],
    "Most Engaged": [],
    "Least Loyal": [],
    "Most Loyal": [],
    "Party": [{
            "party": "D",
            "ID": "Democrat",
            "Number": 0,
            "List members": [],
            "Average vote with Party": 0,
        },

        {

            "party": "R",
            "ID": "Republican",
            "Number": 0,
            "List members": [],
            "Average vote with Party": 0,

        },
        {
            "party": "I",
            "ID": "Independent",
            "Number": 0,
            "List members": [],
            "Average vote with Party": 0,

        }
    ]
};


var party = ["D", "R", "I"];



calculateStatistics(party);

showTableAtaGlance(statistics.Party);
showTableEngaged(statistics["Least Engaged"], "leastEngaged");
showTableEngaged(statistics["Most Engaged"], "mostEngaged");



function calculateStatistics(value) {
    var memberParty = [];
    var arrayVotesMissed = [];

    value.forEach(function (val) {
        var avg = 0;
        allMembers.forEach(function (member) {
            if (member.party == val) {
                avg += member.votes_with_party_pct;
                arrayVotesMissed.push(member.missed_votes_pct); // for calculate missed votes index--tables least/most Engaged
            }
        });

        memberParty = allMembers.filter(function (member) {
            return member.party == val;
        });

        statistics.Party.forEach(function (party) {
            if (party.party == val) {
                party["List members"] = memberParty;
                party.Number = party["List members"].length;
                party["Average vote with Party"] = avg / party.Number;
            }
        });
    });


    getLeastMostEngaged(arrayVotesMissed);


}


function getLeastMostEngaged(array) {
    //order list for calculate missed votes index--tables least/most Engaged
    var sortList = array.sort(function (a, b) {
        return a - b;
    });

    var badMemberList = [];
    var goodMemberList = [];


    var indexMin = sortList[Math.floor((allMembers.length / 10) + 1)]; //index for least engaged
    var indexMax = sortList[allMembers.length - (Math.floor((allMembers.length / 10) + 1))]; //index for most engaged


    //least Engaged
    goodMemberList = allMembers.filter(function (element) {
        return element.missed_votes_pct <= indexMin;
    });

    //best Engaged
    badMemberList = allMembers.filter(function (element) {
        return element.missed_votes_pct >= indexMax;
    });

    statistics["Most Engaged"] = goodMemberList.sort(function (a, b) {
        return a["missed_votes_pct"] - b["missed_votes_pct"];
    });
    statistics["Least Engaged"] = badMemberList.sort(function (a, b) {
        return a["missed_votes_pct"] - b["missed_votes_pct"];
    });
    statistics["Least Engaged"].reverse();
}


function showTableAtaGlance(value) {
    var myTHeader = document.createElement("tr"); //.setAttribute("style", "text-align:'center';");
    var party = document.createElement("th");
    party.append("Party");
    var numberReps = document.createElement("th");
    numberReps.append("Number of Reps");
    var votes = document.createElement("th");
    votes.append("% voted with Party");
    myTHeader.append(party, numberReps, votes);
    document.getElementById("tableAtGlance").append(myTHeader)
    var myTBody = document.createElement("tbody");


    value.forEach(function (el) {

        if (el.Number > 0) {
            var trparty = document.createElement("tr");
            var tdparty = document.createElement("td");
            tdparty.append(el.ID);
            var tdReps = document.createElement("td");
            tdReps.append(el.Number);
            var tdVotes = document.createElement("td");
            tdVotes.append(el["Average vote with Party"].toFixed(3));
            trparty.append(tdparty, tdReps, tdVotes);
            myTBody.append(trparty);
        }
    });
    document.getElementById("tableAtGlance").append(myTBody);
    return;
}





function showTableEngaged(value, table) {

    //show header
    var myTHeader = document.createElement("tr"); //.setAttribute("style", "text-align:'center';");
    var party = document.createElement("th");
    party.append("Name");
    var numberReps = document.createElement("th");
    numberReps.append("Number Votes Missed");
    var votes = document.createElement("th");
    votes.append("% Votes Missed");
    myTHeader.append(party, numberReps, votes);
    document.getElementById(table).append(myTHeader)
    //show body
    var myTBody = document.createElement("tbody");

    value.forEach(function (el) {

        if (el.middle_name == null) {
            el.middle_name = "";
        }
        var myTr = document.createElement("tr");
        var tdFullName = document.createElement("td");
        var linkName = document.createElement("a");
        linkName.setAttribute("href", el.url);
        linkName.append(el.last_name + ", " + el.middle_name + el.first_name);
        tdFullName.append(linkName);
        var tdMissedVotes = document.createElement("td");
        tdMissedVotes.append(el.missed_votes);
        var tdPerMissedVotes = document.createElement("td");
        tdPerMissedVotes.append(el.missed_votes_pct);
        myTr.append(tdFullName, tdMissedVotes, tdPerMissedVotes);
        myTBody.append(myTr);
        document.getElementById(table).append(myTBody);
    });

}