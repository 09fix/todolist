// 총 결혼비용 변수 선언 (초기값은 0원)
let totalCost = 0;

// 화면 전환 함수. 클릭된 화면을 보여주고 다른 화면은 숨김 처리.
function goToScreen(screenId) {
  const screens = document.querySelectorAll(".screen"); // 모든 .screen 요소를 선택.
  screens.forEach((screen) => screen.classList.remove("active")); // 현재 화면 비활성화
  document.getElementById(screenId).classList.add("active"); // 새로운 화면 활성화
}

// 할 일을 추가하는 함수
function addTask() {
  const date = document.getElementById("taskDate").value; // 날짜
  const desc = document.getElementById("taskDesc").value; // 할 일 내용
  const cost = document.getElementById("taskCost").value; // 예상 금액
  const assignee = document.getElementById("taskAssignee").value; // 담당자

  // 입력값이 비어 있으면 경고
  if (!date || !desc || !cost || !assignee) {
    alert("입력하신 내용을 다시 확인해주세요.");
    return;
  }

  // 할일 목록에 항목 추가
  const taskList = document.getElementById("taskList");
  const li = document.getElementById("li");
  li.textContent = `${date}-${desc} (${cost}원) -${assignee}`; // 항목 내용 표시
  li.setAttribute("data-cost", cost); // 예상 금액을 data-cost 속성에 저장
  taskList.appendChild(li);

  // 총 결혼비용 업데이트
  totalCost += parseInt(cost); // 예상 금액을 총 결혼비용에 더 함
  document.getElementById("totalCost").textContent = totalCost + "원"; // 총 결혼 비용 화면에 표시

  // 폼 리셋 후 수정 화면으로 이동
  document.getElementById("addTaskForm").reset();
  goToScreen("modifyTasksScreen");
}

// 삭제 화면에 현재 할 일 목록을 불러와, 각 항목마다 삭제 버튼 생성
function populateDeleteScreen() {
  const deleteTaskList = document.getElementById("deleteTaskList");
  deleteTaskList.innerHTML = "";
  const taskList = document.getElementById("taskList");
  const tasks = taskList.children; // 할 일 목록 항목들 가져오기

  if (tasks.length === 0) {
    const li = document.createElement("li");
    li.textContent = "삭제할 할 일이 없습니다.";
    deleteTaskList.appendChild(li);
  } else {
    // tasks를 Array.from() 함수로, 배열로 변환
    Array.from(tasks).forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "delete-item";
      li.innerHTML = `<span>
          ${index + 1}. ${task.textContent}
        </span>`; // 항목의 번호와 내용 표시
      const delBtn = document.createElement("button");
      delBtn.addEventListener("click", () => {
        const taskCost = parseInt(task.getAttribute("data-cost") || "0"); // 항목 예상 금액 가져오기
        totalCost -= taskCost; // 총 결혼비용에서 해당 금액 빼기
        document.getElementById("totalCost").textContent = totalCost + "원"; // 총 결혼비용 업데이트
        task.remove(); // 할 일 목록에서 해당 항목 삭제
        li.remove(); // 삭제 화면에서 해당 항목의 li 삭제
        // 목록이 모두 삭제 되었으면 삭제 화면에 메시지 표시
        if (taskList.children.length === 0) {
          const emptyLi = document.createElement("li");
          emptyLi.textContent = "삭제할 할 일이 없습니다.";
          deleteTaskList.appendChild(emptyLi);
        }
      });
      li.appendChild(delBtn); // 삭제 버튼 추가
      deleteTaskList.appendChild(li); // 삭제 화면에 항목 추가
    });
  }

  // 삭제 화면으로 이동
  goToScreen("deleteTaskScreen");
}
