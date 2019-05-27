Vue.config.devtools = true
var filterByState = false;
var filterByParty = false;
var filterMemberState;
var AllStates = [];
var filteredStates = [];

var myLocation = window.location.pathname;
var chamber = "";
myLocation = myLocation.split(".");
console.log(myLocation);

if (myLocation[0] == "/senate") {
    chamber = "senate";
} else {
    chamber = "house";
}

var info = "legislators-" + chamber;

Vue.component('test', {
    props: ["message"],
    template: `<table class="table table-responsive table-hover table-sm">
    <thead>
        <th>Name</th>
        <th>Party</th>
        <th>State</th>
        <th>Seniority</th>
        <th>% Votes With Party</th>
    </thead>

    <tbody>
        <tr v-if='message.length == 0'>
            <td></td>
            <td style="color:red;text-align:center">NO MATCHES FOUND
            </td>

        </tr>
        <tr v-for="msg in message">
            <td> <a v-bind:href="msg.url">{{msg.last_name}} , {{msg.first_name}}</a></td>
            <td> {{msg.party}} </td>
            <td> {{msg.state}} </td>
            <td> {{msg.seniority}} </td>
            <td> {{msg.votes_with_party_pct}} % </td>
        </tr>
    </table>`
});



var senate = new Vue({

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
            var allStates = [];
            let cached = localStorage.getItem(info);
            if (cached !== null) {

                let data = JSON.parse(cached);
                console.log(data.results[0].members);
                this.allMembers = data.results[0].members;
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
                let information = JSON.stringify(json);
                console.log(information);
                localStorage.setItem(info, information);


                let data = JSON.parse(localStorage.getItem(info));
                senate.allMembers = data.results[0].members;
                senate.members = senate.allMembers;

                senate.allMembers.forEach(function (member) {
                    allStates.push(member.state);
                });
                senate.filteredStates = allStates.filter(function (el, pos) {
                    return allStates.indexOf(el) == pos;
                });
                senate.filteredStates.sort();



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