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
      async (article) => {

        if (chrome.runtime.lastError) {
          loading.classList.add("hidden");
          alert("ERROR: " + chrome.runtime.lastError.message);
          return;
        }

        try {
          const response = await fetch("http://localhost:3000/analyse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title: article.title,
              text: article.text
            })
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const data = await response.json();

          loading.classList.add("hidden");
          result.classList.remove("hidden");

          document.getElementById("verdict").textContent = data.verdict || "Unknown";
          document.getElementById("score").textContent = data.riskScore || "N/A";

          const reasonsList = data.reasons || [];
          document.getElementById("reasons").innerHTML = reasonsList
            .map(reason => `<li>${reason}</li>`)
            .join("");

          const claimsList = data.claims || [];
          document.getElementById("claims").innerHTML = claimsList
            .map(claim => `<li>${claim}</li>`)
            .join("");

          document.getElementById("recommendation").textContent = data.recommendation || "No recommendation available";

        } catch (error) {
          loading.classList.add("hidden");
          alert("Failed to analyze article: " + error.message);
        }
      }
  );
});