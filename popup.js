document.getElementById("analyseBtn").addEventListener("click", async () => {

  const loading = document.getElementById("loading");
  const result = document.getElementById("result");

  loading.classList.remove("hidden");
  result.classList.add("hidden");

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.sendMessage(
      tab.id,
      { action: "getArticle" },
      (article) => {

        loading.classList.add("hidden");

        if (chrome.runtime.lastError) {
          alert("ERROR: " + chrome.runtime.lastError.message);
          return;
        }

        result.classList.remove("hidden");

        document.getElementById("verdict").textContent =
            "Article captured!";

        document.getElementById("score").textContent =
            "Testing";

        document.getElementById("reasons").innerHTML =
            "<li>Successfully read the article.</li>";

        document.getElementById("claims").innerHTML =
            `<li>${article.title}</li>`;

        document.getElementById("recommendation").textContent =
            "Ready to send to the AI.";
      }
  );
});