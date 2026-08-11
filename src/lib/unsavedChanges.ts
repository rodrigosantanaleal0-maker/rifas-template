/**
 * Guarda leve de "alterações não salvas" para navegação dentro do
 * PackLP Admin. O App Router aqui usa <BrowserRouter> (não o modo de
 * dados), então `useBlocker` do react-router não está disponível — em
 * vez disso, páginas com formulário chamam `setUnsavedChanges(dirty)`
 * e o Sidebar/Header consultam `confirmDiscardIfDirty()` antes de
 * navegar. Cobre também fechar/recarregar a aba via `beforeunload`.
 */
let dirty = false;

export function setUnsavedChanges(value: boolean) {
  dirty = value;
}

export function hasUnsavedChanges(): boolean {
  return dirty;
}

export function confirmDiscardIfDirty(): boolean {
  if (!dirty) return true;
  return window.confirm('Você possui alterações não salvas. Deseja realmente sair sem salvar?');
}
