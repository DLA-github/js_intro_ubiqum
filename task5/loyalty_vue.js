Vue.config.devtools = true;

var myLocation = window.location.pathname;
var chamber = "";
myLocation = myLocation.split("_");

if (myLocation[0] == "/senate") {
    chamber = "senate";
} else {
    chamber = "house";
}
var info = "loyalty-" + chamber;
var party = ["D", "R", "I"];

Vue.component('testing', {
    props: {
        message: Array,
    },
    template: `<table class="table table-responsive table-hover table-sm">
    <thead>
        <th>Name</th>
        <th>Total Votes</th>
        <th>% Votes With Party</th>
    </thead>
    <tbody id="leastLoyal">
        <tr v-for="member in message">
            <td><a v-bind:href="member.url">{{member.last_name}} , {{member.first_name}}</a></td>
            <td>{{member.total_votes}}</td>
            <td>{{member.votes_with_party_pct}} %</td>
        </tr>
    </tbody>
</table>`

});
Vue.component('first-table', {
    props: {
        message: Array,
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


var loyalty = new Vue({
    el: "#app",
    data: {

        url: 'https://api.propublica.org/congress/v1/113/' + chamber + '/members.json',
        allMembers: [],
        filteredStates: [],
        st: "",
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
            //if data storaged
            let expiration = 1200; // sec
            var allStates = [];
            let cached = JSON.parse(localStorage.getItem(info));


            if (cached !== null) {
                let now = Math.floor(new Date().getTime().toString() / 1000);
                let dateString = Math.floor(cached.timestamp / 1000);

                if (now - dateString < expiration) {

                    this.allMembers = cached.value.results[0].members;
                    this.allMembers.forEach(member => {
                        if (member.middle_name != null) {
                            member.last_name = member.middle_name + " " + member.last_name;
                        }
                        allStates.push(member.state);
                    });

                    this.filteredStates = allStates.filter(function (el, pos) {
                        return allStates.indexOf(el) == pos;
                    });
                    this.filteredStates.sort();

                    this.calculateStatistics(party);
                    let response = new Response(new Blob([cached]))
                    return Promise.resolve(response)
                }
                localStorage.removeItem(info);
            }
            //if not
            return fetch(this.url, {
                method: "GET",
                headers: {
                    'X-API-Key': 'FR2OceQlsd8zFSiKVyScEYQ2RuBgMz99VFL4n2os'
                }
            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            }).then(function (json) { ///////////////////////MANAGEMENT OF DATA//////////
                let myData = {
                    value: json,
                    timestamp: new Date().getTime()
                }

                localStorage.setItem(info, JSON.stringify(myData));


                let data = JSON.parse(localStorage.getItem(info));
                loyalty.allMembers = data.value.results[0].members;
                loyalty.allMembers.forEach(member => {
                    if (member.middle_name != null) {
                        member.last_name = member.middle_name + " " + member.last_name;
                    }
                    allStates.push(member.state);
                });

                loyalty.filteredStates = allStates.filter(function (el, pos) {
                    return allStates.indexOf(el) == pos;
                });
                loyalty.filteredStates.sort();

                loyalty.calculateStatistics(party);
            }).catch(error => {
                console.log(error);
            });
        },
        calculateStatistics: function (value) {
            var memberParty = [];
            var arrayVotesParty = [];
            var sumAvg = 0;
            var divider = 0;
            value.forEach(val => {
                var avg = 0;
                this.allMembers.forEach(member => {
                    if (member.party == val) {
                        avg += member.votes_with_party_pct;
                        arrayVotesParty.push(member.votes_with_party_pct); // for calculate missed votes index--tables least/most Engaged
                    }
                });
                memberParty = this.allMembers.filter(member => member.party == val);

                this.Party.forEach(party => {
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
                        this.totalReps += party.Number;
                    }

                });
                this.generalAvg = (sumAvg / divider).toFixed(3);

            });

            this.getLeastMostLoyal(arrayVotesParty);

        },

        getLeastMostLoyal: function (array) {

            var sortList = array.sort((a, b) => a - b);

            var badMemberList = [];
            var goodMemberList = [];

            var indexMin = sortList[Math.round((this.allMembers.length / 10) - 1)]; //index for least engaged
            var indexMax = sortList[this.allMembers.length - Math.round((this.allMembers.length / 10))]; //index for most engaged


            //least loyal
            badMemberList = this.allMembers.filter(element => element.votes_with_party_pct <= indexMin);

            //most loyal
            goodMemberList = this.allMembers.filter(element => element.votes_with_party_pct >= indexMax);


            this.LeastLoyal = badMemberList.sort((a, b) => a["votes_with_party_pct"] - b["votes_with_party_pct"]);
            this.MostLoyal = goodMemberList.sort((a, b) => a["votes_with_party_pct"] - b["votes_with_party_pct"]);
            this.MostLoyal.reverse();

        }

    }

})