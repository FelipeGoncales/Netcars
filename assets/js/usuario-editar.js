document.getElementById("date-input").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    if (value.length > 8) value = value.slice(0, 8); // Limita a 8 dígitos (DDMMAAAA)

    let formattedValue = "";
    if (value.length > 4) {
        formattedValue = `${value.slice(0,2)}/${value.slice(2,4)}/${value.slice(4,8)}`;
    } else if (value.length > 2) {
        formattedValue = `${value.slice(0,2)}/${value.slice(2,4)}`;
    } else {
        formattedValue = value;
    }

    e.target.value = formattedValue;
});

document.querySelectorAll('.container-input').forEach(container => {
    const input = container.querySelector('input');
    const label = container.querySelector('label');

    input.addEventListener('input', function() {
        if (this.value.trim() !== "") {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
});

// Formatação do Telefone
document.getElementById("telefone").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    
    let formatted = '';
    if (value.length > 0) {
        if (value.length <= 2) {
            formatted = value;
        } else {
            formatted = `(${value.substring(0,2)}) `;
            value = value.substring(2);
            if (value.length > 5) {
                formatted += `${value.substring(0,5)}-${value.substring(5,9)}`;
            } else {
                formatted += value;
            }
        }
    }
    e.target.value = formatted;
});

function validarCPF(cpf) {
cpf = cpf.replace(/\D/g, '');
if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

let soma = 0;
for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
let resto = (soma * 10) % 11;
if (resto === 10 || resto === 11) resto = 0;
if (resto !== parseInt(cpf.charAt(9))) return false;

soma = 0;
for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
resto = (soma * 10) % 11;
if (resto === 10 || resto === 11) resto = 0;
return resto === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj) {
cnpj = cnpj.replace(/\D/g, '');
if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

const pesos = [5,4,3,2,9,8,7,6,5,4,3,2];
let soma = pesos.reduce((acc, peso, i) => acc + (parseInt(cnpj.charAt(i)) * peso), 0);
let resto = soma % 11;
let digito1 = resto < 2 ? 0 : 11 - resto;
if (digito1 !== parseInt(cnpj.charAt(12))) return false;

pesos.unshift(6);
soma = pesos.reduce((acc, peso, i) => acc + (parseInt(cnpj.charAt(i)) * peso), 0);
resto = soma % 11;
let digito2 = resto < 2 ? 0 : 11 - resto;
return digito2 === parseInt(cnpj.charAt(13));
}

// Formatação e validação do CPF/CNPJ
document.getElementById("cpf").addEventListener("input", function(e) {
let value = e.target.value.replace(/\D/g, '');
let originalLength = value.length;
let isCNPJ = value.length > 11;

// Formatação
let formatted = value;
if (isCNPJ) {
    formatted = value.substring(0, 14);
    formatted = formatted
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
} else {
    formatted = value.substring(0, 11);
    formatted = formatted
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

e.target.value = formatted;

// Validação
const rawValue = formatted.replace(/\D/g, '');
const isValid = rawValue.length === 11 ? validarCPF(formatted) : 
               rawValue.length === 14 ? validarCNPJ(formatted) : false;

// Feedback visual
if (rawValue.length >= 11 && !isValid) {
    e.target.style.borderColor = '#ff0000';
} else if (isValid) {
    e.target.style.borderColor = '#00ff00';
} else {
    e.target.style.borderColor = '#AEAEBA';
}
});