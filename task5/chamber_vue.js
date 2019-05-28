Vue.config.devtools = true

var filterMemberState;
var AllStates = [];

var myLocation = window.location.pathname;
var chamber = "";
myLocation = myLocation.split(".");


if (myLocation[0] == "/senate") {
    chamber = "senate";
} else {
    chamber = "house";
}

var info = "legislators-" + chamber;

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



var congress = new Vue({

    el: '#app',

    data: {
        chambers: chamber,
        allMembers: [],
        members: [],
        checked: [],
        state: "",
        st: "",
        filteredStates: [],
        url: 'https://api.propublica.org/congress/v1/113/' + chamber + '/members.json'
    },
    created() {
        this.getInfo();
    },
    methods: {
        getInfo: function () {

            let expiration = 1200; // sec
            var allStates = [];
            let cached = JSON.parse(localStorage.getItem(this.url));


            if (cached !== null) {
                let now = Math.floor(new Date().getTime().toString() / 1000);
                let dateString = Math.floor(cached.timestamp / 1000);

                if (now - dateString < expiration) {

                    this.allMembers = cached.value.results[0].members;
                    this.members = this.allMembers;
                    console.log(this.allMembers);
                    this.allMembers.forEach(function (member) {
                        allStates.push(member.state);
                    });
                    this.filteredStates = allStates.filter(function (el, pos) {
                        return allStates.indexOf(el) == pos;
                    });
                    this.filteredStates.sort();
                    let response = new Response(new Blob([cached]))

                    return Promise.resolve(response)

                }
                localStorage.removeItem(this.url);
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

                // date = Math.floor(Date.now() / 1000);
                //set timestamp inside data
                let myData = {
                    value: json,
                    timestamp: new Date().getTime()
                }

                localStorage.setItem(congress.url, JSON.stringify(myData));


                let data = JSON.parse(localStorage.getItem(congress.url));
                congress.allMembers = data.value.results[0].members;
                congress.members = congress.allMembers;

                congress.allMembers.forEach(function (member) {
                    allStates.push(member.state);
                });
                congress.filteredStates = allStates.filter(function (el, pos) {
                    return allStates.indexOf(el) == pos;
                });
                congress.filteredStates.sort();



            }).catch(function (error) {
                console.log(error);
            });
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