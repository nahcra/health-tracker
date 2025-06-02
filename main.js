78% of storage used … If you run out, you can't create, edit, and upload files.
// workout app/main.js
// This function is now called by firebase-init.js when a user logs in
function initializeAppUI(user) {
    // The welcome screen hiding is now handled directly in index.html

    const userNameInput = document.getElementById('userName');
    const userWeightInput = document.getElementById('userWeight');
    // Ensure db is defined (from firebase-init.js)
    if (typeof db === 'undefined') {
        console.error("Firestore (db) not initialized. Check firebase-init.js.");
        return;
    }
    const userDocRef = db.collection('users').doc(user.uid); // Reference to the user's document in Firestore

    // --- NEW: Function to save data to Firestore ---
    const saveData = (data) => {
        userDocRef.set(data, { merge: true }) // {merge: true} prevents overwriting the whole document
            .catch(err => console.error("Error saving data: ", err));
    };

    // --- NEW: Load user profile data from Firestore ---
    userDocRef.get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            userNameInput.value = data.userName || '';
            userWeightInput.value = data.userWeight || '';
            // Load and apply checkbox/timer states after building the UI
        }
    }).catch(err => console.error("Error loading data: ", err));
    
    // --- MODIFIED: Save profile data on input change ---
    userNameInput.addEventListener('input', (e) => saveData({ userName: e.target.value }));
    userWeightInput.addEventListener('input', (e) => saveData({ userWeight: e.target.value }));

    // --- COMBINED WORKOUT & FOOD DATA (This stays the same) ---
    const healthData = [
        // ... (Your entire healthData array goes here, no changes needed)
        // Week 1
        { week: 1, date: 'June 1st', title: 'Chest Day', type: 'strength', quote: "The only bad workout is the one that didn't happen.", exercises: [{ name: 'Bench Press', sets: 4, reps: 8 }, { name: 'Incline Dumbbell Press', sets: 3, reps: 10 }, { name: 'Dumbbell Flyes', sets: 3, reps: 12 }, { name: 'Push-ups', sets: 3, reps: 'To Failure' }], meals: { breakfast: 'Greek yogurt (1 cup) + 1/2 cup mixed berries + 1 tbsp chia seeds.', lunch: 'Large mixed green salad + 4-5 oz grilled chicken + vinaigrette.', dinner: 'Baked cod (5-6 oz) + 1 cup roasted asparagus + 1/2 cup quinoa.', snacks: 'N/A (Focus on water/herbal tea if hungry)' } },
        { week: 1, date: 'June 2nd', title: 'Back Day', type: 'strength', quote: "Success isn't always about greatness. It's about consistency.", exercises: [{ name: 'Deadlifts', sets: 4, reps: 6 }, { name: 'Pull-ups / Lat Pulldowns', sets: 3, reps: 8 }, { name: 'Bent-Over Rows', sets: 3, reps: 10 }, { name: 'Face Pulls', sets: 3, reps: 15 }], meals: { breakfast: '2 scrambled eggs + 1 slice whole-grain toast + 1/4 avocado.', lunch: 'Leftover baked cod + asparagus + quinoa.', dinner: 'Turkey stir-fry (5 oz) + 2 cups veggies + 1/2 cup brown rice.', snacks: 'Optional: Small protein shake post-workout.' } },
        // ... etc. ...
        { week: 2, date: 'June 10th', title: 'Chest & Back (Supersets)', type: 'strength', quote: "Push yourself because no one else is going to do it for you.", exercises: [{ name: 'Incline Press + T-Bar Row', sets: 3, reps: 10 }, { name: 'Push-ups + Dumbbell Pullovers', sets: 3, reps: 12 }], meals: { breakfast: 'Greek yogurt + mixed berries + flax seeds.', lunch: 'Leftover turkey meatballs + zucchini noodles.', dinner: 'Chicken breast (5 oz) + roasted vegetables.', snacks: 'N/A (Focus on water/herbal tea if hungry)' } },
    ];
    
    // Clear existing cards before drawing new ones
    document.getElementById('week1').innerHTML = '';
    document.getElementById('week2').innerHTML = '';
    document.getElementById('week3').innerHTML = '';

    // --- DYNAMIC CARD CREATION (This logic is mostly the same) ---
    healthData.forEach(day => {
        const section = document.getElementById(`week${day.week}`);
        if (!section) return;

        const cardId = `day-${day.date.replace(/ /g, '-')}`;
        let cardContent = '';

        if (day.quote) cardContent += `<p class="quote-of-the-day">“${day.quote}”</p>`;
        
        if (day.meals) {
            // ... (The logic to build the meal HTML is the same)
            cardContent += `<button class="food-toggle">Food Plan</button><div class="food-plan"><ul class="meal-list">`;
            for (const mealType of ['breakfast', 'lunch', 'dinner', 'snacks']) {
                if (day.meals[mealType]) {
                    const mealId = `${cardId}-meal-${mealType}`;
                    cardContent += `
                        <li class="meal-item">
                            <span class="meal-desc"><strong>${mealType.charAt(0).toUpperCase() + mealType.slice(1)}:</strong> ${day.meals[mealType]}</span>
                            <div class="meal-controls">
                                <input type="time" id="${mealId}-time">
                                <label class="custom-checkbox"><input type="checkbox" id="${mealId}-check"><span class="checkmark"></span></label>
                            </div>
                        </li>`;
                }
            }
            cardContent += `</ul></div>`;
        }

        if (day.description) cardContent += `<p class="card-text">${day.description}</p>`;

        if (day.type === 'strength' && day.exercises && day.exercises.length > 0) {
            // ... (The logic to build the exercise HTML is the same)
             cardContent += '<ul class="exercise-list">';
            day.exercises.forEach((ex) => {
                const exerciseId = `${cardId}-${ex.name.replace(/\s+/g, '-').toLowerCase()}`;
                cardContent += `<li class="exercise-item"><span class="exercise-name">${ex.name} (${ex.sets} sets of ${ex.reps})</span>`;
                for (let i = 1; i <= ex.sets; i++) {
                    cardContent += `<label class="custom-checkbox"><input type="checkbox" id="${exerciseId}-set${i}"><span class="checkmark"></span>Set ${i}</label>`;
                }
                cardContent += '</li>';
            });
            cardContent += '</ul><div class="progress-bar-container"><div class="progress-bar"></div></div>';
        } else if (day.type !== 'strength') {
            cardContent += `<label class="custom-checkbox" style="font-size: 1.1rem; margin-top: 15px;"><input type="checkbox" id="${cardId}-completed"><span class="checkmark"></span>Mark as Completed</label>`;
        }
        
        const timerHtml = `<div class="timer"><div class="timer-display">00:00:00</div><div class="timer-controls"><button class="start-btn">Start</button><button class="pause-btn">Pause</button><button class="reset-btn">Reset</button></div></div>`;
        
        const card = document.createElement('div');
        card.className = 'day-card';
        card.id = cardId;
        card.dataset.date = day.date;
        card.dataset.type = day.type;
        card.innerHTML = `<div class="card-header"><h3>${day.date}: ${day.title}</h3></div><div class="card-body">${cardContent}</div>${timerHtml}`;
        section.appendChild(card);
    });

    // --- EVENT LISTENERS & STATE MANAGEMENT (MODIFIED FOR FIREBASE) ---

    // Food plan toggle (same as before)
    document.querySelectorAll('.food-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
    
    // --- MODIFIED: Load states from Firestore and save on change ---
    userDocRef.get().then(doc => {
        const data = doc.exists ? doc.data() : {};
        document.querySelectorAll('input[type="checkbox"], input[type="time"]').forEach(input => {
            if (data[input.id]) {
                if (input.type === 'checkbox') input.checked = data[input.id];
                if (input.type === 'time') input.value = data[input.id];
            }

            input.addEventListener('change', function() {
                const valueToSave = input.type === 'checkbox' ? this.checked : this.value;
                // Use a dynamic key for the object
                const fieldToUpdate = {};
                fieldToUpdate[this.id] = valueToSave;
                saveData(fieldToUpdate);
                
                if(input.type === 'checkbox') updateCardState(this.closest('.day-card'));
            });
        });
        
        // After setting up listeners, initialize all cards
        document.querySelectorAll('.day-card').forEach(card => {
            updateCardState(card);
            initializeTimer(card, data); // Pass data to timer
        });
    });

    // --- The rest of your functions (updateCardState, initializeTimer, checkMissedWorkouts) ---
    // These need minor changes to save timer data to Firestore instead of localStorage.

    function updateCardState(card) {
        // ... This function's internal logic is the same
         if (!card) return;
        const progressBar = card.querySelector('.progress-bar');
        if (progressBar) {
            const exCheckboxes = card.querySelectorAll('.exercise-item input[type="checkbox"]');
            const checkedCount = card.querySelectorAll('.exercise-item input[type="checkbox"]:checked').length;
            progressBar.style.width = exCheckboxes.length > 0 ? (checkedCount / exCheckboxes.length) * 100 + '%' : '0%';
            exCheckboxes.forEach(cb => {
                const item = cb.closest('.exercise-item');
                const allSets = item.querySelectorAll('input[type="checkbox"]');
                item.classList.toggle('completed', Array.from(allSets).every(set => set.checked));
            });
        }
        
        const allCheckboxesInCard = card.querySelectorAll('.custom-checkbox input');
        card.classList.toggle('completed-day', Array.from(allCheckboxesInCard).every(cb => cb.checked));
        checkMissedWorkouts();
    }

    function initializeTimer(card, initialData) {
        const timerDisplay = card.querySelector('.timer-display');
        const startBtn = card.querySelector('.start-btn');
        const pauseBtn = card.querySelector('.pause-btn');
        const resetBtn = card.querySelector('.reset-btn');
        const timerId = `timer-${card.id}`;
        
        let timerInterval;
        let elapsedTime = initialData[timerId] || 0; // MODIFIED: Get from initialData
        let isRunning = false;
        
        const formatTime = (seconds) => {
            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            return `${h}:${m}:${s}`;
        }
        
        timerDisplay.textContent = formatTime(elapsedTime);

        startBtn.addEventListener('click', () => { if (isRunning) return; isRunning = true; pauseBtn.classList.add('running'); pauseBtn.textContent = 'Pause'; timerInterval = setInterval(() => { elapsedTime++; timerDisplay.textContent = formatTime(elapsedTime); const d = {}; d[timerId] = elapsedTime; saveData(d); }, 1000); });
        pauseBtn.addEventListener('click', () => { if (!isRunning) return; isRunning = false; pauseBtn.classList.remove('running'); pauseBtn.textContent = 'Resume'; clearInterval(timerInterval); });
        resetBtn.addEventListener('click', () => { isRunning = false; clearInterval(timerInterval); elapsedTime = 0; timerDisplay.textContent = formatTime(elapsedTime); const d = {}; d[timerId] = elapsedTime; saveData(d); pauseBtn.classList.remove('running'); pauseBtn.textContent = 'Pause'; });
    }
    
    const missedWorkoutsList = document.getElementById('missed-workouts-list');
    function checkMissedWorkouts() {
        // ... This function's logic is the same
        missedWorkoutsList.innerHTML = '';
        const today = new Date();
        const currentYear = today.getFullYear();
        
        document.querySelectorAll('.day-card').forEach(card => {
            const workoutDate = new Date(`${card.dataset.date}, ${currentYear}`);
            const isMissed = (workoutDate < today.setHours(0,0,0,0)) && !card.classList.contains('completed-day');
            card.classList.toggle('missed-day', isMissed);
            
            if (isMissed) {
                const li = document.createElement('li');
                li.textContent = `${card.dataset.date}: ${card.querySelector('h3').textContent.split(': ')[1]}`;
                missedWorkoutsList.appendChild(li);
            }
        });
        if(missedWorkoutsList.children.length === 0) {
            const li = document.createElement('li');
            li.textContent = "No missed entries. Great job!";
            missedWorkoutsList.appendChild(li);
        }
    }
    checkMissedWorkouts();
}