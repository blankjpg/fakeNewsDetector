chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received!");

  sendResponse({
    title: document.title,
    text: document.body.innerText
  });

  return true;
});