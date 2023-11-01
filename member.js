function skillsMember() {
    var x = document.getElementById("skillsMember");
    if (x.style.display === "none") {
        x.style.display = "block";
        document.getElementById("skillsMemberButton").innerHTML = "Hide Skills";
    } else {
        x.style.display = "none";
        document.getElementById("skillsMemberButton").innerHTML = "Show Skills";
    }
}