// جلب أوقات الصلاة تلقائياً من API مع ضبط المنطقة الزمنية للأردن
async function fetchPrayerTimes() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    // استخدم API مع ضبط المنطقة الزمنية Asia/Amman
    const url = `https://api.aladhan.com/v1/timingsByCity?city=Amman&country=Jordan&method=2&date=${day}-${month}-${year}&tz=Asia/Amman`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const timings = data.data.timings;
        const prayerTimes = {
            "الفجر": timings.Fajr,
            "الشروق": timings.Sunrise,
            "الظهر": timings.Dhuhr,
            "العصر": timings.Asr,
            "المغرب": timings.Maghrib,
            "العشاء": timings.Isha
        };
        displayPrayerTimes(prayerTimes);
    } catch (e) {
        // في حال فشل الجلب، استخدم القيم الافتراضية
        displayPrayerTimes({
            "الفجر": "04:10",
            "الشروق": "05:35",
            "الظهر": "12:40",
            "العصر": "16:20",
            "المغرب": "19:45",
            "العشاء": "21:10"
        });
    }
}

function displayDate() {
    const dateElem = document.getElementById('date');
    const today = new Date();
    // ضبط المنطقة الزمنية للأردن
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Amman' };
    dateElem.textContent = today.toLocaleDateString('ar-JO', options);
}

function to12Hour(time24) {
    // تحويل الوقت من 24 ساعة إلى 12 ساعة مع AM/PM
    let [hour, minute] = time24.split(":");
    hour = parseInt(hour);
    const ampm = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
}

function displayPrayerTimes(prayerTimes) {
    const tbody = document.querySelector('#prayer-times tbody');
    tbody.innerHTML = '';
    for (const [name, time] of Object.entries(prayerTimes)) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${name}</td><td>${to12Hour(time)}</td>`;
        tbody.appendChild(row);
    }
}

displayDate();
fetchPrayerTimes();
