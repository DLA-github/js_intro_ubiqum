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


var loyalty = new Vue({
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
                loyalty.allMembers = data.results[0].members;
                loyalty.allMembers.forEach(member => {
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
            var arrayVotesParty = [];
            var sumAvg = 0;
            var divider = 0;
            console.log(value);
            value.forEach(val => {
                var avg = 0;
                loyalty.allMembers.forEach(member => {
                    if (member.party == val) {
                        avg += member.votes_with_party_pct;
                        arrayVotesParty.push(member.votes_with_party_pct); // for calculate missed votes index--tables least/most Engaged
                    }
                });
                console.log(loyalty.allMembers);
                memberParty = loyalty.allMembers.filter(member => member.party == val);

                loyalty.Party.forEach(party => {
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
                        loyalty.totalReps += party.Number;
                    }

                });
                loyalty.generalAvg = (sumAvg / divider).toFixed(3);

            });


            console.log(divider);

            loyalty.getLeastMostLoyal(arrayVotesParty);

        },

        getLeastMostLoyal: array => {

            var sortList = array.sort((a, b) => a - b);

            var badMemberList = [];
            var goodMemberList = [];

            var indexMin = sortList[Math.round((loyalty.allMembers.length / 10) - 1)]; //index for least engaged
            var indexMax = sortList[loyalty.allMembers.length - Math.round((loyalty.allMembers.length / 10))]; //index for most engaged


            //least loyal
            badMemberList = loyalty.allMembers.filter(element => element.votes_with_party_pct <= indexMin);

            //most loyal
            goodMemberList = loyalty.allMembers.filter(element => element.votes_with_party_pct >= indexMax);


            loyalty.LeastLoyal = badMemberList.sort((a, b) => a["votes_with_party_pct"] - b["votes_with_party_pct"]);
            loyalty.MostLoyal = goodMemberList.sort((a, b) => a["votes_with_party_pct"] - b["votes_with_party_pct"]);
            loyalty.MostLoyal.reverse();

        }



    }







})