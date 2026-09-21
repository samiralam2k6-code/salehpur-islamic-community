import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'
console.log("SUPABASE KEY LOADED:", !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

function App() {
  const [user, setUser] = useState(null)
  const [activeView, setActiveView] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [namaz, setNamaz] = useState(null)
  const [community, setCommunity] = useState(null)
  const [siteContent, setSiteContent] = useState(null)
  const [fundSettings, setFundSettings] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [projects, setProjects] = useState([])
  const [gallery, setGallery] = useState([])

  const [members, setMembers] = useState([])
  const [payments, setPayments] = useState([])
  const [salary, setSalary] = useState(9000)

  const [loading, setLoading] = useState(true)

  // =========================
  // AUTH
  // =========================

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // =========================
  // LOAD WEBSITE DATA
  // =========================

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)

    const [
      namazResult,
      communityResult,
      siteResult,
      fundResult,
      expensesResult,
      projectsResult,
      galleryResult,
      membersResult,
      paymentsResult,
      salaryResult,
    ] = await Promise.all([
      supabase.from('namaz_timings').select('*').eq('id', 1).single(),

      supabase
        .from('community_info')
        .select('*')
        .eq('id', 1)
        .single(),

      supabase
        .from('site_content')
        .select('*')
        .eq('id', 1)
        .single(),

      supabase
        .from('fund_settings')
        .select('*')
        .eq('id', 1)
        .single(),

      supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false }),

      supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true }),

      supabase
        .from('gallery')
        .select('*')
        .order('id', { ascending: false }),

      supabase
        .from('members')
        .select('*')
        .order('id', { ascending: true }),

      supabase
        .from('Monthly_payments')
        .select('*')
        .order('month', { ascending: true }),

      supabase
        .from('imam_salary')
        .select('*')
        .order('month', { ascending: false })
        .limit(1),
    ])

    if (namazResult.data) setNamaz(namazResult.data)
    if (communityResult.data) setCommunity(communityResult.data)
    if (siteResult.data) setSiteContent(siteResult.data)
    if (fundResult.data) setFundSettings(fundResult.data)

    setExpenses(expensesResult.data || [])
    setProjects(projectsResult.data || [])
    setGallery(galleryResult.data || [])
    setMembers(membersResult.data || [])
    setPayments(paymentsResult.data || [])

    if (salaryResult.data?.length) {
      setSalary(Number(salaryResult.data[0].amount))
    }

    setLoading(false)
  }

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setLoginError(error.message)
      return
    }

    setShowLogin(false)
    setActiveView('admin')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setActiveView('home')
  }

  // =========================
  // HELPERS
  // =========================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`
  }

  const goHome = () => {
    setActiveView('home')
    setMenuOpen(false)
  }

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  )

  const totalJama = Number(fundSettings?.total_jama || 0)
  const currentBalance = totalJama - totalExpenses

  const hijriDate = new Intl.DateTimeFormat(
    'en-u-ca-islamic-umalqura',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(new Date())

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="app">
        <div className="section">
          <h2>Loading...</h2>
          <p>Website data load ho raha hai.</p>
        </div>
      </div>
    )
  }

  // =========================
  // SEPARATE NAMAZ VIEW
  // =========================

  if (activeView === 'namaz') {
    return (
      <div className="app">
        <button className="menu-button" onClick={goHome}>
          ← Back
        </button>

        <section className="section">
          <h2>🕌 Namaz Timings</h2>

          <div className="prayer-grid">
            <Prayer name="Fajr" time={namaz?.fajr} />
            <Prayer name="Dhuhr" time={namaz?.dhuhr} />
            <Prayer name="Asr" time={namaz?.asr} />
            <Prayer name="Maghrib" time={namaz?.maghrib} />
            <Prayer name="Isha" time={namaz?.isha} />
            <Prayer name="Jummah" time={namaz?.jummah} />
          </div>
        </section>
      </div>
    )
  }

  // =========================
  // SEPARATE FUNDS VIEW
  // =========================

  if (activeView === 'funds') {
    return (
      <div className="app">
        <button className="menu-button" onClick={goHome}>
          ← Back
        </button>

        <section className="section">
          <h2>💰 Community Funds</h2>

          <div className="stats">
            <div className="card">
              <h3>{formatCurrency(totalJama)}</h3>
              <p>Total Jama</p>
            </div>

            <div className="card">
              <h3>{formatCurrency(totalExpenses)}</h3>
              <p>Total Kharch</p>
            </div>

            <div className="card">
              <h3>{formatCurrency(currentBalance)}</h3>
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
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.expense_date}</td>
                    <td>{expense.title}</td>
                    <td>{formatCurrency(expense.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }

  // =========================
  // SEPARATE PROJECTS VIEW
  // =========================

  if (activeView === 'projects') {
    return (
      <div className="app">
        <button className="menu-button" onClick={goHome}>
          ← Back
        </button>

        <section className="section">
          <h2>🏗️ Current Projects</h2>

          {projects.map((project) => {
            const target = Number(project.target_amount || 0)
            const collected = Number(project.collected_amount || 0)

            const percentage =
              target > 0
                ? Math.min(Math.round((collected / target) * 100), 100)
                : 0

            return (
              <div className="project-card" key={project.id}>
                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <p>Target: {formatCurrency(target)}</p>
                <p>Collected: {formatCurrency(collected)}</p>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p>{percentage}% Completed</p>
              </div>
            )
          })}
        </section>
      </div>
    )
  }

  // =========================
  // SEPARATE GALLERY VIEW
  // =========================

  if (activeView === 'gallery') {
    return (
      <div className="app">
        <button className="menu-button" onClick={goHome}>
          ← Back
        </button>

        <section className="section">
          <h2>📸 Gallery</h2>

          <div className="gallery-grid">
            {gallery.length === 0 ? (
              <p>No gallery photos added yet.</p>
            ) : (
              gallery.map((item) => (
                <div className="gallery-card" key={item.id}>
                  {item.image_path ? (
                    <img
                      src={item.image_path}
                      alt={item.title}
                    />
                  ) : (
                    <div className="gallery-placeholder">
                      📸
                    </div>
                  )}

                  <p>{item.title}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    )
  }

  // =========================
  // SEPARATE MADARSA VIEW
  // =========================

  if (activeView === 'madarsa') {
    return (
      <MadarsaView
  members={members}
  payments={payments}
  salary={salary}
  user={user}
  goHome={goHome}
/>
    )
  }

  // =========================
  // SEPARATE CALENDAR VIEW
  // =========================

  if (activeView === 'calendar') {
    return (
      <div className="app">
        <button className="menu-button" onClick={goHome}>
          ← Back
        </button>

        <section className="section">
          <h2>🌙 Islamic Calendar</h2>

          <div className="calendar-box">
            <h3>Hijri Date</h3>
            <p>{hijriDate}</p>

            <h3>Important Islamic Dates</h3>

            <p>
              Ramadan • Eid-ul-Fitr • Eid-ul-Adha • Muharram
            </p>
          </div>
        </section>
      </div>
    )
  }

  // =========================
  // ADMIN PANEL
  // =========================

  if (activeView === 'admin') {
    if (!user) {
      setActiveView('home')
      return null
    }

    return (
      <AdminPanel
        user={user}
        namaz={namaz}
        community={community}
        siteContent={siteContent}
        fundSettings={fundSettings}
        expenses={expenses}
        projects={projects}
        gallery={gallery}
        members={members}
        payments={payments}
        salary={salary}
        reload={loadAllData}
        goHome={goHome}
      />
    )
  }

  // =========================
  // HOME
  // =========================

  return (
    <div className="app">
      <header className="header">
        <h1>
          {siteContent?.site_title || '🕌 Salehpur Islamic Community'}
        </h1>

        <p>
          {siteContent?.site_subtitle ||
            'Transparency • Unity • Community Service'}
        </p>
      </header>

      <nav className="navbar">
        <button
          className="menu-button"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        <button
          className="nav-link-button"
          onClick={goHome}
        >
          Home
        </button>

        <button
          className="nav-link-button"
          onClick={() => setActiveView('namaz')}
        >
          Namaz
        </button>

        <button
          className="nav-link-button"
          onClick={() => setActiveView('madarsa')}
        >
          📚 Madarsa
        </button>

        <button
          className="nav-link-button"
          onClick={() => setActiveView('funds')}
        >
          Funds
        </button>

        <button
          className="nav-link-button"
          onClick={() => setActiveView('gallery')}
        >
          Gallery
        </button>
      </nav>

      {showLogin && (
        <div className="login-overlay">
          <div className="login-box">
            <h2>🔐 Admin Login</h2>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">Login</button>
            </form>

            {loginError && (
              <p style={{ color: 'red' }}>{loginError}</p>
            )}

            <button onClick={() => setShowLogin(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {menuOpen && (
        <>
          <div
            className="menu-overlay"
            onClick={() => setMenuOpen(false)}
          />

          <div className="side-menu">
            <button
              className="menu-close"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>

            <h2>Menu</h2>

            <button
              className="menu-admin-button"
              onClick={() => {
                setActiveView('calendar')
                setMenuOpen(false)
              }}
            >
              🌙 Islamic Calendar
            </button>

            <button
              className="menu-admin-button"
              onClick={() => {
                setActiveView('projects')
                setMenuOpen(false)
              }}
            >
              🏗️ Projects
            </button>

            <button
              className="menu-admin-button"
              onClick={() => {
                setActiveView('gallery')
                setMenuOpen(false)
              }}
            >
              📸 Gallery
            </button>

            <a
              href={
                community?.masjid_map_url ||
                'https://maps.app.goo.gl/EupH6DhsqzYYCZtMA?g_st=ac'
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              📍 Masjid Location
            </a>

            <button
              className="menu-admin-button"
              onClick={() => {
                setMenuOpen(false)
                document
                  .getElementById('about')
                  ?.scrollIntoView()
              }}
            >
              ℹ️ About Community
            </button>

            <button
              className="menu-admin-button"
              onClick={() => {
                setMenuOpen(false)
                document
                  .getElementById('contact')
                  ?.scrollIntoView()
              }}
            >
              📞 Contact
            </button>

            {user ? (
              <>
                <button
                  className="menu-admin-button"
                  onClick={() => {
                    setActiveView('admin')
                    setMenuOpen(false)
                  }}
                >
                  🛠️ Admin Panel
                </button>

                <button
                  className="menu-admin-button"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <button
                className="menu-admin-button"
                onClick={() => {
                  setShowLogin(true)
                  setMenuOpen(false)
                }}
              >
                🔐 Admin Login
              </button>
            )}
          </div>
        </>
      )}

      <section className="hero-section">
        <h2>
          {siteContent?.home_heading || 'Assalamu Alaikum'}
        </h2>

        <p>
          {siteContent?.home_text1 ||
            'Welcome to the official community website of Salehpur.'}
        </p>

        <p>
          {siteContent?.home_text2 ||
            'Yahan community ke funds, projects aur zaroori information transparent tareeke se dekhe ja sakte hain.'}
        </p>
      </section>

      <section className="section">
        <h2>🕌 Namaz Timings</h2>

        <div className="prayer-grid">
          <Prayer name="Fajr" time={namaz?.fajr} />
          <Prayer name="Dhuhr" time={namaz?.dhuhr} />
          <Prayer name="Asr" time={namaz?.asr} />
          <Prayer name="Maghrib" time={namaz?.maghrib} />
          <Prayer name="Isha" time={namaz?.isha} />
          <Prayer name="Jummah" time={namaz?.jummah} />
        </div>
      </section>

      <section className="section">
        <h2>💰 Community Funds</h2>

        <div className="stats">
          <div className="card">
            <h3>{formatCurrency(totalJama)}</h3>
            <p>Total Jama</p>
          </div>

          <div className="card">
            <h3>{formatCurrency(totalExpenses)}</h3>
            <p>Total Kharch</p>
          </div>

          <div className="card">
            <h3>{formatCurrency(currentBalance)}</h3>
            <p>Current Balance</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>📸 Gallery</h2>

        <div className="gallery-grid">
          {gallery.length === 0 ? (
            <p>No gallery photos added yet.</p>
          ) : (
            gallery.slice(0, 3).map((item) => (
              <div className="gallery-card" key={item.id}>
                {item.image_path ? (
                  <img
                    src={item.image_path}
                    alt={item.title}
                  />
                ) : (
                  <div className="gallery-placeholder">
                    📸
                  </div>
                )}

                <p>{item.title}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section">
        <h2>📚 Madarsa</h2>

        <div
          className="project-card"
          onClick={() => setActiveView('madarsa')}
          style={{ cursor: 'pointer' }}
        >
          <h3>📚 Madarsa</h3>

          <p>
            Madarsa aur monthly fund details dekhne ke liye tap karein.
          </p>
        </div>
      </section>

      <section id="about" className="section">
        <h2>ℹ️ About Community</h2>

        <div className="calendar-box">
          <h3>
            {community?.about_title || 'Salehpur Islamic Community'}
          </h3>

          <p>{community?.about_text1}</p>
          <p>{community?.about_text2}</p>
        </div>
      </section>

      <section id="contact" className="section contact">
        <h2>📍 Contact & Location</h2>

        <p>
          <strong>Village:</strong> {community?.village || 'Salehpur'}
        </p>

        <p>
          <strong>Masjid:</strong>{' '}
          {community?.masjid || 'Salehpur Masjid'}
        </p>

        <p>
          <strong>Contact:</strong>{' '}
          {community?.contact || 'Community Committee'}
        </p>
      </section>

      <footer>
        <p>© 2026 Salehpur Islamic Community</p>
        <p>Transparency • Unity • Community Service</p>
      </footer>
    </div>
  )
}

// =========================
// PRAYER CARD
// =========================

function Prayer({ name, time }) {
  return (
    <div className="prayer-card">
      <h3>{name}</h3>
      <p>{time || '-'}</p>
    </div>
  )
}

// =========================
// STORAGE URL
// =========================

function getStorageUrl(bucket, path) {
  if (!path) return ''

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

// =========================
// MADARSA VIEW
// =========================

function MadarsaView({
  members,
  payments,
  salary,
  user,
  goHome,
}) {
  const [isAdmin, setIsAdmin] = useState(false)

useEffect(() => {
  const checkAdmin = async () => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    const { data, error } = await supabase.rpc('is_admin')

    if (error) {
      console.error(error)
      setIsAdmin(false)
      return
    }

    setIsAdmin(data === true)
  }

  checkAdmin()
}, [user])
  const months = []
  const editPayment = async (payment) => {
  const newAmount = prompt(
    'Chanda amount:',
    payment.amount
  )

  if (newAmount === null) return

  if (!newAmount.trim() || Number(newAmount) < 0) {
    alert('Valid amount enter karo.')
    return
  }

  const { error } = await supabase
    .from('Monthly_payments')
    .update({
      amount: Number(newAmount),
      status: 'paid',
    })
    .eq('id', payment.id)

  if (error) {
    alert(error.message)
    return
  }

  window.location.reload()
}

  const start = new Date(2026, 8, 1)
  const current = new Date()

  const end = new Date(
    current.getFullYear(),
    current.getMonth() + 12,
    1
  )

  const date = new Date(start)

  while (date <= end) {
    months.push(
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`
    )

    date.setMonth(date.getMonth() + 1)
  }

  const formatMonth = (month) => {
    const [year, monthNumber] = month.split('-')

    return new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    ).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="app">
      <button className="menu-button" onClick={goHome}>
        ← Back
      </button>

      <section className="section">
        <h2>📚 Madarsa</h2>

        <div className="calendar-box">
          <h3>
            🕌 Imam Sahab Monthly Salary: ₹
            {Number(salary || 0).toLocaleString('en-IN')}
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>

                  {months.map((month) => (
                    <th key={month}>
                      {formatMonth(month)}
                    </th>
                  ))}

                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => {
                  const memberPayments = payments.filter(
                    (payment) =>
                      String(payment.member_id) ===
                      String(member.id)
                  )

                  const total = memberPayments.reduce(
                    (sum, payment) =>
                      sum + Number(payment.amount || 0),
                    0
                  )

                  return (
                    <tr key={member.id}>
                      <td>
                        <strong>{member.name}</strong>
                      </td>

                      {months.map((month) => {
                        const payment = memberPayments.find(
                          (p) =>
                            String(p.month).slice(0, 7) ===
                            month
                        )

                        return (
                          <td key={month}>
                            {payment
  ? (
      <>
        ₹{Number(payment.amount).toLocaleString('en-IN')} Paid

        {isAdmin && (
  <button
    type="button"
    onClick={() => editPayment(payment)}
    style={{ marginLeft: '6px' }}
  >
    ✏️
  </button>
)}
      </>
    )
  : ''}
                          </td>
                        )
                      })}

                      <td>
                        <strong>
                          ₹{total.toLocaleString('en-IN')}
                        </strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>

              <tfoot>
                <tr>
                  <th>Total</th>

                  {months.map((month) => {
                    const monthTotal = payments
  .filter(
    (payment) =>
      String(payment.month).slice(0, 7) === month &&
      members.some(
        (member) =>
          String(member.id) === String(payment.member_id)
      )
  )
                      .reduce(
                        (sum, payment) =>
                          sum + Number(payment.amount || 0),
                        0
                      )

                    return (
                      <th key={month}>
                        ₹{monthTotal.toLocaleString('en-IN')}
                      </th>
                    )
                  })}

                  <th>
                    ₹
                    {payments
  .filter((payment) =>
    members.some(
      (member) =>
        String(member.id) === String(payment.member_id)
    )
  )
  .reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  )
  .toLocaleString('en-IN')}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

// =========================
// ADMIN PANEL
// =========================

function AdminPanel({
  user,
  namaz,
  community,
  siteContent,
  fundSettings,
  expenses,
  projects,
  gallery,
  members,
  payments,
  salary,
  reload,
  goHome,
}) {
  const [message, setMessage] = useState('')

  const [namazForm, setNamazForm] = useState({
    fajr: namaz?.fajr || '',
    dhuhr: namaz?.dhuhr || '',
    asr: namaz?.asr || '',
    maghrib: namaz?.maghrib || '',
    isha: namaz?.isha || '',
    jummah: namaz?.jummah || '',
  })

  const [fund, setFund] = useState(
    fundSettings?.total_jama || 0
  )

  const [memberName, setMemberName] = useState('')
  const [memberContact, setMemberContact] = useState('')

  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState('')

  const [salaryAmount, setSalaryAmount] = useState(salary)
  const [paymentMember, setPaymentMember] = useState('')
const [paymentMonth, setPaymentMonth] = useState(
  new Date().toISOString().slice(0, 7)
)
const [paymentAmount, setPaymentAmount] = useState('')
const addPayment = async (e) => {
  e.preventDefault()

  if (!paymentMember || !paymentAmount) return

  const month = `${paymentMonth}-01`

  // Same member + same month ke saare records check karo
  const { data: existingPayments, error: findError } =
    await supabase
      .from('Monthly_payments')
      .select('id')
      .eq('member_id', Number(paymentMember))
      .eq('month', month)
      .order('id', { ascending: true })

  if (findError) {
    alert(findError.message)
    return
  }

  let error

  if (existingPayments && existingPayments.length > 0) {
    // Pehle record ko update karo
    const result = await supabase
      .from('Monthly_payments')
      .update({
        amount: Number(paymentAmount),
        status: 'paid',
      })
      .eq('id', existingPayments[0].id)

    error = result.error

    if (error) {
      alert(error.message)
      return
    }

    // Agar purane duplicate records hain,
    // unko remove karo
    if (existingPayments.length > 1) {
      const duplicateIds = existingPayments
        .slice(1)
        .map((payment) => payment.id)

      const { error: deleteError } =
        await supabase
          .from('Monthly_payments')
          .delete()
          .in('id', duplicateIds)

      if (deleteError) {
        alert(deleteError.message)
        return
      }
    }
  } else {
    // Naya member + naya month
    const result = await supabase
      .from('Monthly_payments')
      .insert({
        member_id: Number(paymentMember),
        month,
        amount: Number(paymentAmount),
        status: 'paid',
      })

    error = result.error
  }

  if (error) {
    alert(error.message)
    return
  }

  setPaymentMember('')
  setPaymentAmount('')
  setMessage('Monthly chanda saved.')
  await reload()
}

  const saveNamaz = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from('namaz_timings')
      .update(namazForm)
      .eq('id', 1)

    if (error) {
      alert(error.message)
      return
    }

    setMessage('Namaz timings updated.')
    await reload()
  }

  const saveFund = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from('fund_settings')
      .update({
        total_jama: Number(fund),
      })
      .eq('id', 1)

    if (error) {
      alert(error.message)
      return
    }

    setMessage('Funds updated.')
    await reload()
  }

  const addMember = async (e) => {
  e.preventDefault()

  if (!memberName.trim()) return

  const { error } = await supabase
    .from('members')
    .insert({
      name: memberName.trim(),
    })

  if (error) {
    alert(error.message)
    return
  }

  setMemberName('')
  setMessage('Member added.')
  await reload()
}

  const addExpense = async (e) => {
    e.preventDefault()

    if (!expenseTitle.trim() || !expenseAmount) return

    const { error } = await supabase
      .from('expenses')
      .insert({
        title: expenseTitle.trim(),
        amount: Number(expenseAmount),
        expense_date:
          expenseDate ||
          new Date().toISOString().slice(0, 10),
      })

    if (error) {
      alert(error.message)
      return
    }

    setExpenseTitle('')
    setExpenseAmount('')
    setExpenseDate('')
    setMessage('Expense added.')
    await reload()
  }

  
      const saveSalary = async (e) => {
  e.preventDefault()

  const month =
    new Date().toISOString().slice(0, 7) + '-01'

  const { data: existingRows, error: findError } =
    await supabase
      .from('imam_salary')
      .select('id')
      .eq('month', month)
      .order('id', { ascending: false })
      .limit(1)

  if (findError) {
    alert(findError.message)
    return
  }

  let error

  if (existingRows && existingRows.length > 0) {
    const result = await supabase
      .from('imam_salary')
      .update({
        amount: Number(salaryAmount),
      })
      .eq('id', existingRows[0].id)

    error = result.error
  } else {
    const result = await supabase
      .from('imam_salary')
      .insert({
        month,
        amount: Number(salaryAmount),
      })

    error = result.error
  }

  if (error) {
    alert(error.message)
    return
  }

  setMessage('Imam salary updated.')
  await reload()
}
  return (
    <div className="app">
      <header className="header">
        <h1>🛠️ Admin Panel</h1>
        <p>{user.email}</p>
      </header>

      <main className="section">
        <button className="menu-button" onClick={goHome}>
          ← Back
        </button>

        {message && (
          <div className="calendar-box">
            {message}
          </div>
        )}

        <div className="project-card">
          <h3>🕌 Namaz Timings</h3>

          <form onSubmit={saveNamaz}>
  <h3>Namaz Timings</h3>

  <label>Fajr</label>
  <input
    value={namazForm.fajr}
    onChange={(e) =>
      setNamazForm({
        ...namazForm,
        fajr: e.target.value,
      })
    }
  />

  <label>Dhuhr</label>
  <input
    value={namazForm.dhuhr}
    onChange={(e) =>
      setNamazForm({
        ...namazForm,
        dhuhr: e.target.value,
      })
    }
  />

  <label>Asr</label>
  <input
    value={namazForm.asr}
    onChange={(e) =>
      setNamazForm({
        ...namazForm,
        asr: e.target.value,
      })
    }
  />

  <label>Maghrib</label>
  <input
    value={namazForm.maghrib}
    onChange={(e) =>
      setNamazForm({
        ...namazForm,
        maghrib: e.target.value,
      })
    }
  />

  <label>Isha</label>
  <input
    value={namazForm.isha}
    onChange={(e) =>
      setNamazForm({
        ...namazForm,
        isha: e.target.value,
      })
    }
  />

  <label>Jummah</label>
  <input
    value={namazForm.jummah}
    onChange={(e) =>
      setNamazForm({
        ...namazForm,
        jummah: e.target.value,
      })
    }
  />

  <button type="submit">
    Save Namaz Timings
  </button>
</form>
        </div>

        <div className="project-card">
          <h3>💰 Funds</h3>

          <form onSubmit={saveFund}>
            <input
              type="number"
              value={fund}
              onChange={(e) => setFund(e.target.value)}
              placeholder="Total Jama"
            />

            <button type="submit">
              Save Total Jama
            </button>
          </form>
        </div>

        <div className="project-card">
          <h3>👥 Madarsa Members</h3>

          <form onSubmit={addMember}>
            <input
              value={memberName}
              onChange={(e) =>
                setMemberName(e.target.value)
              }
              placeholder="Representative name"
              required
            />

            

            <button type="submit">
              ➕ Add Member
            </button>
          </form>
          <div className="project-card">
  <h3>💰 Monthly Chanda</h3>

  <form onSubmit={addPayment}>
    <label>1. Select Member</label>

    <select
      value={paymentMember}
      onChange={(e) => setPaymentMember(e.target.value)}
      required
    >
      <option value="">Select Member</option>

      {members.map((member) => (
        <option key={member.id} value={member.id}>
          {member.name}
        </option>
      ))}
    </select>

    <label>2. Month</label>

    <input
      type="month"
      value={paymentMonth}
      onChange={(e) => setPaymentMonth(e.target.value)}
      required
    />

    <label>3. Chanda Amount</label>

    <input
      type="number"
      value={paymentAmount}
      onChange={(e) => setPaymentAmount(e.target.value)}
      placeholder="Chanda Amount"
      required
    />

    <button type="submit">
      4. ➕ Add Monthly Chanda
    </button>
  </form>

  <p>
    5. 👥 Member Edit / Delete
  </p>
</div>

          {members.map((member) => (
  <div key={member.id} className="expense-row">
    <span>
      👤 {member.name}
      {member.contact ? ` — ${member.contact}` : ''}
    </span>

    <button
      type="button"
      onClick={async () => {
        const newName = prompt(
          'Representative name:',
          member.name
        )

        if (newName === null || !newName.trim()) return

        

        const { error } = await supabase
          .from('members')
          .update({
            name: newName.trim(),
          
          })
          .eq('id', member.id)

        if (error) {
          alert(error.message)
          return
        }

        setMessage('Member updated.')
        await reload()
      }}
    >
      ✏️ Edit
    </button>

    <button
      type="button"
      onClick={async () => {
        const confirmDelete = window.confirm(
          'Kya aap is member ko delete karna chahte hain?'
        )

        if (!confirmDelete) return

        const { error } = await supabase
          .from('members')
          .delete()
          .eq('id', member.id)

        if (error) {
          alert(error.message)
          return
        }

        setMessage('Member deleted.')
        await reload()
      }}
    >
      🗑️ Delete
    </button>
  </div>
))}
        </div>

        <div className="project-card">
          <h3>📋 Add Expense</h3>

          <form onSubmit={addExpense}>
            <input
              value={expenseTitle}
              onChange={(e) =>
                setExpenseTitle(e.target.value)
              }
              placeholder="Expense title"
              required
            />

            <input
              type="number"
              value={expenseAmount}
              onChange={(e) =>
                setExpenseAmount(e.target.value)
              }
              placeholder="Amount"
              required
            />

            <input
              type="date"
              value={expenseDate}
              onChange={(e) =>
                setExpenseDate(e.target.value)
              }
            />

            <button type="submit">
              ➕ Add Expense
            </button>
          </form>

          {expenses.map((expense) => (
  <div key={expense.id} className="expense-row">
    <span>
      {expense.expense_date} — {expense.title} — ₹
      {Number(expense.amount).toLocaleString('en-IN')}
    </span>

    <button
      type="button"
      onClick={async () => {
        const newTitle = prompt(
          'Expense title:',
          expense.title
        )

        if (newTitle === null) return

        const newAmount = prompt(
          'Amount:',
          expense.amount
        )

        if (newAmount === null) return

        const newDate = prompt(
          'Date (YYYY-MM-DD):',
          expense.expense_date
        )

        if (newDate === null) return

        const { error } = await supabase
          .from('expenses')
          .update({
            title: newTitle.trim(),
            amount: Number(newAmount),
            expense_date: newDate,
          })
          .eq('id', expense.id)

        if (error) {
          alert(error.message)
          return
        }

        setMessage('Expense updated.')
        await reload()
      }}
    >
      ✏️ Edit
    </button>

    <button
      type="button"
      onClick={async () => {
        const confirmDelete = window.confirm(
          'Kya aap is expense ko delete karna chahte hain?'
        )

        if (!confirmDelete) return

        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', expense.id)

        if (error) {
          alert(error.message)
          return
        }

        setMessage('Expense deleted.')
        await reload()
      }}
    >
      🗑️ Delete
    </button>
  </div>
))}
        </div>

        <div className="project-card">
          <h3>🕌 Imam Salary</h3>

          <form onSubmit={saveSalary}>
            <input
              type="number"
              value={salaryAmount}
              onChange={(e) =>
                setSalaryAmount(e.target.value)
              }
            />

            <button type="submit">
              Save Salary
            </button>
          </form>
        </div>

        <div className="project-card">
          <h3>🏗️ Projects</h3>

<form
  onSubmit={async (e) => {
    e.preventDefault()

    const title = prompt('Project name:')
    if (!title || !title.trim()) return

    const description = prompt('Project description:')
    if (description === null) return

    const targetAmount = prompt('Target amount:')
    if (targetAmount === null) return

    const collectedAmount = prompt('Collected amount:')
    if (collectedAmount === null) return

    const { error } = await supabase
      .from('projects')
      .insert({
        title: title.trim(),
        description: description.trim(),
        target_amount: Number(targetAmount),
        collected_amount: Number(collectedAmount),
      })

    if (error) {
      alert(error.message)
      return
    }

    setMessage('Project added.')
    await reload()
  }}
>
  <button type="submit">
    ➕ Add Project
  </button>
</form>

{projects.map((project) => (
  <div key={project.id} className="expense-row">
    <span>
      🏗️ {project.title} — ₹
      {Number(
        project.collected_amount || 0
      ).toLocaleString('en-IN')}
    </span>

    <button
      type="button"
      onClick={async () => {
        const title = prompt(
          'Project name:',
          project.title
        )

        if (title === null || !title.trim()) return

        const description = prompt(
          'Project description:',
          project.description || ''
        )

        if (description === null) return

        const targetAmount = prompt(
          'Target amount:',
          project.target_amount || 0
        )

        if (targetAmount === null) return

        const collectedAmount = prompt(
          'Collected amount:',
          project.collected_amount || 0
        )

        if (collectedAmount === null) return

        const { error } = await supabase
          .from('projects')
          .update({
            title: title.trim(),
            description: description.trim(),
            target_amount: Number(targetAmount),
            collected_amount: Number(collectedAmount),
            updated_at: new Date().toISOString(),
          })
          .eq('id', project.id)

        if (error) {
          alert(error.message)
          return
        }

        setMessage('Project updated.')
        await reload()
      }}
    >
      ✏️ Edit
    </button>

    <button
      type="button"
      onClick={async () => {
        const confirmDelete = window.confirm(
          'Kya aap is project ko delete karna chahte hain?'
        )

        if (!confirmDelete) return

        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', project.id)

        if (error) {
          alert(error.message)
          return
        }

        setMessage('Project deleted.')
        await reload()
      }}
    >
      🗑️ Delete
    </button>
  </div>
))}
        </div>

        <div className="project-card">
  <h3>📸 Gallery</h3>

  <form
    onSubmit={async (e) => {
      e.preventDefault()

      const title = prompt('Photo title:')
      if (!title || !title.trim()) return

      const imagePath = prompt(
        'Image path / Storage path:'
      )

      if (imagePath === null || !imagePath.trim()) return

      const { error } = await supabase
        .from('gallery')
        .insert({
          title: title.trim(),
          image_path: imagePath.trim(),
        })

      if (error) {
        alert(error.message)
        return
      }

      setMessage('Gallery item added.')
      await reload()
    }}
  >
    <button type="submit">
      ➕ Add Gallery Photo
    </button>
  </form>

  {gallery.map((item) => (
    <div
      key={item.id}
      className="expense-row"
    >
      <span>
        📸 {item.title}
      </span>

      <button
        type="button"
        onClick={async () => {
          const title = prompt(
            'Photo title:',
            item.title
          )

          if (title === null || !title.trim()) return

          const { error } = await supabase
            .from('gallery')
            .update({
              title: title.trim(),
            })
            .eq('id', item.id)

          if (error) {
            alert(error.message)
            return
          }

          setMessage('Gallery item updated.')
          await reload()
        }}
      >
        ✏️ Edit
      </button>

      <button
        type="button"
        onClick={async () => {
          const confirmDelete = window.confirm(
            'Kya aap is gallery photo ko delete karna chahte hain?'
          )

          if (!confirmDelete) return

          const { error } = await supabase
            .from('gallery')
            .delete()
            .eq('id', item.id)

          if (error) {
            alert(error.message)
            return
          }

          setMessage('Gallery item deleted.')
          await reload()
        }}
      >
        🗑️ Delete
      </button>
    </div>
  ))}
</div>

        <div className="project-card">
  <h3>📸 Gallery</h3>

  <form
    onSubmit={async (e) => {
      e.preventDefault()

      const title = e.currentTarget.galleryTitle.value.trim()
      const file = e.currentTarget.galleryFile.files[0]

      if (!title) {
        alert('Photo title enter karo.')
        return
      }

      if (!file) {
        alert('Photo select karo.')
        return
      }

      const fileName =
        `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`

      const { error: uploadError } =
        await supabase.storage
          .from('gallery')
          .upload(fileName, file)

      if (uploadError) {
        alert(uploadError.message)
        return
      }

      const { data: publicUrlData } =
        supabase.storage
          .from('gallery')
          .getPublicUrl(fileName)

      const imageUrl = publicUrlData.publicUrl

      const { error: insertError } =
        await supabase
          .from('gallery')
          .insert({
            title,
            image_path: imageUrl,
          })

      if (insertError) {
        alert(insertError.message)
        return
      }

      e.currentTarget.reset()

      setMessage('Gallery photo uploaded.')
      await reload()
    }}
  >
    <input
      name="galleryTitle"
      type="text"
      placeholder="Photo title"
      required
    />

    <input
      name="galleryFile"
      type="file"
      accept="image/*"
      required
    />

    <button type="submit">
      📤 Upload Photo
    </button>
  </form>

  {gallery.map((item) => (
    <div
      key={item.id}
      className="expense-row"
    >
      <div>
        <strong>📸 {item.title}</strong>

        {item.image_path && (
          <div>
            <img
              src={item.image_path}
              alt={item.title}
              style={{
                width: '100px',
                marginTop: '8px',
                borderRadius: '8px',
              }}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={async () => {
          const newTitle = prompt(
            'Photo title:',
            item.title
          )

          if (
            newTitle === null ||
            !newTitle.trim()
          ) {
            return
          }

          const { error } = await supabase
            .from('gallery')
            .update({
              title: newTitle.trim(),
            })
            .eq('id', item.id)

          if (error) {
            alert(error.message)
            return
          }

          setMessage('Gallery title updated.')
          await reload()
        }}
      >
        ✏️ Edit
      </button>

      <button
        type="button"
        onClick={async () => {
          const confirmDelete = window.confirm(
            'Kya aap is photo ko delete karna chahte hain?'
          )

          if (!confirmDelete) return

          const { error } = await supabase
            .from('gallery')
            .delete()
            .eq('id', item.id)

          if (error) {
            alert(error.message)
            return
          }

          setMessage('Gallery photo deleted.')
          await reload()
        }}
      >
        🗑️ Delete
      </button>
    </div>
  ))}
</div>
      </main>
    </div>
  )
}

export default App