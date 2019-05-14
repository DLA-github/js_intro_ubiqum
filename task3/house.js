/////////////////// INIT ///////////////////////////////////////////////////////

allMembers = data.results[0].members; //simplified acces to data.

var filterByState = false;
var filterByParty = false;
var filterMemberParty = [];
var filterMemberState;

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS ///////////////////////////////////////////////////////////////////


function showHeaderTable() {

    var myTHeader = document.createElement("tr"); //.setAttribute("style", "text-align:'center';");
    var fullName = document.createElement("th");
    fullName.append(" Full Name");
    var party = document.createElement("th");
    party.append(" Party");
    var state = document.createElement("th");
    state.append(" State");
    var seniority = document.createElement("th");
    seniority.append("Seniority");
    var votes = document.createElement("th");
    votes.append("% of votes");
    myTHeader.append(fullName, party, state, seniority, votes);
    document.getElementById("house-data").append(myTHeader);

    return;
}




function showAllMembers(value) {
    document.getElementById("house-data").innerHTML = "";
    console.log(value);

    if (value == "") {
        var noFoundTr = document.createElement("tr");
        var noFoundTdLeft = document.createElement("td");
        noFoundTdLeft.classList.add("col-sm-4");
        var noFoundTdMiddle = document.createElement("td");
        noFoundTdMiddle.append("NO MATCHES FOUND");
        noFoundTdMiddle.classList.add("col-sm-4");
        noFoundTdMiddle.style.color = "red";
        var noFoundTdRigth = document.createElement("td");
        noFoundTdRigth.classList.add("col-sm-4");
        noFoundTr.append(noFoundTdLeft, noFoundTdMiddle, noFoundTdRigth);
        document.getElementById("house-data").append(noFoundTr);
        return;
    }

    showHeaderTable();
    var myTBody = document.createElement("tbody");

    var myTable = value.map(function (tr) {
        if (tr.middle_name == null) {
            tr.middle_name = "";
        }
        var myTr = document.createElement("tr");
        var tdFullName = document.createElement("td");
        var linkName = document.createElement("a");
        linkName.setAttribute("href", tr.url);
        linkName.append(tr.last_name + "," + tr.middle_name + tr.first_name);
        tdFullName.append(linkName);
        var tdParty = document.createElement("td");
        tdParty.append(tr.party);
        var tdState = document.createElement("td");
        tdState.append(tr.state);
        var tdSeniority = document.createElement("td");
        tdSeniority.append(tr.seniority);
        var tdVotes = document.createElement("td");
        tdVotes.append(tr.votes_with_party_pct + "%");
        myTr.setAttribute("style", "text-align:'center';");
        myTr.append(tdFullName, tdParty, tdState, tdSeniority, tdVotes);
        myTBody.append(myTr);
        document.getElementById("house-data").append(myTBody);
    });

}


function doFilterParty(parties) {
    var result = [];

    parties.forEach(function (party) {
        result.push(allMembers.filter(function (member) {
            return member.party == party;
        }));
    });

    var filterResult = [].concat.apply([], result);

    return filterResult;
}

function filterTableByState(members, state) {

    var memberState = [];
    for (var i = 0; i < members.length; i++) { //loop for make the required HTML table 
        if (members[i].state == state) {
            memberState.push(members[i]);
        }
    }
    showAllMembers(memberState);
    return;

}

///////////////////////////////////////////////////////////////////////////////////
// CALLS //////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


showAllMembers(allMembers);




function getFilterTable() {

    var checked = [];
    var allCheckboxes = document.querySelectorAll('input[type=checkbox]:checked'); //for addAddEventListeners to checkboxs
    allCheckboxes.forEach(function (el) {
        checked.push(el.attributes.value.nodeValue);
    });

    if (checked == "") {
        filterByParty = false;
        if (filterByState == false) {
            showAllMembers(allMembers);
            return;
        } else {
            filterTableByState(allMembers, filterMemberState);
            return;
        }
    }
    filterByParty = true;
    var filterMemberParty = doFilterParty(checked);

    if (filterByState == false) {
        showAllMembers(filterMemberParty);
        return;
    }

    filterTableByState(filterMemberParty, filterMemberState);
    return;

}

document.getElementById("byParty").addEventListener('click', function () {
    getFilterTable();
});
document.getElementById("byState").addEventListener('change', function () {

    filterMemberState = this.value;

    if (filterMemberState != "") {
        filterByState = true;
    } else {
        filterByState = false;
    }

    getFilterTable();

});