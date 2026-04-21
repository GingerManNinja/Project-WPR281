const issueList = document.getElementById("issueList");
const issueCount = document.querySelector(".issue-count");
const issueDetails = document.getElementById("issueDetails");
const newIssueBtn = document.getElementById("newIssueBtn");
const openCount = document.getElementById("openCount");
const resolvedCount = document.getElementById("resolvedCount");
const overdueCount = document.getElementById("overdueCount");
const closeBtn = document.getElementById("closeFormBtn");
const popupForm = document.getElementById("popupForm");
const popupFormTitle = document.getElementById("popupFormTitle");
const openFilter = document.getElementById("openFilter");
const resolvedFilter = document.getElementById("resolvedFilter");
const overdueFilter = document.getElementById("overdueFilter");
const allFilter = document.getElementById("allFilter");
const sortPriorityBtn = document.getElementById("sortPriorityBtn");
const searchInput = document.getElementById("issueSearch");
const popupFormElement = document.querySelector("#popupForm form");

let userSelectedRow = null;

const people = [
   {
      id: 1,
      name: "Tanya",
      surname: "Smith",
      email: "tanya@example.com",
      username: "tsmith01",
      profilePic: "https://ui-avatars.com/api/?name=Tanya+Smith&background=random"
   },
   {
      id: 2,
      name: "John",
      surname: "Doe",
      email: "john@example.com",
      username: "jdoe99",
      profilePic: "https://ui-avatars.com/api/?name=John+Doe&background=random"
   },
   {
      id: 3,
      name: "Sarah",
      surname: "Jones",
      email: "sarah@example.com",
      username: "sjones88",
      profilePic: "https://ui-avatars.com/api/?name=Sarah+Jones&background=random"
   },
   {
      id: 4,
      name: "Michael",
      surname: "Brown",
      email: "mbrown@example.com",
      username: "mikeb_dev",
      profilePic: "https://ui-avatars.com/api/?name=Michael+Brown&background=random"
   },
   {
      id: 5,
      name: "Emily",
      surname: "Davis",
      email: "emilyd@example.com",
      username: "edavis_qa",
      profilePic: "https://ui-avatars.com/api/?name=Emily+Davis&background=random"
   },
   {
      id: 6,
      name: "Oliver",
      surname: "Khan",
      email: "okhan@example.com",
      username: "okhan_dev",
      profilePic: "https://ui-avatars.com/api/?name=Oliver+Khan&background=random"
   },
   {
      id: 7,
      name: "Naledi",
      surname: "Madiba",
      email: "nmadiba@example.com",
      username: "naledi_m",
      profilePic: "https://ui-avatars.com/api/?name=Naledi+Madiba&background=random"
   }
];

const defaultIssues = [
   {
      id: 1,
      bugId: "BUG-001",
      summary: "Login page error",
      description: "User cannot log in after resetting password.",
      project: "Student Portal",
      assignedTo: "Tanya",
      status: "Open",
      priority: "High",
      dateReported: "2026-04-14",
      targetDate: "2026-04-20",
      actualResolutionDate: "Not resolved yet",
      resolutionSummary: "Pending investigation"
   },
   {
      id: 2,
      bugId: "BUG-002",
      summary: "Profile picture not uploading",
      description: "Users receive an error when uploading a profile image.",
      project: "Bug Tracker",
      assignedTo: "John",
      status: "Resolved",
      priority: "Medium",
      dateReported: "2026-04-10",
      targetDate: "2026-04-15",
      actualResolutionDate: "2026-04-13",
      resolutionSummary: "File size validation was fixed"
   },
   {
      id: 3,
      bugId: "BUG-003",
      summary: "Dashboard not loading on mobile",
      description: "Dashboard layout breaks on smaller mobile screens.",
      project: "Admin Panel",
      assignedTo: "Sarah",
      status: "Overdue",
      priority: "Low",
      dateReported: "2026-04-08",
      targetDate: "2026-04-12",
      actualResolutionDate: "Not resolved yet",
      resolutionSummary: "Still in progress"
   },
   {
      id: 4,
      bugId: "BUG-004",
      summary: "Broken link in footer",
      description: "The 'Privacy Policy' link leads to a 404 page.",
      project: "Bug Tracker",
      assignedTo: "Emily",
      status: "Open",
      priority: "Low",
      dateReported: "2026-04-11",
      targetDate: "2026-04-25",
      actualResolutionDate: "Not resolved yet",
      resolutionSummary: "Will update URL in next deployment"
   },
   {
      id: 5,
      bugId: "BUG-005",
      summary: "Database migration failure",
      description: "Production database failed to migrate to version 2.4.",
      project: "Admin Panel",
      assignedTo: "",
      status: "Resolved",
      priority: "High",
      dateReported: "2026-04-13",
      targetDate: "2026-04-17",
      actualResolutionDate: "Not resolved yet",
      resolutionSummary: "Waiting for Lead Engineer"
   },
   {
      id: 6,
      bugId: "BUG-006",
      summary: "Auth token expiration error",
      description: "Similar to login error: Users are logged out prematurely due to token expiry.",
      project: "Bug Tracker",
      assignedTo: "Oliver",
      status: "Open",
      priority: "High",
      dateReported: "2026-04-16",
      targetDate: "2026-04-19",
      actualResolutionDate: "Not resolved yet",
      resolutionSummary: "Investigating session timeouts"
   },
   {
      id: 7,
      bugId: "BUG-007",
      summary: "Table overflow on small screens",
      description: "Similar to dashboard layout: Issue table expands past the viewport on mobile devices.",
      project: "Student Portal",
      assignedTo: "Naledi",
      status: "Overdue",
      priority: "Medium",
      dateReported: "2026-04-06",
      targetDate: "2026-04-14",
      actualResolutionDate: "Not resolved yet",
      resolutionSummary: "Applying responsive CSS overflow-x"
   }
];

let issues = JSON.parse(localStorage.getItem("issues")) || defaultIssues;

// ------------------------------
// STORAGE HELPERS
// ------------------------------
function persistIssues() {
   localStorage.setItem("issues", JSON.stringify(issues));
}

function saveData(key, data) {
   localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
   const data = localStorage.getItem(key);
   return data ? JSON.parse(data) : [];
}

// ------------------------------
// ID / BUG NUMBER HELPERS
// ------------------------------
function getNextBugNumber() {
   const maxNumber = issues.reduce((max, issue) => {
      const value = issue.bugId || issue.code || issue.idString || "";

      if (typeof value !== "string") return max;

      const match = value.match(/^BUG-(\d+)$/i);
      if (!match) return max;

      const num = parseInt(match[1], 10);
      return Number.isNaN(num) ? max : Math.max(max, num);
   }, 0);

   return maxNumber + 1;
}

function generateBugID() {
   return `BUG-${String(getNextBugNumber()).padStart(3, "0")}`;
}

function normalizeIssues() {
   issues = issues.map((issue, index) => {
      const fallbackNumber = index + 1;
      let bugValue = issue.bugId || issue.code || issue.idString || "";

      if (!/^BUG-\d+$/i.test(bugValue)) {
         bugValue = `BUG-${String(fallbackNumber).padStart(3, "0")}`;
      }

      return {
         id: issue.id ?? Date.now() + index,
         bugId: bugValue.toUpperCase(),
         summary: issue.summary ?? "",
         description: issue.description ?? "",
         project: issue.project ?? "",
         assignedTo: issue.assignedTo ?? "",
         status: issue.status ?? "Open",
         priority: issue.priority ?? "Low",
         dateReported: issue.dateReported ?? "",
         targetDate: issue.targetDate ?? "",
         actualResolutionDate: issue.actualResolutionDate ?? "Not resolved yet",
         resolutionSummary: issue.resolutionSummary ?? ""
      };
   });

   issues.sort((a, b) => a.id - b.id);
   issues.forEach((issue, index) => {
      issue.bugId = `BUG-${String(index + 1).padStart(3, "0")}`;
   });

   persistIssues();
}

// ------------------------------
// UI HELPERS
// ------------------------------
function formatDisplayValue(value) {
   return value && String(value).trim() !== "" ? value : "Not provided";
}

function getStatusClass(status) {
   switch ((status || "").toLowerCase()) {
      case "open":
         return "status-open";
      case "resolved":
         return "status-resolved";
      case "overdue":
         return "status-overdue";
      default:
         return "";
   }
}

function getPriorityClass(priority) {
   switch ((priority || "").toLowerCase()) {
      case "low":
         return "priority-low";
      case "medium":
         return "priority-medium";
      case "high":
         return "priority-high";
      default:
         return "";
   }
}

function clearSelectedRows() {
   const rows = document.querySelectorAll(".issue-table tbody tr");
   rows.forEach(row => row.classList.remove("selected-row"));
}

function setActiveFilter(filterElement) {
   document.querySelectorAll(".status-box").forEach(box => {
      box.classList.remove("active");
   });

   if (filterElement) {
      filterElement.classList.add("active");
   }
}

function closePopup() {
   popupForm.style.display = "none";
   popupFormTitle.textContent = "New Issue:";
   popupFormElement.reset();
   userSelectedRow = null;
}

function updateStatusSummary(issueArray) {
   const open = issueArray.filter(i => i.status.toLowerCase() === "open").length;
   const resolved = issueArray.filter(i => i.status.toLowerCase() === "resolved").length;
   const overdue = issueArray.filter(i => i.status.toLowerCase() === "overdue").length;

   openCount.textContent = open;
   resolvedCount.textContent = resolved;
   overdueCount.textContent = overdue;
}

function checkOverdueIssues() {
   const today = new Date();
   today.setHours(0, 0, 0, 0);

   issues.forEach(issue => {
      if (issue.status.toLowerCase() !== "resolved" && issue.targetDate) {
         const target = new Date(issue.targetDate);
         target.setHours(0, 0, 0, 0);

         if (target < today) {
            issue.status = "Overdue";
         }
      }
   });

   persistIssues();
}

// ------------------------------
// DETAILS PANEL
// ------------------------------
function showIssueDetails(issue, selectedRow = null) {
   if (selectedRow) {
      clearSelectedRows();
      selectedRow.classList.add("selected-row");
   }

   issueDetails.innerHTML = `
      <h3>${formatDisplayValue(issue.bugId)} - ${formatDisplayValue(issue.summary)}</h3>
      <div class="details-grid">
         <p><strong>Description:</strong> ${formatDisplayValue(issue.description)}</p>
         <p><strong>Project:</strong> ${formatDisplayValue(issue.project)}</p>
         <p><strong>Assigned To:</strong> ${formatDisplayValue(issue.assignedTo)}</p>
         <p>
            <strong>Status:</strong>
            <span class="status ${getStatusClass(issue.status)}">● ${formatDisplayValue(issue.status)}</span>
         </p>
         <p>
            <strong>Priority:</strong>
            <span class="priority ${getPriorityClass(issue.priority)}">⚡ ${formatDisplayValue(issue.priority)}</span>
         </p>
         <p><strong>Date Reported:</strong> ${formatDisplayValue(issue.dateReported)}</p>
         <p><strong>Target Resolution Date:</strong> ${formatDisplayValue(issue.targetDate)}</p>
         <p><strong>Actual Resolution Date:</strong> ${formatDisplayValue(issue.actualResolutionDate)}</p>
         <p><strong>Resolution Summary:</strong> ${formatDisplayValue(issue.resolutionSummary)}</p>

         <div class="details-actions">
            <button type="button" id="editBtn">Edit</button>
            <button type="button" id="deleteBtn">Delete</button>
         </div>
      </div>
   `;

   const editBtn = document.getElementById("editBtn");
   const deleteBtn = document.getElementById("deleteBtn");

   editBtn.addEventListener("click", () => {
      popupForm.style.display = "flex";
      popupFormTitle.textContent = "Edit Issue:";

      document.getElementById("summary").value = issue.summary;
      document.getElementById("description").value = issue.description;
      document.getElementById("project").value = issue.project;
      document.getElementById("assignedTo").value = issue.assignedTo;
      document.getElementById("status").value = issue.status;
      document.getElementById("priority").value = issue.priority;
      document.getElementById("dateReported").value = issue.dateReported;
      document.getElementById("targetResolutionDate").value = issue.targetDate;
      document.getElementById("actualResolutionDate").value =
         issue.actualResolutionDate === "Not resolved yet" ? "" : issue.actualResolutionDate;
      document.getElementById("resolutionSummary").value = issue.resolutionSummary;
   });

   deleteBtn.addEventListener("click", () => {
      const confirmDelete = confirm("Are you sure you want to delete this issue?");
      if (!confirmDelete) return;

      issues = issues.filter(i => i.id !== issue.id);
      persistIssues();
      loadIssues();

      issueDetails.innerHTML = `
         <h3>Issue Details</h3>
         <p>Select an issue to see full details.</p>
      `;
   });

   userSelectedRow = issue;
}

// ------------------------------
// TABLE RENDER
// ------------------------------
function createIssueRow(issue) {
   const row = document.createElement("tr");

   row.innerHTML = `
      <td>${issue.bugId}</td>
      <td>${issue.summary}</td>
      <td>${issue.project}</td>
      <td>${issue.assignedTo}</td>
      <td>
         <span class="status ${getStatusClass(issue.status)}">● ${issue.status}</span>
      </td>
      <td>
         <span class="priority ${getPriorityClass(issue.priority)}">⚡ ${issue.priority}</span>
      </td>
   `;

   row.addEventListener("click", () => {
      showIssueDetails(issue, row);
   });

   return row;
}

function loadIssues(filter = "") {
   checkOverdueIssues();
   issueList.innerHTML = "";

   const filteredIssues = issues.filter(issue =>
      issue.summary.toLowerCase().includes(filter) ||
      issue.project.toLowerCase().includes(filter) ||
      issue.assignedTo.toLowerCase().includes(filter) ||
      issue.status.toLowerCase().includes(filter) ||
      issue.priority.toLowerCase().includes(filter) ||
      issue.bugId.toLowerCase().includes(filter)
   );

   if (filteredIssues.length === 0) {
      issueList.innerHTML = `
         <tr>
            <td colspan="6" class="no-issues">No matching issues found.</td>
         </tr>
      `;
      issueCount.textContent = "0 Issues";
      updateStatusSummary([]);
      return;
   }

   filteredIssues.forEach(issue => {
      issueList.appendChild(createIssueRow(issue));
   });

   issueCount.textContent = `${filteredIssues.length} Issues`;
   updateStatusSummary(filteredIssues);
}

function loadIssuesByStatus(status) {
   checkOverdueIssues();
   issueList.innerHTML = "";

   const filtered = issues.filter(issue =>
      issue.status.toLowerCase() === status
   );

   if (filtered.length === 0) {
      issueList.innerHTML = `
         <tr>
            <td colspan="6" class="no-issues">No matching issues found.</td>
         </tr>
      `;
      issueCount.textContent = "0 Issues";
      updateStatusSummary([]);
      return;
   }

   filtered.forEach(issue => {
      issueList.appendChild(createIssueRow(issue));
   });

   issueCount.textContent = `${filtered.length} Issues`;
   updateStatusSummary(filtered);
}

// ------------------------------
// CREATE / EDIT
// ------------------------------
function submit(issue) {
   const mode = popupFormTitle.textContent.trim();

   if (mode === "New Issue:") {
      const newIssue = {
         id: Date.now(),
         bugId: generateBugID(),
         summary: document.getElementById("summary").value,
         description: document.getElementById("description").value,
         project: document.getElementById("project").value,
         assignedTo: document.getElementById("assignedTo").value,
         status: document.getElementById("status").value,
         priority: document.getElementById("priority").value,
         dateReported: document.getElementById("dateReported").value,
         targetDate: document.getElementById("targetResolutionDate").value,
         actualResolutionDate: document.getElementById("actualResolutionDate").value || "Not resolved yet",
         resolutionSummary: document.getElementById("resolutionSummary").value
      };

      issues.push(newIssue);
      persistIssues();
      closePopup();
      loadIssues();
      return;
   }

   if (mode === "Edit Issue:") {
      if (!issue) {
         alert("No issue selected for editing.");
         return;
      }

      const idx = issues.findIndex(i => i.id === issue.id);

      if (idx !== -1) {
         issues[idx] = {
            ...issues[idx],
            summary: document.getElementById("summary").value,
            description: document.getElementById("description").value,
            project: document.getElementById("project").value,
            assignedTo: document.getElementById("assignedTo").value,
            status: document.getElementById("status").value,
            priority: document.getElementById("priority").value,
            dateReported: document.getElementById("dateReported").value,
            targetDate: document.getElementById("targetResolutionDate").value,
            actualResolutionDate: document.getElementById("actualResolutionDate").value || "Not resolved yet",
            resolutionSummary: document.getElementById("resolutionSummary").value
         };

         persistIssues();
         closePopup();
         loadIssues();
      }

      return;
   }

   alert("Error implementing action. Please try again.");
}

// ------------------------------
// EXTRA HELPERS
// ------------------------------
function updateAssignment(issueSummary, newAssignee) {
   const issueIndex = issues.findIndex(i => i.summary === issueSummary);

   if (issueIndex !== -1) {
      issues[issueIndex].assignedTo = newAssignee;
      persistIssues();
      loadIssues();
   }
}

function createProject(id, name) {
   return {
      id: id,
      projectName: name
   };
}

function addProject(name) {
   let projects = loadData("projects");
   const newId = projects.length > 0 ? projects[projects.length - 1].id + 1 : 1;

   const project = createProject(newId, name);
   projects.push(project);
   saveData("projects", projects);
   return project;
}

function getAllProjects() {
   return loadData("projects");
}

function getProjectById(id) {
   const projects = loadData("projects");
   return projects.find(p => p.id === id);
}

function deleteProject(id) {
   let projects = loadData("projects");
   projects = projects.filter(p => p.id !== id);
   saveData("projects", projects);
}

function linkIssueToProject(issueSummary, projectName) {
   const storedIssues = loadData("issues");
   const issueIndex = storedIssues.findIndex(i => i.summary === issueSummary);

   if (issueIndex !== -1) {
      storedIssues[issueIndex].project = projectName;
      saveData("issues", storedIssues);
      issues = storedIssues;
      loadIssues();
   }
}

function sortIssuesByPriority() {
   const order = {
      High: 1,
      Medium: 2,
      Low: 3
   };

   issues.sort((a, b) => order[a.priority] - order[b.priority]);
   persistIssues();
   loadIssues();
}

// ------------------------------
// EVENT LISTENERS
// ------------------------------
popupFormElement.addEventListener("submit", (e) => {
   e.preventDefault();
   submit(userSelectedRow);
});

newIssueBtn.addEventListener("click", () => {
   popupForm.style.display = "flex";
   popupFormTitle.textContent = "New Issue:";
   popupFormElement.reset();
   userSelectedRow = null;
});

closeBtn.addEventListener("click", closePopup);

if (searchInput) {
   searchInput.addEventListener("input", (e) => {
      const value = e.target.value.trim().toLowerCase();
      loadIssues(value);
   });
}

if (openFilter) {
   openFilter.addEventListener("click", () => {
      loadIssuesByStatus("open");
      setActiveFilter(openFilter);
   });
}

if (resolvedFilter) {
   resolvedFilter.addEventListener("click", () => {
      loadIssuesByStatus("resolved");
      setActiveFilter(resolvedFilter);
   });
}

if (overdueFilter) {
   overdueFilter.addEventListener("click", () => {
      loadIssuesByStatus("overdue");
      setActiveFilter(overdueFilter);
   });
}

if (allFilter) {
   allFilter.addEventListener("click", () => {
      loadIssues();
      setActiveFilter(allFilter);
   });
}

if (sortPriorityBtn) {
   sortPriorityBtn.addEventListener("click", sortIssuesByPriority);
}

// ------------------------------
// INITIALISE
// ------------------------------
window.addEventListener("load", () => {
   if (!localStorage.getItem("projects")) {
      saveData("projects", []);
   }

   if (!localStorage.getItem("issues")) {
      saveData("issues", defaultIssues);
   }

   if (!localStorage.getItem("people")) {
      saveData("people", people);
   }

   issues = loadData("issues");
   normalizeIssues();
   loadIssues();
   setActiveFilter(allFilter);

   console.log("Projects:", getAllProjects());
   console.log("Issues:", loadData("issues"));
   console.log("People:", loadData("people"));
});