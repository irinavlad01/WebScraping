var quotes = []

async function postData(url, data) { // trimite post request-uri, trimite json, returneaza raspunsul ca string, deci trebuie deserializat daca e primit json
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.text();
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


async function deleteData(url) { // trimite delete request-uri, returneaza raspunsul ca string
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const responseData = await response.text();
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


async function getData(url) { // returneaza raspunsul ca string, deci trebuie deserializat daca raspunsul primit e de tip json
    try {
        const response = await fetch(url);

        const responseData = await response.text();
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function fetchQuotes() {
    const jsonResponse = await getData('backend/web-scraping-script.php');
    quotes = JSON.parse(jsonResponse);

    const quotesTable = document.getElementById("quotesTable");
    quotes.forEach(quote => {
        const row = document.createElement("tr");

        const authorCell = document.createElement("td");
        authorCell.textContent = quote.author;
        row.appendChild(authorCell);

        const quoteCell = document.createElement("td");
        quoteCell.textContent = quote.quote;
        row.appendChild(quoteCell);

        quotesTable.appendChild(row);
    });
}

async function insertInJsonServer() {
    const new_author = document.getElementById("author-input").value;
    const new_quote = document.getElementById("quote-input").value;

    const new_quote_element = { "author": new_author, "quote": new_quote };
    quotes.push(new_quote_element);

    const response = await postData('backend/json-server.php', quotes);
    if (parseInt(response) === 1) {
        // success
        const jsonServerTable = document.getElementById("jsonServerTable");

        // fetch data from json-server
        const jsonServerData = await getData('http://localhost:4000/quotes');
        const dataArray = JSON.parse(jsonServerData);

        dataArray.forEach(quote => {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = quote.id;
            row.appendChild(idCell);

            const authorCell = document.createElement("td");
            authorCell.textContent = quote.author;
            row.appendChild(authorCell);

            const quoteCell = document.createElement("td");
            quoteCell.textContent = quote.quote;
            row.appendChild(quoteCell);

            jsonServerTable.appendChild(row);
        });
    } else {
        console.log(response);
    }
}

async function deleteInJsonServer() {
    console.log("a intrat in fct");
    const delete_author = document.getElementById("delete-input").value;
    const encodedAuthor = delete_author.split(' ').join('%20');
    // Filtrăm citatele care au autorul specificat
    const filteredQuotes = quotes.filter(item => item.author === encodedAuthor);
  
    // Parcurgem fiecare citat filtrat și trimitem o solicitare de ștergere către server
    filteredQuotes.forEach(async (quote) => {
      const response = await deleteData('backend/json-server-delete.php?id=' + quote.id);
  
      // Verificăm răspunsul și afișăm un mesaj corespunzător
      if (response === '1') {
        console.log('Citatul cu id-ul ' + quote.id + ' a fost șters cu succes.');
      } else {
        console.log('Eroare la ștergerea citatului cu id-ul ' + quote.id + '.');
      }
    });
  
    // Actualizăm variabila quotes cu citatele rămase
    quotes = quotes.filter(item => item.author !== encodedAuthor);
  
    // Solicităm datele actualizate din json-server
    const jsonServerData = await getData('http://localhost:4000/quotes');
    const dataArray = JSON.parse(jsonServerData);
  
    // Găsim tabela din HTML pentru a o actualiza
    const jsonServerTable = document.getElementById("jsonServerDeleteTable");
  
    // Golim tabela existentă
    while (jsonServerTable.firstChild) {
      jsonServerTable.removeChild(jsonServerTable.firstChild);
    }
  
    // Adăugăm rândurile actualizate în tabela HTML
    dataArray.forEach(quote => {
      const row = document.createElement("tr");
  
      const idCell = document.createElement("td");
      idCell.textContent = quote.id;
      row.appendChild(idCell);
  
      const authorCell = document.createElement("td");
      authorCell.textContent = quote.author;
      row.appendChild(authorCell);
  
      const quoteCell = document.createElement("td");
      quoteCell.textContent = quote.quote;
      row.appendChild(quoteCell);
  
      jsonServerTable.appendChild(row);
    });
  }
  

// async function deleteInJsonServer() {
//     const delete_quote = document.getElementById("delete-input").value;

//     const delete_quote_element = { "quote": delete_quote };
//     quotes.push(delete_quote_element);

//     const response = await postData('backend/json-server.php', quotes);
//     if (parseInt(response) === 1) {
//         // success
//         const jsonServerDeleteTable = document.getElementById("jsonServerDeleteTable");

//         // fetch data from json-server
//         const jsonServerDataDelete = await getData('http://localhost:4000/quotes');
//         const dataArray = JSON.parse(jsonServerDataDelete);

//         dataArray.forEach(quote => {
//             const row = document.createElement("tr");

//             const idCell = document.createElement("td");
//             idCell.textContent = quote.id;
//             row.deleteChild(idCell);

//             const quoteCell = document.createElement("td");
//             quoteCell.textContent = quote.quote;
//             row.deleteChild(quoteCell);

//             jsonServerDeleteTable.deleteChild(row);
//         });
//     } else {
//         console.log(response);
//     }
// }