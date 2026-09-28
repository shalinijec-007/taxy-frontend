import { useState } from "react";

function TaxyChat() {

  const [isTaxyChatOpen, setIsTaxyChatOpen] = useState(false);

  return (
    <>
      {/* Chat window */}
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
            <p>
              👋 Hi! I'm Taxy.
              Ask me anything about taxes!
            </p>
          </div>

        </div>
      )}

      {/* Floating button */}
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