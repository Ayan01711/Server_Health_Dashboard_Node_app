const API_URL = "http://localhost:5000"; // Replace with your backend public IP

// ============ Login ============
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    alert("Cannot connect to backend. Check server.");
    console.error(err);
  }
});

// ============ Signup ============
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.message) {
      alert("Signup successful, please login.");
      window.location.href = "index.html";
    } else {
      alert(data.error || "Signup failed");
    }
  } catch (err) {
    alert("Cannot connect to backend. Check server.");
    console.error(err);
  }
});

// ============ Dashboard Metrics ============
async function fetchMetrics() {
  const token = localStorage.getItem("token");
  if (!token) return window.location.href = "index.html";

  try {
    const res = await fetch(`${API_URL}/metrics/latest`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    document.getElementById("cpuUsage").innerText = data.cpuUsage;
    document.getElementById("ramUsage").innerText = data.ramUsage;
    document.getElementById("diskUsage").innerText = data.diskUsage;
    document.getElementById("uptime").innerText = data.uptime;
    document.getElementById("hostname").innerText = data.hostname;
    document.getElementById("platform").innerText = data.platform;
    document.getElementById("ip").innerText = data.ip;
    document.getElementById("processes").innerText = data.processes;
    document.getElementById("loggedInUser").innerText = data.loggedInUser;
  } catch (err) {
    console.error("Error fetching metrics:", err);
  }
}

if (window.location.pathname.includes("dashboard.html")) {
  setInterval(fetchMetrics, 3000);
  fetchMetrics();
}

// ============ Logout ============
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
