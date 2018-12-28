
function changeUser(formData = {}) {
  const headers = new Headers();
  const pathname = getPathname();
  const url = `http://localhost:3000${pathname}`;
  const init = {
    method: 'PATCH',
    headers: headers,
    body: formData
  };

  return fetch(new Request(url, init))
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(e => console.error(e))
}

function handleChange(event) {
  event.preventDefault();

  const form = document.getElementById('change-user');
  changeUser(new FormData(form))
    .then(() => {
      form.reset();
      document.location.assign('http://localhost:3000/users');
    });
}

function getPathname() {
  return document.location.pathname;
}
