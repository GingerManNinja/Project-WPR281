const issueList = document.getElementById("issueList");
const issueCount = document.querySelector(".issue-count");
const issueDetails = document.getElementById("issueDetails");
const newIssueBtn = document.getElementById("newIssueBtn");
const openCount = document.getElementById("openCount");
const resolvedCount = document.getElementById("resolvedCount");
const overdueCount = document.getElementById("overdueCount");

// Temporary test data
const issues = [
   {
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
   }
];
const searchInput = document.getElementById("issueSearch");

function getStatusClass(status) {
   switch (status.toLowerCase()) {
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
   switch (priority.toLowerCase()) {
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

function formatDisplayValue(value) {
   return value && value.trim() !== "" ? value : "Not provided";
}

function clearSelectedRows() {
   const rows = document.querySelectorAll(".issue-table tbody tr");
   rows.forEach(row => row.classList.remove("selected-row"));
}

function showIssueDetails(issue, selectedRow = null) {
   if (selectedRow) {
      clearSelectedRows();
      selectedRow.classList.add("selected-row");
   }

   issueDetails.innerHTML = `
        <h3>${issue.summary}</h3>
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
        </div>
    `;
}

function loadIssues(filter = "") {

   issueList.innerHTML = "";

   const filteredIssues = issues.filter(issue =>
      issue.summary.toLowerCase().includes(filter) ||
      issue.project.toLowerCase().includes(filter) ||
      issue.assignedTo.toLowerCase().includes(filter) ||
      issue.status.toLowerCase().includes(filter) ||
      issue.priority.toLowerCase().includes(filter)
   );

   if (filteredIssues.length === 0) {
      issueList.innerHTML = `
            <tr>
                <td colspan="5" class="no-issues">No matching issues found.</td>
            </tr>
        `;

      issueCount.textContent = "0 Issues";
      return;
   }

   filteredIssues.forEach(issue => {

      const row = document.createElement("tr");

      row.innerHTML = `
            <td>${issue.summary}</td>
            <td>${issue.project}</td>
            <td>${issue.assignedTo}</td>
            <td>
                <span class="status ${getStatusClass(issue.status)}">
                    ● ${issue.status}
                </span>
            </td>
            <td>
                <span class="priority ${getPriorityClass(issue.priority)}">
                    ⚡ ${issue.priority}
                </span>
            </td>
        `;

      row.addEventListener("click", () => {
         showIssueDetails(issue, row);
      });

      issueList.appendChild(row);

   });

   issueCount.textContent = `${filteredIssues.length} Issues`;
   updateStatusSummary(filteredIssues);
}

searchInput.addEventListener("input", (e) => {
   const value = e.target.value.trim().toLowerCase();
   loadIssues(value);
});
loadIssues();

function updateStatusSummary(issueArray) {

   const open = issueArray.filter(i => i.status.toLowerCase() === "open").length;
   const resolved = issueArray.filter(i => i.status.toLowerCase() === "resolved").length;
   const overdue = issueArray.filter(i => i.status.toLowerCase() === "overdue").length;

   openCount.textContent = open;
   resolvedCount.textContent = resolved;
   overdueCount.textContent = overdue;

}