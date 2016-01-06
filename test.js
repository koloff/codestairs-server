'use strict';

function shortenUrl(url) {

  let shortened;

  // remove protocol
  let protocolPos = url.indexOf('://');
  if (protocolPos !== -1) {
    let protocolPosEnd = protocolPos + 3;
    shortened = url.slice(protocolPosEnd, url.length);
  }

  // remove www if available
  let wwwPos = url.indexOf('www.');
  if (wwwPos !== -1 && shortened.slice(0, 3) === 'www') {
    let wwwPosEnd = wwwPos + 4;
    shortened = url.slice(wwwPosEnd, url.length);
  }

  // remove the slash in the end if available
  if (shortened[shortened.length - 1] === '/') {
    shortened = shortened.slice(0, shortened.length - 1);
  }

  return shortened;
}

shortenUrl('https://www.mail.google.com/mail/u/0/#inbox/');

shortenUrl('https://mail.google.com/mail/u/0/#inbox/');
