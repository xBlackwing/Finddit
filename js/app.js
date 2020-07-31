const searchForm = document.getElementById("search-form");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", (e) => {
  // Get sort
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  // Get limit
  const searchLimit = document.getElementById("limit").value;
  // Get search
  const searchTerm = searchInput.value;
  // Check for input
  if (searchTerm == "") {
    // Show message
    showMessage("Please add a search term", "alert-danger");
  }
  // Clear field
  searchInput.value = "";

  // Search Reddit
  search(searchTerm, searchLimit, sortBy).then((results) => {
    let output = '<div class="card-columns">';
    results.forEach((post) => {
      // Check for image
      let image = post.preview
        ? post.preview.images[0].source.url
        : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";
      output += `
      <div class="card mb-2">
      <img class="card-img-top" src="${image}" alt="Card image">
      <div class="card-body">
        <h5 class="card-title"><a href="${post.url}" target="_blank" 
        class="text-dark">${truncateString(post.title, 140)}</a></h5>
        <hr>
        <span class="badge badge-secondary">
          <a href="https://reddit.com/${post.subreddit_name_prefixed}"
          target="_blank" class="text-light">r/${post.subreddit}</a></span>
        <span class="badge badge-dark">Score: ${post.score}</span>
      </div>
    </div>
      `;
    });
    output += "</div>";
    document.getElementById("results").innerHTML = output;
  });

  e.preventDefault();
});

// Show Message Function
function showMessage(message, className) {
  // Create div
  const div = document.createElement("div");
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const searchContainer = document.getElementById("search-container");
  // Get form
  const search = document.getElementById("search");

  // Insert alert
  searchContainer.insertBefore(div, search);

  // Timeout after 3 sec
  setTimeout(function () {
    document.querySelector(".alert").remove();
  }, 3000);
}

// Truncate String Function
function truncateString(myString, limit) {
  const shortened = myString.indexOf(" ", limit);
  if (shortened == -1) return myString;
  return myString.substring(0, shortened) + "...";
}

function search(searchTerm, searchLimit, sortBy) {
  return fetch(
    `https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`
  )
    .then((res) => res.json())
    .then((data) => {
      return data.data.children.map((data) => data.data);
    })
    .catch((err) => console.log(err));
}
