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
            
            <td>NO MATCHES FOUND
            </td>
            
        </tr>
        <tr v-for="msg in message">
            <td> <a v-bind:href="msg.url">{{msg.last_name}} , {{msg.first_name}}</a></td>
            <td> {{msg.party}} </td>
            <td> {{msg.state}} </td>
            <td> {{msg.seniority}} </td>
            <td> {{msg.votes_with_party_pct}} % </td>
        </tr>
    </table>>`
});


var states = new Vue({
    el: "#state",
    data: {
        states: data,
        st: ""
    }
});



var senate = new Vue({

    el: '#app',
    data: {
        allMembers: [],
        members: [],
        filterByState: false,
        filterByParty: false,
        filterMemberState: "",
        state: "",
        filteredStates: [],
        url: 'https://api.propublica.org/congress/v1/113/' + chamber + '/members.json'
    },
    created() {
        this.getInfo();
    },
    methods: {
        getInfo: function () {
            var data = [];
            var allStates = [];
            fetch(this.url, {
                method: "GET",
                headers: {
                    'X-API-Key': 'FR2OceQlsd8zFSiKVyScEYQ2RuBgMz99VFL4n2os'
                }
            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            }).then(function (json) { ///////////////////////MANAGEMENT OF DATA//////////
                data = json;
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
        getFilterTable: function () {

            senate.filterByState = false;

            if (senate.state != "") {
                senate.filterByState = true;
                senate.filterMemberState = event.target.value;
            }
            var checked = [];
            var allCheckboxes = document.querySelectorAll('input[type=checkbox]:checked'); //for addAddEventListeners to checkboxs
            allCheckboxes.forEach(function (el) {
                checked.push(el.attributes.value.nodeValue);
            });

            if (checked == "") {
                senate.filterByParty = false;
                if (senate.filterByState == false) {
                    senate.members = senate.allMembers;
                    return;
                } else {
                    this.filterTableByState(senate.allMembers, senate.state);
                    return;
                }
            }
            senate.filterByParty = true;
            var filterMemberParty = this.doFilterParty(checked);
            console.log(filterMemberParty);
            if (senate.filterByState == false) {
                senate.members = filterMemberParty;
                // if (senators.members.length == 0) {
                //     senators.empty = true;
                // }
                return;
            }

            this.filterTableByState(filterMemberParty, senate.state);
            return;

        },
        doFilterParty: function (parties) {
            var result = [];

            parties.forEach(function (party) {
                result.push(senate.allMembers.filter(function (member) {
                    return member.party == party;
                }));
            });

            var filterResult = [].concat.apply([], result);
            console.log(filterResult);
            return filterResult;
        },

        filterTableByState: function (members, state) {
            console.log(members);
            var memberState = [];
            for (var i = 0; i < members.length; i++) { //loop for make the required HTML table 
                if (members[i].state == state) {
                    memberState.push(members[i]);
                }
            }
            senate.members = memberState;
            // senators.empty = false;
            // if (senators.members.length == 0) {
            //     senators.empty = true;
            // }
            return;

        }

    },

    computed: {


    }

})