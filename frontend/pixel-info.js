function makePixelInfoDisplay(element, history) {
  console.log('Making history display', history);

  element.innerHTML = '';

  for (const entry of history) {
    element.appendChild(makeHistoryElement(entry));
  }
}

function makeHistoryElement(entry) {
  const el = document.createElement('div');

  const img = document.createElement('img');
  img.setAttribute('src', entry.user.picture);
  img.style.width = 32;
  img.style.height = 32;
  el.appendChild(img);

  const info = document.createElement('span');
  info.innerText = `Color: ${gameInfo.colors[entry.pix].name} User: ${entry.user.name}`;
  el.appendChild(info);

  return el;
}
