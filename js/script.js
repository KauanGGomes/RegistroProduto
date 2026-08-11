
// =====================================================
// SITE REGISTRO - SCRIPT PRINCIPAL
// =====================================================


// -----------------------------------------------------
// CARREGAR PRODUTOS
// -----------------------------------------------------

let produtos = JSON.parse(localStorage.getItem('produtos')) || [];


// -----------------------------------------------------
// INICIALIZAÇÃO
// -----------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    atualizarLista();
    atualizarContador();
});


// -----------------------------------------------------
// SALVAR PRODUTOS NO LOCALSTORAGE
// -----------------------------------------------------

function salvarProdutos() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}


// -----------------------------------------------------
// FORMATAR DATA DD/MM/AAAA
// -----------------------------------------------------

function formatarData(input) {

    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 8) {
        valor = valor.substring(0, 8);
    }

    if (valor.length > 2) {
        valor =
            valor.substring(0, 2) +
            '/' +
            valor.substring(2);
    }

    if (valor.length > 5) {
        valor =
            valor.substring(0, 5) +
            '/' +
            valor.substring(5);
    }

    input.value = valor;
}


// -----------------------------------------------------
// VALIDAR DATA
// -----------------------------------------------------

function validarData(data) {

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
        return false;
    }

    const partes = data.split('/');

    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]);
    const ano = parseInt(partes[2]);

    if (mes < 1 || mes > 12) {
        return false;
    }

    if (dia < 1 || dia > 31) {
        return false;
    }

    if (ano < 1900 || ano > 2100) {
        return false;
    }

    const dataTeste = new Date(ano, mes - 1, dia);

    return (
        dataTeste.getFullYear() === ano &&
        dataTeste.getMonth() === mes - 1 &&
        dataTeste.getDate() === dia
    );
}


// -----------------------------------------------------
// REGISTRAR PRODUTO
// -----------------------------------------------------

function registrarProduto() {

    const nome = document.getElementById('nome').value.trim();
    const codigo = document.getElementById('codigo').value.trim();
    const dataValidade = document.getElementById('dataValidade').value.trim();
    const dataProduto = document.getElementById('dataProduto').value.trim();


    // Verificar nome
    if (nome === '') {
        mostrarMensagem('Digite o nome do produto.', 'erro');
        document.getElementById('nome').focus();
        return;
    }


    // Verificar código
    if (codigo === '') {
        mostrarMensagem('Digite o código do produto.', 'erro');
        document.getElementById('codigo').focus();
        return;
    }


    // Verificar data de validade
    if (!validarData(dataValidade)) {
        mostrarMensagem(
            'Digite uma data de validade válida no formato DD/MM/AAAA.',
            'erro'
        );

        document.getElementById('dataValidade').focus();
        return;
    }


    // Verificar data do produto
    if (!validarData(dataProduto)) {
        mostrarMensagem(
            'Digite uma data do produto válida no formato DD/MM/AAAA.',
            'erro'
        );

        document.getElementById('dataProduto').focus();
        return;
    }


    // Verificar se o código já existe
    const codigoExiste = produtos.some(
        produto => produto.codigo.toLowerCase() === codigo.toLowerCase()
    );

    if (codigoExiste) {
        mostrarMensagem(
            'Já existe um produto cadastrado com esse código.',
            'erro'
        );

        document.getElementById('codigo').focus();
        return;
    }


    // Criar produto
    const novoProduto = {
        id: Date.now(),
        nome: nome,
        codigo: codigo,
        dataValidade: dataValidade,
        dataProduto: dataProduto
    };


    // Adicionar produto
    produtos.push(novoProduto);


    // Salvar
    salvarProdutos();


    // Atualizar tela
    atualizarLista();
    atualizarContador();


    // Limpar formulário
    limparCampos();


    // Mensagem
    mostrarMensagem(
        'Produto registrado com sucesso!',
        'sucesso'
    );
}


// -----------------------------------------------------
// ATUALIZAR LISTA DE PRODUTOS
// -----------------------------------------------------

function atualizarLista() {

    const lista = document.getElementById('listaProdutos');

    lista.innerHTML = '';


    if (produtos.length === 0) {

        lista.innerHTML = `
            <li style="
                text-align: center;
                color: #64748b;
                padding: 30px;
            ">
                📦 Nenhum produto registrado.
            </li>
        `;

        return;
    }


    produtos.forEach((produto, index) => {

        const li = document.createElement('li');

        li.innerHTML = `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
                flex-wrap: wrap;
            ">

                <div style="flex: 1;">

                    <strong style="
                        display: block;
                        font-size: 16px;
                        color: #0f172a;
                        margin-bottom: 8px;
                    ">
                        ${index + 1}. ${escaparHTML(produto.nome)}
                    </strong>

                    <span style="
                        display: block;
                        color: #64748b;
                        font-size: 13px;
                        margin-bottom: 4px;
                    ">
                        Código: ${escaparHTML(produto.codigo)}
                    </span>

                    <span style="
                        display: block;
                        color: #64748b;
                        font-size: 13px;
                        margin-bottom: 4px;
                    ">
                        Validade: ${escaparHTML(produto.dataValidade)}
                    </span>

                    <span style="
                        display: block;
                        color: #64748b;
                        font-size: 13px;
                    ">
                        Data do produto: ${escaparHTML(produto.dataProduto)}
                    </span>

                </div>

                <button
                    onclick="editarProduto(${produto.id})"
                    style="
                        border: none;
                        background: #dbeafe;
                        color: #1d4ed8;
                        padding: 9px 14px;
                        border-radius: 7px;
                        cursor: pointer;
                        font-weight: bold;
                    "
                >
                    ✏️ Editar
                </button>

            </div>
        `;

        lista.appendChild(li);
    });
}


// -----------------------------------------------------
// CONTADOR
// -----------------------------------------------------

function atualizarContador() {

    const contador =
        document.getElementById('contadorProdutos');

    if (!contador) {
        return;
    }


    if (produtos.length === 1) {

        contador.textContent = '1 produto';

    } else {

        contador.textContent =
            `${produtos.length} produtos`;
    }
}


// -----------------------------------------------------
// EDITAR PRODUTO
// -----------------------------------------------------

function editarProduto(id) {

    const produto = produtos.find(
        item => item.id === id
    );


    if (!produto) {
        mostrarMensagem(
            'Produto não encontrado.',
            'erro'
        );

        return;
    }


    const novoNome = prompt(
        'Nome do produto:',
        produto.nome
    );


    if (novoNome === null) {
        return;
    }


    const novoCodigo = prompt(
        'Código do produto:',
        produto.codigo
    );


    if (novoCodigo === null) {
        return;
    }


    const novaValidade = prompt(
        'Data de validade (DD/MM/AAAA):',
        produto.dataValidade
    );


    if (novaValidade === null) {
        return;
    }


    const novaDataProduto = prompt(
        'Data do produto (DD/MM/AAAA):',
        produto.dataProduto
    );


    if (novaDataProduto === null) {
        return;
    }


    if (novoNome.trim() === '') {

        mostrarMensagem(
            'O nome não pode ficar vazio.',
            'erro'
        );

        return;
    }


    if (novoCodigo.trim() === '') {

        mostrarMensagem(
            'O código não pode ficar vazio.',
            'erro'
        );

        return;
    }


    if (!validarData(novaValidade.trim())) {

        mostrarMensagem(
            'Data de validade inválida.',
            'erro'
        );

        return;
    }


    if (!validarData(novaDataProduto.trim())) {

        mostrarMensagem(
            'Data do produto inválida.',
            'erro'
        );

        return;
    }


    // Verificar código duplicado
    const codigoDuplicado = produtos.some(
        item =>
            item.id !== id &&
            item.codigo.toLowerCase() ===
            novoCodigo.trim().toLowerCase()
    );


    if (codigoDuplicado) {

        mostrarMensagem(
            'Esse código já pertence a outro produto.',
            'erro'
        );

        return;
    }


    // Atualizar
    produto.nome = novoNome.trim();
    produto.codigo = novoCodigo.trim();
    produto.dataValidade = novaValidade.trim();
    produto.dataProduto = novaDataProduto.trim();


    salvarProdutos();

    atualizarLista();
    atualizarContador();


    mostrarMensagem(
        'Produto atualizado com sucesso!',
        'sucesso'
    );
}


// -----------------------------------------------------
// EXCLUIR PRODUTO
// -----------------------------------------------------

function excluirProduto() {

    if (produtos.length === 0) {

        mostrarMensagem(
            'Não há produtos para excluir.',
            'erro'
        );

        return;
    }


    const codigo = prompt(
        'Digite o código do produto que deseja excluir:'
    );


    if (codigo === null) {
        return;
    }


    const codigoBusca = codigo.trim().toLowerCase();


    const indice = produtos.findIndex(
        produto =>
            produto.codigo.toLowerCase() === codigoBusca
    );


    if (indice === -1) {

        mostrarMensagem(
            'Produto não encontrado.',
            'erro'
        );

        return;
    }


    const produto = produtos[indice];


    const confirmar = confirm(
        `Deseja realmente excluir o produto "${produto.nome}"?`
    );


    if (!confirmar) {
        return;
    }


    produtos.splice(indice, 1);


    salvarProdutos();

    atualizarLista();
    atualizarContador();


    mostrarMensagem(
        'Produto excluído com sucesso!',
        'sucesso'
    );
}


// -----------------------------------------------------
// LIMPAR CAMPOS
// -----------------------------------------------------

function limparCampos() {

    document.getElementById('nome').value = '';
    document.getElementById('codigo').value = '';
    document.getElementById('dataValidade').value = '';
    document.getElementById('dataProduto').value = '';

    document.getElementById('nome').focus();
}


// -----------------------------------------------------
// MENSAGENS
// -----------------------------------------------------

function mostrarMensagem(texto, tipo) {

    // Remove mensagem anterior
    const antiga =
        document.getElementById('mensagemSistema');

    if (antiga) {
        antiga.remove();
    }


    const mensagem =
        document.createElement('div');

    mensagem.id = 'mensagemSistema';

    const cor =
        tipo === 'sucesso'
            ? '#16a34a'
            : '#dc2626';


    mensagem.innerHTML = `
        ${tipo === 'sucesso' ? '✓' : '⚠️'}
        ${escaparHTML(texto)}
    `;


    mensagem.style.position = 'fixed';
    mensagem.style.top = '20px';
    mensagem.style.right = '20px';
    mensagem.style.background = '#ffffff';
    mensagem.style.color = cor;
    mensagem.style.padding = '14px 18px';
    mensagem.style.borderRadius = '10px';
    mensagem.style.boxShadow =
        '0 5px 20px rgba(0,0,0,0.15)';
    mensagem.style.borderLeft =
        `4px solid ${cor}`;
    mensagem.style.fontSize = '14px';
    mensagem.style.fontWeight = 'bold';
    mensagem.style.zIndex = '9999';


    document.body.appendChild(mensagem);


    setTimeout(() => {

        mensagem.style.opacity = '0';
        mensagem.style.transition = '0.3s';

        setTimeout(() => {
            mensagem.remove();
        }, 300);

    }, 3000);
}


// -----------------------------------------------------
// PROTEÇÃO CONTRA HTML
// -----------------------------------------------------

function escaparHTML(texto) {

    const div =
        document.createElement('div');

    div.textContent = texto;

    return div.innerHTML;
}


// -----------------------------------------------------
// GERAR PDF
// -----------------------------------------------------

function gerarPDF() {

    if (produtos.length === 0) {

        mostrarMensagem(
            'Não há produtos para gerar o PDF.',
            'erro'
        );

        return;
    }


    if (!window.jspdf) {

        alert(
            'Erro: a biblioteca jsPDF não foi carregada.'
        );

        return;
    }


    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();


    // -------------------------------------------------
    // TÍTULO
    // -------------------------------------------------

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');

    doc.text(
        'Produtos Registrados',
        105,
        20,
        {
            align: 'center'
        }
    );


    // -------------------------------------------------
    // DATA DO RELATÓRIO
    // -------------------------------------------------

    const agora = new Date();

    const dataGeracao =
        agora.toLocaleDateString('pt-BR');

    const horaGeracao =
        agora.toLocaleTimeString(
            'pt-BR',
            {
                hour: '2-digit',
                minute: '2-digit'
            }
        );


    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(
        `Relatório gerado em ${dataGeracao} às ${horaGeracao}`,
        105,
        28,
        {
            align: 'center'
        }
    );


    // -------------------------------------------------
    // CABEÇALHO
    // -------------------------------------------------

    const colunas = [
        'Nº',
        'Nome',
        'Código',
        'Data de Validade',
        'Data do Produto'
    ];


    // -------------------------------------------------
    // LINHAS
    // -------------------------------------------------

    const linhas = produtos.map(
        (produto, index) => [

            index + 1,

            produto.nome || '',

            produto.codigo || '',

            produto.dataValidade || '',

            produto.dataProduto || ''

        ]
    );


    // -------------------------------------------------
    // TABELA
    // -------------------------------------------------

    doc.autoTable({

        head: [colunas],

        body: linhas,

        startY: 38,

        theme: 'grid',

        styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 4,
            valign: 'middle',
            lineColor: [210, 214, 220],
            lineWidth: 0.2
        },

        headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },

        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },

        columnStyles: {

            0: {
                cellWidth: 12,
                halign: 'center'
            },

            1: {
                cellWidth: 55
            },

            2: {
                cellWidth: 35,
                halign: 'center'
            },

            3: {
                cellWidth: 40,
                halign: 'center'
            },

            4: {
                cellWidth: 40,
                halign: 'center'
            }
        },

        margin: {
            left: 10,
            right: 10,
            bottom: 20
        },

        didDrawPage: function () {

            const pagina =
                doc.internal.getNumberOfPages();


            doc.setFontSize(8);
            doc.setTextColor(120, 120, 120);


            doc.text(
                `Página ${pagina}`,
                105,
                290,
                {
                    align: 'center'
                }
            );
        }
    });


    // -------------------------------------------------
    // TOTAL
    // -------------------------------------------------

    const finalY =
        doc.lastAutoTable.finalY + 10;


    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);


    doc.text(
        `Total de produtos: ${produtos.length}`,
        14,
        finalY
    );


    // -------------------------------------------------
    // SALVAR PDF
    // -------------------------------------------------

    doc.save('produtos.pdf');


    mostrarMensagem(
        'PDF gerado com sucesso!',
        'sucesso'
    );
}