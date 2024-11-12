document.addEventListener("DOMContentLoaded", () => {
    displayTasks();
    displayQuote();
    updateProgress();
    updateClock();
    setInterval(updateClock, 1000); // Perbarui jam setiap detik
});

const quotes = [
    "Hari ini adalah kesempatan baru untuk berkembang.",
    "Tugas kecil yang selesai lebih baik daripada tugas besar yang tidak dilakukan.",
    "Jangan menunda pekerjaanmu, selesaikan hari ini!",
    "Langkah kecil menuju tujuan adalah langkah maju.",
    "Setiap tugas yang selesai membawa Anda lebih dekat ke tujuan.",
    "Setiap hari adalah kesempatan untuk menjadi lebih baik.",
    "Fokus pada apa yang bisa Anda kendalikan.",
    "Ketekunan adalah kunci menuju kesuksesan.",
    "Keberhasilan datang kepada mereka yang gigih.",
    "Ambil waktu untuk mengisi ulang energi dan kembali lebih kuat.",
    "Fortis Fortuna Adiuvat"
];

function displayQuote() {
    const quoteElement = document.getElementById("quote");
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = `"${randomQuote}"`;
}

function updateClock() {
    const clockElement = document.getElementById("clock");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function getFormattedDate(daysOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText) {
        const tasks = JSON.parse(localStorage.getItem(getFormattedDate())) || [];
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem(getFormattedDate(), JSON.stringify(tasks));
        taskInput.value = "";
        displayTasks();
    }
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem(getFormattedDate())) || [];

    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        if (task.completed) taskText.style.textDecoration = "line-through";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus";
        deleteButton.classList.add("delete-btn");  // Tambahkan kelas delete-btn
        deleteButton.onclick = () => removeTask(index);

        const completeButton = document.createElement("button");
        completeButton.textContent = "Selesai";
        completeButton.classList.add("complete-btn");
        completeButton.onclick = () => toggleComplete(index);

        taskItem.appendChild(taskText);
        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
    });
    updateProgress();
}


function removeTask(index) {
    const tasks = JSON.parse(localStorage.getItem(getFormattedDate())) || [];
    tasks.splice(index, 1);
    localStorage.setItem(getFormattedDate(), JSON.stringify(tasks));
    displayTasks();
}

function toggleComplete(index) {
    const tasks = JSON.parse(localStorage.getItem(getFormattedDate())) || [];
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem(getFormattedDate(), JSON.stringify(tasks));
    displayTasks();
}

function viewHistory() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "<h3>Riwayat Hari Kemarin:</h3>";
    const yesterdayTasks = JSON.parse(localStorage.getItem(getFormattedDate(-1))) || [];

    if (yesterdayTasks.length > 0) {
        yesterdayTasks.forEach((task) => {
            const taskItem = document.createElement("div");
            taskItem.className = "task-item";
            taskItem.textContent = task.text;
            if (task.completed) taskItem.style.textDecoration = "line-through";
            historyList.appendChild(taskItem);
        });
    } else {
        historyList.innerHTML += "<p>Tidak ada tugas kemarin.</p>";
    }
}

function updateProgress() {
    const tasks = JSON.parse(localStorage.getItem(getFormattedDate())) || [];
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    document.getElementById("progressBar").style.width = `${progress}%`;
    document.getElementById("progressText").textContent = `${Math.round(progress)}% Selesai`;
}

function viewHistory() {
    const historyList = document.getElementById("historyList");
    const historyButton = document.querySelector(".history-btn");

    if (historyList.style.display === "none" || !historyList.style.display) {
        // Tampilkan riwayat
        historyList.innerHTML = "<h3>Riwayat Hari Kemarin:</h3>";
        const yesterdayTasks = JSON.parse(localStorage.getItem(getFormattedDate(-1))) || [];

        if (yesterdayTasks.length > 0) {
            yesterdayTasks.forEach((task) => {
                const taskItem = document.createElement("div");
                taskItem.className = "task-item";
                taskItem.textContent = task.text;
                if (task.completed) taskItem.style.textDecoration = "line-through";
                historyList.appendChild(taskItem);
            });
        } else {
            historyList.innerHTML += "<p>Tidak ada tugas kemarin.</p>";
        }

        historyList.style.display = "block";  // Tampilkan riwayat
        historyButton.textContent = "Tutup Riwayat";  // Ubah teks tombol
    } else {
        // Sembunyikan riwayat
        historyList.style.display = "none";
        historyButton.textContent = "Lihat Riwayat Hari Kemarin";  // Ubah kembali teks tombol
    }
}

// Menambahkan event listener untuk tombol Enter
document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();  // Panggil fungsi addTask saat Enter ditekan
    }
});

// Fungsi untuk menambahkan tugas
function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim(); // Mengambil teks dari input dan menghapus spasi di awal/akhir
    if (taskText) {
        const tasks = JSON.parse(localStorage.getItem(getFormattedDate())) || [];
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem(getFormattedDate(), JSON.stringify(tasks));
        input.value = ""; // Mengosongkan input setelah menambahkan tugas
        displayTasks();   // Menampilkan ulang daftar tugas
    }
}
