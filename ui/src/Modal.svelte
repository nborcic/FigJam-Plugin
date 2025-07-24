<script>
  export let visible = false;
  export let noteText = "";
  export let onConfirm;
  export let onCancel;

  let start = new Date().toISOString().slice(0, 16); // current time for datetime-local
  let end = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16); // +1 hour
</script>

{#if visible}
  <div
    class="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-4 rounded shadow w-96">
      <h2 class="text-lg font-bold mb-2">Create Event</h2>
      <label class="block text-sm font-medium mb-1">Title</label>
      <input class="w-full border p-1 mb-3" bind:value={noteText} />

      <label class="block text-sm font-medium mb-1">Start</label>
      <input
        type="datetime-local"
        class="w-full border p-1 mb-3"
        bind:value={start}
      />

      <label class="block text-sm font-medium mb-1">End</label>
      <input
        type="datetime-local"
        class="w-full border p-1 mb-3"
        bind:value={end}
      />

      <div class="flex justify-end gap-2">
        <button class="bg-gray-300 px-3 py-1 rounded" on:click={onCancel}
          >Cancel</button
        >
        <button
          class="bg-blue-500 text-white px-3 py-1 rounded"
          on:click={() => onConfirm({ noteText, start, end })}
        >
          Create
        </button>
      </div>
    </div>
  </div>
{/if}
