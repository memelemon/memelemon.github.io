fetch("https://memelemoncounter.escapemmlmn.workers.dev")
  .then(response => response.json())
  .then(data => {
    document.getElementById("visitors").innerText = data.visitors;
  });
