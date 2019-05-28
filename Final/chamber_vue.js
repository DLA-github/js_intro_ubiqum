Vue.config.devtools = true

var filterMemberState;
var AllStates = [];

var myLocation = window.location.pathname;

var chamber = "";

myLocation = myLocation.split(".");
myLocation = myLocation[0].split("_");



if (myLocation[0] == "/senate") {
    chamber = "senate";
} else {
    chamber = "house";
}




var party = ["D", "R", "I"];




// var congress = new Vue({

//     el: '#app',

//     data: {
//         chambers: chamber,
//         allMembers: [],
//         members: [],
//         checked: [],
//         state: "",
//         st: "",
//         filteredStates: [],
//         url: 'https://api.propublica.org/congress/v1/113/' + chamber + '/members.json'
//     },
//     created() {
//         this.getInfo();
//     },
//     methods: {
//         getInfo: function () {

//             let expiration = 1200; // sec
//             var allStates = [];
//             let cached = JSON.parse(localStorage.getItem(this.url));


//             if (cached !== null) {
//                 let now = Math.floor(new Date().getTime().toString() / 1000);
//                 let dateString = Math.floor(cached.timestamp / 1000);

//                 if (now - dateString < expiration) {

//                     this.allMembers = cached.value.results[0].members;
//                     this.members = this.allMembers;
//                     console.log(this.allMembers);
//                     this.allMembers.forEach(function (member) {
//                         allStates.push(member.state);
//                     });
//                     this.filteredStates = allStates.filter(function (el, pos) {
//                         return allStates.indexOf(el) == pos;
//                     });
//                     this.filteredStates.sort();
//                     let response = new Response(new Blob([cached]))

//                     return Promise.resolve(response)

//                 }
//                 localStorage.removeItem(this.url);
//             }
//             //if not
//             return fetch(this.url, {
//                 method: "GET",
//                 headers: {
//                     'X-API-Key': 'FR2OceQlsd8zFSiKVyScEYQ2RuBgMz99VFL4n2os'
//                 }
//             }).then(function (response) {
//                 if (response.ok) {
//                     return response.json();
//                 }
//             }).then(function (json) { ///////////////////////MANAGEMENT OF DATA//////////

//                 // date = Math.floor(Date.now() / 1000);
//                 //set timestamp inside data
//                 let myData = {
//                     value: json,
//                     timestamp: new Date().getTime()
//                 }

//                 localStorage.setItem(congress.url, JSON.stringify(myData));


//                 let data = JSON.parse(localStorage.getItem(congress.url));
//                 congress.allMembers = data.value.results[0].members;
//                 congress.members = congress.allMembers;

//                 congress.allMembers.forEach(function (member) {
//                     allStates.push(member.state);
//                 });
//                 congress.filteredStates = allStates.filter(function (el, pos) {
//                     return allStates.indexOf(el) == pos;
//                 });
//                 congress.filteredStates.sort();



//             }).catch(function (error) {
//                 console.log(error);
//             });
//         },
//     },
//     computed: {
//         getFilterTable: function () {

//             var result = this.allMembers.filter(member => this.checked.includes(member.party) || this.checked.length === 0);
//             var final = result.filter(res => this.state.includes(res.state) || this.state.length === 0);
//             return this.members = final;
//         }

//     }

// })

Vue.component('test', {
    props: ["message"],
    template: `
    <div>
    <table class="table table-responsive table-hover table-sm">
    <thead>
        <th>Name</th>
        <th>Party</th>
        <th>State</th>
        <th>Seniority</th>
        <th>% Votes With Party</th>
    </thead>

    <tbody>
        <tr v-for="msg in message">
            <td> <a v-bind:href="msg.url">{{msg.last_name}} , {{msg.first_name}}</a></td>
            <td> {{msg.party}} </td>
            <td> {{msg.state}} </td>
            <td> {{msg.seniority}} </td>
            <td> {{msg.votes_with_party_pct}} % </td>
        </tr>
    </table>
    <div class="col-sm-12" style="color:red;text-align:center;" v-if='message.length == 0'>NO MATCHES FOUND</div>
    </div>`
});


Vue.component('most-least-table', {
    props: {
        message: "",
        condition: ""
    },
    template: `<div v-if='condition=="attendance"'><table class="table table-responsive table-hover table-sm">
    
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
</table>
</div>
<div v-else>
<table class="table table-responsive table-hover table-sm">
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
</table>
</div>

`

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

var congress = new Vue({
    el: "#app",
    data: {
        chambers: chamber,
        allMembers: [],
        members: [],
        checked: [],
        state: "",
        filteredStates: [],
        url: 'https://api.propublica.org/congress/v1/113/' + chamber + '/members.json',
        allMembers: [],
        filteredStates: [],
        st: "",
        page: myLocation[1],
        LeastEngaged: [],
        MostEngaged: [],
        LeastLoyal: [],
        MostLoyal: [],
        totalReps: 0,
        generalAvg: 0,
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
            let cached = JSON.parse(localStorage.getItem(this.url));


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
                localStorage.removeItem(this.url);
            }

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

                localStorage.setItem(congress.url, JSON.stringify(myData));

                let data = JSON.parse(localStorage.getItem(congress.url));
                congress.allMembers = data.value.results[0].members;

                congress.allMembers.forEach(member => {
                    if (member.middle_name != null) {
                        member.last_name = member.middle_name + " " + member.last_name;
                    }
                    allStates.push(member.state);
                });

                congress.filteredStates = allStates.filter(function (el, pos) {
                    return allStates.indexOf(el) == pos;
                });
                congress.filteredStates.sort();
                congress.calculateStatistics(party);
            }).catch(function (error) {
                console.log(error);
            });
        },

        calculateStatistics: function (value) {
            var memberParty = [];
            var arrayVotesMissed = [];
            var arrayVotesParty = [];
            var sumAvg = 0;
            var divider = 0;
            value.forEach(val => {
                var avg = 0;
                this.allMembers.forEach(member => {
                    if (member.party == val) {
                        avg += member.votes_with_party_pct;
                        arrayVotesMissed.push(member.missed_votes_pct); // for calculate missed votes index--tables least/most Engaged
                        arrayVotesParty.push(member.votes_with_party_pct) // for calculate tables least/most Loyal
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
            if (this.page == "attendance") {
                this.getLeastMostLoyal(arrayVotesMissed);
            } else {
                console.log(this.page);
                this.getLeastMostLoyal(arrayVotesParty);
            }

        },
        getLeastMostLoyal: function (array) {

            var sortList = array.sort((a, b) => a - b);

            var badMemberList = [];
            var goodMemberList = [];

            var indexMin = sortList[Math.round((this.allMembers.length / 10) - 1)]; //index for least engaged
            var indexMax = sortList[this.allMembers.length - Math.round((this.allMembers.length / 10))]; //index for most engaged

            if (this.page == "attendance") {
                //Most Engaged
                goodMemberList = this.allMembers.filter(element => element.missed_votes_pct <= indexMin);

                //Least Engaged
                badMemberList = this.allMembers.filter(element => element.missed_votes_pct >= indexMax);



                this.MostEngaged = goodMemberList.sort((a, b) => a["missed_votes_pct"] - b["missed_votes_pct"]);
                this.LeastEngaged = badMemberList.sort((a, b) => a["missed_votes_pct"] - b["missed_votes_pct"]);
                this.LeastEngaged.reverse();
            } else {
                console.log(this.page);
                //least loyal
                badMemberList = this.allMembers.filter(element => element.votes_with_party_pct <= indexMin);

                //most loyal
                goodMemberList = this.allMembers.filter(element => element.votes_with_party_pct >= indexMax);


                this.LeastLoyal = badMemberList.sort((a, b) => a["votes_with_party_pct"] - b["votes_with_party_pct"]);
                this.MostLoyal = goodMemberList.sort((a, b) => a["votes_with_party_pct"] - b["votes_with_party_pct"]);
                this.MostLoyal.reverse();
            }

        },
    },
    computed: {

        getFilterTable: function () {
            var result = this.allMembers.filter(member => this.checked.includes(member.party) || this.checked.length === 0);
            var final = result.filter(res => this.state.includes(res.state) || this.state.length === 0);
            return this.members = final;
        }

    }





})