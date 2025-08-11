export default function Page() {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.6",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          padding: "2rem",
          backgroundColor: "#F5F5DC",
          borderRadius: "12px",
          border: "1px solid #1B2951",
        }}
      >
        <h1
          style={{
            color: "#1B2951",
            fontSize: "2.5rem",
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          📱 Startup Connect
        </h1>
        <p
          style={{
            color: "#6B7280",
            fontSize: "1.2rem",
            margin: "0",
          }}
        >
          React Native Mobile App
        </p>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1B2951", marginBottom: "1rem" }}>About This App</h2>
        <p style={{ color: "#6B7280", marginBottom: "1rem" }}>
          Startup Connect is a mobile application built with React Native and Expo SDK 53. It's designed as a "Tinder
          for startups" that connects students and job seekers with startup opportunities.
        </p>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1B2951", marginBottom: "1rem" }}>Key Features</h2>
        <ul style={{ color: "#6B7280", paddingLeft: "1.5rem" }}>
          <li>
            <strong>Google Authentication:</strong> Secure login with Google OAuth
          </li>
          <li>
            <strong>Resume Upload:</strong> Multi-format file support with validation
          </li>
          <li>
            <strong>Swipeable Feed:</strong> Tinder-style interface for browsing startups
          </li>
          <li>
            <strong>Applications Management:</strong> Track and manage job applications
          </li>
          <li>
            <strong>Analytics Dashboard:</strong> Monitor application performance
          </li>
          <li>
            <strong>Profile Management:</strong> User settings and preferences
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1B2951", marginBottom: "1rem" }}>How to Run</h2>
        <div
          style={{
            backgroundColor: "#F3F4F6",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <p style={{ color: "#1B2951", margin: "0 0 1rem 0", fontWeight: "600" }}>1. Download the project files</p>
          <p style={{ color: "#1B2951", margin: "0 0 1rem 0", fontWeight: "600" }}>2. Install dependencies:</p>
          <code
            style={{
              backgroundColor: "#1B2951",
              color: "white",
              padding: "0.5rem",
              borderRadius: "4px",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            npm install
          </code>
          <p style={{ color: "#1B2951", margin: "0 0 1rem 0", fontWeight: "600" }}>3. Start the development server:</p>
          <code
            style={{
              backgroundColor: "#1B2951",
              color: "white",
              padding: "0.5rem",
              borderRadius: "4px",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            npx expo start
          </code>
          <p style={{ color: "#1B2951", margin: "0", fontWeight: "600" }}>
            4. Use Expo Go app on your phone or iOS/Android simulator
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1B2951", marginBottom: "1rem" }}>Tech Stack</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#F5F5DC",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
            }}
          >
            <h3 style={{ color: "#1B2951", margin: "0 0 0.5rem 0" }}>Frontend</h3>
            <ul style={{ color: "#6B7280", margin: "0", paddingLeft: "1rem" }}>
              <li>React Native</li>
              <li>Expo SDK 53</li>
              <li>TypeScript</li>
            </ul>
          </div>
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#F5F5DC",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
            }}
          >
            <h3 style={{ color: "#1B2951", margin: "0 0 0.5rem 0" }}>Navigation</h3>
            <ul style={{ color: "#6B7280", margin: "0", paddingLeft: "1rem" }}>
              <li>React Navigation</li>
              <li>Stack Navigator</li>
              <li>Tab Navigator</li>
            </ul>
          </div>
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#F5F5DC",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
            }}
          >
            <h3 style={{ color: "#1B2951", margin: "0 0 0.5rem 0" }}>Features</h3>
            <ul style={{ color: "#6B7280", margin: "0", paddingLeft: "1rem" }}>
              <li>Google OAuth</li>
              <li>File Upload</li>
              <li>Swipe Gestures</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "#F3F4F6",
          borderRadius: "8px",
          marginTop: "2rem",
        }}
      >
        <p style={{ color: "#6B7280", margin: "0" }}>
          This is a mobile app preview. To see the full functionality, download the code and run it with Expo on your
          mobile device.
        </p>
      </div>
    </div>
  )
}
