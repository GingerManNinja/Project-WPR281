const issueList = document.getElementById("issueList");
const issueCount = document.querySelector(".issue-count");
const issueDetails = document.getElementById("issueDetails");
const newIssueBtn = document.getElementById("newIssueBtn");
const openCount = document.getElementById("openCount");
const resolvedCount = document.getElementById("resolvedCount");
const overdueCount = document.getElementById("overdueCount");

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

let issues = JSON.parse(localStorage.getItem("issues")) || [
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
   },
   {
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

   // Find the full person object to get the profile picture
   const assignedPerson = people.find(p => p.name === issue.assignedTo);
   const avatarUrl = assignedPerson ? assignedPerson.profilePic : "https://ui-avatars.com/api/?name=U&background=ccc";

   // Generate dropdown options from the people array
   const peopleOptions = people.map(person => 
      `<option value="${person.name}" ${issue.assignedTo === person.name ? 'selected' : ''}>
         ${person.name} ${person.surname} (@${person.username})
      </option>`
   ).join('');

   issueDetails.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
         <img src="${avatarUrl}" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%;">
         <h3>${issue.summary}</h3>
      </div>
      <div class="details-grid">
         <p><strong>Description:</strong> ${issue.description}</p>
         <p><strong>Assigned To:</strong> 
            <select class="form-select" onchange="updateAssignment('${issue.summary}', this.value)">
               <option value="">Unassigned (Assign Later)</option>
               ${peopleOptions}
            </select>
         </p>
         <p><strong>Project:</strong> ${issue.project}</p>
         <p><strong>Status:</strong> ${issue.status}</p>
         <p><strong>Priority:</strong> ${issue.priority}</p>
         <p><strong>Reported:</strong> ${issue.dateReported}</p>
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
function updateAssignment(issueSummary, newAssignee) {
   const issueIndex = issues.findIndex(i => i.summary === issueSummary);
   
   if (issueIndex !== -1) {
      issues[issueIndex].assignedTo = newAssignee;
      localStorage.setItem("issues", JSON.stringify(issues));
      loadIssues();
      console.log(`Successfully reassigned to ${newAssignee}`);
   }
}
