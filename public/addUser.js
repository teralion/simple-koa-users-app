
function postUser(formData = {}) {
  const headers = new Headers();
  const url = 'http://localhost:3000/users';
  const init = {
    method: 'POST',
    headers,
    body: formData
  };

  return fetch(new Request(url, init))
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(e => console.error(e));
};

function addUser(event) {
  event.preventDefault();

  const form = document.getElementById('add-user');
  postUser(new FormData(form))
    .then(() => form.reset());
};
