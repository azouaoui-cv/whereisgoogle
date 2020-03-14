//////////////////////
// Global variables //
//////////////////////

const letters_map = {"g1": "G",
                     "o1": "o",
                     "o2": "o",
                     "g2": "g",
                     "l": "l",
                     "e": "e"};

const colors = {"B": "#4582F5",
              "R": "#EF3E34",
              "Y": "#FDBA0B",
              "G": "#2FA954"};

const letters_idx = {"g1": 0,
                "o1": 1,
                "o2": 2,
                "g2": 3,
                "l": 4,
                "e": 5};

const GOOGLE_LOGO_COLORS = ["B", "R", "Y", "B", "G", "R"];

const color_names = Object.keys(colors);

///////////////
// Utilities //
///////////////
// Create a cartesian product of arrays
// Source: https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
// Alternative source: https://paul.af/javascript-cartesian-product
const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);



// Source: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * Source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

//////////
// Core //
//////////
function create_combinations(n_logos=16){
  // instanciate cartesian product
  let combinations = cartesian(color_names,
    color_names,
    color_names,
    color_names,
    color_names,
    color_names);
  // Register length
  n_combinations = combinations.length
  // Find index of Google Logo
  index = combinations.findIndex(x => arraysEqual(x, GOOGLE_LOGO_COLORS));
  // Pop Google index logo
  combinations.splice(index, 1);
  // Randomly select a subset of combinations
  selected_subset = [];
  for (let i = 0; i < n_logos - 1; i++) {
      let item = combinations[Math.floor(Math.random()*n_combinations)];
      selected_subset.push(item);
  }
  // Add real Google logo
  selected_subset.push(GOOGLE_LOGO_COLORS);
  // Shuffle the array
  shuffle(selected_subset);
  return selected_subset;
}

function populate_HTML(selected_subset) {


  // Set the date we're counting down to
  var startDate = new Date().getTime();
  // Update the count down every 1 second
  var x = setInterval(function() {
    // Get today's date and time
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    var distance = now - startDate;
    // Time calculations for days, hours, minutes and seconds
    // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Display the result in the element with id="demo"
    document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";
    // If the count down is finished, write some text
    if (distance > 1000 * 60 * 60) {
      clearInterval(x);
      document.getElementById("timer").innerHTML = "EXPIRED";
    }
  }, 1000);



  // Populate the colors
  n_combinations = selected_subset.length
  for (let i = 0; i < n_combinations; i++){
    let item = document.getElementById(`cell-${i}`);
    if (arraysEqual(selected_subset[i], GOOGLE_LOGO_COLORS)){
      item.onclick = function(){

        // Get today's date and time
        var now = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = now - startDate;
        // Time calculations for days, hours, minutes and seconds
        // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        clearInterval(x);
        time = "Done in " + minutes + "m " + seconds + "s.";
        alert(`Congratulations! ${time}`);

      }
    }
    else {
      item.onclick = function(){
        alert("Wrong logo!");
      }
    }
    for (let [key, value] of Object.entries(letters_idx)) {
        document.getElementById(`${key}-${i}`).style.color = colors[selected_subset[i][value]];
        }
  }
}

//////////
// Main //
//////////
function tableCreate(){

    if (document.contains(document.getElementById("demo-table"))) {
        document.getElementById("demo-table").remove();
    }

    if (document.contains(document.getElementById("timer"))) {
      document.getElementById("timer").remove();
    }

    const body = document.body,
        table  = document.createElement('table'),
        timer = document.createElement("p"),
        n_rows = parseInt(document.getElementById("new_table_rows_input").value),
        n_cols = parseInt(document.getElementById("new_table_columns_input").value),
        n_logos = n_rows * n_cols;
    table.style.width  = '100%';
    table.id = "demo-table";
    timer.id = "timer";
    let counter = 0;
    for(let i = 0; i < n_rows; i++){
        const tr = table.insertRow();
        for(let j = 0; j < n_cols; j++){
            const td = tr.insertCell();
            // Create div block here
            let div = document.createElement("div");
            // Populate div attributes
            div.id = `cell-${counter}`;
            div.contenteditable = "true";
            // Populate div with spans
            for (let [key, value] of Object.entries(letters_map)) {
                span = document.createElement("span");
                span.id = `${key}-${counter}`;
                span.innerHTML = value;
                div.appendChild(span);
            }
            td.appendChild(div);
            counter++;
        }
    }
    body.appendChild(table);
    body.appendChild(timer);
    combinations = create_combinations(n_logos);
    populate_HTML(combinations);
}
