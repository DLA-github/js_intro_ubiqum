Vue.component('myTable', {

    props: {
        members: Array
    },
    template: `
    <table>
    <thead>
        <th>Name</th>
        <th>state</th>
        <th>chamber</th>
    </thead>
    <tbody>
        <tr v-for="member in members">
            <td>{{member.name}}</td>
            <td>{{member.state}}</td>
            <td>{{member.chamber}}</td>
        </tr>
    </tbody>
    </table>`

});


var tb = new Vue({
    el: "#app",

    data: {
        members: [
            "name" = "mariano",
            ""
        },
        {

        },
    ]
}

});