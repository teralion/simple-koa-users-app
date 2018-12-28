
function deleteUser(userId) {
  const headers = new Headers();
  headers.append('content-type', 'application/json');
  const url = 'http://localhost:3000/users';
  const init = {
    method: 'DELETE',
    headers: headers,
    body: JSON.stringify({'id': userId})
  };

  return fetch(new Request(url), init)
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(e => console.error(e))
}

function handleDelete(event) {
  event.preventDefault();

  const id = event.target.closest('[data-user-id]').dataset.userId;
  if (!id) return;
  deleteUser(id);
}
