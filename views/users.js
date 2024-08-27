const form = document.getElementById('signupForm');
let signup = false;

function getSignUpLoginData() {
    const signUpFormValues = {};
    const formElements = signup ? document.forms[0].elements : document.forms[1].elements;
    
    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (element.type !== 'submit') {
            signUpFormValues[element.name] = element.value;
        }
    }
    return signUpFormValues;
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    signup = true;
    const signupFormData = getSignUpLoginData();
    form.reset();
    
    try {
        const res = await axios.post('http://localhost:3000/register', signupFormData);
        alert(res.data.message); 
    } catch (err) {
       
        alert(err.response?.data?.message || 'An error occurred');
    }
});

const login = document.getElementById('loginForm');

login.addEventListener('submit', async function(e) {
    e.preventDefault();
    signup = false;
    const loginFormData = getSignUpLoginData();
    login.reset();
    
    try {
        const res = await axios.post('http://localhost:3000/login', loginFormData);
        alert(`Hello, ${res.data.user.email}`);
        localStorage.setItem('token', res.data.token);
        window.location.href = '/views/product.html';
    } catch (err) { 
        
        alert(err.response?.data?.message || 'An error occurred');
    }
});
