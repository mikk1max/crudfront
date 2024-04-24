document.addEventListener('DOMContentLoaded', () => {
    getAllProducts();
    var bdodaj = document.getElementById('add');
    bdodaj.addEventListener("click", () => {
        //Dodawanie
        dodaj();
    });
    // Obsługa kliknięcia przycisku "Edytuj"
    var dbzmien = document.getElementById('edit');
    dbzmien.addEventListener("click", () => {
        var name = document.getElementById('editName').value;
        var price = document.getElementById('editPrice').value;
        update(name, price);
    });

});

function dodaj() {
    console.log("Dodawanie nowego produktu");
    var st = {};
    st.name = document.getElementById('name').value;
    st.price = parseInt(document.getElementById('price').value);
    fetch("http://localhost:8000/api/products", {
        method: "post",
        body: JSON.stringify(st),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Accept": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) { //status odpowiedzi różny od 2xx
                return response.json().then(error => {
                    return Promise.reject(error);
                });
            }
            return response.json();
        })
        .then(response => {
            console.log("Dodano produkt:");
            console.log(response);
            getAllProducts(); // Wywołanie funkcji do pobrania i wyświetlenia wszystkich produktów
            document.getElementById('name').value = "";
            document.getElementById('price').value = "";
            console.log("Koniec dodawania");
        }).catch((error) => {
            if (error.errors) {
                var errorMessage = Object.values(error.errors).flat().join('<br>');
                showMessage(errorMessage);
            } else {
                showMessage("Wystąpił błąd: " + JSON.stringify(error));
            }
        });
}



function edytuj(id, name, price) {
    var x = document.getElementById("divedit");
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editPrice').value = price;
    x.style.visibility = "visible";
}
function update() {
    var st = {};
    st.id = document.getElementById('editId').value;
    st.name = document.getElementById('editName').value;
    st.price = document.getElementById('editPrice').value;

    fetch("http://localhost:8000/api/products/" + st.id, {
        method: "put",
        body: JSON.stringify(st),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(response => {
            if (!response.ok) { //status odpowiedzi różny od 2xx
                return response.json().then(error => {
                    return Promise.reject(error);
                });
            }
            return response.json();
        })
        .then(response => {
            console.log("Zmieniono produkt:");
            console.log(response);
            getAllProducts(); // Wywołanie funkcji do pobrania i wyświetlenia wszystkich produktów
            document.getElementById('name').value = "";
            document.getElementById('price').value = "";
            console.log("Koniec modyfikacji");
        }).catch((error) => {
            if (error.errors) {
                var errorMessage = Object.values(error.errors).flat().join('<br>');
                showMessage(errorMessage);
            } else {
                showMessage("Wystąpił błąd: " + JSON.stringify(error));
            }
        });
}
function getAllProducts() {
    fetch("http://localhost:8000/api/products")
        .then((response) => {
            if (!response.ok) {
                return Promise.reject('Coś poszło nie tak!');
            }
            return response.json();
        })
        .then((data) => {
            pokazTabele(data);
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
            err.innerHTML = error;
        });
}
function usun(id) {
    fetch("http://localhost:8000/api/products/" + id, {
        method: "delete",
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(response => {
            if (!response.ok) {
                return Promise.reject('Problem z usunięciem danych!');
            }
            return response.json();
        })
        .then(response => {
            console.log("Usunięto produkt o id:" + id);
            console.log(response);
            getAllProducts();
        }).catch((error) => {
            console.log(error);
            err.innerHTML = error;
        });
}
function pokazTabele(response) {
    var main = document.getElementById('main');
    var content = "<table border='1' width='100%' style='font-size: larger'> <thead style='background: #C0C0C0' align='center'> <tr> <th>ID</th><th>Name</th>" + "<th>Price</th> <th colspan=2>Control</th> </tr></thead><tbody align='center' style='background: #F5F5F5'>";
    for (var st in response) {
        var name = response[st].name;
        var price = response[st].price;
        var id = response[st].id;
        content += "<tr><td style='background: #C0C0C0;'>" + id + "</td><td style='padding: 0 1% 0 1%;'>" + name + "</td><td style='padding: 0 1% 0 1%;'>" + price + "</td>";
        content += "<td><button style='width: 100%; height: 100%; background: #FF0000; font-size: large;' onclick='usun(" + id + ")'>Usuń</button></td>";
        content += "<td><button style='width: 100%; height: 100%; background: #FFD700; font-size: large;' onclick='edytuj(" + id + ",\"" + name + "\"," + price + ")'>Edytuj</button></td></tr>";
    }
    content += "</tbody></table>";
    main.innerHTML = content;
}