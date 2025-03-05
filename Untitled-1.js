function loadData() {
    fetch('http://localhost:8000/restaurants')
        .then(response => response.json())
        .then(data => {
            document.getElementById('data').innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => console.error('Error:', error));
}