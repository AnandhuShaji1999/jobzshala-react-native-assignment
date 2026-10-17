export type Locale = 'en' | 'hi';

const en = {
  // Navigation / chrome
  appTitle: 'Job Matches',
  jobDetailTitle: 'Job details',
  applicationTitle: 'Application',
  languageToggleLabel: 'Language: English. Tap to switch to Hindi',
  languageShort: 'EN',

  // Filters & countries
  filterLabel: 'Filter by country',
  filterAll: 'All',
  countryUAE: 'UAE',
  countrySaudi: 'Saudi Arabia',
  countryQatar: 'Qatar',

  // Card
  matchPercent: '{pct}% match',
  salaryRange: 'AED {min} – {max} / month',
  applied: 'Applied',
  openJob: 'Open job: {title}',

  // List states
  loadingMatches: 'Finding your best matches…',
  emptyTitle: 'No matches yet',
  emptyBody: 'We will show jobs here as soon as we find ones that fit your profile.',
  emptyFilteredBody: 'No matches in {country} right now. Try another country.',
  showAllCountries: 'Show all countries',
  errorTitle: 'Something went wrong',
  errorBody: "We couldn't load your jobs. Please try again.",
  retry: 'Retry',
  offlineNoCacheTitle: "You're offline",
  offlineNoCacheBody: 'Connect to the internet to see your job matches.',
  refreshFailed: "Couldn't refresh your jobs.",
  loadMoreFailed: "Couldn't load more jobs.",
  loadingMore: 'Loading more jobs…',
  dismiss: 'Dismiss',

  // Offline
  offlineBanner: "You're offline — showing saved jobs",
  applyOfflineHint: "You're offline. Connect to the internet to apply.",

  // Detail
  loadingJob: 'Loading job…',
  jobLoadError: "We couldn't load this job.",
  whyMatch: 'Why this matches you',
  aboutJob: 'About the job',
  requirements: 'Requirements',
  benefits: 'Benefits',
  accommodation: 'Accommodation',
  food: 'Food',
  visa: 'Visa',
  provided: 'Provided',
  notProvided: 'Not provided',
  skills: 'Skills',
  apply: 'Apply',
  applyA11y: 'Apply for {title}',
  alreadyApplied: 'Applied',

  // Confirmation
  confirmTitle: 'Application sent',
  confirmBody: 'Your profile has been shared for {title}. We will let you know when there is an update.',
  confirmSyncing: 'Confirming with the server…',
  backToMatches: 'Back to matches',
  viewJob: 'View job',
  applyFailedTitle: 'Application not sent',
  applyFailedServer:
    'Our server had a problem. Your application was not submitted and has been undone. Please try again.',
  applyFailedOffline:
    'You went offline, so your application was not submitted and has been undone. Connect and try again.',
  tryAgain: 'Try again',
  backToJob: 'Back to job',
  notAppliedTitle: 'Not applied yet',
  notAppliedBody: 'Open a job and tap Apply to send your application.',
  applyFailedSnackbar: "Couldn't apply to {title}. The application was undone.",
};

export type StringKey = keyof typeof en;

const hi: Record<StringKey, string> = {
  appTitle: 'जॉब मैच',
  jobDetailTitle: 'नौकरी का विवरण',
  applicationTitle: 'आवेदन',
  languageToggleLabel: 'भाषा: हिंदी। अंग्रेज़ी में बदलने के लिए टैप करें',
  languageShort: 'हि',

  filterLabel: 'देश के अनुसार छाँटें',
  filterAll: 'सभी',
  countryUAE: 'यूएई',
  countrySaudi: 'सऊदी अरब',
  countryQatar: 'कतर',

  matchPercent: '{pct}% मैच',
  salaryRange: 'AED {min} – {max} / माह',
  applied: 'आवेदन किया',
  openJob: 'नौकरी खोलें: {title}',

  loadingMatches: 'आपके लिए सबसे अच्छे मैच खोजे जा रहे हैं…',
  emptyTitle: 'अभी कोई मैच नहीं',
  emptyBody: 'जैसे ही आपकी प्रोफ़ाइल से मेल खाती नौकरियाँ मिलेंगी, वे यहाँ दिखेंगी।',
  emptyFilteredBody: '{country} में अभी कोई मैच नहीं है। कोई दूसरा देश चुनें।',
  showAllCountries: 'सभी देश दिखाएँ',
  errorTitle: 'कुछ गड़बड़ हो गई',
  errorBody: 'नौकरियाँ लोड नहीं हो सकीं। कृपया दोबारा कोशिश करें।',
  retry: 'दोबारा कोशिश करें',
  offlineNoCacheTitle: 'आप ऑफ़लाइन हैं',
  offlineNoCacheBody: 'अपने जॉब मैच देखने के लिए इंटरनेट से जुड़ें।',
  refreshFailed: 'नौकरियाँ रीफ़्रेश नहीं हो सकीं।',
  loadMoreFailed: 'और नौकरियाँ लोड नहीं हो सकीं।',
  loadingMore: 'और नौकरियाँ लोड हो रही हैं…',
  dismiss: 'बंद करें',

  offlineBanner: 'आप ऑफ़लाइन हैं — सहेजी गई नौकरियाँ दिख रही हैं',
  applyOfflineHint: 'आप ऑफ़लाइन हैं। आवेदन करने के लिए इंटरनेट से जुड़ें।',

  loadingJob: 'नौकरी लोड हो रही है…',
  jobLoadError: 'यह नौकरी लोड नहीं हो सकी।',
  whyMatch: 'यह नौकरी आपके लिए क्यों सही है',
  aboutJob: 'नौकरी के बारे में',
  requirements: 'ज़रूरी योग्यताएँ',
  benefits: 'सुविधाएँ',
  accommodation: 'रहने की व्यवस्था',
  food: 'खाना',
  visa: 'वीज़ा',
  provided: 'उपलब्ध',
  notProvided: 'उपलब्ध नहीं',
  skills: 'कौशल',
  apply: 'आवेदन करें',
  applyA11y: '{title} के लिए आवेदन करें',
  alreadyApplied: 'आवेदन किया',

  confirmTitle: 'आवेदन भेज दिया गया',
  confirmBody: '{title} के लिए आपकी प्रोफ़ाइल भेज दी गई है। कोई अपडेट आने पर हम आपको बताएँगे।',
  confirmSyncing: 'सर्वर से पुष्टि हो रही है…',
  backToMatches: 'मैच की सूची पर वापस जाएँ',
  viewJob: 'नौकरी देखें',
  applyFailedTitle: 'आवेदन नहीं भेजा गया',
  applyFailedServer:
    'हमारे सर्वर में समस्या आई। आपका आवेदन जमा नहीं हुआ और रद्द कर दिया गया है। कृपया दोबारा कोशिश करें।',
  applyFailedOffline:
    'आप ऑफ़लाइन हो गए, इसलिए आवेदन जमा नहीं हुआ और रद्द कर दिया गया है। इंटरनेट से जुड़कर दोबारा कोशिश करें।',
  tryAgain: 'दोबारा कोशिश करें',
  backToJob: 'नौकरी पर वापस जाएँ',
  notAppliedTitle: 'अभी आवेदन नहीं किया',
  notAppliedBody: 'कोई नौकरी खोलें और आवेदन भेजने के लिए "आवेदन करें" दबाएँ।',
  applyFailedSnackbar: '{title} के लिए आवेदन नहीं हो सका। आवेदन रद्द कर दिया गया।',
};

export const STRINGS: Record<Locale, Record<StringKey, string>> = { en, hi };
