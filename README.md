# 🎮 RetroVault — E-Commerce de Jogos Retrô

Uma aplicação frontend em React simulando um e-commerce de consoles, cartuchos e acessórios de jogos retrô clássicos. Conta com carrinho de compras integrado, controle estrito de estoque, validações com focagem inteligente nos formulários e um CRUD completo público para facilidade de avaliação.

---

## Visão Geral

**RetroVault** é uma Single Page Application (SPA) de e-commerce desenvolvida com foco em colecionadores de videogames retrô. A interface adota um estilo visual moderno com pegada *synthwave* (temas escuros, acentos neon em fuchsia e ciano, e efeito glassmorphic).

| Tecnologia | Versão | Propósito |
|---|---|---|
| React | 19.x | Biblioteca UI |
| React Router DOM | 7.x | Navegação SPA |
| TailwindCSS | 4.x | Estilização utilitária |
| Vite | 8.x | Build tool / Dev server |
| JSON Server | 1.x | API REST simulada |
| Context API | nativa | Gerenciamento de estado global |

---

## Como Rodar o Projeto

### Pré-requisitos
- **Node.js** v18+ instalado
- **npm** v8+ instalado

### Instalação
```bash
# 1. Acesse o diretório do projeto
cd ecommerce-react

# 2. Instale as dependências
npm install
```

### Execução
A aplicação necessita de **dois servidores rodando em paralelo**. No Windows, execute-os abrindo dois prompts de comando ou terminais PowerShell diferentes:

**Terminal 1 — JSON Server (API):**
```bash
npm run server
```
> Inicia a API mockada na porta **3001** (`http://localhost:3001`) com suporte a persistência no arquivo `db.json`.

**Terminal 2 — Vite Dev Server (React App):**
```bash
npm run dev
```
> Abre o servidor de desenvolvimento na porta **5173** (`http://localhost:5173`).

---

## Estrutura do Projeto

A organização das pastas separa as responsabilidades da seguinte forma:
```
ecommerce-react/
├── public/
│   ├── favicon.svg              # Ícone da aba do navegador
│   └── screenshots/             # Imagens ilustrativas para a documentação
├── src/
│   ├── components/              # Componentes comuns reutilizáveis
│   │   ├── Header.jsx           # Barra de navegação com logotipo, links e contador do carrinho
│   │   ├── ProductCard.jsx      # Card individual de jogo para a listagem
│   │   ├── CartItem.jsx         # Item individual listado na página do carrinho
│   │   ├── ProtectedRoute.jsx   # Guarda de rotas (desativado para facilitação do CRUD)
│   │   └── SearchBar.jsx        # Barra de pesquisa com filtros de categoria e ordenações
│   ├── context/                 # Contextos para gerenciamento de estado global
│   │   ├── CartContext.jsx      # Estado global e funções de alteração do carrinho
│   │   └── AuthContext.jsx      # Estado de login (opcional, mantido para propósitos extras)
│   ├── hooks/                   # Hooks customizados
│   │   └── useFetch.js          # Hook de conveniência para carregar dados da API
│   ├── pages/                   # Componentes de página correspondentes às rotas
│   │   ├── Home.jsx             # Página inicial com Hero e catálogo completo (/)
│   │   ├── ProductDetails.jsx   # Informações do jogo e ação de comprar (/produto/:id)
│   │   ├── Cart.jsx             # Carrinho de compras com resumo e fechamento (/carrinho)
│   │   ├── ProductForm.jsx      # Formulário compartilhado de criação e edição (/cadastro, /editar/:id)
│   │   ├── Login.jsx            # Autenticação de usuários (/login)
│   │   └── NotFound.jsx         # Página 404 para URLs não mapeadas (*)
│   ├── services/                # Funções utilitárias de rede
│   │   └── api.js               # Funções fetch para interagir com o JSON Server (GET, POST, PUT, DELETE)
│   ├── App.jsx                  # Ponto central de roteamento da aplicação
│   ├── main.jsx                 # Arquivo de bootstrap
│   └── index.css                # Estilo TailwindCSS e fontes customizadas
├── db.json                      # Arquivo JSON com os dados persistidos da API
├── package.json                 # Definição do projeto e dependências
├── vite.config.js               # Configurações de build do Vite
└── README.md                    # Esta documentação
```

### Relação de Rotas
- `Home` (`/`): Exibe o catálogo completo, barra de busca, ordenação por preço/nome, e filtragem por categorias.
- `Detalhes do Produto` (`/produto/:id`): Exibe a ficha completa do item, status de estoque e botões de ação rápidos.
- `Carrinho` (`/carrinho`): Mostra os itens adicionados, preços unitários, quantidades e o total do pedido.
- `Cadastro de Jogo` (`/cadastro`): Rota pública que exibe um formulário de cadastro.
- `Edição de Jogo` (`/editar/:id`): Rota pública para alterar dados de um item existente.
- `NotFound` (`*`): Exibida quando qualquer rota inexistente é requisitada.

---

## Uso do useContext

O gerenciamento global do carrinho de compras é realizado por meio do **CartContext** nativo do React.

- **Criação do Contexto:** O arquivo `CartContext.jsx` cria o contexto e fornece o hook encapsulado `useCart()` para importação simplificada nos componentes.
- **Dados e Métodos Disponibilizados:**
  - `cartItems`: Array de itens do carrinho `{ produto: {...}, quantidade: n }`.
  - `addToCart(produto)`: Adiciona o item ao carrinho ou incrementa se já existir (validando o estoque máximo).
  - `removeFromCart(id)`: Remove completamente um item do carrinho.
  - `increaseQty(id)`: Adiciona +1 à quantidade se houver estoque disponível.
  - `decreaseQty(id)`: Diminui a quantidade mantendo um mínimo de 1.
  - `getItemQty(id)`: Retorna a quantidade de um item específico que já está no carrinho.
  - `getTotal()`: Soma o preço de todos os itens multiplicado pelas suas quantidades.
  - `clearCart()`: Limpa o carrinho.
  - `getCartCount()`: Retorna o total acumulado de itens individuais para exibição no badge do header.
- **Consumo:**
  - `Header.jsx`: Exibe a quantidade de itens ao lado do ícone do carrinho.
  - `ProductDetails.jsx`: Compara a quantidade no carrinho vs estoque total para desabilitar o botão de compra caso atinja o limite.
  - `CartItem.jsx`: Utiliza os botões `+`, `-` e o botão de exclusão para interagir diretamente com o contexto global.
  - `Cart.jsx`: Consome a lista de produtos, calcula e exibe o total global.

---

## Consumo da API (JSON Server)

A aplicação consome a API REST simulada usando a função nativa `fetch` do navegador.

### Exemplos de Requisições Utilizadas (`services/api.js`):

1. **GET (Listagem de Jogos):**
   ```javascript
   export async function getProdutos() {
     const response = await fetch('http://localhost:3001/produtos');
     return handleResponse(response);
   }
   ```
2. **POST (Cadastro de Jogo):**
   ```javascript
   export async function createProduto(produto) {
     const response = await fetch('http://localhost:3001/produtos', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(produto),
     });
     return handleResponse(response);
   }
   ```
3. **PUT (Atualização de Jogo):**
   ```javascript
   export async function updateProduto(id, produto) {
     const response = await fetch(`http://localhost:3001/produtos/${id}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(produto),
     });
     return handleResponse(response);
   }
   ```
4. **DELETE (Exclusão de Jogo):**
   ```javascript
   export async function deleteProduto(id) {
     const response = await fetch(`http://localhost:3001/produtos/${id}`, {
       method: 'DELETE',
     });
     return handleResponse(response);
   }
   ```

### Estados de Carregamento e Erros:
- Durante as requisições, o hook customizado `useFetch.js` retorna o estado `loading`. Enquanto for verdadeiro, as páginas renderizam esqueletos de pulsação animada (*Skeleton Screen*).
- Se a requisição falhar (por exemplo, se o JSON Server estiver desligado), o erro é capturado e uma mensagem descritiva amigável é impressa na tela instruindo o usuário a iniciar o backend mockado.

---

## Funcionalidades Implementadas

### Lógica de Controle de Estoque
- **Na Home (`/`):** Caso o estoque do produto seja `0`, exibe um badge destacado com o texto **"Esgotado"** por cima da imagem. Se o estoque for de 1 a 3 unidades, exibe um badge amarelo **"Últimas X un."** alertando sobre a escassez.
- **Nos Detalhes do Produto (`/produto/:id`):** O botão de adicionar ao carrinho é desabilitado e o texto muda para **"Produto Esgotado"** se o estoque na API for zero. Se o item já foi adicionado ao carrinho e a quantidade acumulada atingiu o estoque total da API, o botão é travado mudando para **"Estoque Máximo Atingido"** e um painel de aviso amarelo é renderizado na tela.
- **No Carrinho (`/carrinho`):** O botão de incremento (`+`) é desabilitado assim que a quantidade no carrinho iguala o estoque disponível do produto. Além disso, uma mensagem amarela com ícone de alerta **"Estoque máximo atingido"** aparece permanentemente abaixo do item limitando novas adições.

### Validações de Formulários com Foco Inteligente (`useRef`)
Ao cadastrar (`/cadastro`) ou editar (`/editar/:id`) um item, as seguintes regras são aplicadas no formulário:
1. **Campos Obrigatórios:** Nome do Item, Descrição, Preço, Estoque, URL de Imagem e Categoria.
2. **Validações Numéricas:** O preço e o estoque devem ser maiores ou iguais a 0. O estoque deve obrigatoriamente ser um número inteiro.
3. **Foco Automático com `useRef`:** Caso o usuário submeta o formulário com dados incorretos, o script interrompe o envio, identifica o primeiro campo inválido e direciona o foco do teclado automaticamente a ele usando referências `useRef`, destacando o input com bordas vermelhas e mensagens explicativas de erro logo abaixo.

---

## Hooks Utilizados
- `useState`: Controle de estados de inputs de formulários, dados dinâmicos, mensagens de erro temporárias e abas de menu móvel.
- `useEffect`: Disparo de chamadas à API, sincronização e persistência do carrinho com o `localStorage` do navegador.
- `useContext`: Compartilhamento do estado global do carrinho de compras e funções mutadoras.
- `useParams`: Captura do `:id` dinâmico da rota para carregamento de produto e preenchimento de formulário na edição.
- `useNavigate`: Redirecionamento programático de rotas após a criação, edição ou exclusão de um produto.
- `useRef`: Armazenamento de referências diretas do DOM para os inputs de formulário para possibilitar o foco do primeiro erro.
- `useMemo`: Filtragem e ordenação inteligente de produtos na home sem causar re-renderizações desnecessárias.
- `useFetch` (Hook Customizado): Encapsulamento da lógica de requisição HTTP, estados de erro e carregamento (*loading*).

---

## Licença
Desenvolvido como projeto acadêmico para simulação de e-commerce moderno e dinâmico com React.
