import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/utils/define-content-script";
import { ContentScriptContext } from "wxt/utils/content-script-context";
import { MSG_SOURCE, MSG_TYPE } from "gunsole-shared";

export default defineContentScript({
  matches: ["<all_urls>"],
  main(ctx: ContentScriptContext) {
    console.log("Hello content!");

    window.addEventListener("message", (event) => {
      console.log("Received from devtools:", event.data);
      // Only accept messages from same origin and with our identifier
      if (
        event.source !== window ||
        event.data.source !== MSG_SOURCE.GUNSOLE_SDK
      ) {
        return;
      }

      // Forward message to devtools
      browser.runtime.sendMessage({
        type: MSG_TYPE.CONTENT_SCRIPT_TO_DEVTOOLS,
        data: event.data,
      });
    });
  },
});
