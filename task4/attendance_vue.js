/////////////////// INIT ///////////////////////////////////////////////////////
Vue.config.devtools = true;

var myLocation = window.location.pathname;
var chamber = "";
myLocation = myLocation.split("_");

if (myLocation[0] == "/senate") {
    chamber = "senate";
} else {
    chamber = "house";
}


var data;
var party = ["D", "R", "I"];


var attendance = new Vue({
    el: "#app",
    data: {

        url: 'https://api.propublica.org/congress/v1/113/' + chamber + '/members.json',
        allMembers: [],
        LeastEngaged: [],
        MostEngaged: [],
        LeastLoyal: [],
        MostLoyal: [],
        totalReps: 0,
        generalAvg: 0,
        // divider: 0,
        Party: [{
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
    },
    created() {
        this.getInfo();
    },

    methods: {
        getInfo: function () {
            var data = [];
            fetch(this.url, {
                method: "GET",
                headers: {
                    'X-API-Key': 'FR2OceQlsd8zFSiKVyScEYQ2RuBgMz99VFL4n2os'
                }
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
            }).then(json => { ///////////////////////MANAGEMENT OF DATA//////////
                data = json;
                attendance.allMembers = data.results[0].members;
                attendance.allMembers.forEach(member => {
                    if (member.middle_name != null) {
                        member.last_name = member.middle_name + " " + member.last_name;
                    }
                });
                this.calculateStatistics(party);
            }).catch(error => {
                console.log(error);
            });
        },
        calculateStatistics: value => {
            var memberParty = [];
            var arrayVotesMissed = [];
            var sumAvg = 0;
            var divider = 0;
            console.log(value);
            value.forEach(val => {
                var avg = 0;
                attendance.allMembers.forEach(member => {
                    if (member.party == val) {
                        avg += member.votes_with_party_pct;
                        arrayVotesMissed.push(member.missed_votes_pct); // for calculate missed votes index--tables least/most Engaged
                    }
                });
                memberParty = attendance.allMembers.filter(member => member.party == val);

                attendance.Party.forEach(party => {
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
                        attendance.totalReps += party.Number;
                    }

                });
                attendance.generalAvg = (sumAvg / divider).toFixed(3);

            });
            attendance.getLeastMostLoyal(arrayVotesMissed);

        },
        getLeastMostLoyal: array => {

            var sortList = array.sort((a, b) => a - b);

            var badMemberList = [];
            var goodMemberList = [];

            var indexMin = sortList[Math.round((attendance.allMembers.length / 10) - 1)]; //index for least engaged
            var indexMax = sortList[attendance.allMembers.length - Math.round((attendance.allMembers.length / 10))]; //index for most engaged


            //Most Engaged
            goodMemberList = attendance.allMembers.filter(element => element.missed_votes_pct <= indexMin);

            //Least Engaged
            badMemberList = attendance.allMembers.filter(element => element.missed_votes_pct >= indexMax);



            attendance.MostEngaged = goodMemberList.sort((a, b) => a["missed_votes_pct"] - b["missed_votes_pct"]);
            attendance.LeastEngaged = badMemberList.sort((a, b) => a["missed_votes_pct"] - b["missed_votes_pct"]);
            attendance.LeastEngaged.reverse();

        }



    }

})


// Vue.config.devtools = true;
// var sumAvg = 0;
// var divider = 0;
// var data;
// var allMembers;
// var party = ["D", "R", "I"];
// const url = 'https://api.propublica.org/congress/v1/113/senate/members.json'


// var statistics = {
//     "Least Engaged": [],
//     "Most Engaged": [],
//     "Least Loyal": [],
//     "Most Loyal": [],
//     "Total Reps": 0,
//     "General average": 0,
//     "Party": [{
//             "party": "D",
//             "ID": "Democrat",
//             "Number": 0,
//             "List members": [],
//             "Average vote with Party": 0,
//         },

//         {

//             "party": "R",
//             "ID": "Republican",
//             "Number": 0,
//             "List members": [],
//             "Average vote with Party": 0,

//         },
//         {
//             "party": "I",
//             "ID": "Independent",
//             "Number": 0,
//             "List members": [],
//             "Average vote with Party": 0,

//         }
//     ]
// };

// var generalTable = new Vue({
//     el: '#tableAtGlance',
//     data: {
//         information: [],
//         totalReps: 0,
//         generalAvg: 0
//     }
// });
// var leastWhatever = new Vue({
//     el: '#leastEngaged',
//     data: {
//         members: []
//     }
// });
// var mostWhatever = new Vue({
//     el: '#mostEngaged',
//     data: {
//         members: []
//     }
// });
// var tab = document.querySelectorAll("div.memberTable");
// tab.forEach(function (t) {
//     t.style.display = "none";
// });
// // document.getElementById("memberTable2").style.display = "none";
// // document.getElementById("memberTable3").style.display = "none";
// fetch(url, {

//     method: "GET",
//     headers: {
//         'X-API-Key': 'FR2OceQlsd8zFSiKVyScEYQ2RuBgMz99VFL4n2os'
//     }
// }).then(function (response) {
//     if (response.ok) {
//         return response.json();
//     }
// }).then(function (json) {

//     var loader = document.querySelectorAll("div.loader");
//     loader.forEach(function (load) {
//         load.style.display = "none";
//     });
//     tab.forEach(function (t) {
//         t.style.display = "block";
//     });
//     // document.getElementById("loader2").style.display = "none";
//     // document.getElementById("memberTable2").style.display = "block";
//     // document.getElementById("loader3").style.display = "none";
//     // document.getElementById("memberTable3").style.display = "block";
//     data = json;
//     allMembers = data.results[0].members;
//     allMembers.forEach(function (member) {
//         if (member.middle_name != null) {
//             member.last_name = member.middle_name + " " + member.last_name;
//         }
//     });

//     calculateStatistics(party);
//     generalTable.information = statistics.Party;
//     generalTable.totalReps = statistics["Total Reps"];
//     generalTable.generalAvg = statistics["General average"];
//     leastWhatever.members = statistics["Least Engaged"];
//     mostWhatever.members = statistics["Most Engaged"];

//     // showTableAtaGlance(statistics.Party);
//     // showTableEngaged(statistics["Least Engaged"], "leastEngaged");
//     // showTableEngaged(statistics["Most Engaged"], "mostEngaged");

// }).catch(function (error) {
//     console.log(error);
// });

/////////////////////////////////////////////////////////////////////////////
////////////////////FUNCTIONS////////////////////////////////////////////////

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

    getLeastMostEngaged(arrayVotesMissed);

}


function getLeastMostEngaged(array) {
    //order list for calculate missed votes index--tables least/most Engaged
    var sortList = array.sort(function (a, b) {
        return a - b;
    });


    var badMemberList = [];
    var goodMemberList = [];


    var indexMin = sortList[Math.round((allMembers.length / 10) - 1)]; //index for least engaged
    var indexMax = sortList[allMembers.length - (Math.round((allMembers.length / 10)))]; //index for most engaged


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