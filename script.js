/**
 * ============================================================================
 * HOSPITAL QUEUE MANAGEMENT SYSTEM — DATA STRUCTURES & ALGORITHMS (DSA)
 * ============================================================================
 * 
 * Main Concept: QUEUE DATA STRUCTURE (FIFO — First In, First Out)
 * 
 * DEFINITIONS FOR COLLEGE VIVA / PRESENTATION:
 * ----------------------------------------------------------------------------
 * 1. Queue: An abstract data type (ADT) that maintains an ordered sequence of
 *    elements where insertions happen at one end (REAR) and deletions happen
 *    at the opposite end (FRONT).
 * 
 * 2. FIFO Principle (First In, First Out):
 *    The element that enters the queue first will be the first one to be removed
 *    and served. In this hospital system, the patient who registers first is
 *    consulted first by the doctor.
 * 
 * 3. Enqueue Operation:
 *    Adding a new patient record to the REAR (end) of the queue.
 *    JavaScript implementation: Array.prototype.push()
 *    Time Complexity: O(1)
 * 
 * 4. Dequeue Operation:
 *    Removing the patient at the FRONT (index 0) to be served by the doctor.
 *    JavaScript implementation: Array.prototype.shift()
 *    Time Complexity: O(n) due to array shifting (or O(1) in linked lists / ring buffers)
 * 
 * 5. Front Pointer:
 *    Points to the next patient in line (index 0 of the queue array).
 * 
 * 6. Rear Pointer:
 *    Points to the most recently registered patient (index length - 1).
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. STATE MANAGEMENT (IN-MEMORY BROWSER STORAGE)
// ----------------------------------------------------------------------------

/**
 * Array storing patients waiting in line.
 * Follows strict FIFO order:
 *  - Front of Queue: patientQueue[0] (Next to be served)
 *  - Rear of Queue:  patientQueue[patientQueue.length - 1] (Last patient joined)
 */
let patientQueue = [];

/**
 * Array storing patients who have already been served.
 */
let patientHistory = [];

/**
 * Auto-incrementing counters for generating unique IDs and Tokens.
 */
let nextTokenNumber = 101;
let totalRegisteredCount = 0;
let totalServedCount = 0;

/**
 * Pending action placeholder for custom confirmation modal
 */
let pendingConfirmAction = null;


// ----------------------------------------------------------------------------
// 2. CORE DSA QUEUE FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * ENQUEUE OPERATION
 * Adds a newly registered patient to the REAR of the waiting queue.
 * 
 * DSA Concept:
 * In a queue, new elements can only enter through the Rear.
 * We use JavaScript's built-in `push()` method to append to the end of the array.
 * 
 * @param {Object} patient - The patient data object
 */
function enqueuePatient(patient) {
    // Insert at the rear (end) of the queue array
    patientQueue.push(patient);

    // Update global counters
    totalRegisteredCount++;
    nextTokenNumber++;

    // If currently filtered to 'served' only, revert to 'all' so new patient is visible
    const statusSelect = document.getElementById("status-filter-select");
    if (statusSelect && statusSelect.value === "served") {
        statusSelect.value = "all";
        filterPatients();
    } else {
        // Refresh UI & Statistics
        updateStatistics();
        displayQueue();
        renderVisualizer();
    }

    updateNextPatientIdPreview();

    // Show friendly success toast
    showToast(
        "Patient Enqueued!",
        `${patient.name} (${patient.tokenFormatted}) added to the queue rear.`,
        "success"
    );
}

/**
 * DEQUEUE OPERATION (SERVE NEXT PATIENT)
 * Removes and serves the patient at the FRONT of the queue.
 * 
 * DSA Concept:
 * Queue follows FIFO (First In, First Out).
 * The earliest registered waiting patient is always at index 0 (Front).
 * We use JavaScript's built-in `shift()` method to remove the element at index 0.
 * 
 * @returns {Object|null} The served patient or null if queue is empty
 */
function serveNextPatient() {
    // Underflow check: Cannot dequeue from an empty queue
    if (patientQueue.length === 0) {
        showToast(
            "Queue is Empty!",
            "There are currently no patients waiting in the queue.",
            "warning"
        );
        return null;
    }

    // DEQUEUE: Extract patient from index 0 (Front of the Queue)
    const servedPatient = patientQueue.shift();

    // Update patient status and record timestamp
    servedPatient.status = "Served";
    servedPatient.servedTime = getCurrentTimeString();

    // Add to served history list (latest served at top)
    patientHistory.unshift(servedPatient);

    // Increment served counter
    totalServedCount++;

    // Update UI elements
    updateStatistics();
    displayQueue();
    displayHistory();
    renderVisualizer();

    // Show success notification with the served patient's name
    showToast(
        "Patient Served (Dequeued)",
        `Now consulting: ${servedPatient.name} (${servedPatient.tokenFormatted}).`,
        "success"
    );

    return servedPatient;
}

/**
 * PEEK OPERATION (HELPER)
 * Inspects the front of the queue without removing it.
 * 
 * @returns {Object|null}
 */
function peekQueue() {
    return patientQueue.length > 0 ? patientQueue[0] : null;
}

/**
 * CHECK IF EMPTY (HELPER)
 * 
 * @returns {boolean}
 */
function isQueueEmpty() {
    return patientQueue.length === 0;
}


// ----------------------------------------------------------------------------
// 3. PATIENT REGISTRATION FORM HANDLER & VALIDATION
// ----------------------------------------------------------------------------

/**
 * Handles the registration form submission.
 * Validates inputs and prepares patient record for Enqueue.
 * 
 * @param {Event} event - Form submit event
 */
function registerPatient(event) {
    if (event) {
        event.preventDefault();
    }

    // Retrieve input values
    const nameInput = document.getElementById("patient-name");
    const ageInput = document.getElementById("patient-age");
    const genderInput = document.getElementById("patient-gender");
    const reasonInput = document.getElementById("patient-reason");

    const nameValue = nameInput.value.trim();
    const ageValue = parseInt(ageInput.value, 10);
    const genderValue = genderInput.value;
    const reasonValue = reasonInput.value.trim();

    // Validation Flags
    let isValid = true;

    // 1. Validate Patient Name
    if (!nameValue || nameValue.length < 2) {
        setFieldError("name-error", nameInput, true);
        isValid = false;
    } else {
        setFieldError("name-error", nameInput, false);
    }

    // 2. Validate Age (Must be a positive number)
    if (isNaN(ageValue) || ageValue <= 0 || ageValue > 125) {
        setFieldError("age-error", ageInput, true);
        isValid = false;
    } else {
        setFieldError("age-error", ageInput, false);
    }

    // 3. Validate Gender
    if (!genderValue) {
        setFieldError("gender-error", genderInput, true);
        isValid = false;
    } else {
        setFieldError("gender-error", genderInput, false);
    }

    // 4. Validate Reason for Visit
    if (!reasonValue || reasonValue.length < 3) {
        setFieldError("reason-error", reasonInput, true);
        isValid = false;
    } else {
        setFieldError("reason-error", reasonInput, false);
    }

    // If validation fails, stop execution
    if (!isValid) {
        showToast("Validation Error", "Please fill in all required fields properly.", "error");
        return;
    }

    // Construct the patient record object
    const newPatient = {
        id: `PID-${nextTokenNumber}`,
        token: nextTokenNumber,
        tokenFormatted: `#${nextTokenNumber}`,
        name: nameValue,
        age: ageValue,
        gender: genderValue,
        reason: reasonValue,
        arrivalTime: getCurrentTimeString(),
        servedTime: null,
        status: "Waiting"
    };

    // Execute Queue Enqueue
    enqueuePatient(newPatient);

    // Reset Form inputs for the next entry
    resetForm();
}

/**
 * Resets the patient registration input fields and error messages.
 */
function resetForm() {
    document.getElementById("patient-name").value = "";
    document.getElementById("patient-age").value = "";
    document.getElementById("patient-gender").value = "";
    document.getElementById("patient-reason").value = "";

    // Clear any active validation error states
    setFieldError("name-error", document.getElementById("patient-name"), false);
    setFieldError("age-error", document.getElementById("patient-age"), false);
    setFieldError("gender-error", document.getElementById("patient-gender"), false);
    setFieldError("reason-error", document.getElementById("patient-reason"), false);
}

/**
 * Shows or hides validation error indicators for a form control.
 */
function setFieldError(errorElementId, inputElement, show) {
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
        if (show) {
            errorEl.classList.add("visible");
            inputElement.classList.add("input-error");
        } else {
            errorEl.classList.remove("visible");
            inputElement.classList.remove("input-error");
        }
    }
}

/**
 * Updates the auto-generated Patient ID and Token previews in the form.
 */
function updateNextPatientIdPreview() {
    const idField = document.getElementById("patient-id");
    const tokenField = document.getElementById("token-number");
    const previewBadge = document.getElementById("token-preview-badge");

    const nextId = `PID-${nextTokenNumber}`;
    const nextToken = `#${nextTokenNumber}`;

    if (idField) idField.value = nextId;
    if (tokenField) tokenField.value = nextToken;
    if (previewBadge) previewBadge.textContent = `Next Token: ${nextToken}`;
}


// ----------------------------------------------------------------------------
// 4. DISPLAY & RENDERING FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Displays the waiting queue in the table.
 * Preserves arrival order (FIFO).
 * Highlights the first patient as "Next to Be Served" with light blue styling.
 * Handles empty states and active search queries.
 */
function displayQueue() {
    const tbody = document.getElementById("waiting-queue-body");
    const emptyState = document.getElementById("queue-empty-state");
    const countBadge = document.getElementById("waiting-count-badge");
    const searchInput = document.getElementById("queue-search-input");
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

    if (!tbody) return;

    // Filter list if user searched by name or patient ID
    // NOTE: This does NOT modify the underlying patientQueue array!
    const filteredQueue = patientQueue.filter(patient => {
        if (!searchTerm) return true;
        const matchesName = patient.name.toLowerCase().includes(searchTerm);
        const matchesId = patient.id.toLowerCase().includes(searchTerm);
        const matchesToken = patient.token.toString().includes(searchTerm);
        return matchesName || matchesId || matchesToken;
    });

    // Update count badge
    if (countBadge) {
        countBadge.textContent = `${patientQueue.length} Patient${patientQueue.length === 1 ? '' : 's'}`;
    }

    // Check if table is empty
    if (filteredQueue.length === 0) {
        tbody.innerHTML = "";
        if (emptyState) {
            emptyState.style.display = "flex";
            if (searchTerm && patientQueue.length > 0) {
                emptyState.querySelector("h3").textContent = "No Matching Patients Found";
                emptyState.querySelector("p").textContent = `No waiting patient found matching "${searchTerm}".`;
            } else {
                emptyState.querySelector("h3").textContent = "No Patients Waiting in Queue";
                emptyState.querySelector("p").textContent = "Register a new patient using the form above or click Load Sample Demo.";
            }
        }
        return;
    }

    // Hide empty state
    if (emptyState) {
        emptyState.style.display = "none";
    }

    // Build rows HTML matching the exact columns:
    // Token No. | Patient Name | Age | Gender | Reason for Visit | Status | Action
    let html = "";
    filteredQueue.forEach((patient, index) => {
        // Is this patient at index 0 of the entire queue? (Front / Next to be served)
        const isNextInLine = (patient.token === (patientQueue[0] ? patientQueue[0].token : null));
        const rowClass = isNextInLine ? "next-patient-row" : "";

        // Status badge: Next in Line vs Waiting
        const statusBadge = isNextInLine
            ? `<span class="badge-status badge-next">⭐ Next in Line</span>`
            : `<span class="badge-status badge-waiting">⏳ Waiting (${index + 1})</span>`;

        html += `
            <tr class="${rowClass}">
                <td><span class="token-pill">${patient.tokenFormatted}</span></td>
                <td class="patient-name-cell">
                    <div class="patient-name-wrapper">
                        <span class="patient-name-main">${escapeHtml(patient.name)}</span>
                        <span class="patient-id-subtag">${patient.id}</span>
                    </div>
                    ${isNextInLine ? '<span class="front-subtag">⭐ Next to Be Served (Front)</span>' : ''}
                </td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${escapeHtml(patient.reason)}</td>
                <td>${statusBadge}</td>
                <td style="text-align: center;">
                    <button class="btn btn-outline btn-sm" onclick="viewPatientDetails('${patient.id}')" title="View complete patient record">
                        View Details
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

/**
 * Displays the served patient history table.
 * Preserves the exact 7 columns matching the waiting table:
 * Token No. | Patient Name | Age | Gender | Reason for Visit | Status | Action
 */
function displayHistory() {
    const tbody = document.getElementById("history-queue-body");
    const emptyState = document.getElementById("history-empty-state");
    const countBadge = document.getElementById("history-count-badge");
    const searchInput = document.getElementById("queue-search-input");
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

    if (!tbody) return;

    // Update count badge
    if (countBadge) {
        countBadge.textContent = `${patientHistory.length} Served`;
    }

    // Filter by search query without modifying patientHistory array
    const filteredHistory = patientHistory.filter(patient => {
        if (!searchTerm) return true;
        const matchesName = patient.name.toLowerCase().includes(searchTerm);
        const matchesId = patient.id.toLowerCase().includes(searchTerm);
        const matchesToken = patient.token.toString().includes(searchTerm);
        return matchesName || matchesId || matchesToken;
    });

    if (filteredHistory.length === 0) {
        tbody.innerHTML = "";
        if (emptyState) {
            emptyState.style.display = "flex";
            if (searchTerm && patientHistory.length > 0) {
                emptyState.querySelector("h3").textContent = "No Matching Served Patients";
                emptyState.querySelector("p").textContent = `No served patient found matching "${searchTerm}".`;
            } else {
                emptyState.querySelector("h3").textContent = "No Patients Served Yet";
                emptyState.querySelector("p").textContent = "When you click Serve Next Patient, the patient at the front of the queue will appear here as completed.";
            }
        }
        return;
    }

    if (emptyState) emptyState.style.display = "none";

    let html = "";
    filteredHistory.forEach(patient => {
        html += `
            <tr>
                <td><span class="token-pill token-pill-served">${patient.tokenFormatted}</span></td>
                <td class="patient-name-cell">
                    <div class="patient-name-wrapper">
                        <span class="patient-name-main">${escapeHtml(patient.name)}</span>
                        <span class="patient-id-subtag">${patient.id}</span>
                    </div>
                </td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${escapeHtml(patient.reason)}</td>
                <td>
                    <span class="badge-status badge-served">
                        ✓ Served (${patient.servedTime || 'Done'})
                    </span>
                </td>
                <td style="text-align: center;">
                    <button class="btn btn-outline btn-sm" onclick="viewPatientDetails('${patient.id}')" title="View complete patient record">
                        View Details
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

/**
 * Renders the horizontal visual queue track showing FIFO flow.
 * Front (Head / Exit) <--- [ Patient 1 ] <--- [ Patient 2 ] <--- Rear (Tail / Entry)
 */
function renderVisualizer() {
    const container = document.getElementById("queue-stream");
    const summaryTag = document.getElementById("visualizer-summary");
    if (!container) return;

    if (summaryTag) {
        summaryTag.textContent = patientQueue.length === 0
            ? "Queue Empty (0 items)"
            : `Queue Size: ${patientQueue.length} (FIFO Order)`;
    }

    if (patientQueue.length === 0) {
        container.innerHTML = `<div class="queue-empty-indicator">Queue is currently empty. Register patients below to populate queue.</div>`;
        return;
    }

    let nodesHtml = "";
    patientQueue.forEach((patient, index) => {
        const isFront = (index === 0);
        nodesHtml += `
            <div class="queue-node ${isFront ? 'node-front' : ''}">
                ${isFront ? '<span class="node-next-badge">Next In Line</span>' : ''}
                <div class="node-token">${patient.tokenFormatted} (${patient.id})</div>
                <div class="node-name" title="${escapeHtml(patient.name)}">${escapeHtml(patient.name)}</div>
                <div class="node-reason" title="${escapeHtml(patient.reason)}">${escapeHtml(patient.reason)}</div>
            </div>
        `;

        // Add arrow between elements
        if (index < patientQueue.length - 1) {
            nodesHtml += `<span class="queue-arrow" title="Queue pointer">←</span>`;
        }
    });

    container.innerHTML = nodesHtml;
}

/**
 * Updates all top summary cards and quick status labels.
 */
function updateStatistics() {
    const totalRegEl = document.getElementById("stat-total-registered");
    const waitingEl = document.getElementById("stat-waiting");
    const servedEl = document.getElementById("stat-served");
    const nextTokenEl = document.getElementById("stat-next-token");
    const nextLabelEl = document.getElementById("stat-next-label");
    const quickNextName = document.getElementById("quick-next-name");

    const nextPatient = peekQueue();

    if (totalRegEl) totalRegEl.textContent = totalRegisteredCount;
    if (waitingEl) waitingEl.textContent = patientQueue.length;
    if (servedEl) servedEl.textContent = totalServedCount;

    if (nextPatient) {
        if (nextTokenEl) nextTokenEl.textContent = nextPatient.tokenFormatted;
        if (nextLabelEl) nextLabelEl.textContent = `${nextPatient.name} (Next)`;
        if (quickNextName) quickNextName.textContent = `${nextPatient.tokenFormatted} - ${nextPatient.name}`;
    } else {
        if (nextTokenEl) nextTokenEl.textContent = "—";
        if (nextLabelEl) nextLabelEl.textContent = "Queue Empty";
        if (quickNextName) quickNextName.textContent = "No patient waiting";
    }
}


// ----------------------------------------------------------------------------
// 5. SEARCH & FILTER HANDLERS
// ----------------------------------------------------------------------------

/**
 * Searches and filters patients dynamically by name or patient ID.
 * Preserves the actual queue order in memory without reordering.
 */
function searchPatient() {
    const clearBtn = document.getElementById("clear-search-btn");
    const input = document.getElementById("queue-search-input");

    if (clearBtn && input) {
        clearBtn.style.display = input.value.trim().length > 0 ? "block" : "none";
    }

    filterPatients();
}

/**
 * Filters patients by waiting or served status.
 * Allows viewing all, only waiting, or only served patients.
 */
function filterPatients() {
    const statusSelect = document.getElementById("status-filter-select");
    const selectedStatus = statusSelect ? statusSelect.value : "all";
    const waitingSection = document.getElementById("waiting-queue-section");
    const historySection = document.getElementById("history-section");

    if (selectedStatus === "waiting") {
        if (waitingSection) waitingSection.style.display = "block";
        if (historySection) historySection.style.display = "none";
    } else if (selectedStatus === "served") {
        if (waitingSection) waitingSection.style.display = "none";
        if (historySection) historySection.style.display = "block";
    } else {
        // "all"
        if (waitingSection) waitingSection.style.display = "block";
        if (historySection) historySection.style.display = "block";
    }

    displayQueue();
    displayHistory();
}

/**
 * Clears the active search query.
 */
function clearSearch() {
    const input = document.getElementById("queue-search-input");
    const clearBtn = document.getElementById("clear-search-btn");
    if (input) input.value = "";
    if (clearBtn) clearBtn.style.display = "none";
    filterPatients();
}

/**
 * Legacy handler alias for history filter select.
 */
function filterHistory() {
    filterPatients();
}


// ----------------------------------------------------------------------------
// 6. PATIENT DETAILS MODAL
// ----------------------------------------------------------------------------

/**
 * Opens details modal showing detailed information for a patient.
 * 
 * @param {string} patientId - Unique ID of the patient (e.g., "PID-101")
 */
function viewPatientDetails(patientId) {
    // Search in waiting queue or history
    let patient = patientQueue.find(p => p.id === patientId);
    let queuePosition = null;

    if (patient) {
        queuePosition = patientQueue.indexOf(patient) + 1;
    } else {
        patient = patientHistory.find(p => p.id === patientId);
    }

    if (!patient) {
        showToast("Error", "Patient record not found.", "error");
        return;
    }

    // Populate modal title and header
    document.getElementById("modal-patient-name").textContent = patient.name;
    document.getElementById("modal-patient-id").textContent = `${patient.id} • ${patient.tokenFormatted}`;

    // Populate modal body
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <span class="detail-label">Assigned Token</span>
                <div class="detail-value text-teal">${patient.tokenFormatted}</div>
            </div>

            <div class="detail-item">
                <span class="detail-label">Current Status</span>
                <div class="detail-value">
                    ${patient.status === 'Waiting' 
                        ? '<span class="badge-status badge-waiting">⏳ Waiting in Queue</span>'
                        : '<span class="badge-status badge-served">✓ Consultation Done</span>'
                    }
                </div>
            </div>

            <div class="detail-item">
                <span class="detail-label">Age &amp; Gender</span>
                <div class="detail-value">${patient.age} Years • ${patient.gender}</div>
            </div>

            <div class="detail-item">
                <span class="detail-label">Queue Position</span>
                <div class="detail-value">
                    ${queuePosition ? `#${queuePosition} of ${patientQueue.length}` : 'Served (Exited Queue)'}
                </div>
            </div>

            <div class="detail-item full-width">
                <span class="detail-label">Reason for Visit</span>
                <div class="detail-value">${escapeHtml(patient.reason)}</div>
            </div>

            <div class="detail-item">
                <span class="detail-label">Registration Time</span>
                <div class="detail-value">${patient.arrivalTime}</div>
            </div>

            <div class="detail-item">
                <span class="detail-label">Consultation Time</span>
                <div class="detail-value">${patient.servedTime || 'Pending'}</div>
            </div>
        </div>
    `;

    // Show modal
    const modal = document.getElementById("details-modal");
    if (modal) modal.classList.add("active");
}

/**
 * Closes the patient details modal.
 */
function closeModal() {
    const modal = document.getElementById("details-modal");
    if (modal) modal.classList.remove("active");
}


// ----------------------------------------------------------------------------
// 7. CONFIRMATION DIALOGS & RESET OPERATIONS
// ----------------------------------------------------------------------------

/**
 * Shows confirmation modal before clearing the waiting queue.
 */
function confirmClearQueue() {
    if (patientQueue.length === 0) {
        showToast("Queue is already empty", "There are no waiting patients to clear.", "warning");
        return;
    }

    pendingConfirmAction = () => {
        const clearedCount = patientQueue.length;
        patientQueue = []; // Empty the queue array
        displayQueue();
        renderVisualizer();
        updateStatistics();
        showToast("Queue Cleared", `${clearedCount} waiting patients removed from queue.`, "warning");
    };

    openConfirmModal(
        "Clear Waiting Queue?",
        `Are you sure you want to clear all ${patientQueue.length} currently waiting patients? This action cannot be undone.`
    );
}

/**
 * Shows confirmation modal before resetting the entire system state.
 */
function confirmResetAll() {
    pendingConfirmAction = () => {
        patientQueue = [];
        patientHistory = [];
        nextTokenNumber = 101;
        totalRegisteredCount = 0;
        totalServedCount = 0;

        resetForm();
        clearSearch();
        const statusSelect = document.getElementById("status-filter-select");
        if (statusSelect) statusSelect.value = "all";

        updateNextPatientIdPreview();
        updateStatistics();
        filterPatients();
        renderVisualizer();

        showToast("System Reset", "All patient records and counters restored to clean demo state.", "warning");
    };

    openConfirmModal(
        "Reset System to Clean Slate?",
        "Are you sure you want to clear all waiting patients, served history, and reset token counters to #101?"
    );
}

/**
 * Opens custom confirmation dialog.
 */
function openConfirmModal(title, message) {
    document.getElementById("confirm-modal-title").textContent = title;
    document.getElementById("confirm-modal-message").textContent = message;
    const modal = document.getElementById("confirm-modal");
    if (modal) modal.classList.add("active");
}

/**
 * Closes confirmation dialog.
 */
function closeConfirmModal() {
    const modal = document.getElementById("confirm-modal");
    if (modal) modal.classList.remove("active");
    pendingConfirmAction = null;
}

/**
 * Executes the confirmed callback action.
 */
function executeConfirmedAction() {
    if (typeof pendingConfirmAction === "function") {
        pendingConfirmAction();
    }
    closeConfirmModal();
}

/**
 * Closes modal when clicking on the blurred background backdrop.
 */
function handleBackdropClick(event) {
    if (event.target.classList.contains("modal-backdrop")) {
        closeModal();
        closeConfirmModal();
    }
}


// ----------------------------------------------------------------------------
// 8. DEMO DATA GENERATOR (FOR PRESENTATIONS & VIVA)
// ----------------------------------------------------------------------------

/**
 * Loads 4 realistic sample patients sequentially into the queue.
 * Extremely helpful for college students to demonstrate FIFO without manual typing!
 */
function loadSampleData() {
    const samplePatients = [
        { name: "Aarav Sharma", age: 28, gender: "Male", reason: "Viral Fever & Cold" },
        { name: "Priya Patel", age: 45, gender: "Female", reason: "Chest Pain / Cardiology" },
        { name: "Michael Chang", age: 34, gender: "Male", reason: "Orthopedic Joint Pain" },
        { name: "Ananya Iyer", age: 22, gender: "Female", reason: "General Health Checkup" }
    ];

    samplePatients.forEach(p => {
        const patientRecord = {
            id: `PID-${nextTokenNumber}`,
            token: nextTokenNumber,
            tokenFormatted: `#${nextTokenNumber}`,
            name: p.name,
            age: p.age,
            gender: p.gender,
            reason: p.reason,
            arrivalTime: getCurrentTimeString(),
            servedTime: null,
            status: "Waiting"
        };

        patientQueue.push(patientRecord);
        totalRegisteredCount++;
        nextTokenNumber++;
    });

    updateStatistics();
    displayQueue();
    renderVisualizer();
    updateNextPatientIdPreview();

    // If currently filtered to 'served' only, revert to 'all' so waiting queue is shown
    const statusSelect = document.getElementById("status-filter-select");
    if (statusSelect && statusSelect.value === "served") {
        statusSelect.value = "all";
        filterPatients();
    }

    showToast(
        "Sample Patients Loaded!",
        "Added 4 sample patients to demonstrate FIFO queue flow.",
        "success"
    );
}


// ----------------------------------------------------------------------------
// 9. TOAST NOTIFICATION UTILITY
// ----------------------------------------------------------------------------

/**
 * Shows an elegant toast notification on top-right.
 * 
 * @param {string} title - Heading
 * @param {string} message - Descriptive text
 * @param {'success'|'warning'|'error'} type - Notification severity
 */
function showToast(title, message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === "success") {
        iconSvg = `
            <svg class="toast-icon text-green" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        `;
    } else if (type === "warning") {
        iconSvg = `
            <svg class="toast-icon text-orange" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        `;
    } else {
        iconSvg = `
            <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--danger-red);">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
        `;
    }

    toast.innerHTML = `
        ${iconSvg}
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            <div class="toast-message">${escapeHtml(message)}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()" title="Dismiss">&times;</button>
    `;

    container.appendChild(toast);

    // Auto-remove after 4.5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}


// ----------------------------------------------------------------------------
// 10. HELPER UTILITIES
// ----------------------------------------------------------------------------

/**
 * Returns formatted 12-hour local time string (e.g., "11:42 AM").
 */
function getCurrentTimeString() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Starts live header clock updater.
 */
function initLiveClock() {
    const clockEl = document.getElementById("live-clock");
    function updateClock() {
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString();
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * Escape HTML special characters to prevent injection.
 */
function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ----------------------------------------------------------------------------
// 11. INITIALIZATION ON DOM CONTENT LOADED
// ----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // Start live digital clock
    initLiveClock();

    // Initialize auto-generated ID previews
    updateNextPatientIdPreview();

    // Render initial empty states
    updateStatistics();
    displayQueue();
    displayHistory();
    renderVisualizer();

    // Keyboard Shortcuts: Enter or Esc to close modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeConfirmModal();
        }
    });

    console.log("Hospital Queue Management System initialized successfully.");
    console.log("DSA Structure: Queue (FIFO) using Array.prototype.push() and Array.prototype.shift()");
});
