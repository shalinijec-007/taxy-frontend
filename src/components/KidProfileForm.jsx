import { useState } from "react";

function KidProfileForm({ onProfileLoaded }) {
	

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [missionStarted, setMissionStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userType, setUserType] = useState(null);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [lessonAlreadyCompleted, setLessonAlreadyCompleted] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  
  const handleSubmit = async () => {

    // Create the request body expected by Spring Boot
    const kidProfile = {
      name: name,
	  username: username,
      age: Number(age)
    };

    try {

      // Send HTTP POST request to our Spring Boot application
      const response = await fetch(
        "http://localhost:8080/api/kids",
        {
          method: "POST",

          // Tell Spring Boot that we are sending JSON
          headers: {
            "Content-Type": "application/json"
          },

          // Convert JavaScript object into JSON
          body: JSON.stringify(kidProfile)
        }
      );

	  // Convert Spring Boot JSON response into a JavaScript object
	  const data = await response.json();

	  setProfile(data);
	  onProfileLoaded(data);

	  console.log("Profile created:", data);

    } catch (error) {

      // This runs if React cannot reach the backend
      console.error("Error creating profile:", error);
    }
  };
  
  // Load an existing kid using the username
  const handleWelcomeBack = async () => {

    try {

      const response = await fetch(
        `http://localhost:8080/api/kids/username/${username}`
      );

      // Convert Spring Boot response to JavaScript object
      const data = await response.json();

      // Store the existing profile
      setProfile(data);

      console.log("Existing profile:", data);

    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };
  
  // Save the XP earned from the completed lesson
  const handleCollectXp = async () => {

    try {

      const response = await fetch(
        `http://localhost:8080/api/kids/${profile.id}/xp?lessonId=${lessons[0].id}&earnedXp=${lessons[0].xpReward}`,
        {
          method: "PUT"
        }
      );

      // Get the updated profile from Spring Boot
      const updatedProfile = await response.json();

      // Update React with the new XP value
      setProfile(updatedProfile);
      setMissionCompleted(true);
      console.log("XP updated:", updatedProfile);

    } catch (error) {
      console.error("Error updating XP:", error);
    }
  };
  
  // Runs when the kid clicks "Start Learning"
  const handleStartLearning = async () => {
	console.log("Current profile:", profile);
	console.log("Age being sent:", profile.age);

    try {

      // Ask Spring Boot for lessons suitable for this kid's age
      const response = await fetch(
        `http://localhost:8080/api/lessons?age=${profile.age}`
      );

      // Convert the JSON response into a JavaScript array
      const data = await response.json();

      // Store the lessons in React state
      setLessons(data);
	  // If a lesson was found, check whether this kid already completed it
	  if (data.length > 0) {

	    const progressResponse = await fetch(
	      `http://localhost:8080/api/progress/${profile.id}/lessons/${data[0].id}`
	    );

	    const completed = await progressResponse.json();

	    setLessonAlreadyCompleted(completed);

	    console.log("Lesson already completed:", completed);
	  }

      console.log("Lessons:", data);

    } catch (error) {

      console.error("Error loading lessons:", error);
    }
  };
  
  const handleAskTaxy = async () => {

    if (!aiQuestion.trim()) {
      return;
    }

    setAiLoading(true);
    setAiAnswer("");

    try {

      const response = await fetch(
        "http://localhost:8080/api/ai/explain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: aiQuestion,
            age: profile.age
          })
        }
      );

      const answer = await response.text();

      setAiAnswer(answer);

    } catch (error) {

      console.error("Error asking Taxy:", error);

      setAiAnswer(
        "Sorry, Taxy could not answer right now."
      );

    } finally {

      setAiLoading(false);
    }
  };
  
  // If lessons have been loaded,
  // show the first lesson instead of the profile screen.
  if (lessons.length > 0) {

    const lesson = lessons[0];
	
	if (lessonAlreadyCompleted) {
	  return (
	    <div className="profile-card">
	      <h2>✅ Mission Already Completed!</h2>

	      <h3>🍋 {lesson.title}</h3>

	      <p>
	        Great job, {profile.name}! You have already completed this mission.
	      </p>

	      <div className="lesson-reward">
	        ⭐ Reward already collected
	      </div>

	      <div className="player-stats">
	        <div>
	          <span>⭐</span>
	          <strong>Level {profile.level}</strong>
	        </div>

	        <div>
	          <span>⚡</span>
	          <strong>{profile.totalXp} XP</strong>
	        </div>
	      </div>
	    </div>
	  );
	}
	// Show this screen after the kid successfully collects the XP
	if (missionCompleted) {
	  return (
	    <div className="profile-card">

	      <h2>🎉 Mission Complete!</h2>

	      <h3>🍋 {lesson.title}</h3>

	      <p>
	        Great job, {profile.name}! You completed your first mission.
	      </p>

	      <div className="lesson-reward">
	        ⭐ +{lesson.xpReward} XP Earned!
	      </div>

	      <div className="player-stats">
	        <div>
	          <span>⭐</span>
	          <strong>Level {profile.level}</strong>
	        </div>

	        <div>
	          <span>⚡</span>
	          <strong>{profile.totalXp} XP</strong>
	        </div>
	      </div>

	    </div>
	  );
	}
	// If the kid has started the mission,
	// show the lesson activity instead of the mission card.
	if (missionStarted) {

	  return (
	    <div className="profile-card">

	      <h2>🍋 {lesson.title}</h2>

	      <p>
	        Imagine you open a lemonade stand in your neighborhood.
	      </p>

	      <p>
	        You sell lemonade and earn <strong>$20</strong>. 🎉
	      </p>

	      <p>
	        Your town uses tax money to help pay for things
	        everyone uses, like roads, parks, and schools.
	      </p>

	      <h3>🤔 Quick Question</h3>

	      <p>Why do people pay taxes?</p>

		  <button
		    type="button"
		    className="answer-button"
		    onClick={() => setSelectedAnswer("A")}
		  >
	        A. To help pay for public services
	      </button>
		  

		  <button
		    type="button"
		    className="answer-button"
		    onClick={() => setSelectedAnswer("B")}
		  >
	        B. To make money disappear
	      </button>

		  <button
		    type="button"
		    className="answer-button"
		    onClick={() => setSelectedAnswer("C")}
		  >
	        C. Because shops keep all the tax money
	      </button>
		  
		  {/* Show feedback below all answer choices */}
		  {selectedAnswer === "A" && (
		    <div className="answer-feedback">

		      <p>
		        🎉 Correct! Taxes help pay for public services like
		        roads, schools, and parks.
		      </p>

		      <button
		        type="button"
		        className="adventure-button"
				onClick={handleCollectXp}
		      >
		        Collect +{lesson.xpReward} XP ⭐
		      </button>

		    </div>
		  )}
		  {/* Show friendly feedback for an incorrect answer */}
		  {(selectedAnswer === "B" || selectedAnswer === "C") && (
		    <div className="answer-feedback">
		      🤔 Not quite! Try again.
		    </div>
		  )}
		  
	    </div>
	  );
	}

    return (
      <div className="profile-card">

        {/* Mission heading */}
        <h2>📚 Your First Mission</h2>

        {/* Lesson title */}
        <h3>🍋 {lesson.title}</h3>

        {/* Lesson description */}
        <p>{lesson.description}</p>

        {/* XP reward coming from Spring Boot */}
        <div className="lesson-reward">
          ⭐ Reward: +{lesson.xpReward} XP
        </div>

        <button
          type="button"
          className="adventure-button"
		  		  onClick={() => setMissionStarted(true)}
        >
          Begin Mission →
        </button>

      </div>
    );
  }
  // If a profile has already been created,
  // show the welcome screen instead of the form.
  if (profile) {

    return (
      <div className="profile-card">

        {/* Celebrate successful profile creation */}
        <h2>🎉 Welcome, {profile.name}!</h2>

        <p>
          Your money adventure is ready to begin!
        </p>

        {/* Information returned by Spring Boot */}
        <div className="player-stats">

          <div>
            <span>⭐</span>
            <strong>Level {profile.level}</strong>
          </div>

          <div>
            <span>⚡</span>
            <strong>{profile.totalXp} XP</strong>
          </div>

        </div>

        {/* Load age-appropriate lessons */}
        <button
          type="button"
          className="adventure-button"
		  		  onClick={handleStartLearning}
        >
          Start Learning 🚀
        </button>

      </div>
    );
  }

  // First screen: new or returning Taxy user
  if (userType === null) {
    return (
      <div className="profile-card">
        <h2>👋 Welcome to Taxy!</h2>

        <p>Ready for your money adventure?</p>

        <button
          type="button"
          className="adventure-button"
          onClick={() => setUserType("new")}
        >
          🌟 New to Taxy
        </button>

        <button
          type="button"
          className="adventure-button"
          onClick={() => setUserType("returning")}
        >
          👋 Welcome Back
        </button>
      </div>
    );
  }
  
  // Returning kid: only ask for the existing username
  if (userType === "returning") {
    return (
      <div className="profile-card">

        <h2>👋 Welcome Back!</h2>

        <p>Enter your username to continue your adventure.</p>

        <div className="profile-form">

          <label htmlFor="returningUsername">
            🌟 Username:
          </label>

          <input
            id="returningUsername"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

        </div>

        <button
          type="button"
          className="adventure-button"
          onClick={handleWelcomeBack}
        >
          🚀 Continue My Adventure
        </button>

      </div>
    );
  }
  
  return (
    <div className="profile-card">

      {/* Profile section heading */}
      <h2>👋 Let's Get to Know You!</h2>

      {/* Grid keeps labels and inputs perfectly aligned */}
      <div className="profile-form">

        {/* Name row */}
        <label htmlFor="name">👧 Name:</label>

        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

		<label htmlFor="username">🌟 Username:</label>
		<input
		  id="username"
		  type="text"
		  placeholder="Choose a username"
		  value={username}
		  onChange={(event) => setUsername(event.target.value)}
		/>
		
        {/* Age row */}
        <label htmlFor="age">🎂 Age:</label>

        <input
          id="age"
          type="number"
          placeholder="Enter your age"
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />

      </div>

      {/* Adventure button */}
      <button
        className="adventure-button"
        type="button"
        onClick={handleSubmit}
      >
        🚀 Start My Tax Adventure!
      </button>

    </div>
  );
}

export default KidProfileForm;