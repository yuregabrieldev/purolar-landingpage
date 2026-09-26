const SUPABASE_URL = 'https://iexionzhuymetllkwgkv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleGlvbnpodXltZXRsbGt3Z2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTU4NDgsImV4cCI6MjEwNTY3MTg0OH0.Nv5yWm2ghH7CGgziJXtWYaOQK1Etdu3K08Oiocgezg8';

const gate = document.querySelector('#gate');
const workspace = document.querySelector('#workspace');
const form = document.querySelector('#gate-form');
const error = document.querySelector('#gate-error');
const submit = document.querySelector('#gate-submit');
const logout = document.querySelector('#logout');

function showWorkspace() {
  if (!gate || !workspace) return;
  gate.hidden = true;
  workspace.hidden = false;
  document.title = 'Biblioteca reservada · PuroLar';
}

function showGate() {
  if (!gate || !workspace) return;
  gate.hidden = false;
  workspace.hidden = true;
}

function messageFor(error) {
  if (!error) return 'Não foi possível iniciar a sessão.';
  if (/invalid login credentials/i.test(error.message)) return 'E-mail ou palavra-passe incorretos.';
  if (/email not confirmed/i.test(error.message)) return 'Confirme o e-mail antes de entrar.';
  return 'Não foi possível iniciar a sessão. Tente novamente.';
}

(async () => {
  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    const { data: { session } } = await client.auth.getSession();
    if (session) showWorkspace(); else showGate();

    client.auth.onAuthStateChange((_event, nextSession) => {
      if (nextSession) showWorkspace(); else showGate();
    });

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      error.textContent = '';
      submit.disabled = true;
      submit.dataset.originalText = submit.textContent;
      submit.childNodes[0].textContent = 'A entrar… ';
      const email = document.querySelector('#gate-email').value.trim();
      const password = document.querySelector('#gate-password').value;
      const { error: signInError } = await client.auth.signInWithPassword({ email, password });
      if (signInError) error.textContent = messageFor(signInError);
      submit.disabled = false;
      submit.childNodes[0].textContent = 'Entrar ';
    });

    logout?.addEventListener('click', async () => {
      await client.auth.signOut();
      showGate();
    });
  } catch (loadError) {
    showGate();
    if (error) error.textContent = 'Não foi possível carregar o serviço de autenticação.';
    console.error(loadError);
  }
})();
