<script>
  import { onMount } from "svelte";
  import Modal from "./Modal.svelte";

  let logs = [];
  let accessToken = null;
  let modalVisible = false;
  let currentNoteText = "";

  const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";
  let tokenClient;

  function log(message) {
    logs = [...logs, message];
    parent.postMessage({ pluginMessage: { type: "LOG", message } }, "*");
  }

  function signIn() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        accessToken = response.access_token;
        log("Google Auth successful. Token acquired.");
      },
    });
    tokenClient.requestAccessToken();
  }

  async function createCalendarEvent({ noteText, start, end }) {
    const event = { summary: noteText, start: { dateTime: start }, end: { dateTime: end } };

    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    });

    if (res.ok) {
      log(`Event created: ${noteText}`);
    } else {
      const error = await res.text();
      log("Failed to create event: " + error);
    }
  }

  function onModalConfirm({ noteText, start, end }) {
    modalVisible = false;
    createCalendarEvent({ noteText, start, end });
  }

  function onModalCancel() {
    modalVisible = false;
  }

  onMount(() => {
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (msg.type === "NEW_STICKY") {
        if (!accessToken) {
          log("User not authenticated. Please sign in first.");
          return;
        }
        currentNoteText = msg.text;
        modalVisible = true;
      }
    };
  });
</script>

<div class="p-4">
  <h3 class="text-lg font-bold mb-2">Google Calendar Integration</h3>
  <p class="text-sm mb-4">Sign in with Google to add FigJam sticky notes as events.</p>
  <button class="bg-blue-500 text-white px-4 py-2 rounded mb-4" on:click={signIn}>
    Sign in with Google
  </button>

  <h4 class="text-md font-semibold mb-2">Logs:</h4>
  <pre class="bg-gray-100 p-2 h-48 overflow-auto text-xs">
    {#each logs as logItem}{logItem}{/each}
  </pre>

  <Modal visible={modalVisible} noteText={currentNoteText} 
         onConfirm={onModalConfirm} onCancel={onModalCancel}/>
</div> 