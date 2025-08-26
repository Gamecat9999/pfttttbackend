// Cloudflare Worker for pftttt.xyz Duinocoin Faucet
// Replace the placeholders with your actual Duinocoin wallet and secret

const DUCO_WALLET = 'katfaucet'; // Replace with your wallet
const DUCO_PASSWORD = 'AJRrulez20'; // Replace with your password
const MIN_AMOUNT = 0.01;
const MAX_AMOUNT = 5;
const CLAIM_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

// In-memory store for demo; use KV for production
let claims = {};

async function sendDuco(username, amount) {
  // Replace with actual Duinocoin API call
  // Example: https://server.duinocoin.com/transaction
  // This is a placeholder for demonstration
  return { success: true, amount };
}

function getRandomAmount() {
  return +(Math.random() * (MAX_AMOUNT - MIN_AMOUNT) + MIN_AMOUNT).toFixed(4);
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response('', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'POST only' }), { status: 405, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    const { username } = await request.json();
    if (!username || typeof username !== 'string') {
      return new Response(JSON.stringify({ success: false, message: 'Invalid username' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    const now = Date.now();
    if (claims[username] && now - claims[username] < CLAIM_INTERVAL) {
      return new Response(JSON.stringify({ success: false, message: 'You can only claim once every 24 hours.' }), { status: 429, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    const amount = getRandomAmount();
    const ducoRes = await sendDuco(username, amount);
    if (ducoRes.success) {
      claims[username] = now;
      return new Response(JSON.stringify({ success: true, amount }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Failed to send DUCO.' }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
  }
};
