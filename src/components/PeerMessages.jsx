import React, { useEffect, useRef, useState } from "react";

const PeerMessages = () => {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);

  const getStatusColor = (status) => {
    if (status === "completed") return "text-green-500";
    if (status === "pending") return "text-blue-500";
    if (status === "missing") return "text-red-600";
    if (status === "upcoming") return "text-gray-400";
  };

  useEffect(() => {
    if (window.Quill && editorRef.current && !quillInstanceRef.current) {
      quillInstanceRef.current = new window.Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
          ],
        },
      });
    }
  }, []);

  const logStatus = [
    { Sno: "1", Day: "Monday", status: "completed" },
    { Sno: "2", Day: "Tuesday", status: "missing" },
    { Sno:"3",Day: "Wednesday", status: "completed" },
    { Sno:"4",Day: "Thursday", status: "pending" },
    { Sno:"5",Day: "Friday", status: "upcoming" },
    { Sno:"6",Day: "Saturday", status: "upcoming" },
    { Sno:"7",Day: "Sunday", status: "upcoming" },
  ];

  
  const journalView = [
    { day: "Monday", content: "<h1>Monday Data</h1>" },
    { day: "Tuesday", content: "<h1>Tuesday Data</h1>" },
    { day: "Wednesday", content: "<h1>Wednesday Data</h1>" },
    { day: "Thursday", content: "<h1>Thursday Data</h1>" },
    { day: "Friday", content: "<h1>Friday Data</h1>" },
    { day: "Saturday", content: "<h1>Saturday Data</h1>" },
    { day: "Sunday", content: "<h1>Sunday Data</h1>" },
  ];

  const [mContent,setmContent] = useState("<p>No Data available</p>")

  const setModelContent = (day) => {
    const statusObj = logStatus.find((log) => log.Day === day);
    const journal = journalView.find((entry) => entry.day === day);

    if (statusObj?.status === "completed" && journal) {
      setmContent(journal.content);
    } else {
      setmContent("<h1>No Data available</h1>");
    }
  };



  return (
    <>
      <div className="flex flex-row mt-5 p-5 gap-1 justify-evenly">
        <div className="relative shadow-2xl border-2 border-white rounded-lg overflow-y-scroll p-5 mt-5 top-5 w-[1000px]">
          <div
            ref={editorRef}
            id="editor"
            className="border-1 min-h-[75vh] border-gray-300"
          >
            <h2>Demo Content</h2>
            <p>
              Preset build with <code>snow</code> theme, and some common
              formats.
            </p>
          </div>
        </div>
        <div className="relative shadow-2xl border-2 border-white rounded-lg p-5 mt-5 top-5 w-[450px]">
          <div id="log" className="h-[80vh] overflow-y-scroll">
            <p className="font-semibold text-3xl text-orange-400 text-shadow-lg">
              Weekly Journal Log
            </p>
            <ul className="m-3">
              {logStatus.map((log) => (
                <li
                  onClick={() => {
                    if (log.status !== "upcoming") {
                      setModelContent(log.Day);
                      document.getElementById("my_modal_3").showModal();
                    }
                  }}
                  key={log.Sno}
                  className="cursor-pointer w-full rounded-lg flex flex-row justify-start items-center p-3 mb-3 gap-3 shadow-lg border-2 border-white"
                >
                  <div className="bg-orange-400 text-white text-[15px] font-bold rounded-full p-3">
                    Day-{log.Sno}
                  </div>
                  <p className="text-xl font-semibold">{log.Day}</p>
                  <p
                    className={`text-md font-semibold ${getStatusColor(
                      log.status
                    )}`}
                  >
                    ({log.status})
                  </p>
                </li>
              ))}
            </ul>
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box min-w-[80%] min-h-[80%]">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: mContent }}
                />
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default PeerMessages;
