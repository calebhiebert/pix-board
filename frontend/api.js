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
