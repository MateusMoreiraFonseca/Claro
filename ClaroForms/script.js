class BlogCRUDE {
    constructor(caixaDialogo) { // Adicionar parâmetro para a instância de CaixaDialogo
        this.postagens = [];
        this.postagensOriginais = [];
        this.caixaDialogo = caixaDialogo; // Atribuir a instância de CaixaDialogo à propriedade caixaDialogo
    }

    getDataAtual() {
        const dataAtual = new Date();
        const dia = String(dataAtual.getDate()).padStart(2, "0");
        const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
        const ano = dataAtual.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    carregarDadosLocalStorage() {
        const dadosArmazenados = localStorage.getItem("postagens");
        if (dadosArmazenados) {
            this.postagens = JSON.parse(dadosArmazenados);
            this.atualizarListaPostagens();
        }
    }

    salvarDadosLocalStorage() {
        localStorage.setItem("postagens", JSON.stringify(this.postagens));
    }

    adicionarPostagem(titulo, categoria, imagem, conteudo) {
        const data = this.getDataAtual();

        const postagem = {
            titulo,
            categoria,
            imagem,
            conteudo,
            data
        };

        this.postagens.unshift(postagem);

        this.atualizarListaPostagens();

        this.salvarDadosLocalStorage();




    }


    atualizarListaPostagens() {
        const boxContainer = document.getElementById("boxContainer");
        boxContainer.innerHTML = "";

        const limitePostagens = Math.min(this.postagens.length, 3);

        for (let i = 0; i < limitePostagens; i++) {
            const postagem = this.postagens[i];

            const boxWrapper = document.createElement("div");
            boxWrapper.classList.add("box-wrapper");
            boxWrapper.id = `box-wrapper-${i + 1}`;

            const boxHeader = document.createElement("div");
            boxHeader.classList.add("box-header");

            const titleSubtitleWrapper = document.createElement("div");
            titleSubtitleWrapper.classList.add("title-subtitle-wrapper");

            const boxTitle = document.createElement("p");
            boxTitle.classList.add("box-title");
            boxTitle.textContent = postagem.titulo;

            const subtitle = document.createElement("p");
            subtitle.classList.add("subtitle");
            subtitle.textContent = postagem.categoria;

            const data = document.createElement("p");
            data.classList.add("data");
            data.textContent = postagem.data;

            titleSubtitleWrapper.appendChild(boxTitle);
            titleSubtitleWrapper.appendChild(subtitle);
            titleSubtitleWrapper.appendChild(data);

            const boxLogo = document.createElement("img");
            boxLogo.classList.add("box-logo");
            boxLogo.src = "imagens/clarologosemfundo.png";
            boxLogo.alt = "Logo";

            boxHeader.appendChild(boxLogo);
            boxHeader.appendChild(titleSubtitleWrapper);
            boxHeader.appendChild(data);

            const box = document.createElement("div");
            box.classList.add("box");

            const boxContent = document.createElement("div");
            boxContent.classList.add("box-content");

            const imagem = document.createElement("img");
            imagem.src = postagem.imagem;
            imagem.alt = postagem.titulo;

            boxContent.appendChild(imagem);
            box.appendChild(boxContent);

            const boxBotao = document.createElement("div");
            boxBotao.classList.add("box-botao");

            const lerMaisBotao = document.createElement("button");
            lerMaisBotao.classList.add("botao");
            lerMaisBotao.textContent = "Leia Mais";
            lerMaisBotao.setAttribute("aria-label", "Leia Mais");

            const editarBotao = document.createElement("button");
            editarBotao.classList.add("botao", "editar");
            editarBotao.textContent = "Editar";
            editarBotao.setAttribute("aria-label", "Editar");
            editarBotao.dataset.postIndex = i;

            const removerBotao = document.createElement("button");
            removerBotao.classList.add("botao", "remover");
            removerBotao.textContent = "Remover";
            removerBotao.setAttribute("aria-label", "Remover");
            removerBotao.dataset.postIndex = i;


            const boxContentWrapper = document.createElement("div");
            boxContentWrapper.classList.add("box-content-wrapper");
            boxContentWrapper.textContent = postagem.conteudo;
            boxContentWrapper.classList.add("hidden");

            lerMaisBotao.addEventListener("click", function () {
                boxContentWrapper.classList.toggle("hidden");
            });

            boxBotao.appendChild(editarBotao);
            boxBotao.appendChild(removerBotao);
            boxBotao.appendChild(lerMaisBotao);

            boxWrapper.appendChild(boxHeader);
            boxWrapper.appendChild(box);
            boxWrapper.appendChild(boxBotao);
            boxWrapper.appendChild(boxContentWrapper);

            boxContainer.appendChild(boxWrapper);
        }


        const editarBotoes = document.querySelectorAll(".editar");
        editarBotoes.forEach((botao) => {
            botao.addEventListener("click", this.editarPostagem.bind(this));
        });

        const removerBotoes = document.querySelectorAll(".remover");
        removerBotoes.forEach((botao) => {
            botao.addEventListener("click", this.removerPostagem.bind(this));
        });
    }

    buscarPostagens(termoBusca) {
        if (this.postagensOriginais.length === 0) {
            this.postagensOriginais = [...this.postagens];
        }

        const postagensFiltradas = this.postagensOriginais.filter(function (postagem) {
            return (
                postagem.titulo.toLowerCase().includes(termoBusca) ||
                postagem.categoria.toLowerCase().includes(termoBusca) ||
                postagem.conteudo.toLowerCase().includes(termoBusca)
            );
        });

        if (postagensFiltradas.length > 0) {
            this.postagens = postagensFiltradas;
            this.atualizarListaPostagens();
            caixaDialogo.limparMensagens();
            caixaDialogo.exibirMensagem(`Encontradas ${postagensFiltradas.length} postagens com o termo de busca.`);
        } else {
            caixaDialogo.limparMensagens();
            caixaDialogo.exibirMensagem("Nenhuma postagem encontrada com o termo de busca.");
        }
    }
    removerPostagem(event) {
        const index = event.target.dataset.postIndex;
        const postagem = this.postagens[index];

        caixaDialogo.limparMensagens();

        caixaDialogo.exibirMensagem("Tem certeza de que deseja excluir a postagem?");
        caixaDialogo.exibirMensagem("Título: " + postagem.titulo);
        caixaDialogo.exibirMensagem("Categoria: " + postagem.categoria);
        caixaDialogo.exibirMensagem("URL da imagem: " + postagem.imagem);
        caixaDialogo.exibirMensagem("Conteúdo: " + postagem.conteudo);

        const simButton = document.createElement("button");
        simButton.textContent = "Sim, remover postagem";
        simButton.setAttribute("aria-label", "Remover postagem");
        simButton.addEventListener("click", () => {
            this.postagens.splice(index, 1);
            this.atualizarListaPostagens();
            this.salvarDadosLocalStorage();

            caixaDialogo.limparMensagens();
            caixaDialogo.exibirMensagem("Postagem removida com sucesso!");
        });

        const naoButton = document.createElement("button");
        naoButton.textContent = "Cancelar edição";
        naoButton.setAttribute("aria-label", "Cancelar edição");
        naoButton.addEventListener("click", () => {
            caixaDialogo.limparMensagens();
            caixaDialogo.exibirMensagem("Remoção cancelada.");
        });


        caixaDialogo.avisosContainer.appendChild(simButton);
        caixaDialogo.avisosContainer.appendChild(naoButton);
    }


    salvarPostagemEditada(index, novoTitulo, novaCategoria, novaImagem, novoConteudo) {
        const postagem = this.postagens[index];
        postagem.titulo = novoTitulo;
        postagem.categoria = novaCategoria;
        postagem.imagem = novaImagem;
        postagem.conteudo = novoConteudo;


        this.atualizarListaPostagens();
        this.salvarDadosLocalStorage();

        caixaDialogo.exibirMensagem("Sucesso ao editar a postagem!");

    }

    editarPostagem(event) {
        const index = event.target.dataset.postIndex;
        const postagem = this.postagens[index];

        const avisosContainer = document.getElementById("avisosContainer");

        caixaDialogo.limparMensagens();

        caixaDialogo.exibirMensagem("Deseja editar a postagem?");
        caixaDialogo.exibirMensagem("Título atual:" + postagem.titulo);

        caixaDialogo.exibirMensagem("Categoria atual:" + postagem.categoria);

        caixaDialogo.exibirMensagem("URL da imagem atual:" + postagem.imagem);

        caixaDialogo.exibirMensagem("Conteúdo atual:" + postagem.conteudo);



        caixaDialogo.adicionarBotao("Sim,editar postagem", () => {
            // Limpar o conteúdo atual do avisosContainer
            avisosContainer.innerHTML = "";

            // Criar o formulário de edição da postagem
            const form = document.createElement("form");
            form.classList.add("editar-postagem-form");

            const tituloLabel = document.createElement("label");
            tituloLabel.textContent = "Novo Título:";
            const tituloInput = document.createElement("input");
            tituloInput.type = "text";
            tituloInput.value = postagem.titulo;

            const categoriaLabel = document.createElement("label");
            categoriaLabel.textContent = "Nova Categoria:";
            const categoriaInput = document.createElement("input");
            categoriaInput.type = "text";
            categoriaInput.value = postagem.categoria;

            const imagemLabel = document.createElement("label");
            imagemLabel.textContent = "Nova URL da Imagem:";
            const imagemInput = document.createElement("input");
            imagemInput.type = "text";
            imagemInput.value = postagem.imagem;

            const conteudoLabel = document.createElement("label");
            conteudoLabel.textContent = "Novo Conteúdo:";
            const conteudoTextarea = document.createElement("textarea");
            conteudoTextarea.value = postagem.conteudo;

            const salvarButton = document.createElement("button");
            salvarButton.textContent = "Salvar edição da postagem";
            salvarButton.setAttribute("aria-label", "Salvar edição da postagem");
            salvarButton.addEventListener("click", () => {
                const novoTitulo = tituloInput.value;
                const novaCategoria = categoriaInput.value;
                const novaImagem = imagemInput.value;
                const novoConteudo = conteudoTextarea.value;

                this.salvarPostagemEditada(index, novoTitulo, novaCategoria, novaImagem, novoConteudo);

                caixaDialogo.exibirMensagem("Sucesso ao editar a postagem!");

            });
            // Definir estilo dos elementos como blocos
            tituloLabel.style.display = "block";
            tituloInput.style.display = "block";
            categoriaLabel.style.display = "block";
            categoriaInput.style.display = "block";
            imagemLabel.style.display = "block";
            imagemInput.style.display = "block";
            conteudoLabel.style.display = "block";
            conteudoTextarea.style.display = "block";

            const cancelarButton = document.createElement("button");
            cancelarButton.textContent = "Cancelar edição";
            cancelarButton.setAttribute("aria-label", "Cancelar edição");
            cancelarButton.addEventListener("click", () => {
                caixaDialogo.limparMensagens();
                caixaDialogo.exibirMensagem("Edição cancelada.");
            });

            form.appendChild(tituloLabel);
            form.appendChild(tituloInput);
            form.appendChild(categoriaLabel);
            form.appendChild(categoriaInput);
            form.appendChild(imagemLabel);
            form.appendChild(imagemInput);
            form.appendChild(conteudoLabel);
            form.appendChild(conteudoTextarea);
            form.appendChild(salvarButton);
            form.appendChild(cancelarButton);

            // Adicionar o formulário de edição de postagem ao avisosContainer
            avisosContainer.appendChild(form);
        });

        caixaDialogo.adicionarBotao("Cancelar edição", () => {
            caixaDialogo.limparMensagens();
            caixaDialogo.exibirMensagem("Edição cancelada.");
        }, "Cancelar edição da postagem");

    }










    restaurarPostagensOriginais() {
        this.postagens = [...this.postagensOriginais];
    }



}


class Menu {
    constructor(blog, caixaDialogo) {
        this.blog = blog;
        this.caixaDialogo = caixaDialogo;
        this.postForm = document.getElementById("postForm");
        this.buscaForm = document.getElementById("buscaForm");
        this.buscaInput = document.getElementById("buscaInput");
        this.limpaForm = document.getElementById("limpaForm");
    }

    init() {
        this.blog.carregarDadosLocalStorage();
        this.blog.atualizarListaPostagens();
        this.limpaForm.addEventListener("click", this.limparCampos.bind(this));

        this.postForm.addEventListener("submit", this.adicionarPostagem.bind(this));
        this.buscaForm.addEventListener("submit", this.buscarPostagens.bind(this));
        this.buscaInput.addEventListener("input", this.buscarPostagens.bind(this));
        this.limpaForm.addEventListener("submit", this.limparBusca.bind(this));
    }


    limparCampos() {
        document.getElementById("tituloInput").value = "";
        document.getElementById("categoriaInput").value = "";
        document.getElementById("imagemInput").value = "";
        document.getElementById("conteudoInput").value = "";
    }

    adicionarPostagem(event) {
        event.preventDefault();



        const titulo = document.getElementById("tituloInput").value;
        const categoria = document.getElementById("categoriaInput").value;
        const imagem = document.getElementById("imagemInput").value;
        const conteudo = document.getElementById("conteudoInput").value;

        if (!this.validarURL(imagem)) {
            caixaDialogo.limparMensagens;
            caixaDialogo.exibirMensagem("URL da imagem inválida. Por favor, insira uma URL válida(''https://'').");
            return;
        }

        this.blog.adicionarPostagem(titulo, categoria, imagem, conteudo);

        document.getElementById("postForm").reset();
        caixaDialogo.limparMensagens();
        caixaDialogo.exibirMensagem("Postagem criada com sucesso!");


    }

    validarURL(url) {
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        return urlRegex.test(url);
    }

    buscarPostagens(event) {
        event.preventDefault();

        const termoBusca = document.getElementById("buscaInput").value.toLowerCase();
        this.blog.buscarPostagens(termoBusca);


    }

    limparBusca(event) {
        event.preventDefault();
        document.getElementById("buscaInput").value = "";
        this.blog.restaurarPostagensOriginais();
        this.blog.atualizarListaPostagens();
    }




}

class CaixaDialogo {
    constructor() {
        this.avisosContainer = document.getElementById("avisosContainer");
    }

    exibirMensagem(mensagem, tipo = "info") {
        const aviso = document.createElement("div");
        aviso.classList.add("aviso", tipo);
        aviso.textContent = mensagem;

        this.avisosContainer.appendChild(aviso);
        aviso.focus();

    }

    adicionarBotao(texto, callback) {
        const botao = document.createElement("button");
        botao.textContent = texto;
        botao.addEventListener("click", callback);
        botao.setAttribute("aria-label", texto);

        this.avisosContainer.appendChild(botao);
        aviso.focus();
    }

    limparMensagens() {
        this.avisosContainer.innerHTML = "";
    }
}



const caixaDialogo = new CaixaDialogo();
const blog = new BlogCRUDE(caixaDialogo);
const menu = new Menu(blog, caixaDialogo);

menu.init();
