fetch("https://memelemoncounter.escapemmlmn.workers.dev")
  .then(response => response.json())
  .then(data => {
    document.getElementById("visitorCount").innerText = data.visitors;
  });
