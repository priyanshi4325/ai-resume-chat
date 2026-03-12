import { useState, useRef, useEffect } from "react"

const API_BASE = ""

function Chat() {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null) // null | "uploading" | "success" | "error"
  const [resumeName, setResumeName] = useState(null)

  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a file first")
      return
    }

    setUploadStatus("uploading")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Upload failed")
      }

      setResumeName(file.name)
      setUploadStatus("success")
      setFile(null)

      // Reset file input
      document.getElementById("resume-input").value = ""

    } catch (err) {
      console.error("Upload error:", err)
      setUploadStatus("error")
      alert(`Upload failed: ${err.message}`)
    }
  }

  const sendMessage = async () => {
    if (!message.trim()) return

    if (!resumeName) {
      alert("Please upload a resume first!")
      return
    }

    const userMsg = { role: "user", content: message }
    setChat(prev => [...prev, userMsg])
    setMessage("")
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message })
      })

      if (!res.ok) throw new Error("Chat request failed")

      const data = await res.json()
      setChat(prev => [...prev, { role: "bot", content: data.answer }])

    } catch (err) {
      setChat(prev => [...prev, { role: "bot", content: "⚠️ Error getting response. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#0f172a",
      color: "white"
    }}>

      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid #1e293b"
      }}>
        <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
          AI Resume Chat
        </div>

        {/* Upload bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <input
            id="resume-input"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              setFile(e.target.files[0])
              setUploadStatus(null)
            }}
            style={{ color: "#94a3b8" }}
          />

          <button
            onClick={uploadResume}
            disabled={uploadStatus === "uploading"}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "none",
              background: uploadStatus === "uploading" ? "#166534" : "#16a34a",
              color: "white",
              cursor: uploadStatus === "uploading" ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            {uploadStatus === "uploading" ? "Uploading..." : "Upload Resume"}
          </button>

          {/* Status indicator */}
          {uploadStatus === "success" && (
            <span style={{ color: "#4ade80", fontSize: 14 }}>
              ✅ <strong>{resumeName}</strong> indexed — ready to chat!
            </span>
          )}
          {uploadStatus === "error" && (
            <span style={{ color: "#f87171", fontSize: 14 }}>
              ❌ Upload failed. Check console.
            </span>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>

        {chat.length === 0 && (
          <div style={{ color: "#475569", textAlign: "center", marginTop: 60 }}>
            {resumeName
              ? `Resume loaded. Ask anything about ${resumeName}!`
              : "Upload a resume above to get started."}
          </div>
        )}

        {chat.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 15
          }}>
            <div style={{
              background: msg.role === "user" ? "#2563eb" : "#1e293b",
              padding: "12px 16px",
              borderRadius: 12,
              maxWidth: "60%",
              lineHeight: 1.6
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ color: "#64748b", fontStyle: "italic" }}>AI is typing...</div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: 15,
        borderTop: "1px solid #1e293b",
        display: "flex"
      }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          placeholder={resumeName ? "Ask about the resume..." : "Upload a resume first..."}
          disabled={!resumeName}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "none",
            outline: "none",
            background: "#1e293b",
            color: "white",
            opacity: resumeName ? 1 : 0.5,
            cursor: resumeName ? "text" : "not-allowed"
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!resumeName || loading}
          style={{
            marginLeft: 10,
            padding: "0 20px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            cursor: resumeName && !loading ? "pointer" : "not-allowed",
            opacity: resumeName && !loading ? 1 : 0.5
          }}
        >
          Send
        </button>
      </div>

    </div>
  )
}

export default Chat