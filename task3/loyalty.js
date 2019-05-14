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
showTableLoyal(statistics["Least Loyal"], "leastLoyal");
showTableLoyal(statistics["Most Loyal"], "mostLoyal");




function calculateStatistics(value) {
    var memberParty = [];
    var arrayVotesParty = [];

    value.forEach(function (val) {
        var avg = 0;
        allMembers.forEach(function (member) {
            if (member.party == val) {
                avg += member.votes_with_party_pct;
                arrayVotesParty.push(member.votes_with_party_pct); // for calculate missed votes index--tables least/most Engaged
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

    getLeastMostLoyal(arrayVotesParty);

}

function getLeastMostLoyal(array) {

    var sortList = array.sort(function (a, b) {
        return a - b;
    });

    var badMemberList = [];
    var goodMemberList = [];

    var indexMin = sortList[Math.floor((allMembers.length / 10) + 1)]; //index for least engaged
    var indexMax = sortList[allMembers.length - (Math.floor((allMembers.length / 10) + 1))]; //index for most engaged


    //least loyal
    badMemberList = allMembers.filter(function (element) {
        return element.votes_with_party_pct <= indexMin;
    });

    //most loyal
    goodMemberList = allMembers.filter(function (element) {
        return element.votes_with_party_pct >= indexMax;
    });


    statistics["Least Loyal"] = badMemberList.sort(function (a, b) {
        return a["votes_with_party_pct"] - b["votes_with_party_pct"]
    });
    statistics["Most Loyal"] = goodMemberList.sort(function (a, b) {
        return a["votes_with_party_pct"] - b["votes_with_party_pct"]
    });
    statistics["Most Loyal"].reverse();

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
            tdVotes.append(el["Average vote with Party"]);
            trparty.append(tdparty, tdReps, tdVotes);
            myTBody.append(trparty);
        }
    });
    document.getElementById("tableAtGlance").append(myTBody);
    return;
}


function showTableLoyal(value, table) {

    //show header
    var myTHeader = document.createElement("tr"); //.setAttribute("style", "text-align:'center';");
    var party = document.createElement("th");
    party.append("Name");
    var numberReps = document.createElement("th");
    numberReps.append("Total Votes");
    var votes = document.createElement("th");
    votes.append("% votes with Party");
    myTHeader.append(party, numberReps, votes);
    document.getElementById(table).append(myTHeader)
    //show body
    var myTBody = document.createElement("tbody");

    value.forEach(function (el) {
        console.log(el);
        if (el.middle_name == null) {
            el.middle_name = "";
        }
        var myTr = document.createElement("tr");
        var tdFullName = document.createElement("td");
        var linkName = document.createElement("a");
        linkName.setAttribute("href", el.url);
        linkName.append(el.last_name + "," + el.middle_name + el.first_name);
        tdFullName.append(linkName);
        var tdTotalVotes = document.createElement("td");
        tdTotalVotes.append(el.total_votes);
        var tdWithParty = document.createElement("td");
        tdWithParty.append(el.votes_with_party_pct);
        myTr.append(tdFullName, tdTotalVotes, tdWithParty);
        myTBody.append(myTr);
        document.getElementById(table).append(myTBody);
    });

}