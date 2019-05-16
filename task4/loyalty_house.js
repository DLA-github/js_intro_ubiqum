/////////////////// INIT ///////////////////////////////////////////////////////
Vue.config.devtools = true;
var sumAvg = 0;
var divider = 0;
var data;
var allMembers;
var party = ["D", "R", "I"];
const url = 'https://api.propublica.org/congress/v1/113/house/members.json'


var statistics = {
    "Least Engaged": [],
    "Most Engaged": [],
    "Least Loyal": [],
    "Most Loyal": [],
    "Total Reps": 0,
    "General average": 0,
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

var generalTable = new Vue({
    el: '#tableAtGlance',
    data: {
        information: [],
        totalReps: 0,
        generalAvg: 0
    }
});

var leastWhatever = new Vue({
    el: '#leastLoyal',
    data: {
        members: []
    }
});

var mostWhatever = new Vue({
    el: '#mostLoyal',
    data: {
        members: []
    }
});

fetch(url, {

    method: "GET",
    headers: {
        'X-API-Key': 'FR2OceQlsd8zFSiKVyScEYQ2RuBgMz99VFL4n2os'
    }
}).then(function (response) {
    if (response.ok) {
        return response.json();
    }
}).then(function (json) {
    data = json;
    allMembers = data.results[0].members;
    allMembers.forEach(function (member) {
        if (member.middle_name != null) {
            member.last_name = member.middle_name + " " + member.last_name;
        }
    });


    calculateStatistics(party);
    console.log(statistics);
    generalTable.information = statistics.Party;
    generalTable.totalReps = statistics["Total Reps"];
    generalTable.generalAvg = statistics["General average"];
    leastWhatever.members = statistics["Least Loyal"];
    mostWhatever.members = statistics["Most Loyal"];

    // showTableAtaGlance(statistics.Party);
    // showTableEngaged(statistics["Least Engaged"], "leastEngaged");
    // showTableEngaged(statistics["Most Engaged"], "mostEngaged");

}).catch(function (error) {
    console.log(error);
});


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////FUNCTIONS///////////////////////////////////////


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
                if (party.Number == 0) {
                    party["Average vote with Party"] = 0;
                } else {
                    party["Average vote with Party"] = (avg / party.Number).toFixed(3);
                    divider++;
                    sumAvg += (avg / party.Number);
                }
                statistics["Total Reps"] += party.Number;
            }

        });
        statistics["General average"] = (sumAvg / divider).toFixed(3);

    });

    console.log(divider);

    getLeastMostLoyal(arrayVotesParty);

}


function getLeastMostLoyal(array) {
    var sortList = array.sort(function (a, b) {
        return a - b;
    });

    var badMemberList = [];
    var goodMemberList = [];

    var indexMin = sortList[Math.round((allMembers.length / 10) - 1)]; //index for least engaged
    var indexMax = sortList[allMembers.length - Math.round((allMembers.length / 10))]; //index for most engaged


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
    var totalReps = 0;
    var totalVotes = 0;
    var divider = 3;
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
        totalReps += el.Number;


        if (isNaN(el["Average vote with Party"])) {
            el["Average vote with Party"] = 0;
            divider = 2;
        }

        totalVotes += el["Average vote with Party"];
        var trparty = document.createElement("tr");
        var tdparty = document.createElement("td");
        tdparty.append(el.ID);
        var tdReps = document.createElement("td");
        tdReps.append(el.Number);
        var tdVotes = document.createElement("td");
        tdVotes.append(el["Average vote with Party"].toFixed(3) + " %");
        trparty.append(tdparty, tdReps, tdVotes);
        myTBody.append(trparty);

    });

    var trTotal = document.createElement("tr");
    var tdTotal = document.createElement("td");
    tdTotal.append("Total");
    var tdTotalReps = document.createElement("td");
    tdTotalReps.append(totalReps);
    var tdTotalAvg = document.createElement("td");
    tdTotalAvg.append((totalVotes / divider).toFixed(3) + " %");
    trTotal.append(tdTotal, tdTotalReps, tdTotalAvg);
    trTotal.style.fontWeight = "bold";
    myTBody.append(trTotal);

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
        if (el.middle_name == null) {
            el.middle_name = "";
        }
        var myTr = document.createElement("tr");
        var tdFullName = document.createElement("td");
        var linkName = document.createElement("a");
        linkName.setAttribute("href", el.url);
        linkName.append(el.last_name + ", " + el.middle_name + el.first_name);
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