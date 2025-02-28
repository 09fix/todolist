// 총 결혼비용을 저장하는 변수
// localStorage에서 불러옵니다 (기본값===0)
let totalCost = localStorage.getItem("totalCost") || 0;

// 화면에 총 결혼 비용을 표시합니다 (새로고침 시에도 유지)
document.getElementById("totalCost").innerHTML = totalCost + "원";

// 저장된 할 일 목록을 불러와서 화면에 표시하는 함수
function loadTasks() {
  // 할 일 목록을 표시할 ul 요소를 가져옵니다
  const taskList = document.getElementById("taskList");
  // localStorage에서 'tasks' 키의 데이터를 가져옵니다. (기본값===[])
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  taskList.innerHTML = ""; // 기존 목록 초기화 (중복 추가 방지)

  savedTasks.forEach((task) => {
    const li = document.createElement("li"); // 새로운 할 일 리스트 요소를 생성합니다
    // 날짜, 할 일, 금액, 담당자를 표시합니다
    li.innerHTML = `${task.date} - ${task.desc} (${task.cost}원) - ${task.assignee}`;
    // 예상 금액을 data-cost 속성에 저장합니다
    li.setAttribute("data-cost", task.cost);
    // 생성된 li 요소를 ul 목록에 추가합니다
    taskList.appendChild(li);
  });
}

// 화면 전환 함수
// 선택한 화면을 보여주고 다른 화면은 숨김 처리합니다
function goToScreen(screenId) {
  // 모든 화면 요소(screen 클래스를 가진 요소) 가져옵니다
  const screens = document.querySelectorAll(".screen");
  // 모든 화면 요소를 지웁니다
  screens.forEach((screen) => screen.classList.remove("active"));
  // 선택한 화면을 활성화합니다
  document.getElementById(screenId).classList.add("active");
}

// 새로운 할 일을 추가하는 함수
function addTask() {
  const date = document.getElementById("taskDate").value; // 날짜
  const desc = document.getElementById("taskDesc").value; // 할 일 내용
  const cost = document.getElementById("taskCost").value; // 예상 금액
  const assignee = document.getElementById("taskAssignee").value; // 담당자

  // 입력값이 비어 있으면 경고 메시지를 띄웁니다
  if (!date || !desc || !cost || !assignee) {
    alert("입력하신 내용을 다시 확인해주세요.");
    return;
  }

  // 새로운 할 일을 리스트에 추가합니다
  const taskList = document.getElementById("taskList");
  const li = document.createElement("li"); // li 요소 생성합니다
  li.textContent = `${date}-${desc} (${cost}원) - ${assignee}`; // 항목 내용 표시합니다
  li.setAttribute("data-cost", cost); // 예상 금액을 data-cost 속성에 저장합니다
  taskList.appendChild(li); // 생성된 li 요소를 ul 목록에 추가합니다

  // 총 결혼비용을 업데이트합니다
  totalCost += parseInt(cost); // 예상 금액을 총 결혼비용에 더합니다
  document.getElementById("totalCost").textContent = totalCost + "원"; // 총 결혼 비용 화면에 표시합니다

  // localStorage에 새로운 할 일 목록을 저장합니다
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || []; // 기존 데이터를 불러옵니다(기본값===[])
  savedTasks.push({ date, desc, cost, assignee }); // 새로운 할 일 객체를 추가합니다
  localStorage.setItem("tasks", JSON.stringify(savedTasks)); // 업데이트된 목록을 localStorage에 저장합니다
  localStorage.setItem("totalCost", totalCost); // 총 비용도 localStorage에 저장합니다

  // 새로운 할 일을 추가하는 폼을 초기화합니다
  document.getElementById("addTaskForm").reset();
  // 추가 후 수정하기(modifyTasksScreen) 화면으로 이동합니다
  goToScreen("modifyTasksScreen");
}

// 삭제 화면에 현재 할 일 목록을 불러와서 각 항목마다 삭제 버튼 생성
function populateDeleteScreen() {
  const deleteTaskList = document.getElementById("deleteTaskList"); // 삭제 목록을 표시할 ul 요소를 가져옵니다
  deleteTaskList.innerHTML = ""; // 삭제 목록 초기화합니다
  const taskList = document.getElementById("taskList"); // 현재 할 일 목록을 가져옵니다
  const tasks = Array.from(taskList.children); // forEach 사용이 가능하도록 할 일 목록을 배열로 변환합니다

  // 할 일이 하나도 없을 경우, 안내 메시지 표시합니다
  if (tasks.length === 0) {
    deleteTaskList.innerHTML = "<li>삭제할 할 일이 없습니다.</li>";
    return;
  }

  // 모든 할 일 목록을 순회하며 삭제 버튼 추가합니다
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "delete-item";
    li.innerHTML = `<span>${index + 1}. ${task.textContent}</span>`; // 번호와 내용을 표시합니다

    // 삭제 버튼 생성
    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.addEventListener("click", () => {
      // 삭제 버튼 클릭 시 실행되는 함수
      const taskCost = parseInt(task.getAttribute("data-cost") || "0"); // 해당 항목의 예상 금액 가져옵니다
      totalCost -= taskCost; // 총 비용에서 삭제한 해당 금액을 뺍니다
      document.getElementById("totalCost").textContent = totalCost + "원"; // 화면에 반영합니다

      // localStorage에서 해당 항목 삭제합니다
      let savedTasks = JSON.parse(localStorage.getItem("tasks")) || []; // 기존 목록 불러옵니다
      savedTasks.splice(index, 1); // 배열에서 해당 인덱스의 항목을 제거합니다
      localStorage.setItem("tasks", JSON.stringify(savedTasks)); // 업데이트된 목록을 localStorage에 저장합니다
      localStorage.setItem("totalCost", totalCost); // 총 비용도 localStorage에 저장합니다

      // 화면에서 항목 삭제
      task.remove(); // 할 일 목록에서 해당 항목 제거합니다
      li.remove(); // 삭제 화면에서도 해당 항목 제거합니다

      // 목록이 모두 삭제되었으면 메시지 표시합니다
      if (taskList.children.length === 0) {
        deleteTaskList.innerHTML = "<li>삭제할 할 일이 없습니다.</li>";
      }
    });

    li.appendChild(delBtn); // 삭제 버튼을 li 요소에 추가합니다
    deleteTaskList.appendChild(li); // 삭제 화면에 항목을 추가합니다
  });

  // 삭제 화면으로 이동합니다
  goToScreen("deleteTaskScreen");
}

// 페이지가 로드될 때 localStorage에서 기존 데이터 불러옵니다
document.addEventListener("DOMContentLoaded", () => {
  loadTasks(); // 저장된 할 일 목록을 불러옵니다
});
