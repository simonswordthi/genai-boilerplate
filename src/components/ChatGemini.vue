<template>
  <div class="gemini-chat">
    <h2>Interactive Learning with Gemini</h2>
    <div class="chat-window">
      <div v-if="response" class="response">
        <strong>Gemini:</strong>
        <pre>{{ response }}</pre> <!-- Use <pre> for formatting -->
      </div>
      <div v-if="isLoading" class="loading">Thinking...</div>
      <div v-if="error" class="error">Error: {{ error }}</div>
    </div>
    <div class="input-area">
      <input
        v-model="prompt"
        :disabled="isLoading"
        placeholder="Ask Gemini a question..."
        type="text"
        @keyup.enter="askGemini"
      />
      <button :disabled="isLoading || !prompt" @click="askGemini">
        {{ isLoading ? 'Sending...' : 'Ask' }}
      </button>
    </div>
    <!-- <p class="api-key-warning">
      <strong>Warning:</strong> API Key is currently hardcoded for this demo.
      Do NOT deploy this way. Use a backend proxy in a real application.
    </p> -->
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  // --- Configuration ---
  // !!! IMPORTANT: NEVER hardcode your API key in frontend code for production. !!!
  // !!! This is for DEMO purposes ONLY. Use a backend proxy. !!!
  const API_KEY = 'AIzaSyDgs7Fovz5bkn5mSC6yLFzgZZ93DqJQNKw'; // Replace with your actual key
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  // --- Reactive State ---
  const prompt = ref('');
  const response = ref('');
  const isLoading = ref(false);
  const error = ref(null);

  // --- Functions ---
  async function askGemini () {
    if (!prompt.value || isLoading.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;
    response.value = ''; // Clear previous response

    // --- Prepare Request Body ---
    // Simple text prompt structure
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt.value,
        }],
      }],
      // Optional: Add safety settings, generation config here if needed
      // generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
      // safetySettings: [ ... ]
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        // Try to get error details from the API response body
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          // Ignore if response isn't valid JSON
          console.log('UNVALID JSON: ', e)
        }
        const errorMsg = errorData?.error?.message || `HTTP error! status: ${res.status}`;
        throw new Error(errorMsg);
      }

      const data = await res.json();

      // --- Process Response ---
      // Navigate the response structure to get the text
      // Check optional chaining (?.) helps prevent errors if structure is unexpected
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        response.value = generatedText;
      } else {
        // Handle cases where response structure is different or text is missing
        console.error('Unexpected response structure:', data);
        response.value = "Received a response, but couldn't extract text.";
      }
      prompt.value = ''; // Clear input after successful request

    } catch (err) {
      console.error('Error calling Gemini API:', err);
    } finally {
      isLoading.value = false;
    }
  }
</script>
