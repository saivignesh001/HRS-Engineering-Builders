/* ============================================
   HRS Engineers & Builders - Contact Form Config
   ============================================
   Intha file la 2 mattum edit pannunga. Beeley
   'HOW TO GET THESE' steps kudukirom.
*/

// 1) SUPABASE (contact form data save aaganum)
//    - supabase.com la login pannunga -> unga project -> Settings -> API
//    - "Project URL" mattrum "anon public" key copy pannunga
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";      // e.g. https://xxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_PUBLIC_KEY";

// 2) WEB3FORMS (form submit aana odane email vரும் - saidha PHP mail() venam)
//    - https://web3forms.com ku pogunga -> unga email potu "Create Access Key" click pannunga
//    - Free ah kudukura Access Key ah keela paste pannunga
const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

// Ithuku keela ethuvum edit pannatheenga
window.HRS_CONFIG = { SUPABASE_URL, SUPABASE_ANON_KEY, WEB3FORMS_ACCESS_KEY };
