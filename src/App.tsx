import React, { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";

type Task = {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
};

function App() {
  const ganttRef = useRef<HTMLDivElement | null>(null);

  const [projectStart, setProjectStart] = useState("2025-04-20");
  const [baseDate, setBaseDate] = useState("2025-04-21");

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "터파기",
      start: "2025-04-21",
      end: "2025-04-25",
      progress: 30,
    },
    {
      id: "2",
      name: "흙막이",
      start: "2025-04-26",
      end: "2025-04-30",
      progress: 10,
    },
    {
      id: "3",
      name: "구조물 시공",
      start: "2025-05-01",
      end: "2025-05-10",
      progress: 0,
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (ganttRef.current) {
      ganttRef.current.innerHTML = "";

      const gantt = new Gantt(ganttRef.current, tasks, {
        view_mode: "Day",
        bar_height: 32,
        on_click: (task: any) => {
          setSelectedId(task.id);
          setEditName(task.name);
        },
        custom_popup_html: null,
      });

      const bars = ganttRef.current.querySelectorAll(".bar-wrapper");
      bars.forEach((bar) => {
        bar.addEventListener("dblclick", () => {
          const id = bar.getAttribute("data-id");
          if (!id) return;
          const task = tasks.find((t) => t.id === id);
          if (!task) return;

          setSelectedId(task.id);
          setEditName(task.name);
        });
      });

      // 월 경계선 진하게 설정
      const ticks = ganttRef.current.querySelectorAll(".tick");
      ticks.forEach((tick) => {
        if (
          (tick as HTMLElement).getAttribute("data-tick")?.includes("month")
        ) {
          (tick as HTMLElement).style.stroke = "#333";
          (tick as HTMLElement).style.strokeWidth = "1.5px";
        }
      });

      // 프로젝트 시작일 기준으로 Gantt 스크롤 이동
      const scrollContainer = ganttRef.current;
      const startDate = new Date(projectStart);
      const ganttStart = gantt.gantt_start;
      const dayDiff = Math.floor(
        (startDate.getTime() - ganttStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      const targetX = dayDiff * gantt.options.column_width;

      scrollContainer?.scrollTo({
        left: targetX,
        behavior: "auto",
      });
    }
  }, [tasks, projectStart]);

  const addTask = () => {
    const newId = (tasks.length + 1).toString();
    const today = new Date();
    const start = today.toISOString().split("T")[0];
    const end = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const newTask: Task = {
      id: newId,
      name: `새 작업 ${newId}`,
      start,
      end,
      progress: 0,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = () => {
    if (selectedId) {
      setTasks(tasks.filter((t) => t.id !== selectedId));
      setSelectedId(null);
      setEditName("");
    } else {
      alert("삭제할 작업을 클릭하세요.");
    }
  };

  const handleNameEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && selectedId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === selectedId ? { ...t, name: editName } : t))
      );
      setEditName("");
      setSelectedId(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>공정관리 Gantt 앱</h2>
      {/* 상단 날짜 입력 */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "20px" }}>
          프로젝트 시작일:{" "}
          <input
            type="date"
            value={projectStart}
            onChange={(e) => setProjectStart(e.target.value)}
          />
        </label>
        <label>
          기준 날짜:{" "}
          <input
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
          />
        </label>
      </div>
      {/* 기능 버튼 */}
      <button onClick={addTask}>작업 추가</button>{" "}
      <button onClick={deleteTask}>선택된 작업 삭제</button>
      {selectedId && editName && (
        <div style={{ marginTop: "10px" }}>
          <label>
            작업명 수정 (Enter로 저장):{" "}
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleNameEdit}
              autoFocus
            />
          </label>
        </div>
      )}
      {/* 좌우 분할 */}
      <div style={{ display: "flex", marginTop: "20px" }}>
        {/* 왼쪽 테이블 */}
        <table
          style={{
            borderCollapse: "collapse",
            width: "300px",
            minWidth: "300px",
            background: "#f9f9f9",
            borderRight: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "4px" }}>작업명</th>
              <th style={{ textAlign: "left", padding: "4px" }}>시작일</th>
              <th style={{ textAlign: "left", padding: "4px" }}>종료일</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} style={{ height: "32px" }}>
                <td style={{ padding: "4px" }}>{task.name}</td>
                <td style={{ padding: "4px" }}>{task.start}</td>
                <td style={{ padding: "4px" }}>{task.end}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Gantt 차트 */}
        <div
          ref={ganttRef}
          style={{
             width: "100%",
            height: "500px",
            overflowX: "auto",
            paddingLeft: "20px",
            backgroundColor: "#ffffff",
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
