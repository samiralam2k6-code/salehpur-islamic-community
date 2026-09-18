import './App.css'

function App() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <h1>🕌 Salehpur Islamic Community</h1>
        <p>Transparency • Unity • Community Service</p>
      </header>

      {/* Navigation */}
      <nav className="navbar">
        <a href="#home">Home</a>
        <a href="#namaz">Namaz</a>
        <a href="#calendar">Islamic Calendar</a>
        <a href="#quran">Quran & Hadith</a>
        <a href="#funds">Funds</a>
        <a href="#projects">Projects</a>
        <a href="#announcements">Announcements</a>
        <a href="#gallery">Gallery</a>
        <a href="#donation">Donation</a>
        <a href="#contact">Contact</a>
      </nav>

      {/* Home */}
      <section id="home" className="hero-section">
        <h2>Assalamu Alaikum</h2>
        <p>
          Welcome to the official community website of Salehpur.
        </p>
        <p>
          Yahan community ke funds, projects aur announcements
          transparent tareeke se dekhe ja sakte hain.
        </p>
      </section>
      {/* Namaz Timings */}
<section id="namaz" className="section">
  <h2>🕌 Namaz Timings</h2>

  <div className="prayer-grid">
    <div className="prayer-card">
      <h3>Fajr</h3>
      <p>5:00 AM</p>
    </div>

    <div className="prayer-card">
      <h3>Dhuhr</h3>
      <p>1:30 PM</p>
    </div>

    <div className="prayer-card">
      <h3>Asr</h3>
      <p>4:45 PM</p>
    </div>

    <div className="prayer-card">
      <h3>Maghrib</h3>
      <p>Sunset</p>
    </div>

    <div className="prayer-card">
      <h3>Isha</h3>
      <p>8:00 PM</p>
    </div>

    <div className="prayer-card">
      <h3>Jummah</h3>
      <p>1:30 PM</p>
    </div>
  </div>
</section>
{/* Islamic Calendar */}
<section id="calendar" className="section">
  <h2>🌙 Islamic Calendar</h2>

  <div className="calendar-box">
    <h3>Hijri Calendar</h3>
    <p>
  {new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())}
</p>

    <h3>Important Islamic Dates</h3>
    <p>Ramadan • Eid-ul-Fitr • Eid-ul-Adha • Muharram</p>
  </div>
</section>
{/* Quran & Hadith */}
<section id="quran" className="section">
  <h2>📖 Quran & Hadith</h2>

  <div className="quran-box">
    <h3>Quran</h3>
    <p>Daily Quran verse yahan display hoga.</p>

    <h3>Hadith</h3>
    <p>Daily Hadith yahan display hoga.</p>
  </div>
</section>

      {/* Funds */}
      <section id="funds" className="section">
        <h2>💰 Community Funds</h2>
        
<p className="fund-updated">Last Updated: 18 Sep 2026</p>

        <div className="stats">
          <div className="card">
            <h3>₹ 2,50,000</h3>
            <p>Total Jama</p>
          </div>

          <div className="card">
            <h3>₹ 1,40,000</h3>
            <p>Total Kharch</p>
          </div>

          <div className="card">
            <h3>₹ 1,10,000</h3>
            <p>Current Balance</p>
          </div>
        </div>
        <div className="expense-table">
  <h3>📋 Expense Details</h3>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Expense</th>
        <th>Amount</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>10 Sep 2026</td>
        <td>Masjid Renovation</td>
        <td>₹80,000</td>
      </tr>

      <tr>
        <td>05 Sep 2026</td>
        <td>Electricity & Maintenance</td>
        <td>₹25,000</td>
      </tr>

      <tr>
        <td>01 Sep 2026</td>
        <td>Wuzu Area Work</td>
        <td>₹35,000</td>
      </tr>
    </tbody>
  </table>
</div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <h2>🏗️ Current Projects</h2>

        <div className="project-card">
  <h3>🕌 Masjid Renovation</h3>
  <p>Target: ₹5,00,000</p>
  <p>Collected: ₹2,00,000</p>

  <div className="progress-bar">
    <div className="progress-fill" style={{ width: '40%' }}></div>
  </div>

  <p>40% Completed</p>
</div>

        <div className="project-card">
  <h3>🚿 Wuzu Area</h3>
  <p>Target: ₹1,50,000</p>
  <p>Collected: ₹80,000</p>

  <div className="progress-bar">
    <div className="progress-fill" style={{ width: '53%' }}></div>
  </div>

  <p>53% Completed</p>
</div>
      </section>

      {/* Announcements */}
      <section id="announcements" className="section">
        <h2>📢 Announcements</h2>

        <div className="announcement">
          <h3>Jumma Namaz</h3>
          <p>Jumma prayer timing: 1:30 PM</p>
        </div>

        <div className="announcement">
          <h3>Community Meeting</h3>
          <p>Monthly community meeting will be announced here.</p>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="section">
        <h2>📸 Gallery</h2>

        <div className="gallery-grid">
  <div className="gallery-card">
    <div className="gallery-placeholder">🕌</div>
    <p>Masjid</p>
  </div>

  <div className="gallery-card">
    <div className="gallery-placeholder">🤝</div>
    <p>Community Work</p>
  </div>

  <div className="gallery-card">
    <div className="gallery-placeholder">📚</div>
    <p>Islamic Activities</p>
  </div>
</div>
      </section>

      {/* Donation */}
<section id="donation" className="section donation">
  <h2>💚 Support Our Community</h2>

  <p>
    Community projects aur welfare activities mein contribution
    karne ke liye committee se contact karein.
  </p>

  <div className="donation-box">
    <h3>Donation Information</h3>
    <p><strong>UPI:</strong> Coming Soon</p>
    <p><strong>Bank Details:</strong> Coming Soon</p>
    <p><strong>Contact:</strong> Community Committee</p>
  </div>
</section>
      {/* Contact */}
      <section id="contact" className="section contact">
        <h2>📍 Contact & Location</h2>
        <p><strong>Village:</strong> Salehpur</p>
        <p><strong>Masjid:</strong> Salehpur Masjid</p>
        <p><strong>Contact:</strong> Community Committee</p>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2026 Salehpur Islamic Community</p>
        <p>Transparency • Unity • Community Service</p>
      </footer>
    </div>
  )
}

export default App