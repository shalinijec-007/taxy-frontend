import { useState } from "react";

function KidProfileForm() {

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [missionStarted, setMissionStarted] = useState(false);
  const handleSubmit = async () => {

    // Create the request body expected by Spring Boot
    const kidProfile = {
      name: name,
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

	  // Save the returned profile into React state
	  setProfile(data);

	  console.log("Profile created:", data);

    } catch (error) {

      // This runs if React cannot reach the backend
      console.error("Error creating profile:", error);
    }
  };
  
  // Runs when the kid clicks "Start Learning"
  const handleStartLearning = async () => {

    try {

      // Ask Spring Boot for lessons suitable for this kid's age
      const response = await fetch(
        `http://localhost:8080/api/lessons?age=${profile.age}`
      );

      // Convert the JSON response into a JavaScript array
      const data = await response.json();

      // Store the lessons in React state
      setLessons(data);

      console.log("Lessons:", data);

    } catch (error) {

      console.error("Error loading lessons:", error);
    }
  };
  
  // If lessons have been loaded,
  // show the first lesson instead of the profile screen.
  if (lessons.length > 0) {

    const lesson = lessons[0];

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