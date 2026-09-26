const gate = document.querySelector('#gate');
const workspace = document.querySelector('#workspace');
if (gate && workspace) {
  gate.hidden = true;
  workspace.hidden = false;
  document.title = 'Biblioteca reservada · PuroLar';
}
