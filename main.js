let user_id = null;
let user_nama = null;

function login() {
  const nama = document.getElementById("nama").value.trim();
  if (!nama) return alert("Nama wajib diisi");

  fetch("login.php", {
    method: "POST",
    body: new URLSearchParams({ nama }),
  })
    .then(res => res.json())
    .then(data => {
      user_id = data.id;
      user_nama = data.nama;
      document.getElementById("login").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      document.getElementById("welcome").innerText = data.pesan;
      gantiMenu("newdata");
    });
}

function gantiMenu(menu) {
  const konten = document.getElementById("konten");
  konten.innerHTML = "";

  if (menu === "newdata") {
    konten.innerHTML = `
      <h3>New Data</h3>
      <label>Bulan: <select id="bulan">
        ${generateBulanOptions()}
      </select></label><br/>
      <label>Modal (Rp): <input type="number" id="modal" /></label><br/>
      <button onclick="saveNewData()">Simpan</button>
    `;
  }

  else if (menu === "input") {
    konten.innerHTML = `
      <h3>Input Data</h3>
      <label>Tanggal: <input type="date" id="tanggal" /></label><br/>
      <label>Profit (Rp): <input type="number" id="profit" /></label><br/>
      <label>Open Lot (opsional): <input type="number" step="0.01" id="open_lot" /></label><br/>
      <label>Bulan: <select id="bulan_input">${generateBulanOptions()}</select></label><br/>
      <button onclick="saveInputData()">Simpan</button>
    `;
  }

  else if (menu === "portofolio") {
    konten.innerHTML = `
      <h3>Portofolio</h3>
      <label>Bulan: <select id="filter_bulan" onchange="loadPortofolio()">${generateBulanOptions()}</select></label>
      <div id="tabel_porto"></div>
    `;
    loadPortofolio();
  }

  else if (menu === "statistik") {
    konten.innerHTML = `
      <h3>Dashboard</h3>
      <div id="dashboard_data">Loading...</div>
    `;
    loadDashboard();
  }

  else if (menu === "pengaturan") {
    konten.innerHTML = `
      <h3>Pengaturan</h3>
      <button onclick="resetData()">🔄 Reset Semua Data</button><br/>
      <button onclick="hapusAkun()">🗑️ Hapus Akun</button><br/>
      <button onclick="logout()">🚪 Logout</button>
    `;
  }
}

function saveNewData() {
  const bulan = document.getElementById("bulan").value;
  const modal = document.getElementById("modal").value;
  if (!bulan || !modal) return alert("Semua kolom wajib diisi!");

  fetch("save_new_data.php", {
    method: "POST",
    body: new URLSearchParams({ user_id, bulan, modal })
  }).then(() => alert("Modal disimpan!"));
}

function saveInputData() {
  const tanggal = document.getElementById("tanggal").value;
  const profit = document.getElementById("profit").value;
  const open_lot = document.getElementById("open_lot").value;
  const bulan = document.getElementById("bulan_input").value;

  if (!tanggal || !profit || !bulan) return alert("Data wajib diisi!");

  fetch("save_input_data.php", {
    method: "POST",
    body: new URLSearchParams({ user_id, tanggal, profit, open_lot, bulan })
  }).then(() => alert("Data input berhasil disimpan"));
}

function loadPortofolio() {
  const bulan = document.getElementById("filter_bulan").value;
  fetch(`get_portofolio.php?user_id=${user_id}&bulan=${bulan}`)
    .then(res => res.json())
    .then(data => {
      const table = data.data.map(row => `
        <tr>
          <td>${row.no}</td>
          <td>${row.tanggal}</td>
          <td>Rp ${formatRupiah(row.profit)}</td>
          <td>${row.persentase}%</td>
          <td>${row.lot ?? '-'}</td>
          <td>Rp ${formatRupiah(row.total)}</td>
        </tr>`).join("");

      document.getElementById("tabel_porto").innerHTML = `
        <p><b>${user_nama}</b><br/>
        Modal: Rp ${formatRupiah(data.modal)}</p>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>No</th><th>Tanggal</th><th>Profit</th><th>Presentase %</th><th>Total Lot</th><th>Total Profit</th>
          </tr>
          ${table}
          <tr>
            <td colspan="5"><b>Total Profit sebulan</b></td>
            <td><b>Rp ${formatRupiah(data.total_profit)}</b></td>
          </tr>
        </table>
      `;
    });
}

function loadDashboard() {
  fetch(`get_dashboard_data.php?user_id=${user_id}`)
    .then(res => res.json())
    .then(data => {
      let content = "<h4>Statistik Bulanan:</h4>";

      Object.keys(data.monthly_profit).forEach(bulan => {
        content += `
          <p><b>${bulan}</b>:
          Profit: Rp ${formatRupiah(data.monthly_profit[bulan])} |
          Rata-rata lot: ${data.average_lot[bulan]}</p>`;
      });

      document.getElementById("dashboard_data").innerHTML = content;
    });
}

function resetData() {
  if (!confirm("Yakin ingin reset semua data?")) return;
  fetch("reset.php", {
    method: "POST",
    body: new URLSearchParams({ user_id })
  }).then(() => alert("Data direset!"));
}

function hapusAkun() {
  if (!confirm("Yakin ingin menghapus akun ini secara permanen?")) return;
  fetch("delete_account.php", {
    method: "POST",
    body: new URLSearchParams({ user_id })
  }).then(() => {
    alert("Akun dihapus.");
    location.reload();
  });
}

function logout() {
  location.reload();
}

function generateBulanOptions() {
  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return bulan.map(b => `<option value="${b}">${b}</option>`).join("");
}

function formatRupiah(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}