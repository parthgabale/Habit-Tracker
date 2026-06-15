/* ===================================================== */
/* HABITFLOW PRO */
/* PART 3A */
/* ===================================================== */

/* ===================================================== */
/* LOCAL STORAGE KEYS */
/* ===================================================== */

const STORAGE_KEYS = {
    habits: "habitflow_habits",
    monthlyGoals: "habitflow_monthly_goals",
    weeklyGoals: "habitflow_weekly_goals",
    journal: "habitflow_journal",
    theme: "habitflow_theme"
};

/* ===================================================== */
/* GLOBAL STATE */
/* ===================================================== */

const state = {

    habits: [],

    monthlyGoals: [],

    weeklyGoals: [],

    journal: {},

    currentDate: new Date()
};

/* ===================================================== */
/* DOM ELEMENTS */
/* ===================================================== */

const habitList = document.getElementById("habitList");

const addHabitBtn = document.getElementById("addHabitBtn");

const saveHabitBtn = document.getElementById("saveHabit");

const habitModal = document.getElementById("habitModal");

const habitNameInput = document.getElementById("habitName");

const toastContainer = document.getElementById("toast-container");

const themeToggle = document.getElementById("themeToggle");

const loader = document.getElementById("loader");

/* ===================================================== */
/* APP INIT */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

/* ===================================================== */
/* INITIALIZE */
/* ===================================================== */

function initializeApp() {

    loadData();

    initializeTheme();

    initializeNavigation();

    initializeLoader();

    initializeHabitEvents();

    renderHabits();

    updateDashboardStats();

}

/* ===================================================== */
/* LOADER */
/* ===================================================== */

function initializeLoader() {

    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 500);

    }, 800);

}

/* ===================================================== */
/* LOCAL STORAGE */
/* ===================================================== */

function loadData() {

    state.habits =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEYS.habits
            )
        ) || [];

    state.monthlyGoals =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEYS.monthlyGoals
            )
        ) || [];

    state.weeklyGoals =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEYS.weeklyGoals
            )
        ) || [];

    state.journal =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEYS.journal
            )
        ) || {};

}

function saveHabits() {

    localStorage.setItem(
        STORAGE_KEYS.habits,
        JSON.stringify(state.habits)
    );

}

function saveMonthlyGoals() {

    localStorage.setItem(
        STORAGE_KEYS.monthlyGoals,
        JSON.stringify(state.monthlyGoals)
    );

}

function saveWeeklyGoals() {

    localStorage.setItem(
        STORAGE_KEYS.weeklyGoals,
        JSON.stringify(state.weeklyGoals)
    );

}

function saveJournal() {

    localStorage.setItem(
        STORAGE_KEYS.journal,
        JSON.stringify(state.journal)
    );

}

/* ===================================================== */
/* THEME SYSTEM */
/* ===================================================== */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            STORAGE_KEYS.theme
        );

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }

    themeToggle.addEventListener(
        "click",
        toggleTheme
    );

}

function toggleTheme() {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains(
            "dark"
        );

    localStorage.setItem(
        STORAGE_KEYS.theme,
        isDark ? "dark" : "light"
    );

    showToast(
        isDark
            ? "Dark Mode Enabled"
            : "Light Mode Enabled"
    );

}

/* ===================================================== */
/* SIDEBAR NAVIGATION */
/* ===================================================== */

function initializeNavigation() {

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );

    const sections =
        document.querySelectorAll(
            ".page-section"
        );

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navLinks.forEach(item =>
                    item.classList.remove(
                        "active"
                    )
                );

                sections.forEach(section =>
                    section.classList.remove(
                        "active"
                    )
                );

                link.classList.add(
                    "active"
                );

                const target =
                    link.dataset.section;

                document
                    .getElementById(target)
                    .classList.add(
                        "active"
                    );

            }
        );

    });

}

/* ===================================================== */
/* TOAST NOTIFICATIONS */
/* ===================================================== */

function showToast(message) {

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        setTimeout(() => {

            toast.remove();

        }, 400);

    }, 2500);

}

/* ===================================================== */
/* HABIT EVENTS */
/* ===================================================== */

function initializeHabitEvents() {

    addHabitBtn.addEventListener(
        "click",
        openHabitModal
    );

    saveHabitBtn.addEventListener(
        "click",
        createHabit
    );

    habitModal.addEventListener(
        "click",
        e => {

            if (
                e.target === habitModal
            ) {

                closeHabitModal();

            }

        }
    );

}

/* ===================================================== */
/* MODAL */
/* ===================================================== */

function openHabitModal() {

    habitModal.classList.add(
        "active"
    );

}

function closeHabitModal() {

    habitModal.classList.remove(
        "active"
    );

    habitNameInput.value = "";

}

/* ===================================================== */
/* CREATE HABIT */
/* ===================================================== */

function createHabit() {

    const name =
        habitNameInput.value.trim();

    if (!name) {

        showToast(
            "Enter habit name"
        );

        return;

    }

    const habit = {

        id: crypto.randomUUID(),

        name,

        createdAt:
            new Date().toISOString(),

        completedDates: []

    };

    state.habits.push(habit);

    saveHabits();

    renderHabits();

    updateDashboardStats();

    closeHabitModal();

    showToast(
        "Habit Created"
    );

}

/* ===================================================== */
/* DELETE HABIT */
/* ===================================================== */

function deleteHabit(id) {

    state.habits =
        state.habits.filter(
            habit => habit.id !== id
        );

    saveHabits();

    renderHabits();

    updateDashboardStats();

    showToast(
        "Habit Deleted"
    );

}

/* ===================================================== */
/* TOGGLE HABIT */
/* ===================================================== */

function toggleHabit(id) {

    const today =
        getTodayString();

    const habit =
        state.habits.find(
            h => h.id === id
        );

    if (!habit) return;

    const exists =
        habit.completedDates.includes(
            today
        );

    if (exists) {

        habit.completedDates =
            habit.completedDates.filter(
                date => date !== today
            );

    } else {

        habit.completedDates.push(
            today
        );

    }

    saveHabits();

    renderHabits();

    updateDashboardStats();

}

/* ===================================================== */
/* RENDER HABITS */
/* ===================================================== */

function renderHabits() {

    habitList.innerHTML = "";

    if (
        state.habits.length === 0
    ) {

        habitList.innerHTML = `
        <div class="empty-state">
            <h3>No Habits Yet</h3>
            <p>Create your first habit.</p>
        </div>
        `;

        return;

    }

    state.habits.forEach(habit => {

        const completed =
            habit.completedDates.includes(
                getTodayString()
            );

        const habitElement =
            document.createElement("div");

        habitElement.className =
            "habit-item";

        habitElement.innerHTML = `

            <div>

                <div class="habit-name">
                    ${habit.name}
                </div>

                <small>
                    Streak:
                    ${calculateHabitStreak(habit)}
                    days
                </small>

            </div>

            <div class="habit-actions">

                <input
                    type="checkbox"
                    class="habit-check"
                    ${completed ? "checked" : ""}
                >

                <button
                    class="secondary-btn delete-btn"
                >
                    Delete
                </button>

            </div>

        `;

        habitElement
            .querySelector(
                ".habit-check"
            )
            .addEventListener(
                "change",
                () =>
                    toggleHabit(
                        habit.id
                    )
            );

        habitElement
            .querySelector(
                ".delete-btn"
            )
            .addEventListener(
                "click",
                () =>
                    deleteHabit(
                        habit.id
                    )
            );

        habitList.appendChild(
            habitElement
        );

    });

}

/* ===================================================== */
/* DATE HELPERS */
/* ===================================================== */

function getTodayString() {

    const today =
        new Date();

    return today
        .toISOString()
        .split("T")[0];

}

/* ===================================================== */
/* STREAK ENGINE */
/* ===================================================== */

function calculateHabitStreak(habit) {

    if (
        habit.completedDates.length === 0
    ) {
        return 0;
    }

    const sortedDates =
        [...habit.completedDates]
            .sort()
            .reverse();

    let streak = 0;

    let currentDate =
        new Date();

    for (
        let i = 0;
        i < 365;
        i++
    ) {

        const dateString =
            currentDate
                .toISOString()
                .split("T")[0];

        if (
            sortedDates.includes(
                dateString
            )
        ) {

            streak++;

        } else {

            break;

        }

        currentDate.setDate(
            currentDate.getDate() - 1
        );

    }

    return streak;

}

/* ===================================================== */
/* DASHBOARD STATS */
/* ===================================================== */

function updateDashboardStats() {

    const currentStreak =
        document.getElementById(
            "currentStreak"
        );

    const longestStreak =
        document.getElementById(
            "longestStreak"
        );

    const completionRate =
        document.getElementById(
            "completionRate"
        );

    const totalCompleted =
        document.getElementById(
            "totalCompleted"
        );

    let current = 0;

    let longest = 0;

    let completed = 0;

    state.habits.forEach(habit => {

        const streak =
            calculateHabitStreak(
                habit
            );

        current += streak;

        if (streak > longest) {

            longest = streak;

        }

        completed +=
            habit.completedDates.length;

    });

    const possible =
        state.habits.length || 1;

    const rate =
        Math.round(
            (
                state.habits.filter(
                    h =>
                        h.completedDates.includes(
                            getTodayString()
                        )
                ).length /
                possible
            ) * 100
        );

    currentStreak.textContent =
        current;

    longestStreak.textContent =
        longest;

    completionRate.textContent =
        rate + "%";

    totalCompleted.textContent =
        completed;

}

/* ===================================================== */
/* END PART 3A */
/* ===================================================== */
/* ===================================================== */
/* PART 3B */
/* GOALS + JOURNAL + CALENDAR */
/* ===================================================== */

/* ===================================================== */
/* DOM REFERENCES */
/* ===================================================== */

const addGoalBtn =
    document.getElementById("addGoalBtn");

const saveGoalBtn =
    document.getElementById("saveGoal");

const goalModal =
    document.getElementById("goalModal");

const goalNameInput =
    document.getElementById("goalName");

const goalTypeInput =
    document.getElementById("goalType");

const monthlyGoalsContainer =
    document.getElementById("monthlyGoals");

const weeklyGoalsContainer =
    document.getElementById("weeklyGoals");

const journalDateInput =
    document.getElementById("journalDate");

const journalEntryInput =
    document.getElementById("journalEntry");

const saveJournalBtn =
    document.getElementById("saveJournal");

const calendarGrid =
    document.getElementById("calendarGrid");

const currentMonthLabel =
    document.getElementById("currentMonth");

const prevMonthBtn =
    document.getElementById("prevMonth");

const nextMonthBtn =
    document.getElementById("nextMonth");

/* ===================================================== */
/* INIT GOALS */
/* ===================================================== */

initializeGoalEvents();
initializeJournal();
initializeCalendar();

/* ===================================================== */
/* GOAL EVENTS */
/* ===================================================== */

function initializeGoalEvents() {

    addGoalBtn.addEventListener(
        "click",
        openGoalModal
    );

    saveGoalBtn.addEventListener(
        "click",
        createGoal
    );

    goalModal.addEventListener(
        "click",
        (e) => {

            if (e.target === goalModal) {

                closeGoalModal();

            }

        }
    );

    renderGoals();

}

/* ===================================================== */
/* GOAL MODAL */
/* ===================================================== */

function openGoalModal() {

    goalModal.classList.add(
        "active"
    );

}

function closeGoalModal() {

    goalModal.classList.remove(
        "active"
    );

    goalNameInput.value = "";

}

/* ===================================================== */
/* CREATE GOAL */
/* ===================================================== */

function createGoal() {

    const name =
        goalNameInput.value.trim();

    const type =
        goalTypeInput.value;

    if (!name) {

        showToast(
            "Enter goal name"
        );

        return;

    }

    const goal = {

        id: crypto.randomUUID(),

        name,

        type,

        progress: 0,

        createdAt:
            new Date().toISOString()

    };

    if (type === "monthly") {

        state.monthlyGoals.push(
            goal
        );

        saveMonthlyGoals();

    } else {

        state.weeklyGoals.push(
            goal
        );

        saveWeeklyGoals();

    }

    renderGoals();

    closeGoalModal();

    showToast(
        "Goal Added"
    );

}

/* ===================================================== */
/* DELETE GOAL */
/* ===================================================== */

function deleteGoal(id, type) {

    if (type === "monthly") {

        state.monthlyGoals =
            state.monthlyGoals.filter(
                goal => goal.id !== id
            );

        saveMonthlyGoals();

    } else {

        state.weeklyGoals =
            state.weeklyGoals.filter(
                goal => goal.id !== id
            );

        saveWeeklyGoals();

    }

    renderGoals();

}

/* ===================================================== */
/* UPDATE GOAL PROGRESS */
/* ===================================================== */

function updateGoalProgress(
    id,
    type
) {

    const goals =
        type === "monthly"
            ? state.monthlyGoals
            : state.weeklyGoals;

    const goal =
        goals.find(
            item => item.id === id
        );

    if (!goal) return;

    goal.progress += 10;

    if (goal.progress > 100) {

        goal.progress = 100;

    }

    if (type === "monthly") {

        saveMonthlyGoals();

    } else {

        saveWeeklyGoals();

    }

    renderGoals();

}

/* ===================================================== */
/* RENDER GOALS */
/* ===================================================== */

function renderGoals() {

    monthlyGoalsContainer.innerHTML =
        "";

    weeklyGoalsContainer.innerHTML =
        "";

    renderGoalGroup(
        state.monthlyGoals,
        monthlyGoalsContainer,
        "monthly"
    );

    renderGoalGroup(
        state.weeklyGoals,
        weeklyGoalsContainer,
        "weekly"
    );

}

function renderGoalGroup(
    goals,
    container,
    type
) {

    if (goals.length === 0) {

        container.innerHTML = `
        <div class="empty-state">
            <p>No goals yet.</p>
        </div>
        `;

        return;

    }

    goals.forEach(goal => {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "goal-item";

        item.innerHTML = `

            <h4>${goal.name}</h4>

            <div class="goal-progress">

                <div
                class="goal-progress-fill"
                style="width:${goal.progress}%"
                ></div>

            </div>

            <p>
                ${goal.progress}%
            </p>

            <div
            style="
            display:flex;
            gap:10px;
            margin-top:10px;
            "
            >

                <button
                class="primary-btn increase-btn"
                >
                    +10%
                </button>

                <button
                class="secondary-btn delete-btn"
                >
                    Delete
                </button>

            </div>

        `;

        item
        .querySelector(
            ".increase-btn"
        )
        .addEventListener(
            "click",
            () =>
                updateGoalProgress(
                    goal.id,
                    type
                )
        );

        item
        .querySelector(
            ".delete-btn"
        )
        .addEventListener(
            "click",
            () =>
                deleteGoal(
                    goal.id,
                    type
                )
        );

        container.appendChild(
            item
        );

    });

}

/* ===================================================== */
/* JOURNAL */
/* ===================================================== */

function initializeJournal() {

    const today =
        getTodayString();

    journalDateInput.value =
        today;

    loadJournalEntry(today);

    saveJournalBtn.addEventListener(
        "click",
        saveJournalEntry
    );

    journalDateInput.addEventListener(
        "change",
        e => {

            loadJournalEntry(
                e.target.value
            );

        }
    );

}

/* ===================================================== */
/* SAVE JOURNAL */
/* ===================================================== */

function saveJournalEntry() {

    const date =
        journalDateInput.value;

    state.journal[date] =
        journalEntryInput.value;

    saveJournal();

    showToast(
        "Journal Saved"
    );

}

/* ===================================================== */
/* LOAD JOURNAL */
/* ===================================================== */

function loadJournalEntry(date) {

    journalEntryInput.value =
        state.journal[date] || "";

}

/* ===================================================== */
/* CALENDAR */
/* ===================================================== */

function initializeCalendar() {

    renderCalendar();

    prevMonthBtn.addEventListener(
        "click",
        previousMonth
    );

    nextMonthBtn.addEventListener(
        "click",
        nextMonth
    );

}

/* ===================================================== */
/* MONTH NAVIGATION */
/* ===================================================== */

function previousMonth() {

    state.currentDate.setMonth(
        state.currentDate.getMonth() - 1
    );

    renderCalendar();

}

function nextMonth() {

    state.currentDate.setMonth(
        state.currentDate.getMonth() + 1
    );

    renderCalendar();

}

/* ===================================================== */
/* RENDER CALENDAR */
/* ===================================================== */

function renderCalendar() {

    calendarGrid.innerHTML = "";

    const year =
        state.currentDate.getFullYear();

    const month =
        state.currentDate.getMonth();

    currentMonthLabel.textContent =
        state.currentDate.toLocaleString(
            "default",
            {
                month: "long",
                year: "numeric"
            }
        );

    const firstDay =
        new Date(
            year,
            month,
            1
        );

    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );

    const startDay =
        firstDay.getDay();

    const totalDays =
        lastDay.getDate();

    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const blank =
            document.createElement(
                "div"
            );

        calendarGrid.appendChild(
            blank
        );

    }

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );

        const dateString =
            date
            .toISOString()
            .split("T")[0];

        const completion =
            getCompletionForDate(
                dateString
            );

        const dayElement =
            document.createElement(
                "div"
            );

        dayElement.className =
            "calendar-day";

        if (completion === 100) {

            dayElement.classList.add(
                "completed"
            );

        }

        dayElement.innerHTML = `
            <div>
                <strong>${day}</strong>
                <br>
                <small>
                    ${completion}%
                </small>
            </div>
        `;

        dayElement.addEventListener(
            "click",
            () => {

                journalDateInput.value =
                    dateString;

                loadJournalEntry(
                    dateString
                );

                document
                .querySelector(
                    '[data-section="journal"]'
                )
                .click();

            }
        );

        calendarGrid.appendChild(
            dayElement
        );

    }

}

/* ===================================================== */
/* COMPLETION % */
/* ===================================================== */

function getCompletionForDate(
    dateString
) {

    if (
        state.habits.length === 0
    ) {
        return 0;
    }

    let completed = 0;

    state.habits.forEach(
        habit => {

            if (
                habit.completedDates.includes(
                    dateString
                )
            ) {

                completed++;

            }

        }
    );

    return Math.round(
        (
            completed /
            state.habits.length
        ) * 100
    );

}

/* ===================================================== */
/* REFRESH CALENDAR */
/* ===================================================== */

const originalToggleHabit =
    toggleHabit;

toggleHabit = function(id) {

    originalToggleHabit(id);

    renderCalendar();

};

/* ===================================================== */
/* END PART 3B */
/* ===================================================== */
/* ===================================================== */
/* PART 3C */
/* ANALYTICS ENGINE */
/* ===================================================== */

let monthlyChart = null;
let weeklyChart = null;
let trendChart = null;
let performanceChart = null;

/* ===================================================== */
/* INITIALIZE ANALYTICS */
/* ===================================================== */

initializeAnalytics();

/* ===================================================== */
/* ANALYTICS INIT */
/* ===================================================== */

function initializeAnalytics() {

    renderAnalytics();

}

/* ===================================================== */
/* MAIN ANALYTICS */
/* ===================================================== */

function renderAnalytics() {

    createMonthlyChart();

    createWeeklyChart();

    createTrendChart();

    createPerformanceChart();

    renderAnalyticsSummary();

}

/* ===================================================== */
/* DESTROY CHART */
/* ===================================================== */

function destroyChart(chart) {

    if (chart) {

        chart.destroy();

    }

}

/* ===================================================== */
/* MONTHLY OVERVIEW CHART */
/* ===================================================== */

function createMonthlyChart() {

    const canvas =
        document.getElementById(
            "monthlyChart"
        );

    if (!canvas) return;

    destroyChart(monthlyChart);

    const labels = [];
    const data = [];

    for (let i = 29; i >= 0; i--) {

        const date = new Date();

        date.setDate(
            date.getDate() - i
        );

        const dateString =
            date
            .toISOString()
            .split("T")[0];

        labels.push(
            date.getDate()
        );

        data.push(
            getCompletionForDate(
                dateString
            )
        );

    }

    monthlyChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels,

                datasets: [

                    {
                        label:
                            "Completion %",
                        data,
                        tension: 0.4,
                        fill: true
                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        });

}

/* ===================================================== */
/* WEEKLY CHART */
/* ===================================================== */

function createWeeklyChart() {

    const canvas =
        document.getElementById(
            "weeklyChart"
        );

    if (!canvas) return;

    destroyChart(weeklyChart);

    const labels = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];

    const values = [];

    for (let i = 6; i >= 0; i--) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - i
        );

        values.push(
            getCompletionForDate(
                date
                .toISOString()
                .split("T")[0]
            )
        );

    }

    weeklyChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels,

                datasets: [

                    {
                        label:
                            "Consistency",
                        data: values
                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        });

}

/* ===================================================== */
/* TREND CHART */
/* ===================================================== */

function createTrendChart() {

    const canvas =
        document.getElementById(
            "trendChart"
        );

    if (!canvas) return;

    destroyChart(trendChart);

    const labels = [];
    const values = [];

    for (let i = 13; i >= 0; i--) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - i
        );

        const dateString =
            date
            .toISOString()
            .split("T")[0];

        labels.push(
            `${date.getDate()}`
        );

        values.push(
            getCompletionForDate(
                dateString
            )
        );

    }

    trendChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels,

                datasets: [

                    {
                        label:
                            "Habit Trend",

                        data: values,

                        tension: 0.45,

                        fill: true

                    }

                ]

            }

        });

}

/* ===================================================== */
/* PERFORMANCE CHART */
/* ===================================================== */

function createPerformanceChart() {

    const canvas =
        document.getElementById(
            "performanceChart"
        );

    if (!canvas) return;

    destroyChart(
        performanceChart
    );

    const completed =
        state.habits.reduce(
            (sum, habit) =>
                sum +
                habit.completedDates.length,
            0
        );

    const pending =
        Math.max(
            0,
            state.habits.length * 30 -
            completed
        );

    performanceChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Completed",
                    "Remaining"
                ],

                datasets: [

                    {
                        data: [
                            completed,
                            pending
                        ]
                    }

                ]

            }

        });

}

/* ===================================================== */
/* MOST CONSISTENT HABIT */
/* ===================================================== */

function getMostConsistentHabit() {

    if (
        state.habits.length === 0
    ) {

        return "N/A";

    }

    let best =
        state.habits[0];

    state.habits.forEach(
        habit => {

            if (
                habit.completedDates.length >
                best.completedDates.length
            ) {

                best = habit;

            }

        }
    );

    return best.name;

}

/* ===================================================== */
/* GOAL COMPLETION */
/* ===================================================== */

function calculateGoalCompletion() {

    const allGoals = [

        ...state.monthlyGoals,

        ...state.weeklyGoals

    ];

    if (
        allGoals.length === 0
    ) {

        return 0;

    }

    const total =
        allGoals.reduce(
            (sum, goal) =>
                sum + goal.progress,
            0
        );

    return Math.round(
        total /
        allGoals.length
    );

}

/* ===================================================== */
/* TOTAL COMPLETION RATE */
/* ===================================================== */

function getOverallCompletionRate() {

    if (
        state.habits.length === 0
    ) {

        return 0;

    }

    let completed = 0;

    state.habits.forEach(
        habit => {

            completed +=
                habit.completedDates.length;

        }
    );

    const possible =
        state.habits.length * 30;

    return Math.round(
        (
            completed /
            possible
        ) * 100
    );

}

/* ===================================================== */
/* ANALYTICS SUMMARY */
/* ===================================================== */

function renderAnalyticsSummary() {

    const container =
        document.getElementById(
            "analyticsSummary"
        );

    if (!container) return;

    const totalCompleted =
        state.habits.reduce(
            (sum, habit) =>
                sum +
                habit.completedDates.length,
            0
        );

    container.innerHTML = `

        <div class="analytics-item">

            <h4>
                Most Consistent Habit
            </h4>

            <p>
                ${getMostConsistentHabit()}
            </p>

        </div>

        <div class="analytics-item">

            <h4>
                Goal Completion
            </h4>

            <p>
                ${calculateGoalCompletion()}%
            </p>

        </div>

        <div class="analytics-item">

            <h4>
                Total Habits Completed
            </h4>

            <p>
                ${totalCompleted}
            </p>

        </div>

        <div class="analytics-item">

            <h4>
                Overall Completion
            </h4>

            <p>
                ${getOverallCompletionRate()}%
            </p>

        </div>

    `;

}

/* ===================================================== */
/* AUTO REFRESH */
/* ===================================================== */

const oldRenderHabits =
    renderHabits;

renderHabits = function() {

    oldRenderHabits();

    renderAnalytics();

};

const oldRenderGoals =
    renderGoals;

renderGoals = function() {

    oldRenderGoals();

    renderAnalytics();

};

const oldUpdateStats =
    updateDashboardStats;

updateDashboardStats =
function() {

    oldUpdateStats();

    renderAnalytics();

};

/* ===================================================== */
/* INITIAL REFRESH */
/* ===================================================== */

setTimeout(() => {

    renderAnalytics();

}, 1000);

/* ===================================================== */
/* APP BOOTSTRAP */
/* ===================================================== */

window.addEventListener(
    "load",
    () => {

        renderAnalytics();

        renderCalendar();

        renderGoals();

        renderHabits();

        updateDashboardStats();

        showToast(
            "HabitFlow Ready"
        );

    }
);

/* ===================================================== */
/* END PART 3C */
/* ===================================================== */
