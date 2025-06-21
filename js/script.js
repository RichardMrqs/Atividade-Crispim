document.addEventListener('DOMContentLoaded', () => {
    // --- Funções Auxiliares para localStorage ---
    function getItems(key) {
        const items = localStorage.getItem(key);
        return items ? JSON.parse(items) : [];
    }

    function saveItems(key, items) {
        localStorage.setItem(key, JSON.stringify(items));
    }

    function generateId(items) {
        return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    }

    // --- Referências aos elementos do DOM (Usuários) ---
    const userForm = document.getElementById('userForm');
    const userIdInput = document.getElementById('userId');
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    const userPasswordInput = document.getElementById('userPassword');
    const userTypeSelect = document.getElementById('userType');
    const usersTableBody = document.getElementById('usersTableBody');
    const cancelUserEditBtn = document.getElementById('cancelUserEdit');

    // --- Referências aos elementos do DOM (Fornecedores) ---
    const supplierForm = document.getElementById('supplierForm');
    const supplierIdInput = document.getElementById('supplierId');
    const nomeFantasiaInput = document.getElementById('nomeFantasia');
    const razaoSocialInput = document.getElementById('razaoSocial');
    const cnpjInput = document.getElementById('cnpj');
    const inscricaoSocialInput = document.getElementById('inscricaoSocial');
    const suppliersTableBody = document.getElementById('suppliersTableBody');
    const cancelSupplierEditBtn = document.getElementById('cancelSupplierEdit');

    // --- Referências aos elementos do DOM (Produtos) ---
    const productForm = document.getElementById('productForm');
    const productIdInput = document.getElementById('productId');
    const productFornecedorSelect = document.getElementById('productFornecedor');
    const nomeProdutoInput = document.getElementById('nomeProduto');
    const codigoProdutoInput = document.getElementById('codigoProduto');
    const valorCustoProdutoInput = document.getElementById('valorCustoProduto');
    const valorVendaProdutoInput = document.getElementById('valorVendaProduto');
    const qtdProdutoEstoqueInput = document.getElementById('qtdProdutoEstoque');
    const productsTableBody = document.getElementById('productsTableBody');
    const cancelProductEditBtn = document.getElementById('cancelProductEdit');

    // --- Referências aos elementos do DOM (Orçamentos) ---
    const budgetForm = document.getElementById('budgetForm');
    const budgetIdInput = document.getElementById('budgetId');
    const budgetUserSelect = document.getElementById('budgetUser');
    const budgetDateInput = document.getElementById('budgetDate');
    const budgetStatusSelect = document.getElementById('budgetStatus');
    const budgetItemProductSelect = document.getElementById('budgetItemProduct');
    const budgetItemQtyInput = document.getElementById('budgetItemQty');
    const addBudgetItemBtn = document.getElementById('addBudgetItem');
    const budgetItemTableBody = document.getElementById('budgetItemTableBody');
    const budgetTotalValueDisplay = document.getElementById('budgetTotalValue');
    const budgetsTableBody = document.getElementById('budgetsTableBody');
    const cancelBudgetEditBtn = document.getElementById('cancelBudgetEdit');

    let currentBudgetItems = []; // Array temporário para os itens do orçamento em edição

    // --- CRUD de Usuários ---
    function addUser(user) {
        const users = getItems('usuarios');
        users.push(user);
        saveItems('usuarios', users);
        loadUsers();
    }

    function updateUser(updatedUser) {
        let users = getItems('usuarios');
        users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        saveItems('usuarios', users);
        loadUsers();
    }

    function deleteUser(id) {
        if (confirm('Tem certeza que deseja excluir este usuário? Todos os orçamentos associados a ele TAMBÉM serão excluídos!')) {
            let users = getItems('usuarios');
            users = users.filter(u => u.id !== id);
            saveItems('usuarios', users);

            let budgets = getItems('orcamentos');
            budgets = budgets.filter(b => b.usuarioId !== id);
            saveItems('orcamentos', budgets);

            loadUsers();
            loadBudgets();
            populateUserSelect();
            alert('Usuário e orçamentos associados excluídos com sucesso!');
        }
    }

    function loadUsers() {
        const users = getItems('usuarios');
        usersTableBody.innerHTML = '';

        if (users.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum usuário cadastrado.</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = usersTableBody.insertRow();
            row.insertCell(0).textContent = user.id;
            row.insertCell(1).textContent = user.nome;
            row.insertCell(2).textContent = user.email;
            row.insertCell(3).textContent = user.tipo;

            const actionsCell = row.insertCell(4);
            actionsCell.classList.add('text-end');

            const editBtn = document.createElement('button');
            editBtn.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
            editBtn.innerHTML = '<i class="bi bi-pencil"></i> Editar';
            editBtn.title = 'Editar Usuário';
            editBtn.addEventListener('click', () => editUser(user.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i> Excluir';
            deleteBtn.title = 'Excluir Usuário';
            deleteBtn.addEventListener('click', () => deleteUser(user.id));

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    }

    function editUser(id) {
        const users = getItems('usuarios');
        const userToEdit = users.find(u => u.id === id);

        if (userToEdit) {
            userIdInput.value = userToEdit.id;
            userNameInput.value = userToEdit.nome;
            userEmailInput.value = userToEdit.email;
            userPasswordInput.value = userToEdit.senha; // Preenche a senha para edição
            userTypeSelect.value = userToEdit.tipo;
            // Scroll para o formulário de edição do usuário
            const usersTabContent = document.getElementById('users');
            if (usersTabContent) {
                usersTabContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // --- CRUD de Fornecedores ---
    function addSupplier(supplier) {
        const suppliers = getItems('fornecedores');
        suppliers.push(supplier);
        saveItems('fornecedores', suppliers);
        loadSuppliers();
    }

    function updateSupplier(updatedSupplier) {
        let suppliers = getItems('fornecedores');
        suppliers = suppliers.map(s => s.id === updatedSupplier.id ? updatedSupplier : s);
        saveItems('fornecedores', suppliers);
        loadSuppliers();
    }

    function deleteSupplier(id) {
        if (confirm('Tem certeza que deseja excluir este fornecedor? Todos os produtos associados a ele TAMBÉM serão excluídos!')) {
            let suppliers = getItems('fornecedores');
            suppliers = suppliers.filter(s => s.id !== id);
            saveItems('fornecedores', suppliers);

            let products = getItems('produtos');
            products = products.filter(p => p.fornecedorId !== id);
            saveItems('produtos', products);

            loadSuppliers();
            loadProducts();
            populateSupplierSelect();
            alert('Fornecedor e seus produtos associados excluídos com sucesso!');
        }
    }

    function loadSuppliers() {
        const suppliers = getItems('fornecedores');
        suppliersTableBody.innerHTML = '';

        if (suppliers.length === 0) {
            suppliersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum fornecedor cadastrado.</td></tr>';
            return;
        }

        suppliers.forEach(supplier => {
            const row = suppliersTableBody.insertRow();
            row.insertCell(0).textContent = supplier.id;
            row.insertCell(1).textContent = supplier.nomeFantasia;
            row.insertCell(2).textContent = supplier.razaoSocial;
            row.insertCell(3).textContent = supplier.cnpj;

            const actionsCell = row.insertCell(4);
            actionsCell.classList.add('text-end');

            const editBtn = document.createElement('button');
            editBtn.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
            editBtn.innerHTML = '<i class="bi bi-pencil"></i> Editar';
            editBtn.title = 'Editar Fornecedor';
            editBtn.addEventListener('click', () => editSupplier(supplier.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i> Excluir';
            deleteBtn.title = 'Excluir Fornecedor';
            deleteBtn.addEventListener('click', () => deleteSupplier(supplier.id));

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    }

    function editSupplier(id) {
        const suppliers = getItems('fornecedores');
        const supplierToEdit = suppliers.find(s => s.id === id);

        if (supplierToEdit) {
            supplierIdInput.value = supplierToEdit.id;
            nomeFantasiaInput.value = supplierToEdit.nomeFantasia;
            razaoSocialInput.value = supplierToEdit.razaoSocial;
            cnpjInput.value = supplierToEdit.cnpj;
            inscricaoSocialInput.value = supplierToEdit.inscricaoSocial;
            // Scroll para o formulário de edição do fornecedor
            const suppliersTabContent = document.getElementById('suppliers');
            if (suppliersTabContent) {
                suppliersTabContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // --- CRUD de Produtos ---
    function addProduct(product) {
        const products = getItems('produtos');
        products.push(product);
        saveItems('produtos', products);
        loadProducts();
    }

    function updateProduct(updatedProduct) {
        let products = getItems('produtos');
        products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        saveItems('produtos', products);
        loadProducts();
    }

    function deleteProduct(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            let products = getItems('produtos');
            products = products.filter(p => p.id !== id);
            saveItems('produtos', products);
            loadProducts();
            alert('Produto excluído com sucesso!');
        }
    }

    function loadProducts() {
        const products = getItems('produtos');
        const suppliers = getItems('fornecedores');
        productsTableBody.innerHTML = '';

        if (products.length === 0) {
            productsTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum produto cadastrado.</td></tr>';
            return;
        }

        products.forEach(product => {
            const supplier = suppliers.find(s => s.id === product.fornecedorId);
            const supplierName = supplier ? supplier.nomeFantasia : 'Fornecedor Desconhecido';

            const row = productsTableBody.insertRow();
            row.insertCell(0).textContent = product.id;
            row.insertCell(1).textContent = product.nomeProduto;
            row.insertCell(2).textContent = supplierName;
            row.insertCell(3).textContent = product.codigoProduto;
            row.insertCell(4).textContent = `R$ ${product.valorCustoProduto.toFixed(2)}`;
            row.insertCell(5).textContent = `R$ ${product.valorVendaProduto.toFixed(2)}`;
            row.insertCell(6).textContent = product.qtdProdutoEstoque;

            const actionsCell = row.insertCell(7);
            actionsCell.classList.add('text-end');

            const editBtn = document.createElement('button');
            editBtn.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
            editBtn.innerHTML = '<i class="bi bi-pencil"></i> Editar';
            editBtn.title = 'Editar Produto';
            editBtn.addEventListener('click', () => editProduct(product.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i> Excluir';
            deleteBtn.title = 'Excluir Produto';
            deleteBtn.addEventListener('click', () => deleteProduct(product.id));

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    }

    function editProduct(id) {
        const products = getItems('produtos');
        const productToEdit = products.find(p => p.id === id);

        if (productToEdit) {
            productIdInput.value = productToEdit.id;
            productFornecedorSelect.value = productToEdit.fornecedorId;
            nomeProdutoInput.value = productToEdit.nomeProduto;
            codigoProdutoInput.value = productToEdit.codigoProduto;
            valorCustoProdutoInput.value = productToEdit.valorCustoProduto;
            valorVendaProdutoInput.value = productToEdit.valorVendaProduto;
            qtdProdutoEstoqueInput.value = productToEdit.qtdProdutoEstoque;
            // Scroll para o formulário de edição do produto
            const productsTabContent = document.getElementById('products');
            if (productsTabContent) {
                productsTabContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // --- CRUD de Orçamentos ---
    function addBudget(budget) {
        const budgets = getItems('orcamentos');
        budgets.push(budget);
        saveItems('orcamentos', budgets);
        loadBudgets();
    }

    function updateBudget(updatedBudget) {
        let budgets = getItems('orcamentos');
        budgets = budgets.map(b => b.id === updatedBudget.id ? updatedBudget : b);
        saveItems('orcamentos', budgets);
        loadBudgets();
    }

    function deleteBudget(id) {
        if (confirm('Tem certeza que deseja excluir este orçamento?')) {
            let budgets = getItems('orcamentos');
            budgets = budgets.filter(b => b.id !== id);
            saveItems('orcamentos', budgets);
            loadBudgets();
            alert('Orçamento excluído com sucesso!');
        }
    }

    function loadBudgets() {
        const budgets = getItems('orcamentos');
        const users = getItems('usuarios');
        budgetsTableBody.innerHTML = '';

        if (budgets.length === 0) {
            budgetsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum orçamento cadastrado.</td></tr>';
            return;
        }

        budgets.forEach(budget => {
            const user = users.find(u => u.id === budget.usuarioId);
            const userName = user ? user.nome : 'Usuário Desconhecido';

            const row = budgetsTableBody.insertRow();
            row.insertCell(0).textContent = budget.id;
            row.insertCell(1).textContent = budget.dataOrcamento;
            row.insertCell(2).textContent = userName;
            row.insertCell(3).textContent = `R$ ${budget.valorTotal.toFixed(2)}`;
            row.insertCell(4).textContent = budget.status;

            const actionsCell = row.insertCell(5);
            actionsCell.classList.add('text-end');

            const viewBtn = document.createElement('button');
            viewBtn.classList.add('btn', 'btn-sm', 'btn-info', 'me-2');
            viewBtn.innerHTML = '<i class="bi bi-eye"></i> Ver';
            viewBtn.title = 'Ver Detalhes do Orçamento';
            viewBtn.addEventListener('click', () => viewBudgetDetails(budget.id));

            const editBtn = document.createElement('button');
            editBtn.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
            editBtn.innerHTML = '<i class="bi bi-pencil"></i> Editar';
            editBtn.title = 'Editar Orçamento';
            editBtn.addEventListener('click', () => editBudget(budget.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i> Excluir';
            deleteBtn.title = 'Excluir Orçamento';
            deleteBtn.addEventListener('click', () => deleteBudget(budget.id));

            actionsCell.appendChild(viewBtn);
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    }

    function viewBudgetDetails(id) {
        const budgets = getItems('orcamentos');
        const budget = budgets.find(b => b.id === id);
        const users = getItems('usuarios');
        const products = getItems('produtos');

        if (!budget) {
            alert('Orçamento não encontrado!');
            return;
        }

        const user = users.find(u => u.id === budget.usuarioId);
        let details = `Detalhes do Orçamento #${budget.id}\n`;
        details += `Data: ${budget.dataOrcamento}\n`;
        details += `Usuário: ${user ? user.nome : 'Desconhecido'}\n`;
        details += `Status: ${budget.status}\n`;
        details += `Valor Total: R$ ${budget.valorTotal.toFixed(2)}\n\n`;
        details += `Itens:\n`;

        if (budget.itens && budget.itens.length > 0) {
            budget.itens.forEach(item => {
                const product = products.find(p => p.id === item.produtoId);
                const productName = product ? product.nomeProduto : 'Produto Desconhecido';
                details += `- ${productName} (Qtd: ${item.quantidade}) - R$ ${item.valorUnitario.toFixed(2)} cada - Subtotal: R$ ${(item.quantidade * item.valorUnitario).toFixed(2)}\n`;
            });
        } else {
            details += 'Nenhum item neste orçamento.\n';
        }

        alert(details);
    }

    function editBudget(id) {
        const budgets = getItems('orcamentos');
        const budgetToEdit = budgets.find(b => b.id === id);

        if (budgetToEdit) {
            budgetIdInput.value = budgetToEdit.id;
            budgetUserSelect.value = budgetToEdit.usuarioId;
            budgetDateInput.value = budgetToEdit.dataOrcamento;
            budgetStatusSelect.value = budgetToEdit.status;
            currentBudgetItems = [...budgetToEdit.itens]; // Clona os itens para edição
            renderBudgetItemTable();
            // Scroll para o formulário de edição do orçamento
            const budgetsTabContent = document.getElementById('budgets');
            if (budgetsTabContent) {
                budgetsTabContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    function calculateBudgetTotal() {
        let total = 0;
        currentBudgetItems.forEach(item => {
            total += item.quantidade * item.valorUnitario;
        });
        budgetTotalValueDisplay.textContent = `R$ ${total.toFixed(2)}`;
        return total;
    }

    function renderBudgetItemTable() {
        budgetItemTableBody.innerHTML = '';
        if (currentBudgetItems.length === 0) {
            budgetItemTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum item adicionado.</td></tr>';
        } else {
            currentBudgetItems.forEach((item, index) => {
                const products = getItems('produtos');
                const product = products.find(p => p.id === item.produtoId);
                const productName = product ? product.nomeProduto : 'Produto Desconhecido';

                const row = budgetItemTableBody.insertRow();
                row.insertCell(0).textContent = productName;
                row.insertCell(1).textContent = item.quantidade;
                row.insertCell(2).textContent = `R$ ${item.valorUnitario.toFixed(2)}`;
                row.insertCell(3).textContent = `R$ ${(item.quantidade * item.valorUnitario).toFixed(2)}`;
                const actionsCell = row.insertCell(4);

                const removeBtn = document.createElement('button');
                removeBtn.classList.add('btn', 'btn-sm', 'btn-danger');
                removeBtn.innerHTML = '<i class="bi bi-x"></i>';
                removeBtn.title = 'Remover Item';
                removeBtn.addEventListener('click', () => {
                    currentBudgetItems.splice(index, 1);
                    renderBudgetItemTable();
                    calculateBudgetTotal();
                });
                actionsCell.appendChild(removeBtn);
            });
        }
        calculateBudgetTotal();
    }

    // --- Popular Selects de FKs ---
    function populateSupplierSelect() {
        const suppliers = getItems('fornecedores');
        productFornecedorSelect.innerHTML = '<option value="" selected disabled>Selecione um fornecedor...</option>';
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.nomeFantasia;
            productFornecedorSelect.appendChild(option);
        });
    }

    function populateUserSelect() {
        const users = getItems('usuarios');
        budgetUserSelect.innerHTML = '<option value="" selected disabled>Selecione um usuário...</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.nome;
            budgetUserSelect.appendChild(option);
        });
    }

    function populateBudgetItemProductSelect() {
        const products = getItems('produtos');
        budgetItemProductSelect.innerHTML = '<option value="" selected disabled>Selecione um produto...</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.nomeProduto} (R$ ${product.valorVendaProduto.toFixed(2)})`;
            budgetItemProductSelect.appendChild(option);
        });
    }

    // --- Event Listeners dos Formulários ---

    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = userIdInput.value ? parseInt(userIdInput.value) : generateId(getItems('usuarios'));
            const newUser = {
                id: id,
                nome: userNameInput.value,
                email: userEmailInput.value,
                senha: userPasswordInput.value,
                tipo: userTypeSelect.value
            };

            if (userIdInput.value) {
                updateUser(newUser);
                alert('Usuário atualizado com sucesso!');
            } else {
                addUser(newUser);
                alert('Usuário adicionado com sucesso!');
            }
            userForm.reset();
            userIdInput.value = '';
        });
    }

    if (cancelUserEditBtn) {
        cancelUserEditBtn.addEventListener('click', () => {
            userForm.reset();
            userIdInput.value = '';
        });
    }

    if (supplierForm) {
        supplierForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = supplierIdInput.value ? parseInt(supplierIdInput.value) : generateId(getItems('fornecedores'));
            const newSupplier = {
                id: id,
                nomeFantasia: nomeFantasiaInput.value,
                razaoSocial: razaoSocialInput.value,
                cnpj: cnpjInput.value,
                inscricaoSocial: inscricaoSocialInput.value
            };

            if (supplierIdInput.value) {
                updateSupplier(newSupplier);
                alert('Fornecedor atualizado com sucesso!');
            } else {
                addSupplier(newSupplier);
                alert('Fornecedor adicionado com sucesso!');
            }
            supplierForm.reset();
            supplierIdInput.value = '';
        });
    }

    if (cancelSupplierEditBtn) {
        cancelSupplierEditBtn.addEventListener('click', () => {
            supplierForm.reset();
            supplierIdInput.value = '';
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = productIdInput.value ? parseInt(productIdInput.value) : generateId(getItems('produtos'));
            const newProduct = {
                id: id,
                fornecedorId: parseInt(productFornecedorSelect.value),
                nomeProduto: nomeProdutoInput.value,
                codigoProduto: codigoProdutoInput.value,
                valorCustoProduto: parseFloat(valorCustoProdutoInput.value),
                valorVendaProduto: parseFloat(valorVendaProdutoInput.value),
                qtdProdutoEstoque: parseInt(qtdProdutoEstoqueInput.value)
            };

            if (isNaN(newProduct.fornecedorId)) {
                alert('Por favor, selecione um fornecedor válido para o produto.');
                return;
            }

            if (productIdInput.value) {
                updateProduct(newProduct);
                alert('Produto atualizado com sucesso!');
            } else {
                addProduct(newProduct);
                alert('Produto adicionado com sucesso!');
            }
            productForm.reset();
            productIdInput.value = '';
        });
    }

    if (cancelProductEditBtn) {
        cancelProductEditBtn.addEventListener('click', () => {
            productForm.reset();
            productIdInput.value = '';
        });
    }

    if (addBudgetItemBtn) {
        addBudgetItemBtn.addEventListener('click', () => {
            const productId = parseInt(budgetItemProductSelect.value);
            const quantity = parseInt(budgetItemQtyInput.value);

            if (isNaN(productId) || isNaN(quantity) || quantity <= 0) {
                alert('Por favor, selecione um produto e insira uma quantidade válida.');
                return;
            }

            const products = getItems('produtos');
            const product = products.find(p => p.id === productId);

            if (product) {
                const existingItemIndex = currentBudgetItems.findIndex(item => item.produtoId === productId);
                if (existingItemIndex > -1) {
                    currentBudgetItems[existingItemIndex].quantidade += quantity;
                } else {
                    currentBudgetItems.push({
                        produtoId: product.id,
                        nomeProduto: product.nomeProduto, // Para facilitar a exibição
                        quantidade: quantity,
                        valorUnitario: product.valorVendaProduto
                    });
                }
                renderBudgetItemTable();
                budgetItemProductSelect.value = ''; // Limpa seleção
                budgetItemQtyInput.value = '1';     // Reseta quantidade
            } else {
                alert('Produto não encontrado!');
            }
        });
    }

    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (currentBudgetItems.length === 0) {
                alert('Adicione pelo menos um item ao orçamento.');
                return;
            }

            const id = budgetIdInput.value ? parseInt(budgetIdInput.value) : generateId(getItems('orcamentos'));
            const newBudget = {
                id: id,
                usuarioId: parseInt(budgetUserSelect.value),
                dataOrcamento: budgetDateInput.value,
                status: budgetStatusSelect.value,
                itens: currentBudgetItems,
                valorTotal: calculateBudgetTotal()
            };

            if (isNaN(newBudget.usuarioId)) {
                alert('Por favor, selecione um usuário válido para o orçamento.');
                return;
            }

            if (budgetIdInput.value) {
                updateBudget(newBudget);
                alert('Orçamento atualizado com sucesso!');
            } else {
                addBudget(newBudget);
                alert('Orçamento adicionado com sucesso!');
            }

            budgetForm.reset();
            budgetIdInput.value = '';
            currentBudgetItems = [];
            renderBudgetItemTable();
        });
    }

    if (cancelBudgetEditBtn) {
        cancelBudgetEditBtn.addEventListener('click', () => {
            budgetForm.reset();
            budgetIdInput.value = '';
            currentBudgetItems = [];
            renderBudgetItemTable();
        });
    }

    // Eventos de mudança de aba para recarregar dados e selects
    const usersTabButton = document.getElementById('users-tab-button');
    const suppliersTabButton = document.getElementById('suppliers-tab-button');
    const productsTabButton = document.getElementById('products-tab-button');
    const budgetsTabButton = document.getElementById('budgets-tab-button');

    if (usersTabButton) {
        usersTabButton.addEventListener('shown.bs.tab', () => {
            loadUsers();
            userForm.reset();
            userIdInput.value = '';
        });
    }

    if (suppliersTabButton) {
        suppliersTabButton.addEventListener('shown.bs.tab', () => {
            loadSuppliers();
            supplierForm.reset();
            supplierIdInput.value = '';
        });
    }

    if (productsTabButton) {
        productsTabButton.addEventListener('shown.bs.tab', () => {
            populateSupplierSelect();
            loadProducts();
            productForm.reset();
            productIdInput.value = '';
        });
    }

    if (budgetsTabButton) {
        budgetsTabButton.addEventListener('shown.bs.tab', () => {
            populateUserSelect();
            populateBudgetItemProductSelect();
            loadBudgets();
            budgetForm.reset();
            budgetIdInput.value = '';
            currentBudgetItems = []; // Limpa itens do orçamento ao trocar de aba
            renderBudgetItemTable();
        });
    }

    // --- Inicialização dos componentes de abas do Bootstrap ---
    // Isso garante que os listeners de clique do Bootstrap sejam ativados.
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach(button => {
        const tab = new bootstrap.Tab(button);
        // Opcional: Ativar a aba de Usuários explicitamente ao carregar
        if (button.id === 'users-tab-button') {
            tab.show();
        }
    });

    // --- Inicialização dos dados ao carregar a página ---
    loadUsers(); // Carrega os usuários ao carregar a página
    loadSuppliers();
    loadProducts();
    loadBudgets();
    populateUserSelect();
    populateSupplierSelect();
    populateBudgetItemProductSelect();
    renderBudgetItemTable(); // Garante que a tabela de itens do orçamento esteja renderizada (vazia ou não)
});