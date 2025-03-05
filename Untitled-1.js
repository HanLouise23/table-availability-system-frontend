const xhttpr = new XMLHttpRequest();
xhttpr.open('GET', 'localhost:8000/resturants', true);

xhttpr.send();

xhttpr.onload = ()=> {
  if (xhttpr.status === 200) {
      const response = JSON.parse(xhttpr.response);
      // Process the response data here
  } else {
      // Handle error
  }
};