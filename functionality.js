const issueList = document.getElementById("issueList");
const issueCount = document.querySelector(".issue-count");
const issueDetails = document.getElementById("issueDetails");
const newIssueBtn = document.getElementById("newIssueBtn");
const openCount = document.getElementById("openCount");
const resolvedCount = document.getElementById("resolvedCount");
const overdueCount = document.getElementById("overdueCount");
const closeBtn = document.getElementById("closeFormBtn")
const popupForm = document.getElementById("popupForm")
const submitBtn = document.getElementById("submitBtn")
const popupFormTitle = document.getElementById("popupFormTitle")

//Test global variable for update of row item
let userSelectedRow

// Temporary test data
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

            <button type="button" id="editBtn">Edit</button>
        </div>
    `;

      //Open popup for edit
      const editBtn = document.getElementById("editBtn")
      editBtn.addEventListener("click", () => {
      popupForm.style.display = "flex"
      popupForm.style.flexDirection = "column"
      popupFormTitle.innerHTML = "Edit Issue:"

      document.getElementById("summary").value = issue.summary
      document.getElementById("description").value = issue.description
      document.getElementById("project").value = issue.project
      document.getElementById("assignedTo").value = issue.assignedTo
      document.getElementById("status").value = issue.status
      document.getElementById("priority").value = issue.priority
      document.getElementById("dateReported").value = issue.dateReported
      document.getElementById("targetResolutionDate").value = issue.targetDate
      document.getElementById("actualResolutionDate").value = issue.actualResolutionDate
      document.getElementById("resolutionSummary").value = issue.resolutionSummary
      })

      userSelectedRow = issue
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


//----------------------------------------------------------------------------------------------------------------------------------------------------

// Create the Issue/Ticket form

newIssueBtn.addEventListener("click", () => {
   popupForm.style.display = "block"
});

closeBtn.addEventListener("click", () => {
   popupFormTitle.innerHTML = "New Issue:"
   popupForm.style.display = "none"
   document.getElementById("summary").value = ""
   document.getElementById("description").value = ""
   document.getElementById("project").value = ""
   document.getElementById("assignedTo").value = ""
   document.getElementById("status").value = ""
   document.getElementById("priority").value = ""
   document.getElementById("dateReported").value = ""
   document.getElementById("targetResolutionDate").value = ""
   document.getElementById("actualResolutionDate").value = ""
   document.getElementById("resolutionSummary").value = ""
});


// Capture all required fields: summary, description, identified by, dates, project, assigned person, status, priority, resolution details
submitBtn.addEventListener("click", () => {
   submit(userSelectedRow)
})

function submit(issue) {
         if (popupFormTitle.innerHTML == "New Issue:") {
            issues.push({
            summary: document.getElementById("summary").value,
            description: document.getElementById("description").value,
            project: document.getElementById("project").value,
            assignedTo: document.getElementById("assignedTo").value,
            status: document.getElementById("status").value,
            priority: document.getElementById("priority").value,
            dateReported: document.getElementById("dateReported").value,
            targetDate: document.getElementById("targetResolutionDate").value,
            actualResolutionDate: document.getElementById("actualResolutionDate").value,
            resolutionSummary: document.getElementById("resolutionSummary").value
            })
            popupForm.style.display = "none"
            loadIssues()
         }
         // Implement Edit / Update Issue functionality
         else if (popupFormTitle.innerHTML == "Edit Issue:") {
            issue.summary = document.getElementById("summary").value 
            issue.description = document.getElementById("description").value 
            issue.project = document.getElementById("project").value 
            issue.assignedTo = document.getElementById("assignedTo").value 
            issue.status = document.getElementById("status").value 
            issue.priority = document.getElementById("priority").value 
            issue.dateReported = document.getElementById("dateReported").value 
            issue.targetDate = document.getElementById("targetResolutionDate").value 
            issue.actualResolutionDate = document.getElementById("actualResolutionDate").value 
            issue.resolutionSummary = document.getElementById("resolutionSummary").value 
            popupForm.style.display = "none"
            loadIssues()
         }
         else {
            alert("Error implementing action. Please try again.")
         }
}

// Ensure edited issues update correctly in localStorage

//----------------------------------------------------------------------------------------------------------------------------------------------------
// !!!!!!!!(still reviewing)!!!!!!!! Project Management & Data Storage

// Utility Functions
function saveData(key, data) {
   localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
   const data = localStorage.getItem(key);
   
  if (data) {
      // If data exists in localStorage, parse it back into an object/array
   return JSON.parse(data);
} else {
      // If nothing is stored yet, return an empty array
   return [];
}
}

// Project Functions 
function createProject(id, name) {
   return {
      id: id,
      projectName: name
   };
}

function addProject(name) {
   let projects = loadData("projects");
      let newId;

   if (projects.length > 0) {
      // If there are existing projects, increment the last ID
      newId = projects[projects.length - 1].id + 1;
   } else {
      // If no projects exist yet, start with ID = 1
      newId = 1;
   }
   const project = createProject(newId, name);
   projects.push(project);
   saveData("projects", projects);
   return project;
}

function getAllProjects() {
   return loadData("projects");
}

function getProjectById(id) {
   let projects = loadData("projects");
   return projects.find(p => p.id === id);
}

function deleteProject(id) {
   let projects = loadData("projects");
   projects = projects.filter(p => p.id !== id);
   saveData("projects", projects);
}

// Integration with Issues
function linkIssueToProject(issueSummary, projectName) {
   let issues = loadData("issues");
   const issueIndex = issues.findIndex(i => i.summary === issueSummary);

   if (issueIndex !== -1) {
      issues[issueIndex].project = projectName;
      saveData("issues", issues);
      console.log(`Issue "${issueSummary}" linked to project "${projectName}"`);
   } else {
      console.log("Issue not found.");
   }
}

// Initialization
window.addEventListener("load", () => {
   if (!localStorage.getItem("projects")) {
      saveData("projects", []);
   }

   if (!localStorage.getItem("issues")) {
      saveData("issues", issues); // using our existing test issues
   }

   if (!localStorage.getItem("people")) {
      saveData("people", people);
   }

   console.log("Projects:", getAllProjects());
   console.log("Issues:", loadData("issues"));
   console.log("People:", loadData("people"));
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
