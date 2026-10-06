import { useState } from "react";

function TaxyChat() {

  const [isTaxyChatOpen, setIsTaxyChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askTaxy = async () => {

    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {

      const response = await fetch(
        "http://localhost:8080/api/ai/explain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
            age: 10,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.text();
      setAnswer(data);

    } catch (error) {

      console.error(error);
      setAnswer("Oops! Taxy could not answer right now. Please try again!");

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      {isTaxyChatOpen && (

        <div className="taxy-chat-window">

          <div className="taxy-chat-header">

            <span>🤖 Ask Taxy</span>

            <button
              type="button"
              className="taxy-chat-close"
              onClick={() => setIsTaxyChatOpen(false)}
            >
              ✕
            </button>

          </div>

          <div className="taxy-chat-body">

            <div className="taxy-welcome">
              <span className="taxy-avatar">🤖</span>

              <div>
                <strong>Hi! I'm Taxy 👋</strong>
                <p>Ask me anything about money and taxes!</p>
              </div>
            </div>


            <div className="taxy-question-area">

              <input
                className="taxy-question-input"
                type="text"
                placeholder="What would you like to know?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    askTaxy();
                  }
                }}
              />

              <button
                className="taxy-ask-button"
                type="button"
                onClick={askTaxy}
                disabled={loading}
              >
                Ask ✨
              </button>

            </div>


            <div className="taxy-result-area">

              {loading && (

                <div className="taxy-loader">

                  <div className="thinking-robot">
                    🤖
                  </div>

                  <strong>Taxy is thinking...</strong>

                  <div className="thinking-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                </div>

              )}


              {!loading && answer && (

                <div className="taxy-answer">

                  <div className="answer-title">
                    🤖 Taxy says
                  </div>

                  <div className="answer-text">
                    {answer}
                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      )}


      {!isTaxyChatOpen && (

        <button
          type="button"
          className="taxy-chat-button"
          onClick={() => setIsTaxyChatOpen(true)}
        >
          <span className="taxy-chat-icon">🤖</span>
          <span>Ask Taxy</span>
          <span className="taxy-chat-sparkle">✨</span>
        </button>

      )}

    </>
  );
}

export default TaxyChat;