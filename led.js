// BOOKING SYSTEM STORAGE
function getBookings() {
  const saved = localStorage.getItem("pelangi_bookings");
  return saved ? JSON.parse(saved) : [];
}

function saveBookings(bookings) {
  localStorage.setItem("pelangi_bookings", JSON.stringify(bookings));
  renderBookingList();
}

function checkSlotAvailability() {
  const dateVal = document.getElementById("b-date").value;
  if (!dateVal) return;

  const bookings = getBookings();
  const countForDate = bookings.filter((b) => b.date === dateVal).length;
  const alertBox = document.getElementById("slot-alert");
  const submitBtn = document.getElementById("btn-submit-booking");

  if (countForDate >= 2) {
    alertBox.className =
      "p-3 rounded-xl text-xs bg-red-500/10 border border-red-500/30 text-red-400 font-semibold";
    alertBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Slot Penuh (${countForDate}/2 Kendaraan). Silakan pilih tanggal lain agar pengerjaan tetap maksimal.`;
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    alertBox.className =
      "p-3 rounded-xl text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold";
    alertBox.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Slot Tersedia (${2 - countForDate} kuota tersisa untuk tanggal ini).`;
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

function handleBooking(e) {
  e.preventDefault();
  const name = document.getElementById("b-name").value;
  const phone = document.getElementById("b-phone").value;
  const vehicle = document.getElementById("b-vehicle").value;
  const date = document.getElementById("b-date").value;
  const service = document.getElementById("b-service").value;

  const bookings = getBookings();
  const countForDate = bookings.filter((b) => b.date === date).length;

  if (countForDate >= 2) {
    alert(
      "Maaf, slot di tanggal tersebut sudah penuh (maksimal 2 kendaraan per hari).",
    );
    return;
  }

  const newBooking = { id: Date.now(), name, phone, vehicle, date, service };
  bookings.push(newBooking);
  saveBookings(bookings);

  const waText = `Halo Pelangi LED Variasi, saya ingin konfirmasi Booking Jadwal Pemasangan:\n\n- Nama: ${name}\n- No HP/WA: ${phone}\n- Kendaraan: ${vehicle}\n- Tanggal: ${date}\n- Layanan: ${service}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`;
  window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, "_blank");

  document.getElementById("booking-form").reset();
  alert("Booking berhasil dicatat & terhubung ke WhatsApp bengkel!");
  renderBookingList();
}

function renderBookingList() {
  const container = document.getElementById("booking-list-container");
  const bookings = getBookings();
  container.innerHTML = "";

  if (bookings.length === 0) {
    container.innerHTML = `<p class="text-slate-500 italic">Belum ada data booking terjadwal.</p>`;
    return;
  }

  bookings.forEach((b) => {
    const item = document.createElement("div");
    item.className =
      "p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center gap-2";
    item.innerHTML = `
          <div>
            <span class="font-bold text-slate-200 block">${b.name} (${b.vehicle})</span>
            <span class="text-[10px] text-emerald-400"><i class="fa-regular fa-calendar me-1"></i>${b.date} • ${b.service}</span>
          </div>
          ${isAdminLoggedIn ? `<button onclick="deleteBooking(${b.id})" class="text-red-400 hover:text-red-300 text-xs px-2"><i class="fa-solid fa-trash"></i></button>` : ""}
        `;
    container.appendChild(item);
  });
}

function deleteBooking(id) {
  if (!isAdminLoggedIn) return;
  if (confirm("Batalkan & hapus data booking ini?")) {
    let bookings = getBookings();
    bookings = bookings.filter((b) => b.id !== id);
    saveBookings(bookings);
  }
}