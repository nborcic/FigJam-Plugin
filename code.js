// Detect sticky note creation and pass note text to Svelte UI
figma.on("documentchange", (event) => {
  for (const change of event.documentChanges) {
    if (change.type === "CREATE" && change.node.type === "STICKY") {
      const sticky = change.node;
      const text = sticky.text.characters;
      figma.ui.postMessage({ type: "NEW_STICKY", text });
    }
  }
});

figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = (msg) => {
  if (msg.type === "LOG") {
    figma.notify(msg.message);
  }
}; 