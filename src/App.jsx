import { useMemo, useState } from 'react'
import './App.css'

const categories = ['Wedding']

const templates = [
  { id: 'wix-inspired-wedding', name: 'Aarav & Riya — Classic', category: 'Wedding', description: 'A classic editorial wedding invitation with story, festivities, venue, gallery, and RSVP.', color: 'rose', image: 'linear-gradient(145deg, #38232a 0%, #9a6f6b 54%, #f7f3ed 100%)', stats: '5 sections  RSVP included' },
  { id: 'aarav-riya-wedding', name: 'Aarav & Riya', category: 'Wedding', description: 'A romantic Jaipur wedding invitation with a story, countdown, festivities, gallery, venue, and RSVP.', color: 'rose', image: 'linear-gradient(145deg, #541b2a 0%, #b77879 54%, #f6e9df 100%)', stats: '6 sections  RSVP included' },
  { id: 'puran-kiran-wedding', name: 'Puran & Kiran', category: 'Wedding', description: 'A rich Rajasthan wedding invitation with family blessings, festivities, venue details, video, and RSVP.', color: 'rose', image: 'linear-gradient(145deg, #4b1718 0%, #b87555 54%, #f6e8d5 100%)', stats: '4 sections  RSVP included' },
  { id: 'pastoral-wedding-3d', name: 'Pastoral Wedding', category: 'Wedding', description: 'A garden-inspired wedding invitation with floral details, celebrations, memories, and RSVP.', color: 'green', image: 'linear-gradient(145deg, #34483e 0%, #a8b79e 54%, #f4f1e8 100%)', stats: '5 sections  RSVP included' },
  { id: 'mira-arjun-wedding', name: 'Mira & Arjun', category: 'Wedding', description: 'An elegant Jaipur wedding invitation with their story, celebration details, venue, and RSVP.', color: 'rose', image: 'linear-gradient(145deg, #4a3b36 0%, #b78b76 54%, #f5f3ee 100%)', stats: '8 sections  RSVP included' },
  { id: 'cinematic-wedding', name: 'Cinematic Wedding', category: 'Wedding', description: 'A cinematic 16-chapter wedding story with invitations, events, gallery, and RSVP.', color: 'charcoal', image: 'linear-gradient(145deg, #1d2225 0%, #786a59 54%, #eee9df 100%)', stats: '16 chapters  RSVP included' },
  { id: 'enchanted-fairytale', name: 'Enchanted Fairytale', category: 'Wedding', description: 'A dreamy lavender woodland design for the next chapter of your story.', color: 'lavender', image: 'linear-gradient(145deg, #3f315c 0%, #bba8da 54%, #f3e7ff 100%)', stats: '9 pages  RSVP included' },
  { id: 'editorial-fashion', name: 'Editorial Fashion', category: 'Wedding', description: 'Bold typography and modern grids for a fashion-forward celebration.', color: 'charcoal', image: 'linear-gradient(145deg, #171717 0%, #d0b6a1 54%, #f5eee7 100%)', stats: '9 pages  RSVP included' },
  { id: 'vintage-storybook', name: 'Vintage Storybook', category: 'Wedding', description: 'A nostalgic paper-and-ink design filled with keepsakes and memories.', color: 'gold', image: 'linear-gradient(145deg, #705243 0%, #e3c9a7 54%, #f6ecd9 100%)', stats: '9 pages  RSVP included' },
  { id: 'beach-destination', name: 'Beach Destination', category: 'Wedding', description: 'An airy ocean-inspired invitation for a beautiful destination weekend.', color: 'blue', image: 'linear-gradient(145deg, #1d7180 0%, #b9e2dd 54%, #fff9e9 100%)', stats: '9 pages  RSVP included' },
  { id: 'dark-luxury', name: 'Dark Luxury', category: 'Wedding', description: 'A cinematic black, emerald, and champagne-gold wedding experience.', color: 'charcoal', image: 'linear-gradient(145deg, #11151a 0%, #254e45 54%, #d0ad71 100%)', stats: '9 pages  RSVP included' },
  { id: 'traditional-indian', name: 'Traditional Indian', category: 'Wedding', description: 'A vibrant, ceremonial design inspired by Indian wedding traditions.', color: 'gold', image: 'linear-gradient(145deg, #8d1f1f 0%, #edb34d 54%, #f8e6a9 100%)', stats: '9 pages  RSVP included' },
  { id: 'bohemian-earth', name: 'Bohemian Earth', category: 'Wedding', description: 'An earthy, tactile design for an intimate celebration under open skies.', color: 'gold', image: 'linear-gradient(145deg, #9b6244 0%, #e6c6a5 54%, #3f4a3b 100%)', stats: '9 pages  RSVP included' },
  { id: 'romantic-garden', name: 'Romantic Garden', category: 'Wedding', description: 'Soft florals, sage green, and a storybook garden atmosphere.', color: 'lavender', image: 'linear-gradient(145deg, #eab9c4 0%, #fff9f4 54%, #81947c 100%)', stats: '9 pages  RSVP included' },
  { id: 'modern-minimalist', name: 'Modern Minimalist', category: 'Wedding', description: 'A calm, editorial invitation for couples who love thoughtful simplicity.', color: 'blue', image: 'linear-gradient(145deg, #eee9df 0%, #fffdf8 54%, #5e5e5a 100%)', stats: '9 pages  RSVP included' },
  { id: 'royal-palace', name: 'Royal Palace', category: 'Wedding', description: 'A burgundy and gold celebration with a luxurious palace feel.', color: 'rose', image: 'linear-gradient(145deg, #4d1f2c 0%, #b98b52 54%, #f3d9a8 100%)', stats: '9 pages  RSVP included' },
]

const questions = {
  Wedding: ['Couple names', 'Wedding date', 'Wedding venue', 'Location', 'Contact email'],
  Portfolio: ['Full name', 'Profession', 'Skills', 'Projects / case studies', 'Social links'],
  Restaurant: ['Restaurant name', 'Address', 'Food menu', 'Contact number', 'Opening hours'],
  Business: ['Company name', 'Services', 'Address', 'Contact details', 'Business description'],
  'E-commerce': ['Store name', 'Product categories', 'Contact email', 'Shipping information'],
  Personal: ['Your name', 'About you', 'Contact email', 'Social links'],
}

function Icon({ name }) {
  const paths = {
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    layers: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5',
    chart: 'M4 19V5m0 14h17M8 16v-3m4 3V8m4 8v-6m4 6v-9',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8-3.5 2-1.1-2-3.4-2.1.8a8 8 0 0 0-1.8-1L16 5h-4l-.3 2.3a8 8 0 0 0-1.8 1L7.8 7.5l-2 3.4L8 12a8 8 0 0 0 0 2l-2.2 1.1 2 3.4 2.1-.8a8 8 0 0 0 1.8 1L12 21h4l.3-2.3a8 8 0 0 0 1.8-1l2.1.8 2-3.4L20 14a8 8 0 0 0 0-2Z',
    search: 'm20 20-4.5-4.5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    plus: 'M12 5v14M5 12h14',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    external: 'M14 5h5v5m-1-4-8 8m-5 2v3h12V7',
    chevron: 'm8 10 4 4 4-4',
  }
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}

function App() {
  const [active, setActive] = useState('Templates')
  const [category, setCategory] = useState('Wedding')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [formStep, setFormStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [calc, setCalc] = useState({ visitors: 10000, html: 180, css: 80, js: 140, images: 30, imageSize: 450, videos: 2, videoSize: 8500, other: 120, loaded: 72, cache: 35, allowance: 100 })

  const filtered = useMemo(() => templates.filter((item) => item.category === category && item.name.toLowerCase().includes(query.toLowerCase())), [category, query])
  const totalKb = calc.html + calc.css + calc.js + calc.images * calc.imageSize + calc.videos * calc.videoSize + calc.other
  const visitorKb = totalKb * (calc.loaded / 100) * (1 - calc.cache / 100)
  const monthlyGb = (calc.visitors * visitorKb) / 1024 / 1024
  const usedPercent = (monthlyGb / calc.allowance) * 100

  const openForm = (template) => { setSelected(template); setFormStep(0); setFormData({}); setSelectedFiles([]); setSubmitted(false); setSubmitError(''); setIsSubmitting(false) }
  const submitForm = async (event) => {
    event.preventDefault()
    if (isSubmitting) return
    if (formStep < 2) { setFormStep(formStep + 1); return }
    setSubmitError('')
    setIsSubmitting(true)
    const submission = { ...formData, templateId: selected.id, templateName: selected.name, websiteType: selected.category }
    try {
      const endpoint = import.meta.env.DEV ? '/api/submit' : '/api/website-submission'
      const requestBody = new FormData()
      Object.entries(submission).forEach(([key, value]) => {
        if (key !== 'files') requestBody.append(key, value || '')
      })
      selectedFiles.forEach((file) => requestBody.append('files', file))
      const response = await fetch(endpoint, { method: 'POST', body: requestBody })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Submission failed')
      setFormData({})
      setSelectedFiles([])
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message || 'We could not send your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  const updateCalc = (key, value) => setCalc((old) => ({ ...old, [key]: Number(value) || 0 }))

  return (
    <div className="app-shell">
      <header className="site-navbar">
        <div className="brand"><div className="brand-mark">W</div><div><strong>Wedding</strong><span>website studio</span></div></div>
        <nav className="top-nav">
          {['Templates'].map((item) => <button className={`top-nav-item ${active === item ? 'active' : ''}`} onClick={() => setActive(item)} key={item}>{item}</button>)}
        </nav>
        <div className="navbar-actions"><button className="icon-button"><Icon name="search" /></button></div>
      </header>

      <main className="main">
        {active === 'Home' ? <Home onExplore={() => setActive('Templates')} /> : active === 'Templates' ? <section className="content">
          <section className="wedding-cta"><div><div className="eyebrow">YOUR BIG DAY, YOUR WAY</div><h2>Create your website <i>within a day.</i></h2><p>Pick a beautiful design, add your story, and share every important detail with your guests.</p><button className="primary-button" onClick={() => openForm(filtered[0] || templates[0])}>Start building <Icon name="arrow" /></button></div><div className="wedding-cta-badge"><strong>1</strong><span>DAY<br />TO LAUNCH</span></div></section>
          <div className="hero"><div><div className="eyebrow">YOUR WEDDING WEBSITE</div><h1>Build something <i>worth remembering.</i></h1><p>Choose a beautiful wedding template, make it yours, and share your story with every guest.</p></div><div className="hero-shape"><div className="shape-card shape-one"></div><div className="shape-card shape-two">N</div><div className="shape-card shape-three"></div></div></div>
          <div className="toolbar"><div className="search-box"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates" /></div><div className="filter-list">{categories.map((item) => <button className={category === item ? 'filter active-filter' : 'filter'} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><button className="sort">Featured <Icon name="chevron" /></button></div>
          <div className="section-heading"><div><h2>Explore templates <span>{filtered.length}</span></h2><p>A flexible foundation for your next chapter.</p></div><button className="view-all">View all <Icon name="arrow" /></button></div>
          <div className="template-grid" id="wedding-templates">{filtered.map((template) => <article className="template-card" key={template.id}><div className="template-preview"><iframe className="template-image" src={`/templates/${template.id}/index.html`} title={`${template.name} template preview`} loading="lazy" /><div className="preview-overlay"><button onClick={() => window.open(`/templates/${template.id}/index.html`, '_blank')}><Icon name="external" /> Preview</button></div></div><div className="card-body"><div><h3>{template.name}</h3><span className="category-pill">{template.category}</span></div><p>{template.description}</p><div className="card-footer"><span>{template.stats}</span><button className="use-button" onClick={() => openForm(template)}>Use template <Icon name="arrow" /></button></div></div></article>)}</div>
          {filtered.length === 0 && <div className="empty">No templates match your search.</div>}
          <div className="load-more"><span>Showing {filtered.length} of {templates.length} templates</span><button>Load more <Icon name="plus" /></button></div>
        </section> : active === 'Bandwidth calculator' ? <Calculator calc={calc} updateCalc={updateCalc} totalKb={totalKb} visitorKb={visitorKb} monthlyGb={monthlyGb} usedPercent={usedPercent} /> : <Monitor active={active} />}
      </main>

      {selected && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}><div className="modal"><button className="modal-close" onClick={() => setSelected(null)}></button>{submitted ? <div className="success"><div className="success-icon"></div><div className="eyebrow">SUBMISSION RECEIVED</div><h2>Your story is in motion.</h2><p>Your request was sent successfully. We&apos;ll review your details and email you a preview link shortly.</p><button className="primary-button" onClick={() => setSelected(null)}>Back to templates <Icon name="arrow" /></button></div> : <><div className="modal-intro"><span className="modal-kicker">SET UP YOUR TEMPLATE</span><h2>Make <i>{selected.name}</i> yours.</h2><p>Tell us a little about your project. You can always refine the details later.</p><div className="steps"><span className="step-active">01</span><span></span><span>02</span><span></span><span>03</span></div></div><form onSubmit={submitForm}><div className="step-label">STEP 0{formStep + 1} <small>OF 03</small></div>{formStep === 0 && <><label>Your name<input required value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Alex Morgan" /></label><label>Email address<input required type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" /></label><label>{questions[selected.category]?.[0] || 'Project name'}<input required value={formData.main || ''} onChange={(e) => setFormData({ ...formData, main: e.target.value })} placeholder="Tell us what to call it" /></label></>}{formStep === 1 && <><label>{questions[selected.category]?.[1] || 'Description'}<textarea required value={formData.detail || ''} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} placeholder="A few words about your project..." /></label><label>Choose an accent color<div className="color-row">{['#c98476', '#38536d', '#a28c65', '#68856f', '#9d83aa'].map((color) => <button type="button" className={formData.color === color ? 'color-dot chosen' : 'color-dot'} style={{ background: color }} onClick={() => setFormData({ ...formData, color })} key={color} aria-label={`Select ${color}`} />)}</div></label></>}{formStep === 2 && <><label>Upload images and videos<input type="file" accept="image/*,video/*" multiple onChange={(e) => { const files = Array.from(e.target.files); setSelectedFiles(files); setFormData({ ...formData, files: files.map((file) => file.name) }) }} />{formData.files?.length > 0 && <span className="selected-files">{formData.files.join(', ')}</span>}</label><label>Anything else we should know?<textarea value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Optional notes..." /></label></>}{submitError && <p className="form-error">{submitError}</p>}<div className="form-actions">{formStep > 0 && <button type="button" className="back-button" onClick={() => setFormStep(formStep - 1)}>Back</button>}<button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : formStep === 2 ? 'Submit request' : 'Continue'} <Icon name="arrow" /></button></div></form></>}</div></div>}
    </div>
  )
}

function Calculator({ calc, updateCalc, totalKb, visitorKb, monthlyGb, usedPercent }) {
  const fields = [['visitors', 'Monthly visitors'], ['html', 'HTML size (KB)'], ['css', 'CSS size (KB)'], ['js', 'JavaScript size (KB)'], ['images', 'Number of images'], ['imageSize', 'Average image (KB)'], ['videos', 'Number of videos'], ['videoSize', 'Average video (KB)'], ['other', 'Other assets (KB)'], ['loaded', 'Resources loaded (%)'], ['cache', 'Cache savings (%)'], ['allowance', 'Bandwidth allowance (GB)']]
  return <section className="content tool-page"><div className="page-title"><div className="eyebrow">ESTIMATE YOUR GROWTH</div><h1>Bandwidth <i>calculator.</i></h1><p>A clear estimate of what your traffic could look like. Not billing data  a planning tool.</p></div><div className="calculator-layout"><div className="panel input-panel"><h2>Project assumptions</h2><p>Adjust any input to model your monthly transfer.</p><div className="calc-fields">{fields.map(([key, label]) => <label key={key}>{label}<input type="number" min="0" value={calc[key]} onChange={(e) => updateCalc(key, e.target.value)} /></label>)}</div></div><div className="results-panel"><div className="result-label">ESTIMATED MONTHLY TRANSFER</div><div className="big-number">{monthlyGb.toFixed(1)} <small>GB</small></div><div className="meter"><span style={{ width: `${Math.min(usedPercent, 100)}%` }} /></div><div className="meter-caption"><span>{usedPercent.toFixed(0)}% of {calc.allowance} GB allowance</span><span>{usedPercent > 100 ? 'Allowance exceeded' : `${(calc.allowance - monthlyGb).toFixed(1)} GB remaining`}</span></div><div className="result-cards"><div><span>Total website size</span><b>{(totalKb / 1024).toFixed(2)} MB</b></div><div><span>Data per visitor</span><b>{(visitorKb / 1024).toFixed(2)} MB</b></div></div>{usedPercent > 100 && <div className="warning">This estimate exceeds your configured allowance. Consider optimizing media or upgrading your plan.</div>}</div></div></section>
}

function Home({ onExplore }) {
  return <section className="content home-page">
    <div className="home-hero">
      <div className="home-copy">
        <div className="eyebrow">A BETTER WAY TO BEGIN</div>
        <h1>Your next website<br /><i>starts here.</i></h1>
        <p>Beautiful, flexible templates for the moments, ideas, and businesses that deserve to be shared.</p>
        <div className="home-actions"><button className="primary-button" onClick={onExplore}>Explore templates <Icon name="arrow" /></button></div>
      </div>
      <div className="home-art" aria-label="Template preview collage"><div className="art-paper art-paper-one"><small>THE BEGINNING OF</small><strong>Forever<br /><i>starts here.</i></strong><span>WEDDING</span></div><div className="art-paper art-paper-two"><small>SELECTED WORKS</small><strong>Ideas<br /><i>in motion.</i></strong><span>PORTFOLIO</span></div><div className="art-paper art-paper-three"><small>MAKE IT MATTER</small><strong>Move<br /><i>forward.</i></strong><span>BUSINESS</span></div></div>
    </div>
    <div className="home-stats"><div><b>{templates.length}</b><span>considered templates</span></div><div><b>06</b><span>creative categories</span></div><div><b>01</b><span>place to start</span></div></div>
  </section>
}

function Monitor({ active }) {
  return <section className="content tool-page"><div className="page-title"><div className="eyebrow">HEALTH & VISIBILITY</div><h1>{active === 'My websites' ? <>Your <i>websites.</i></> : <>Resource <i>monitor.</i></>}</h1><p>{active === 'My websites' ? 'Keep track of every project you are shaping.' : 'Understand what your visitors actually download  and where to optimize next.'}</p></div><div className="dashboard-grid"><div className="panel usage-panel"><div className="panel-head"><div><div className="result-label">LIVE RESOURCE SNAPSHOT</div><h2>Homepage transfer</h2></div><button className="refresh">Refresh </button></div><div className="resource-list">{[['HTML transferred', '180 KB', 'html'], ['CSS transferred', '80 KB', 'css'], ['JavaScript transferred', '140 KB', 'js'], ['Images', '13.5 MB', 'image'], ['Video (on demand)', '', 'video'], ['Fonts & other', '120 KB', 'other']].map(([label, value, type]) => <div className="resource-row" key={label}><span className={`resource-icon ${type}`}></span><span>{label}</span><b>{value}</b></div>)}</div><div className="resource-total"><span>Total transferred data</span><b>13.99 MB</b></div><p className="disclaimer">Measured with Resource Timing API  18 network requests. Cached and cross-origin resources may not be fully represented.</p></div><div className="panel vercel-panel"><div className="result-label">VERCEL PROJECT USAGE</div><div className="unavailable"><div></div><h3>Connect your project</h3><p>Usage metrics are available when a server-side Vercel API token is configured.</p><button className="outline-button">View setup guide <Icon name="arrow" /></button></div><div className="metrics"><span>Fast Data Transfer <b>Unavailable</b></span><span>CDN Requests <b>Unavailable</b></span><span>Function Invocations <b>Unavailable</b></span></div></div></div></section>
}

export default App
