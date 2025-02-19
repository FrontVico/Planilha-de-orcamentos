document.addEventListener("DOMContentLoaded", function() {
    const appId = "5iObAjUqaMgVB6Jo5uG82pZiv97k1udlluuAVdk6";
    const restKey = "2oC4mOGoFq3H8wY7V8fEqe03CHUBxDiA1v0zuFPK";
    const url = "https://parseapi.back4app.com/classes/Orcamentos";

    document.getElementById("orcamento-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const tipoServico = document.getElementById("tipoServico").value;
        const metragem = document.getElementById("metragem").value.trim();
        const endereco = document.getElementById("endereco").value.trim();
        const valor = document.getElementById("valor").value.trim();

        if (!nome || !email || !tipoServico || !metragem || !endereco || !valor) {
            alert("Preencha todos os campos antes de enviar!");
            return;
        }

        const orcamento = {
            nome: nome,
            email: email,
            tipo_servico: tipoServico,
            metragem: Number(metragem),
            endereco: endereco,
            valor: Number(valor),
            status: "pendente"
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "X-Parse-Application-Id": appId,
                "X-Parse-REST-API-Key": restKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orcamento)
        });

        if (response.ok) {
            alert("Orçamento enviado com sucesso!");
            document.getElementById("orcamento-form").reset();
            carregarOrcamentos();
        } else {
            const errorData = await response.json();
            alert("Erro ao enviar orçamento: " + errorData.error);
        }
    });

    carregarOrcamentos();
});

async function carregarOrcamentos() {
    const url = "https://parseapi.back4app.com/classes/Orcamentos";
    const appId = "5iObAjUqaMgVB6Jo5uG82pZiv97k1udlluuAVdk6";
    const restKey = "2oC4mOGoFq3H8wY7V8fEqe03CHUBxDiA1v0zuFPK";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Parse-Application-Id": appId,
                "X-Parse-REST-API-Key": restKey
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar orçamentos.");
        }

        const data = await response.json();
        const listaOrcamentos = document.getElementById("orcamentos-list");
        listaOrcamentos.innerHTML = "";

        data.results.forEach(orcamento => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${orcamento.nome}</td>
            <td>${orcamento.email}</td>
            <td>${orcamento.tipo_servico}</td>
            <td>${orcamento.metragem} m²</td>
            <td>R$ ${orcamento.valor}</td>
            <td>${orcamento.status}</td>
            <td>
                <i class="fas fa-trash delete-btn" onclick="excluirOrcamento('${orcamento.objectId}')"></i>
            </td>
        `;
            listaOrcamentos.appendChild(row);
        });

    } catch (error) {
        console.error("Erro ao buscar orçamentos:", error);
    }
}

// Função para excluir um orçamento
async function excluirOrcamento(id) {
    const url = `https://parseapi.back4app.com/classes/Orcamentos/${id}`;
    const appId = "5iObAjUqaMgVB6Jo5uG82pZiv97k1udlluuAVdk6";
    const restKey = "2oC4mOGoFq3H8wY7V8fEqe03CHUBxDiA1v0zuFPK";

    const confirmacao = confirm("Tem certeza que deseja excluir este orçamento?");
    if (!confirmacao) return;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "X-Parse-Application-Id": appId,
                "X-Parse-REST-API-Key": restKey
            }
        });

        if (response.ok) {
            alert("Orçamento excluído com sucesso!");
            carregarOrcamentos();
        } else {
            const errorData = await response.json();
            alert("Erro ao excluir orçamento: " + errorData.error);
        }
    } catch (error) {
        console.error("Erro ao excluir orçamento:", error);
    }
}
