function save_data_sessionstorage_redirect(data, produtoId) {
    sessionStorage.setItem("produto", JSON.stringify(data));
    sessionStorage.setItem("produtoId", produtoId);
    window.location.replace("produto.html");
}

function detalhar(link_detalhar) {
    let produtoId = link_detalhar.parentNode.previousSibling.previousSibling.textContent;
    let url = "http://localhost:8080/produtos/" + produtoId;
    fetch(url, {
        method: "GET"
    })
        .then(res => res.json())
        .then(data => save_data_sessionstorage_redirect(data, produtoId))
}

function delete_row(msg, row_id) {
    console.log(msg);
    document.getElementById("myTable").deleteRow(row_id)
}

function excluir(link_excluir) {
    if (confirm("Confirmar a exclusão do produto?") == true) {
        let first_td = link_excluir.parentNode.previousSibling.previousSibling;
        let row_id = first_td.parentNode.rowIndex;
        let produtoId = first_td.textContent;
        let url = "http://localhost:8080/produtos/" + produtoId;
        fetch(url, {
            method: "DELETE"
        })
            .then(msg => delete_row(msg, row_id))
    }
}

function listar() {
    let nomepesquisa = document.getElementById("nomepesquisa");
    sessionStorage.setItem("filtroPesquisa", nomepesquisa.value);
    let table_body = document.getElementById("table_body");
    let div_msg = document.getElementById("msg");
    div_msg.innerHTML = "";
    table_body.innerHTML = "";
    let url = "http://localhost:8080/produtos/filter?nome=" + nomepesquisa.value;

    fetch(url, {
        method: "GET"

    })
        .then(res => res.json())
        .then(data => {
            Object.entries(data).forEach(([key, value]) => {
                let row = table_body.insertRow(-1);
                let cell_codigo = row.insertCell(0);
                let cell_nome = row.insertCell(1);
                let cell_acoes = row.insertCell(2);
                cell_codigo.innerHTML = value.codigo;
                cell_nome.innerHTML = value.nome;
                cell_acoes.innerHTML = "<a class='link_editar' href='#' onclick='javascript:detalhar(this)'><img src='img/editar.png' style='float:left; margin:5px; width:30px' /> </a>" +
                    "<a class='link_excluir' href='#' onclick='javascript:excluir(this)'><img src='img/excluir.png' style='float:left; margin:5px; width:30px' /> </a>";
            })
            if (data.length == 0) {
                document.getElementById("table_head").style.display = "none";
                div_msg.innerHTML =
                    "<div class='alert alert-info'>" +
                    "Nenhum produto encontrado!" +
                    "</div>"
            } else {
                document.getElementById("table_head").style.display = "table-header-group";
            }
        })
}

window.onload = function () {

    let load_type = window.performance.getEntriesByType("navigation")[0].type;
    console.log(load_type);
    if (sessionStorage.filtroPesquisa) {
        if (load_type == "navigate") {
            document.getElementById("nomepesquisa").value = sessionStorage.filtroPesquisa
        } else { //reload
            sessionStorage.removeItem("filtroPesquisa");
        }
    }

    listar();

    document.getElementById("btnconsultar").addEventListener("click", function (e) {
        e.preventDefault();
        listar();
    });

    document.getElementById("btnlimpar").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("table_head").style.display = "none";
        let table_body = document.getElementById("table_body");
        table_body.innerHTML = "";
        let div_msg = document.getElementById("msg");
        div_msg.innerHTML = "";
        document.getElementById("nomepesquisa").value = "";
    });

    document.getElementById("new_button").addEventListener("click", function (e) {
        e.preventDefault();
        window.location.replace("produto.html");
    });

}