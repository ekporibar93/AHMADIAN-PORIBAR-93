import './style.css'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from './supabase'

type GalleryItem = {
  image: string
  eyebrow: string
  title: string
  caption: string
}

type Member = {
  name: string
  id: string
  role: string
  image: string
  initials: string
}

type LedgerRow = {
  date: string
  member: string
  id: string
  category: string
  amount: string
  method: string
  late?: boolean
}

const gallery: GalleryItem[] = [
  {
    image: '/manus-storage/async-images/lcMowmcblJx42Lig2nI2gV/image-1.webp',
    eyebrow: 'একসাথে এগিয়ে যাই',
    title: 'সমিতির শক্তি মানুষের পাশে',
    caption: 'মাসিক বৈঠক · মিরপুর, ঢাকা',
  },
  {
    image: '/manus-storage/async-images/lcMowmcblJx42Lig2nI2gV/image-2.webp',
    eyebrow: 'সম্পর্কের ভিত',
    title: 'আজকের শৃঙ্খলা, আগামীর স্বস্তি',
    caption: 'পরিবার ও প্রতিবেশী · কমিউনিটি ডে',
  },
  {
    image: '/manus-storage/async-images/lcMowmcblJx42Lig2nI2gV/image-3.webp',
    eyebrow: 'লক্ষ্যের পথে',
    title: 'ছোট ছোট অবদান, বড় স্বপ্ন',
    caption: 'সম্মিলিত যাত্রা · ২০২৬',
  },
]

const members: Member[] = [
  { name: 'আহমেদ উল্লাহ', id: 'S-001', role: 'প্রশাসক', initials: 'আউ', image: 'https://i.pravatar.cc/160?img=11' },
  { name: 'মোছা. রুমানা আক্তার', id: 'S-004', role: 'সদস্য', initials: 'রআ', image: 'https://i.pravatar.cc/160?img=47' },
  { name: 'মো. সাইফুল ইসলাম', id: 'S-009', role: 'সদস্য', initials: 'সই', image: 'https://i.pravatar.cc/160?img=12' },
  { name: 'সুমাইয়া নূর', id: 'S-013', role: 'সদস্য', initials: 'সন', image: 'https://i.pravatar.cc/160?img=32' },
]

const deposits: LedgerRow[] = [
  { date: '১২ নভেম্বর ২০২৬', member: 'মোছা. রুমানা আক্তার', id: 'S-004', category: 'মাসিক', amount: '৳ ৫,০০০', method: 'ব্যাংক ট্রান্সফার', late: true },
  { date: '০৮ নভেম্বর ২০২৬', member: 'মো. সাইফুল ইসলাম', id: 'S-009', category: 'মাসিক', amount: '৳ ৫,০০০', method: 'ক্যাশ' },
  { date: '০৩ নভেম্বর ২০২৬', member: 'আহমেদ উল্লাহ', id: 'S-001', category: 'প্রকল্প', amount: '৳ ১৫,০০০', method: 'ব্যাংক ট্রান্সফার' },
]

const expenses = [
  { date: '১০ নভেম্বর ২০২৬', voucher: 'V-0268', description: 'কমিউনিটি হল রক্ষণাবেক্ষণ', category: 'অফিস', amount: '৳ ৩,২০০' },
  { date: '০৪ নভেম্বর ২০২৬', voucher: 'V-0267', description: 'সভা আয়োজন ও নাশতা', category: 'অন্যান্য', amount: '৳ ১,৮৫০' },
  { date: '২৯ অক্টোবর ২০২৬', voucher: 'V-0266', description: 'প্রকল্প উপকরণ', category: 'প্রকল্প বিনিয়োগ', amount: '৳ ৮,৪০০' },
]

const state = {
  route: window.location.pathname === '/hisab' ? '/hisab' : '/',
  galleryIndex: 0,
  modalOpen: false,
  passwordModal: false,
  adminModal: false,
  adminKind: 'settings' as 'settings' | 'members' | 'ledger' | 'gallery',
  adminError: '',
  authMode: 'login' as 'login' | 'signup',
  drawerOpen: false,
  lightboxOpen: false,
  toast: '',
  signedIn: false,
  authReady: !isSupabaseConfigured,
  authUser: null as User | null,
}

let autoPlayTimer: number | undefined
const app = document.querySelector<HTMLDivElement>('#app')!

const identityName = (): string => {
  const metadataName = state.authUser?.user_metadata?.display_name
  return typeof metadataName === 'string' && metadataName.trim() ? metadataName : state.authUser?.email ?? 'সদস্য'
}

const authErrorMessage = (message: string): string => {
  const normalized = message.toLowerCase()
  if (normalized.includes('invalid login credentials')) return 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।'
  if (normalized.includes('email not confirmed')) return 'এই ইমেইল এখনো নিশ্চিত করা হয়নি।'
  if (normalized.includes('rate limit')) return 'অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।'
  return 'প্রবেশ করা যাচ্ছে না। সংযোগ ও তথ্য যাচাই করে আবার চেষ্টা করুন।'
}

const icon = (name: string, className = ''): string => {
  const common = `class="icon ${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`
  const paths: Record<string, string> = {
    arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>',
    arrowDown: '<path d="M12 5v14m6-6-6 6-6-6"/>',
    arrowUp: '<path d="M12 19V5m-6 6 6-6 6 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M7.2 3.8 9 3l2 4-1.8 1.5a14.1 14.1 0 0 0 6.3 6.3L17 13l4 2-.8 1.8a3 3 0 0 1-3.4 1.7C10.6 17.2 6.8 13.4 5.5 7.2a3 3 0 0 1 1.7-3.4Z"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    eye: '<path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
    wallet: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5v-11Z"/><path d="M4 7h15M16 14h3"/>',
    chart: '<path d="M4 19V5M4 19h17"/><path d="m7 15 3-4 3 2 5-7"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M17 13a5 5 0 0 1 4 5"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    settings: '<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="m19.4 15 .1.1-1.8 3.1-.2-.1a2 2 0 0 0-2.5.9l-.1.2h-3.6l-.1-.2a2 2 0 0 0-2.5-.9l-.2.1-1.8-3.1.1-.1a2 2 0 0 0 0-2.9l-.1-.1 1.8-3.1.2.1a2 2 0 0 0 2.5-.9l.1-.2h3.6l.1.2a2 2 0 0 0 2.5.9l.2-.1 1.8 3.1-.1.1a2 2 0 0 0 0 2.9Z"/>',
    logout: '<path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 4v11m-4-4 4 4 4-4M5 20h14"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  }
  return `<svg ${common}>${paths[name] ?? paths.arrow}</svg>`
}

const brandMark = (): string => `
  <span class="brand-mark" aria-hidden="true"><span>৯৩</span></span>
  <span class="brand-copy"><strong>আহমদিয়ান পরিবার-93</strong><small>আঁরা বিয়াক্কুন এক পরিবার</small></span>
`

const renderHeader = (): string => `
  <header class="site-header">
    <a class="brand" href="/" data-action="home" aria-label="আহমদিয়ান পরিবার-93 হোমপেজ">${brandMark()}</a>
    <nav class="main-nav" aria-label="প্রধান নেভিগেশন">
      <a href="#about">আমাদের কথা</a>
      <a href="#members">সদস্যবৃন্দ</a>
      <a href="#updates">আপডেট</a>
    </nav>
    <div class="header-actions">
      <a class="contact-link" href="mailto:shomity93@gmail.com">${icon('mail')}<span>যোগাযোগ</span></a>
      <button class="button button-dark button-small" data-action="open-hisab">হিসাব ঘর ${icon('arrow')}</button>
      <button class="menu-button" data-action="toggle-site-menu" aria-label="মেনু">${icon('menu')}</button>
    </div>
  </header>
`

const renderHome = (): string => {
  const slide = gallery[state.galleryIndex]
  return `
    <div class="public-page">
      ${renderHeader()}
      <main>
        <section class="hero section-wrap">
          <div class="hero-copy">
            <div class="eyebrow"><span class="eyebrow-line"></span> ১৯৯৩ থেকে একসাথে</div>
            <h1>হিসাব পরিষ্কার,<br /><em>পথ একসাথে।</em></h1>
            <p class="hero-lede">আমাদের সমিতি শুধু সঞ্চয়ের জায়গা নয়—এটি বিশ্বাস, দায়িত্ব আর একে অপরের পাশে থাকার একটি দীর্ঘ গল্প।</p>
            <div class="hero-actions">
              <button class="button button-saffron" data-action="open-hisab">সদস্য প্রবেশ ${icon('arrow')}</button>
              <a class="text-link" href="#about">আমাদের গল্প পড়ুন ${icon('arrow')}</a>
            </div>
            <div class="hero-note"><span class="note-dot"></span><span>এই মাসের বৈঠক: ২৮ নভেম্বর, শুক্রবার</span></div>
          </div>
          <div class="hero-visual">
            <div class="hero-frame">
              <img src="${slide.image}" alt="${slide.title}" />
              <div class="hero-overlay"></div>
              <div class="slide-meta">
                <span>${slide.eyebrow}</span>
                <strong>${slide.title}</strong>
                <small>${slide.caption}</small>
              </div>
              <div class="slide-counter"><b>০${state.galleryIndex + 1}</b><span>/ ০${gallery.length}</span></div>
              <div class="slide-controls">
                <button data-action="gallery-prev" aria-label="আগের ছবি">${icon('chevronLeft')}</button>
                <button data-action="gallery-next" aria-label="পরের ছবি">${icon('chevronRight')}</button>
              </div>
              <button class="image-expand" data-action="open-lightbox" aria-label="ছবি বড় করে দেখুন">${icon('eye')} <span>বড় করে দেখুন</span></button>
            </div>
            <div class="gallery-progress" aria-label="গ্যালারি অগ্রগতি">
              ${gallery.map((_, i) => `<button class="progress-item ${i === state.galleryIndex ? 'is-active' : ''}" data-action="gallery-go" data-index="${i}" aria-label="ছবি ${i + 1}"><span></span></button>`).join('')}
            </div>
          </div>
        </section>

        <section class="signal-strip">
          <div class="section-wrap signal-inner">
            <p><span class="signal-number">০১</span><span><strong>লক্ষ্য অর্জনে প্রতিজ্ঞাবদ্ধ</strong><small>প্রতিটি সদস্যের স্বপ্ন আমাদের সম্মিলিত দায়িত্ব।</small></span></p>
            <p><span class="signal-number">০২</span><span><strong>নিরাপদ ও স্বচ্ছ হিসাব</strong><small>যা জমা হয়, তা-ই দেখা যায়—সঠিক সময়ে।</small></span></p>
            <p><span class="signal-number">০৩</span><span><strong>সম্পর্কই মূলধন</strong><small>সঞ্চয়ের বাইরে, আমরা পাশে থাকি।</small></span></p>
          </div>
        </section>

        <section class="about-section section-wrap" id="about">
          <div class="section-kicker">আমাদের কথা <span></span></div>
          <div class="about-grid">
            <div>
              <h2>একটি হিসাবের খাতা,<br /><em>অনেকগুলো জীবনের গল্প।</em></h2>
            </div>
            <div class="about-body">
              <p>আহমদিয়ান পরিবার-93 গড়ে উঠেছে সেই বিশ্বাস থেকে—একসাথে থাকলে ছোট অবদানও বড় পরিবর্তনের শুরু হতে পারে। আমাদের কাজের প্রতিটি ধাপে থাকে স্বচ্ছতা, সম্মান আর পরস্পরের প্রতি দায়বদ্ধতা।</p>
              <a class="text-link" href="#updates">আমাদের অঙ্গীকার দেখুন ${icon('arrow')}</a>
            </div>
          </div>
          <div class="about-rule"></div>
          <div class="about-signature"><span class="signature-line"></span><span>“একসাথে থাকাই আমাদের সবচেয়ে বড় সঞ্চয়।”</span><small>— আহমেদ উল্লাহ, প্রশাসক</small></div>
        </section>

        <section class="members-section section-wrap" id="members">
          <div class="section-heading-row">
            <div><div class="section-kicker">আমাদের মানুষ <span></span></div><h2>যারা পাশে আছেন</h2></div>
            <span class="section-side-note">অনুমোদিত সদস্যদের তালিকা <b>২৪ জন</b></span>
          </div>
          <div class="member-grid">
            ${members.map((member, i) => `
              <article class="member-card ${i === 0 ? 'member-card-featured' : ''}">
                <div class="member-avatar ${i === 0 ? 'avatar-teal' : ''}"><img src="${member.image}" alt="${member.name}" onerror="this.style.display='none'; this.parentElement.classList.add('avatar-fallback')" /><span>${member.initials}</span></div>
                <div class="member-info"><strong>${member.name}</strong><span>${member.id} · ${member.role}</span></div>
                <span class="member-arrow">${icon('arrow')}</span>
              </article>
            `).join('')}
          </div>
        </section>

        <section class="updates-section section-wrap" id="updates">
          <div class="section-heading-row">
            <div><div class="section-kicker">সর্বশেষ <span></span></div><h2>সমিতির দিনলিপি</h2></div>
            <a class="text-link" href="#updates">সব আপডেট দেখুন ${icon('arrow')}</a>
          </div>
          <div class="post-grid">
            <article class="post-card post-featured"><div class="post-date">১২ নভেম্বর ২০২৬ <span>●</span> ঘোষণা</div><h3>বছর শেষের লক্ষ্যে<br />আমরা কোথায় দাঁড়িয়ে?</h3><p>এই মাসের বৈঠকে আমরা দেখেছি, একসাথে থাকলে নিয়মিত ছোট পদক্ষেপ কীভাবে বড় আস্থায় রূপ নেয়।</p><a class="text-link" href="#updates">বিস্তারিত পড়ুন ${icon('arrow')}</a></article>
            <article class="post-card post-image"><div class="post-photo"></div><div class="post-photo-copy"><div class="post-date">০৪ নভেম্বর ২০২৬ <span>●</span> গল্প</div><h3>এক কাপ চায়ের পাশে</h3><p>সম্পর্কের উষ্ণতায় গড়ে ওঠে দীর্ঘমেয়াদি সঞ্চয়।</p></div></article>
            <article class="post-card post-quote"><span class="quote-mark">“</span><blockquote>ভালো হিসাব শুধু সংখ্যা নয়—এটি একে অপরের প্রতি আমাদের প্রতিশ্রুতি।</blockquote><div class="quote-author">— মাসিক বৈঠকের নোট</div></article>
          </div>
        </section>

        <section class="cta-section section-wrap">
          <div class="cta-card"><div class="cta-ornament">৯৩</div><div><div class="section-kicker light">আপনার জন্য <span></span></div><h2>হিসাব ঘরে দেখা হবে?</h2><p>সদস্যদের জন্য নিরাপদ জায়গা—আপনার জমা, রিপোর্ট এবং শিট একসাথে।</p></div><button class="button button-paper" data-action="open-hisab">হিসাব ঘরে যান ${icon('arrow')}</button></div>
        </section>
      </main>
      <footer class="site-footer section-wrap"><div class="footer-brand">${brandMark()}</div><div class="footer-contact"><a href="mailto:shomity93@gmail.com">shomity93@gmail.com</a><a href="tel:+971552650307">+971 55 265 0307</a></div><div class="footer-meta"><span>© ২০২৬ আহমদিয়ান পরিবার-93</span><span>স্বচ্ছতা · সম্পর্ক · অগ্রগতি</span></div></footer>
      ${state.modalOpen ? renderAuthModal() : ''}
      ${state.lightboxOpen ? renderLightbox() : ''}
    </div>
  `
}

const renderAuthModal = (): string => `
  <div class="modal-backdrop" data-action="close-modal">
    <section class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" data-stop-propagation>
      <button class="modal-close" data-action="close-modal" aria-label="বন্ধ করুন">${icon('close')}</button>
      <div class="auth-intro"><span class="auth-seal">৯৩</span><div class="section-kicker">সদস্য এলাকা <span></span></div><h2 id="auth-title">${state.authMode === 'login' ? 'আবার দেখা হলো।' : 'আপনার জায়গা তৈরি করুন।'}</h2><p>${state.authMode === 'login' ? 'Supabase Auth ইমেইল ও পাসওয়ার্ড দিয়ে নিরাপদে হিসাব ঘরে প্রবেশ করুন।' : 'অনুমোদিত সদস্য হলে কয়েকটি তথ্য দিয়ে আবেদন পাঠান।'}</p><p class="demo-helper">নতুন সদস্য আবেদন এখনো Admin approval ও RLS workflow-এর অধীনে রাখা হয়েছে।</p></div>
      <div class="auth-tabs"><button class="auth-tab ${state.authMode === 'login' ? 'is-active' : ''}" data-action="auth-tab" data-mode="login">প্রবেশ করুন</button><button class="auth-tab ${state.authMode === 'signup' ? 'is-active' : ''}" data-action="auth-tab" data-mode="signup">নতুন সদস্য</button></div>
      <form class="auth-form" data-action="auth-submit">
        ${state.authMode === 'signup' ? '<label>ইমেইল<input name="memberId" type="email" inputmode="email" autocomplete="email" placeholder="আপনার ইমেইল" required /></label>' : '<label>ইমেইল<input name="memberId" type="email" inputmode="email" autocomplete="email" placeholder="যেমন: ekporibar93@gmail.com" required /></label>'}
        ${state.authMode === 'signup' ? '<label>দেশ<select name="country"><option>সংযুক্ত আরব আমিরাত (+৯৭১)</option><option>বাংলাদেশ (+৮৮০)</option><option>সৌদি আরব (+৯৬৬)</option></select></label><label>মোবাইল নম্বর<input name="phone" placeholder="৫০ ১২৩ ৪৫৬৭" required /></label>' : ''}
        <label>পাসওয়ার্ড<div class="password-input"><input name="password" type="password" autocomplete="current-password" minlength="6" placeholder="কমপক্ষে ৬ অক্ষর" required /><button type="button" data-action="toggle-password" aria-label="পাসওয়ার্ড দেখুন">${icon('eye')}</button></div></label>
        ${state.authMode === 'signup' ? '<label class="check-row"><input type="checkbox" required /><span>আমি জানি, অনুমোদন ছাড়া সদস্য প্রবেশ সম্ভব নয়।</span></label>' : '<div class="form-options"><label class="check-row"><input type="checkbox" /><span>আমাকে মনে রাখুন</span></label><a href="#reset">পাসওয়ার্ড ভুলে গেছেন?</a></div>'}
        <div class="auth-error" data-auth-error></div>
        <button class="button button-dark button-full" type="submit">${state.authMode === 'login' ? 'হিসাব ঘরে প্রবেশ' : 'অনুমোদনের জন্য পাঠান'} ${icon('arrow')}</button>
      </form>
      <p class="auth-footnote">${icon('lock')} আপনার তথ্য নিরাপদ ও গোপন রাখা হয়</p>
    </section>
  </div>
`

const renderPasswordModal = (): string => `
  <div class="modal-backdrop" data-action="close-password-modal">
    <section class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="password-title" data-stop-propagation>
      <button class="modal-close" data-action="close-password-modal" aria-label="বন্ধ করুন">${icon('close')}</button>
      <div class="auth-intro"><span class="auth-seal">৯৩</span><div class="section-kicker">নিরাপত্তা <span></span></div><h2 id="password-title">Password পরিবর্তন</h2><p>নতুন password সেট করলে পরের login থেকে সেটিই ব্যবহার করবেন।</p></div>
      <form class="auth-form" data-action="password-submit">
        <label>নতুন password<input name="newPassword" type="password" autocomplete="new-password" minlength="8" required /></label>
        <label>আবার লিখুন<input name="confirmPassword" type="password" autocomplete="new-password" minlength="8" required /></label>
        <div class="auth-error" data-password-error></div>
        <button class="button button-dark button-full" type="submit">Password সংরক্ষণ ${icon('check')}</button>
      </form>
    </section>
  </div>
`

const renderAdminModal = (): string => {
  const kind = state.adminKind
  const title = kind === 'settings' ? 'হোমপেজ সেটিংস' : kind === 'members' ? 'সদস্য ব্যবস্থাপনা' : kind === 'ledger' ? 'হিসাব ব্যবস্থাপনা' : 'গ্যালারি ব্যবস্থাপনা'
  const fields = kind === 'settings'
    ? '<label>নাম<input name="name" required value="আহমদিয়ান পরিবার-93" /></label><label>প্রধান tagline<input name="primaryTagline" required /></label><label>দ্বিতীয় tagline<input name="secondaryTagline" required /></label><label>Contact email<input name="contactEmail" type="email" required /></label>'
    : kind === 'members'
      ? '<label>Record ID <small>(Edit/Delete-এর সময়)</small><input name="recordId" inputmode="numeric" /></label><label>Member code<input name="memberCode" required placeholder="S-001" /></label><label>পূর্ণ নাম<input name="fullName" required /></label><label>Phone<input name="phone" /></label><label>Email<input name="email" type="email" /></label><label>Address<input name="address" /></label><label>Occupation<input name="occupation" /></label><label>Status<select name="status"><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option></select></label>'
      : kind === 'ledger'
        ? '<label>Record ID <small>(Edit/Delete-এর সময়)</small><input name="recordId" inputmode="numeric" /></label><label>Reference no.<input name="referenceNo" required /></label><label>Type<select name="type"><option value="income">Income</option><option value="expense">Expense</option></select></label><label>তারিখ<input name="occurredAt" type="date" required /></label><label>Category<input name="category" required /></label><label>Member ID <small>(ঐচ্ছিক)</small><input name="memberId" inputmode="numeric" /></label><label>Description<input name="description" /></label><label>Amount<input name="amount" type="number" min="0" step="0.01" required /></label><label>Payment method<input name="paymentMethod" /></label>'
        : '<label>Record ID <small>(Edit/Delete-এর সময়)</small><input name="recordId" inputmode="numeric" /></label><label>Title<input name="title" required /></label><label>Description<input name="description" /></label><label>Image URL<input name="imageUrl" type="url" required /></label><label>Image key<input name="imageKey" required /></label><label>MIME type<input name="mimeType" value="image/jpeg" required /></label>'
  const tabs = [['settings', 'হোমপেজ'], ['members', 'সদস্য'], ['ledger', 'হিসাব'], ['gallery', 'গ্যালারি']].map(([value, label]) => `<button type="button" class="auth-tab ${kind === value ? 'is-active' : ''}" data-action="admin-kind" data-kind="${value}">${label}</button>`).join('')
  return `<div class="modal-backdrop" data-action="close-admin-modal"><section class="auth-modal admin-modal" role="dialog" aria-modal="true" data-stop-propagation><button class="modal-close" data-action="close-admin-modal" aria-label="বন্ধ করুন">${icon('close')}</button><div class="auth-intro"><span class="auth-seal">৯৩</span><div class="section-kicker">Admin <span></span></div><h2>${title}</h2><p>Add করতে ID খালি রাখুন; Edit/Delete করতে Record ID পূরণ করুন।</p></div><div class="auth-tabs">${tabs}</div><form class="auth-form" data-action="admin-submit">${fields}<div class="auth-error" data-admin-error>${state.adminError}</div><div class="admin-form-actions"><button class="button button-dark" type="submit" data-operation="save">সংরক্ষণ ${icon('check')}</button><button class="button button-outline" type="button" data-action="admin-delete">Delete</button></div></form></section></div>`
}

const renderLightbox = (): string => {
  const slide = gallery[state.galleryIndex]
  return `<div class="lightbox-backdrop" data-action="close-lightbox"><div class="lightbox-inner" data-stop-propagation><button class="modal-close" data-action="close-lightbox" aria-label="বন্ধ করুন">${icon('close')}</button><img src="${slide.image}" alt="${slide.title}" /><div class="lightbox-caption"><span>${slide.eyebrow}</span><strong>${slide.title}</strong><small>${slide.caption}</small></div></div></div>`
}

const renderProtectedGate = (): string => `
  <div class="protected-page"><header class="protected-header section-wrap"><a class="brand" href="/" data-action="home">${brandMark()}</a><button class="button button-paper button-small" data-action="open-login">প্রবেশ করুন ${icon('arrow')}</button></header><main class="gate-main section-wrap"><div class="gate-card"><div class="gate-icon">${icon('lock')}</div><div class="section-kicker">সুরক্ষিত এলাকা <span></span></div><h1>হিসাব ঘর শুধু<br /><em>সদস্যদের জন্য।</em></h1><p>আপনার অনুমোদিত Supabase Auth ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করলে হিসাব ঘরের dashboard দেখতে পারবেন।</p><button class="button button-saffron" data-action="open-login">সদস্য প্রবেশ ${icon('arrow')}</button><a class="text-link" href="/" data-action="home">হোমপেজে ফিরুন ${icon('arrow')}</a></div></main></div>
`

const dashboardSidebar = (): string => `
  <aside class="dashboard-sidebar ${state.drawerOpen ? 'is-open' : ''}">
    <div class="dashboard-side-top"><a class="brand" href="/" data-action="home">${brandMark()}</a><button class="drawer-close" data-action="toggle-drawer" aria-label="মেনু বন্ধ করুন">${icon('close')}</button></div>
    <div class="user-chip"><div class="user-chip-avatar">আউ</div><div><strong>${identityName()}</strong><span>Supabase Auth · Admin profile</span></div><span class="status-dot"></span></div>
    <nav class="dashboard-nav"><div class="nav-label">হিসাব</div><a class="is-active" href="#overview">${icon('home')}ওভারভিউ</a><a href="#deposits">${icon('wallet')}জমা খাতা <span>১২</span></a><a href="#expenses">${icon('file')}খরচের খাতা</a><a href="#members-sheet">${icon('users')}সদস্য শিট</a><div class="nav-label nav-label-spaced">রিপোর্ট</div><a href="#reports">${icon('chart')}মাসিক রিপোর্ট</a><a href="#reports">${icon('calendar')}বার্ষিক রিপোর্ট</a><a href="#reports">${icon('download')}আয়–ব্যয় রিপোর্ট</a><div class="nav-label nav-label-spaced">ব্যবস্থাপনা</div><a class="admin-nav" href="#admin" data-action="admin-info">${icon('settings')}অ্যাডমিন প্যানেল <span class="nav-badge">Admin</span></a></nav>
    <div class="sidebar-bottom"><div class="privacy-note">${icon('lock')} <span>Auth connected · demo data<br /><small>কোনো বাস্তব data mutation নেই</small></span></div><button class="sign-out" data-action="sign-out">${icon('logout')}সাইন আউট</button></div>
  </aside>
`

const renderDashboard = (): string => `
  <div class="dashboard-page">
    ${dashboardSidebar()}
    <div class="dashboard-main">
      <header class="dashboard-header"><div class="dashboard-header-left"><button class="drawer-trigger" data-action="toggle-drawer" aria-label="সাইডবার">${icon('menu')}</button><div><span class="breadcrumb">হিসাব ঘর <b>/</b></span><h1>শুভেচ্ছা, ${identityName()}</h1></div></div><div class="dashboard-header-actions"><span class="demo-label">AUTH CONNECTED</span><button class="icon-button" data-action="toast" data-message="নতুন notification এখনো সংযুক্ত হয়নি" aria-label="নোটিফিকেশন">◌<span class="notification-dot"></span></button><button class="profile-pill" data-action="open-password-modal"><span class="profile-mini">আউ</span><span>${identityName()}</span>${icon('chevronRight')}</button></div></header>
      <main class="dashboard-content section-wrap">
        <div class="dashboard-intro"><div><div class="section-kicker">নভেম্বর ২০২৬ <span></span></div><h2>এই মাসের চিত্র</h2><p>আপনার সমিতির হিসাব এক নজরে। সব সংখ্যা ডেমো ডেটা দিয়ে দেখানো হচ্ছে।</p></div><div class="period-select">নভেম্বর ২০২৬ ${icon('chevronDown')}</div></div>
        <section class="stat-grid">
          <article class="stat-card stat-primary"><div class="stat-top"><span>মোট তহবিল</span><span class="stat-icon">${icon('wallet')}</span></div><strong>৳ ১২,৪৮,০০০</strong><small><b>↑ ৮.৪%</b> গত মাসের তুলনায়</small><div class="stat-spark"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article>
          <article class="stat-card"><div class="stat-top"><span>এই মাসে জমা</span><span class="stat-icon">${icon('arrowDown')}</span></div><strong>৳ ৪২,০০০</strong><small><b class="green">১২টি</b> লেনদেন সম্পন্ন</small><div class="stat-bars"><i style="height:34%"></i><i style="height:52%"></i><i style="height:40%"></i><i style="height:70%"></i><i style="height:58%"></i><i style="height:88%"></i><i style="height:76%"></i></div></article>
          <article class="stat-card"><div class="stat-top"><span>এই মাসে খরচ</span><span class="stat-icon expense">${icon('arrowUp')}</span></div><strong>৳ ১৩,৪৫০</strong><small><b class="dark">৩টি</b> ভাউচার এন্ট্রি</small><div class="expense-line"><span></span><i></i><i></i><i></i><i></i></div></article>
          <article class="stat-card"><div class="stat-top"><span>সক্রিয় সদস্য</span><span class="stat-icon member">${icon('users')}</span></div><strong>২৪ <small class="unit">জন</small></strong><small><b class="green">+২ জন</b> এই বছরে</small><div class="member-avatars"><span>রআ</span><span>সই</span><span>সন</span><span>+২১</span></div></article>
        </section>

        <section class="dashboard-block" id="deposits"><div class="block-header"><div><div class="section-kicker">সাম্প্রতিক হিসাব <span></span></div><h3>জমা খাতা</h3></div><div class="block-actions"><button class="button button-outline button-small" data-action="toast" data-message="জমা এন্ট্রি demo mode-এ বন্ধ আছে">${icon('plus')} নতুন জমা</button><a class="text-link" href="#deposits">সব দেখুন ${icon('arrow')}</a></div></div><div class="table-wrap"><table><thead><tr><th>তারিখ</th><th>সদস্য</th><th>ধরন</th><th>পরিমাণ</th><th>পেমেন্ট</th><th>Late Deposit</th><th></th></tr></thead><tbody>${deposits.map(row => `<tr><td>${row.date}</td><td><strong>${row.member}</strong><small>${row.id}</small></td><td><span class="tag tag-teal">${row.category}</span></td><td class="amount">${row.amount}</td><td>${row.method}</td><td>${row.late ? `<span class="late-pill">দেরিতে</span>` : '<span class="muted-dash">—</span>'}</td><td><button class="row-menu" data-action="toast" data-message="Receipt preview demo mode-এ উপলব্ধ">•••</button></td></tr>`).join('')}</tbody></table></div></section>

        <div class="dashboard-two-col"><section class="dashboard-block compact-block" id="expenses"><div class="block-header"><div><div class="section-kicker">বেরিয়ে গেছে <span></span></div><h3>খরচের খাতা</h3></div><a class="text-link" href="#expenses">সব দেখুন ${icon('arrow')}</a></div><div class="expense-list">${expenses.map(exp => `<div class="expense-row"><div class="expense-icon">${icon('file')}</div><div><strong>${exp.description}</strong><span>${exp.date} · ${exp.category}</span></div><b>${exp.amount}</b></div>`).join('')}</div></section><section class="dashboard-block compact-block" id="members-sheet"><div class="block-header"><div><div class="section-kicker">নিজের হিসাব <span></span></div><h3>সদস্য শিট</h3></div><a class="text-link" href="#members-sheet">শিট খুলুন ${icon('arrow')}</a></div><div class="sheet-preview"><div class="sheet-person"><div class="sheet-avatar">আউ</div><div><strong>আহমেদ উল্লাহ</strong><span>Member ID · S-001</span></div></div><div class="sheet-balance"><span>এই বছর মোট জমা</span><strong>৳ ৬০,০০০</strong><small>শেষ এন্ট্রি · ০৩ নভেম্বর</small></div><div class="sheet-progress"><span style="width: 68%"></span></div><div class="sheet-foot"><span>লক্ষ্যের ৬৮%</span><button class="text-link" data-action="toast" data-message="পূর্ণ সদস্য শিট demo mode-এ লোড হবে">বিস্তারিত ${icon('arrow')}</button></div></div></section></div>

        <section class="admin-panel dashboard-block" id="admin"><div class="block-header"><div><div class="section-kicker">Admin only <span></span></div><h3>অ্যাডমিন প্যানেল</h3></div><span class="admin-status">শুধু Admin role</span></div><p class="admin-description">এখানকার সংরক্ষণ, edit এবং delete Supabase RLS দ্বারা অনুমোদিত Admin account-এ সীমাবদ্ধ।</p><div class="admin-actions"><button data-action="open-admin-kind" data-kind="settings">${icon('settings')} Site settings <span>ইডিট</span></button><button data-action="open-admin-kind" data-kind="gallery">${icon('plus')} Gallery & posts <span>এড / ডিলিট</span></button><button data-action="open-admin-kind" data-kind="members">${icon('users')} Members & roles <span>ম্যানেজ</span></button><button data-action="open-admin-kind" data-kind="ledger">${icon('wallet')} Ledger control <span>ইডিট / ডিলিট</span></button></div><div class="admin-note">Record ID খালি রেখে নতুন record যোগ করুন; Record ID দিয়ে পুরোনো record edit বা delete করুন।</div></section><section class="report-panel" id="reports"><div><div class="section-kicker light">রিপোর্ট সেন্টার <span></span></div><h3>হিসাবকে গল্পের মতো বুঝুন</h3><p>নির্বাচিত জমা বা খরচের block-এর Print button ব্যবহার করুন।</p></div><div class="report-actions"><button class="button button-paper button-small" data-action="print-report" data-target="deposits">${icon('file')} জমা প্রিন্ট</button><button class="button button-ghost-light button-small" data-action="print-report" data-target="expenses">${icon('download')} খরচ প্রিন্ট</button></div><div class="report-period">১ নভেম্বর ২০২৬ — ৩০ নভেম্বর ২০২৬</div></section>
      </main>
      ${state.passwordModal ? renderPasswordModal() : ''}
      ${state.adminModal ? renderAdminModal() : ''}
    </div>
  </div>
`

const renderApp = (): void => {
  window.clearInterval(autoPlayTimer)
  if (state.route === '/hisab' && !state.authReady) {
    app.innerHTML = '<div class="protected-page"><main class="gate-main section-wrap"><div class="gate-card"><div class="gate-icon">◌</div><h1>সংযোগ যাচাই হচ্ছে…</h1><p>Supabase Auth session নিরাপদে যাচাই করা হচ্ছে।</p></div></main></div>'
  } else if (state.route === '/hisab' && state.signedIn) {
    app.innerHTML = renderDashboard()
  } else if (state.route === '/hisab') {
    app.innerHTML = renderProtectedGate()
  } else {
    app.innerHTML = renderHome()
    if (!state.modalOpen && !state.lightboxOpen) {
      autoPlayTimer = window.setInterval(() => {
        state.galleryIndex = (state.galleryIndex + 1) % gallery.length
        renderApp()
      }, 5000)
    }
  }
  if (state.toast) {
    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.innerHTML = `${icon('check')}<span>${state.toast}</span>`
    app.appendChild(toast)
    window.setTimeout(() => {
      state.toast = ''
      toast.remove()
    }, 2600)
  }
}

const navigate = (path: string): void => {
  state.route = path
  state.modalOpen = false
  state.lightboxOpen = false
  state.drawerOpen = false
  window.history.pushState({}, '', path)
  renderApp()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openAuth = (mode: 'login' | 'signup' = 'login'): void => {
  state.authMode = mode
  state.modalOpen = true
  renderApp()
  window.setTimeout(() => app.querySelector<HTMLInputElement>('input[name="memberId"]')?.focus(), 40)
}

const showToast = (message: string): void => {
  state.toast = message
  renderApp()
}

const hydrateAuth = async (): Promise<void> => {
  if (!supabase) {
    state.authReady = true
    renderApp()
    return
  }
  const { data } = await supabase.auth.getSession()
  state.authUser = data.session?.user ?? null
  state.signedIn = Boolean(data.session)
  state.authReady = true
  if (!state.modalOpen) renderApp()
  supabase.auth.onAuthStateChange((_event, session) => {
    state.authUser = session?.user ?? null
    state.signedIn = Boolean(session)
    state.authReady = true
    if (!state.modalOpen) renderApp()
  })
}

const signOut = async (): Promise<void> => {
  if (supabase) await supabase.auth.signOut()
  state.authUser = null
  state.signedIn = false
  showToast('সফলভাবে সাইন আউট হয়েছে')
  window.setTimeout(() => navigate('/'), 800)
}

const adminTable = (): string => state.adminKind === 'settings' ? 'cooperativeSettings' : state.adminKind === 'members' ? 'members' : state.adminKind === 'ledger' ? 'ledgerEntries' : 'galleryItems'

const submitAdminForm = async (form: HTMLFormElement, operation: string): Promise<void> => {
  if (!supabase) return
  const values = Object.fromEntries(new FormData(form).entries()) as Record<string, string>
  const table = adminTable()
  const recordId = values.recordId?.trim()
  const now = new Date().toISOString()
  let payload: Record<string, unknown>
  if (state.adminKind === 'settings') payload = { name: values.name, primaryTagline: values.primaryTagline, secondaryTagline: values.secondaryTagline, contactEmail: values.contactEmail, updatedBy: state.authUser?.id, updatedAt: now }
  else if (state.adminKind === 'members') payload = { memberCode: values.memberCode, fullName: values.fullName, phone: values.phone || null, email: values.email || null, address: values.address || null, occupation: values.occupation || null, status: values.status, joinedAt: now, updatedAt: now, createdAt: now }
  else if (state.adminKind === 'ledger') payload = { referenceNo: values.referenceNo, type: values.type, occurredAt: values.occurredAt, category: values.category, memberId: values.memberId ? Number(values.memberId) : null, description: values.description || null, amount: Number(values.amount), paymentMethod: values.paymentMethod || null, enteredBy: state.authUser?.id, createdAt: now, updatedAt: now }
  else payload = { title: values.title, description: values.description || null, imageUrl: values.imageUrl, imageKey: values.imageKey, mimeType: values.mimeType, createdBy: state.authUser?.id, createdAt: now }
  let result
  if (operation === 'delete') {
    if (!recordId) throw new Error('Delete করার জন্য Record ID দিন।')
    result = await supabase.from(table).delete().eq('id', Number(recordId))
  } else if (state.adminKind === 'settings') {
    result = await supabase.from(table).update(payload).eq('id', 1)
  } else if (recordId) {
    delete payload.createdAt
    result = await supabase.from(table).update(payload).eq('id', Number(recordId))
  } else {
    result = await supabase.from(table).insert(payload)
  }
  if (result.error) throw result.error
  state.adminModal = false
  state.adminError = ''
  showToast(operation === 'delete' ? 'রেকর্ড মুছে ফেলা হয়েছে' : 'রেকর্ড সংরক্ষণ হয়েছে')
}

app.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  const actionElement = target.closest<HTMLElement>('[data-action]')
  if (!actionElement) return
  const action = actionElement.dataset.action
  if (action === 'stop-propagation') {
    event.stopPropagation()
    return
  }
  if (action === 'home') {
    event.preventDefault()
    navigate('/')
    return
  }
  if (action === 'open-hisab') {
    event.preventDefault()
    if (state.signedIn) navigate('/hisab')
    else openAuth('login')
    return
  }
  if (action === 'open-login') {
    openAuth('login')
    return
  }
  if (action === 'close-modal') {
    state.modalOpen = false
    renderApp()
    return
  }
  if (action === 'open-password-modal') {
    state.passwordModal = true
    renderApp()
    return
  }
  if (action === 'close-password-modal') {
    state.passwordModal = false
    renderApp()
    return
  }
  if (action === 'close-admin-modal') {
    state.adminModal = false
    state.adminError = ''
    renderApp()
    return
  }
  if (action === 'admin-kind') {
    state.adminKind = (actionElement.dataset.kind as typeof state.adminKind) ?? 'settings'
    state.adminError = ''
    renderApp()
    return
  }
  if (action === 'open-admin-kind') {
    state.adminKind = (actionElement.dataset.kind as typeof state.adminKind) ?? 'settings'
    state.adminError = ''
    state.adminModal = true
    renderApp()
    return
  }
  if (action === 'admin-delete') {
    const form = actionElement.closest<HTMLFormElement>('form')
    if (form) void submitAdminForm(form, 'delete').catch((error: Error) => { state.adminError = error.message; renderApp() })
    return
  }
  if (action === 'auth-tab') {
    state.authMode = (actionElement.dataset.mode as 'login' | 'signup') ?? 'login'
    renderApp()
    return
  }
  if (action === 'toggle-password') {
    const input = actionElement.closest('.password-input')?.querySelector<HTMLInputElement>('input')
    if (input) input.type = input.type === 'password' ? 'text' : 'password'
    return
  }
  if (action === 'gallery-prev' || action === 'gallery-next') {
    state.galleryIndex = action === 'gallery-next' ? (state.galleryIndex + 1) % gallery.length : (state.galleryIndex - 1 + gallery.length) % gallery.length
    renderApp()
    return
  }
  if (action === 'gallery-go') {
    state.galleryIndex = Number(actionElement.dataset.index ?? 0)
    renderApp()
    return
  }
  if (action === 'open-lightbox') {
    state.lightboxOpen = true
    renderApp()
    return
  }
  if (action === 'close-lightbox') {
    state.lightboxOpen = false
    renderApp()
    return
  }
  if (action === 'toggle-drawer') {
    state.drawerOpen = !state.drawerOpen
    renderApp()
    return
  }
  if (action === 'sign-out') {
    void signOut()
    return
  }
  if (action === 'print') {
    window.print()
    return
  }
  if (action === 'print-report') {
    const target = actionElement.dataset.target ?? 'deposits'
    document.body.classList.add(`print-${target}`)
    window.setTimeout(() => window.print(), 0)
    window.addEventListener('afterprint', () => document.body.classList.remove(`print-${target}`), { once: true })
    return
  }
  if (action === 'toast') {
    showToast(actionElement.dataset.message ?? 'এই ফিচারটি শিগগিরই আসছে')
    return
  }
  if (action === 'admin-info') {
    state.adminKind = 'settings'
    state.adminModal = true
    renderApp()
  }
})

app.addEventListener('submit', async (event) => {
  const form = event.target as HTMLFormElement
  event.preventDefault()
  if (form.dataset.action === 'password-submit') {
    const values = Object.fromEntries(new FormData(form).entries()) as Record<string, string>
    const error = app.querySelector<HTMLElement>('[data-password-error]')
    if (values.newPassword.length < 8 || values.newPassword !== values.confirmPassword) {
      if (error) error.textContent = 'দুটি password একই এবং অন্তত ৮ অক্ষরের হতে হবে।'
      return
    }
    if (!supabase) return
    const result = await supabase.auth.updateUser({ password: values.newPassword })
    if (result.error) { if (error) error.textContent = result.error.message; return }
    state.passwordModal = false
    showToast('Password সফলভাবে পরিবর্তন হয়েছে')
    return
  }
  if (form.dataset.action === 'admin-submit') {
    try { await submitAdminForm(form, 'save') } catch (error) { state.adminError = error instanceof Error ? error.message : 'সংরক্ষণ করা যায়নি'; renderApp() }
    return
  }
  if (form.dataset.action !== 'auth-submit') return
  const password = form.elements.namedItem('password') as HTMLInputElement | null
  const memberId = form.elements.namedItem('memberId') as HTMLInputElement | null
  const error = app.querySelector<HTMLElement>('[data-auth-error]')
  if (!password?.value || password.value.length < 6) {
    if (error) error.textContent = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
    password?.focus()
    return
  }
  if (!memberId?.value.trim()) {
    if (error) error.textContent = 'ইমেইল লিখুন।'
    memberId?.focus()
    return
  }
  if (state.authMode === 'signup') {
    if (error) error.textContent = 'নতুন সদস্য আবেদন এখন Admin approval workflow-এর মাধ্যমে চালু হবে।'
    return
  }
  if (!supabase) {
    if (error) error.textContent = 'Supabase configuration পাওয়া যাচ্ছে না। Netlify environment settings যাচাই করুন।'
    return
  }
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')
  if (submitButton) {
    submitButton.disabled = true
    submitButton.textContent = 'যাচাই হচ্ছে…'
  }
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email: memberId.value.trim(),
    password: password.value,
  })
  if (authError || !data.user) {
    if (error) error.textContent = authErrorMessage(authError?.message ?? 'unknown auth error')
    if (submitButton) submitButton.disabled = false
    return
  }
  state.authUser = data.user
  state.signedIn = true
  state.authReady = true
  state.modalOpen = false
  navigate('/hisab')
})

window.addEventListener('popstate', () => {
  state.route = window.location.pathname === '/hisab' ? '/hisab' : '/'
  renderApp()
})

renderApp()
void hydrateAuth()
