import { browser } from "wxt/browser";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SDK_TO_DEVTOOLS") {
    // Forward to devtools if it's open
    browser.runtime.sendMessage(message);
  }
});
