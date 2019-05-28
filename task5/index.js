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
                //set timestamp inside data
                let myData = {
                    value: json,
                    timestamp: new Date().getTime()
                }

                localStorage.setItem(senate.url, JSON.stringify(myData));


                let data = JSON.parse(localStorage.getItem(senate.url));
                senate.allMembers = data.value.results[0].members;
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