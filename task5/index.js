Vue.config.devtools = true;
var info = "metadata";
var senate = new Vue({

    el: '#app',

    data: {
        allMembers: [],
        members: [],
        checked: [],
        state: "",
        st: "",
        filteredStates: [],
        url: 'https://api.propublica.org/congress/v1/113/house/members.json'
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
        }
    },
    computed: {

    }

})