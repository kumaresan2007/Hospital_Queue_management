# Hospital Queue Management System (DSA Mini-Project)

A clean, modern, and interactive web-based **Hospital Queue Management System** designed for a college **Data Structures and Algorithms (DSA)** mini-project.

This application demonstrates the practical real-world application of the **Queue Abstract Data Type (ADT)** adhering strictly to the **FIFO (First In, First Out)** principle.

---

## 🌟 Key Features

1. **Strict FIFO Queue Implementation:**
   - **Enqueue (Register Patient):** Adds the patient to the **rear** of the queue using `Array.prototype.push()`.
   - **Dequeue (Serve Next Patient):** Removes and serves the patient from the **front** of the queue using `Array.prototype.shift()`.
   - **Front Pointer:** Dynamically identifies and highlights the next patient to be served in light blue.
   - **Queue Underflow Protection:** Alerts when attempting to serve from an empty queue.

2. **Real-time Live Queue Visualizer:**
   - Visual track showing: `FRONT (Head) <--- [ Patient 1 ] <--- [ Patient 2 ] <--- REAR (Tail)`.
   - Helps students and evaluators immediately visualize queue operations during project demonstrations.

3. **Dynamic Dashboard Metrics:**
   - Total Patients Registered (Lifetime counter).
   - Patients Waiting in Queue (Current Queue Size).
   - Patients Served (Successfully consulted).
   - Next Patient Token & Name.

4. **Patient Search & History Tracking:**
   - Live search by Patient Name, Token Number, or Patient ID without disrupting the queue order.
   - Dedicated Consultation History table recording served patients and consultation timestamps.
   - "View Details" modal for deep inspection of individual patient records.

5. **Presentation & Viva Ready:**
   - **"Load Sample Demo" Button:** Instantly pre-fills 4 sample patients with realistic hospital visit reasons to easily demonstrate Enqueue and Dequeue operations.
   - **"Clear Queue" & "Reset System" Buttons:** Equipped with confirmation dialogs.

---

## 💻 Technology Stack

- **HTML5:** Semantic markup, accessible forms, modal dialogs, and SVG medical icons.
- **CSS3:** Custom hospital dashboard theme (ocean blue `#0284c7` & healthcare teal `#0d9488`), CSS grid, flexbox, glassmorphic backdrop modals, responsive mobile-friendly design.
- **Vanilla JavaScript (ES6+):** Pure in-memory Queue ADT logic without any external dependencies, frameworks, databases, or APIs.

---

## 📂 Project Structure

```text
dsa project/
├── index.html       # Web structure, dashboard, tables, and modal dialogs
├── style.css        # Hospital design system, responsive styles, animations
├── script.js        # Queue ADT (FIFO) implementation and event handling
└── README.md        # Documentation, DSA complexity analysis & Viva prep
```

---

## 🚀 How to Run the Project

No web server, Node.js, or database installation is required!

1. Clone or download this project folder.
2. Locate `index.html`.
3. Double-click or right-click and open `index.html` in any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

---

## 🧠 Data Structure Analysis: Queue (FIFO)

### 1. What is a Queue?
A **Queue** is a linear data structure that follows the **FIFO (First In, First Out)** order. The first element added to the queue will be the first one to be removed.

### 2. Operations & Time Complexity

| Queue Operation | Function in `script.js` | Implementation | Time Complexity | Real-world Hospital Analogy |
| :--- | :--- | :--- | :--- | :--- |
| **Enqueue** | `enqueuePatient(patient)` | `patientQueue.push(patient)` | **$O(1)$** | New patient arrives and stands at the end of the line. |
| **Dequeue** | `serveNextPatient()` | `patientQueue.shift()` | **$O(n)$** *(JS Array)* / **$O(1)$** *(Linked List)* | Doctor calls the patient standing at the front of the line. |
| **Peek / Front**| `peekQueue()` | `patientQueue[0]` | **$O(1)$** | Checking the display screen for who is next without calling them yet. |
| **isEmpty** | `isQueueEmpty()` | `patientQueue.length === 0` | **$O(1)$** | Checking if the waiting room is completely empty. |
| **Size** | `patientQueue.length` | `array.length` | **$O(1)$** | Counting how many people are currently sitting in the waiting room. |

---

## 🎓 College Viva & Interview Questions Guide

Use these questions and answers to prepare for your project viva:

### Q1: Why is a Queue suitable for hospital patient management instead of a Stack?
> **Answer:** A Stack follows LIFO (Last In, First Out), meaning the last person who arrived would be served first, which is unfair and dangerous in a healthcare setting. A Queue follows FIFO (First In, First Out), ensuring patients are treated fairly in the exact order of arrival.

### Q2: What is the difference between Enqueue and Dequeue?
> **Answer:** 
> - **Enqueue:** The operation of inserting an element at the **rear (tail)** of the queue.
> - **Dequeue:** The operation of deleting/removing an element from the **front (head)** of the queue.

### Q3: What is Queue Underflow? How is it handled in this project?
> **Answer:** Queue Underflow occurs when an attempt is made to dequeue an element from an already empty queue (`length === 0`). In this project, `serveNextPatient()` checks `if (patientQueue.length === 0)` and triggers a non-blocking warning notification to prevent errors.

### Q4: Why is array `shift()` $O(n)$ in JavaScript? How can it be optimized to $O(1)$?
> **Answer:** In standard arrays, `shift()` removes index `0` and has to re-index all remaining $n-1$ elements one step to the left, resulting in $O(n)$ time. To achieve true $O(1)$ Dequeue, we can use a **Singly Linked List** (with head and tail pointers) or a **Circular Ring Buffer**. For small to moderate queues in web dashboards, the standard array is clean and readable.

### Q5: Does searching or filtering patients violate the FIFO property?
> **Answer:** No. In `script.js`, searching or filtering only filters the rendered view for hospital staff to look up records. The underlying `patientQueue` array is never reordered or modified during search queries.

---

## 👨‍💻 Designed For
College Mini-Project / Lab Practical Examination in **Data Structures and Algorithms (CS / IT / AI / DS)**.
