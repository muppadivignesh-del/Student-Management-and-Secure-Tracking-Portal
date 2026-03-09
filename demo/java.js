const TOTAL_FEES = 10000;
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";
const TEACHER_PASS = "1234";
const STUDENT_PASS = "1234";

let currentStudentIndex = -1;

let books = ["English","Java","DSA"];

let students = [
  {name:"Student 1", paid:0, received:[], present:false},
  {name:"Student 2", paid:0, received:[], present:false},
  {name:"Student 3", paid:0, received:[], present:false},
  {name:"Student 4", paid:0, received:[], present:false},
  {name:"Student 5", paid:0, received:[], present:false},
  {name:"Student 6", paid:0, received:[], present:false}
];

// ===== SCREEN CONTROL =====
function hideAll(){
  document.querySelectorAll("body > div").forEach(d=>{
    if(d.id !== "roleSection") d.style.display="none";
  });
}

// ===== ROLE =====
function showAdminLogin(){ hideAll(); loginSection.style.display="block"; }
function showTeacherLogin(){ hideAll(); teacherLogin.style.display="block"; }
function showStudentLogin(){ hideAll(); studentLogin.style.display="block"; }

// ===== BACK =====
function backToHome(){ hideAll(); roleSection.style.display="block"; }
function backToTeacher(){
  attendancePanel.style.display="none";
  feesPanel.style.display="none";
  teacherOptions.style.display="block";
}

// ===== ADMIN =====
function login(){
  if(username.value.trim()===ADMIN_USER && password.value.trim()===ADMIN_PASS){
    hideAll();
    adminPanel.style.display="block";
    renderTable();
  } else loginMsg.innerText="Invalid username or password";
}

function addBook(){
  const book=newBook.value.trim();
  if(!book) return;
  books.push(book);
  newBook.value="";
  bookMsg.innerText="Book added";
  renderTable();
}

function updatePaid(i){
  let amt=Number(prompt("Enter paid amount:"));
  if(isNaN(amt)||amt<=0) return;
  students[i].paid+=amt;
  if(students[i].paid>TOTAL_FEES) students[i].paid=TOTAL_FEES;
  renderTable();
}

function giveBook(i,book){
  if(!students[i].received.includes(book))
    students[i].received.push(book);
  renderTable();
}

function renderTable(){
  const tb=document.querySelector("#studentTable tbody");
  tb.innerHTML="";
  students.forEach((s,i)=>{
    const due=TOTAL_FEES-s.paid;
    const eligible=due===0;
    const btns=books.map(b=>`<button onclick="giveBook(${i}, '${b}')">${b}</button>`).join(" ");
    tb.innerHTML+=`
      <tr>
        <td>${s.name}</td>
        <td>₹${TOTAL_FEES}</td>
        <td>₹${s.paid}</td>
        <td>₹${due}</td>
        <td><button onclick="updatePaid(${i})">Update</button></td>
        <td class="${eligible?'eligible':'noteligible'}">${eligible?'Eligible':'Not Eligible'}</td>
        <td>${btns}<br><small>Received: ${s.received.join(', ')||'None'}</small></td>
      </tr>`;
  });
}

// ===== TEACHER =====
function teacherLoginFunc(){
  if(teacherPass.value.trim()===TEACHER_PASS){
    hideAll();
    teacherOptions.style.display="block";
  } else teacherMsg.innerText="Invalid teacher password";
}

function openAttendance(){ hideAll(); attendancePanel.style.display="block"; renderAttendance(); }
function openFees(){ hideAll(); feesPanel.style.display="block"; renderFees(); }

function renderAttendance(){
  const tb=document.querySelector("#attendanceTable tbody");
  tb.innerHTML="";
  students.forEach((s,i)=>{
    tb.innerHTML+=`
      <tr>
        <td>${s.name}</td>
        <td>${s.present?'Present':'Absent'}</td>
        <td>
          <button onclick="markAtt(${i},true)">Present</button>
          <button onclick="markAtt(${i},false)">Absent</button>
        </td>
      </tr>`;
  });
}
function markAtt(i,val){ students[i].present=val; renderAttendance(); }
function resetAttendance(){ students.forEach(s=>s.present=false); renderAttendance(); }

function renderFees(){
  const tb=document.querySelector("#feesTable tbody");
  tb.innerHTML="";
  students.forEach(s=>{
    const due=TOTAL_FEES-s.paid;
    tb.innerHTML+=`
      <tr>
        <td>${s.name}</td>
        <td>₹${s.paid}</td>
        <td>₹${due}</td>
        <td>${s.received.join(', ')||'None'}</td>
      </tr>`;
  });
}

// ===== STUDENT =====
function studentLoginFunc(){
  const name=studentName.value.trim();
  const pass=studentPass.value.trim();
  const index=students.findIndex(s=>s.name.toLowerCase()===name.toLowerCase());
  if(index!==-1 && pass===STUDENT_PASS){
    currentStudentIndex=index;
    hideAll();
    studentPanel.style.display="block";
    renderStudentView();
  } else studentMsg.innerText="Invalid student name or password";
}

function renderStudentView(){
  const s=students[currentStudentIndex];
  const due=TOTAL_FEES-s.paid;
  document.querySelector("#studentViewTable tbody").innerHTML=`
    <tr>
      <td>${s.name}</td>
      <td>₹${s.paid}</td>
      <td>₹${due}</td>
      <td>${s.present?'Present':'Absent'}</td>
      <td>${s.received.join(', ')||'None'}</td>
    </tr>`;
}

function downloadStudentReceipt(){
  const s=students[currentStudentIndex];
  const due=TOTAL_FEES-s.paid;
  downloadFile(
`Student Receipt
Name: ${s.name}
Paid: ₹${s.paid}
Due: ₹${due}
Attendance: ${s.present?'Present':'Absent'}
Books: ${s.received.join(', ')||'None'}`,
"student_receipt.txt");
}

// ===== COMMON =====
function downloadFile(content,filename){
  const blob=new Blob([content]);
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  a.click();
}