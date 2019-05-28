Vue.config.devtools = true;

//parameter State from dropdown 
var filterState = window.location.search.split("?=").pop();


Vue.component('table-state', {
    props: ["message"],
    template: `<table class="table table-responsive table-hover table-sm">
    <thead>
        <th>Name</th>
        <th>Party</th>
        <th>Chamber</th>
    </thead>

    <tbody>
        <tr v-if='message.length == 0'>
            <td></td>
            <td style="color:red;text-align:center">NO MATCHES FOUND
            </td>

        </tr>
        <tr v-for="msg in message">
            <td> <a v-bind:href="msg.url">{{msg.last_name}}, {{msg.first_name}}</a></td>
            <td> {{msg.party}} </td>
            <td> {{msg.title}} </td>
        </tr>
    </table>`
});


var states = new Vue({
    el: "#app",

    data: {
        myStateId: filterState,
        st: "",
        filteredStates: [],
        senateData: [],
        houseData: [],
        legislators: [],
        stateMembers: [],
        members: [],
        filters: [],
        chambers: []
    },
    created() {
        this.getInfoHouse();
        this.getInfoSenate();
    },

    methods: {
        getInfoHouse: function () {
            //if data storaged
            let allStates = [];
            let expiration = 1200; // sec
            let cached = JSON.parse(localStorage.getItem('house'));
            let url = "https://api.propublica.org/congress/v1/113/house/members.json";

            if (cached !== null) {
                let now = Math.floor(new Date().getTime().toString() / 1000);
                let dateString = Math.floor(cached.timestamp / 1000);

                if (now - dateString < expiration) {


                    this.houseData = cached.value.results[0].members;
                    this.houseData.forEach(member => {
                        if (member.middle_name != null) {
                            member.last_name = member.middle_name + " " + member.last_name;
                        }
                        allStates.push(member.state);
                    });

                    this.filteredStates = allStates.filter(function (el, pos) {
                        return allStates.indexOf(el) == pos;
                    });
                    this.filteredStates.sort();
                    let response = new Response(new Blob([cached]))
                    return Promise.resolve(response)
                }
                localStorage.removeItem('house');
            }
            //if not
            return fetch(url, {
                method: "GET",
                headers: {
                    'X-API-Key': 'FR2OceQlsd8zFSiKVyScEYQ2RuBgMz99VFL4n2os'
                }
            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            }).then(function (json) { ///////////////////////MANAGEMENT OF DATA//////////
                let house = {
                    value: json,
                    timestamp: new Date().getTime()
                }

                localStorage.setItem('house', JSON.stringify(house));


                let data = JSON.parse(localStorage.getItem('house'));
                states.houseData = data.value.results[0].members;
                states.houseData.forEach(member => {
                    if (member.middle_name != null) {
                        member.last_name = member.middle_name + " " + member.last_name;
                    }
                    allStates.push(member.state);
                });

                states.filteredStates = allStates.filter(function (el, pos) {
                    return allStates.indexOf(el) == pos;
                });
                states.filteredStates.sort();

            }).catch(function (error) {
                console.log(error);
            });
        },
        getInfoSenate: function () {
            let expiration = 1200; // sec
            let cached = JSON.parse(localStorage.getItem('senate'));
            let url = "https://api.propublica.org/congress/v1/113/senate/members.json";

            if (cached !== null) {
                let now = Math.floor(new Date().getTime().toString() / 1000);
                let dateString = Math.floor(cached.timestamp / 1000);

                if (now - dateString < expiration) {


                    this.senateData = cached.value.results[0].members;
                    this.senateData.forEach(member => {
                        if (member.middle_name != null) {
                            member.last_name = member.middle_name + " " + member.last_name;
                        }
                    });
                    this.mergeMembers();
                    let response = new Response(new Blob([cached]))
                    return Promise.resolve(response)
                }
                localStorage.removeItem('senate');
            }
            //if not
            return fetch(url, {
                method: "GET",
                headers: {
                    'X-API-Key': 'FR2OceQlsd8zFSiKVyScEYQ2RuBgMz99VFL4n2os'
                }
            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            }).then(function (json) { ///////////////////////MANAGEMENT OF DATA//////////
                let senate = {
                    value: json,
                    timestamp: new Date().getTime()
                }

                localStorage.setItem('senate', JSON.stringify(senate));


                let data = JSON.parse(localStorage.getItem('senate'));
                states.senateData = data.value.results[0].members;
                states.senateData.forEach(member => {
                    if (member.middle_name != null) {
                        member.last_name = member.middle_name + " " + member.last_name;
                    }
                });
                states.mergeMembers();
            }).catch(function (error) {
                console.log(error);
            });
        },

        mergeMembers: function () {
            this.legislators = this.senateData.concat(this.houseData);
            this.filterByState();
        },

        filterByState: function () {
            let members = []
            members = this.legislators.filter(
                member => {
                    return member.state == this.myStateId
                });

            members.forEach(member => {
                if (member.party == "R") {
                    member.party = "Republican"
                }
                if (member.party == "D") {
                    member.party = "Democratic"
                }
                if (member.party == "I") {
                    member.party = "Independent"
                }
                member.title = member.title.split(",").shift();


            });
            console.log(members);
            this.members = members;
            this.stateMembers = this.members;
        }
    },
    computed: {
        getfilterResult: function () {
            var result = this.stateMembers.filter(member => this.filters.includes(member.party) || this.filters.length === 0);
            var final = result.filter(res => this.chambers.includes(res.title) || this.chambers.length === 0);
            return this.members = final;
        }
    }
});