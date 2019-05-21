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

Vue.component('testing', {
    props: {
        message: "",
    },
    template: `<table class="table table-responsive table-hover table-sm">
<thead>
    <th>Name</th>
    <th>Num. Votes Missed</th>
    <th>% Votes Missed</th>
</thead>
<tbody id="leastEngaged">
    <tr v-for="msg in message">
        <td><a :href="msg.url">{{msg.last_name}} , {{msg.first_name}}</a></td>
        <td>{{msg.missed_votes}}</td>
        <td>{{msg.missed_votes_pct}} %</td>
    </tr>
</tbody>
</table>`

});
Vue.component('first-table', {
    props: {
        message: String,
        totalreps: Number,
        generalavg: Number
    },
    template: `<table class="table table-responsive table-hover table-sm">
    <thead>
        <th>Party</th>
        <th>Number of Reps</th>
        <th>% voted with Party</th>
    </thead>
    <tbody id="tableAtGlance">
        <tr v-for="each in message">
            <td>{{each.ID}}</td>
            <td>{{each.Number}}</td>
            <td>{{each["Average vote with Party"]}} %</td>
        </tr>
        <tr>
            <td>Total</td>
            <td>{{totalreps}}</td>
            <td>{{generalavg}} %</td>
        </tr>
    </tbody>

</table>`

});

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