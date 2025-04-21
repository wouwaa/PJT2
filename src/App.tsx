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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "터파기",
      start: "2025-04-21",
      end: "2025-04-25",
      progress: 0,
    },
    {
      id: "2",
      name: "흙막이",
      start: "2025-04-26",
      end: "2025-04-30",
      progress: 0,
    },
    {
      id: "3",
      name: "구조물 시공",
      start: "2025-05-01",
      end: "2025-05-10",
      progress: 0,
    },
  ]);

  const [projectStart, setProjectStart] = useState("2025-04-20");
  const [baseDate, setBaseDate] = useState("2025-04-21");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const ganttRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ganttRef.current) {
      const gantt = new Gantt(ganttRef.current, tasks, {
        view_mode: "Day",
        bar_height: 32,
        date_format: "YYYY-MM-DD",
        on_click: (task: any) => {
          setSelectedId(task.id);
          setEditName(task.name);
        },
      });

      gantt.change_view_mode("Day");
    }
  }, [tasks, projectStart]);

  const handleAddTask = () => {
    const newId = (tasks.length + 1).toString();
    const today = new Date().toISOString().split("T")[0];

    const newTask: Task = {
      id: newId,
      name: `작업 ${newId}`,
      start: today,
      end: today,
      progress: 0,
    };

    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = () => {
    if (selectedId) {
      setTasks(tasks.filter((task) => task.id !== selectedId));
      setSelectedId(null);
      setEditName("");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && selectedId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedId ? { ...t, name: editName } : t
        )
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>공정관리 Gantt 앱</h2>

      <div style={{ marginBottom: "10px" }}>
        프로젝트 시작일:{" "}
        <input
          type="date"
          value={projectStart}
          onChange={(e) => setProjectStart(e.target.value)}
        />
        기준 날짜:{" "}
        <input
          type="date"
          value={baseDate}
          onChange={(e) => setBaseDate(e.target.value)}
        />
      </div>

      <button onClick={handleAddTask}>작업 추가</button>
      <button onClick={handleDeleteTask} style={{ marginLeft: "10px" }}>
        선택된 작업 삭제
      </button>

      <table style={{ marginTop: "20px", borderCollapse: "collapse" }}>
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
              <td style={{ padding: "4px" }}>
                {selectedId === task.id ? (
                  <input
                    value={editName}
                    onChange={handleNameChange}
                    onKeyDown={handleNameSubmit}
                  />
                ) : (
                  <span
                    onDoubleClick={() => {
                      setSelectedId(task.id);
                      setEditName(task.name);
                    }}
                  >
                    {task.name}
                  </span>
                )}
              </td>
              <td style={{ padding: "4px" }}>{task.start}</td>
              <td style={{ padding: "4px" }}>{task.end}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gantt 차트 영역 */}
      <div
        ref={ganttRef}
        style={{
          height: "400px",
          backgroundColor: "#fff",
          overflowX: "auto",
          width: "100%",
          paddingLeft: "20px",
          marginTop: "20px",
        }}
      ></div>
    </div>
  );
}

export default App;
