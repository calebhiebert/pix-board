const authToken = localStorage.getItem('auth-token');

function handleAxiosResponse(response) {
  return response.data;
}

function getInfo() {
  return axios
    .get(`${apiUrl}/info`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then(handleAxiosResponse);
}

function getPix(x, y) {
  return axios
    .get(`${apiUrl}/pixel/${x}/${y}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then(handleAxiosResponse);
}

function getUser(id) {
  return axios
    .get(`${apiUrl}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      timeout: 5000,
    })
    .then(handleAxiosResponse);
}

function getBoard() {
  return axios
    .get(`${apiUrl}/board`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      onDownloadProgress(event) {
        const percent = event.loaded / event.total;
        console.log(`Board loaded ${Math.round(percent * 100)}%`);
      },
    })
    .then(handleAxiosResponse)
    .then((arraybuffer) => new Uint8Array(arraybuffer));
}

function place(x, y, pix) {
  return axios
    .post(
      `${apiUrl}/place`,
      {
        x,
        y,
        pix,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
    .then(handleAxiosResponse);
}
