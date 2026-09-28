import KidProfileForm from "./components/KidProfileForm";
import TaxyChat from "./components/TaxyChat";
import "./App.css";

function App() {

  return (
    <div className="app">

      {/* Top navigation */}
      <header className="header">

        <div className="logo">
          💰 TAXY
        </div>

        <div className="xp-badge">
          ⭐ 0 XP
        </div>

      </header>

      {/* Main game area */}
      <main className="main-content">

        <section className="game-panel">

          {/* Hero section */}
          <div className="hero">

            <div className="hero-icon">🚀</div>

            <h1>
              Ready for a
              <br />
              Money Adventure?
            </h1>

            <p>
              Learn how money and taxes work through
              <br />
              games, stories, and challenges!
            </p>

          </div>

          {/* Kid profile form */}
          <KidProfileForm />
		  <TaxyChat />

          {/* Game benefits */}
          <div className="features">

            <div className="feature">
              <span>📚</span>
              <strong>Learn</strong>
            </div>

            <div className="feature">
              <span>⭐</span>
              <strong>Earn XP</strong>
            </div>

            <div className="feature">
              <span>🏆</span>
              <strong>Level Up</strong>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;