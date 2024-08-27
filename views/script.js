const BASE_URL = "http://localhost:3000";

function showSection(section) {
  document
    .querySelectorAll(".section")
    .forEach((sec) => (sec.style.display = "none"));
  document.getElementById(section).style.display = "block";
}
document.getElementById("products").style.display = "block";

async function fetchProducts() {
  try {
    const res = await axios.get(`${BASE_URL}/product`);
    const products = res.data.products;
    console.log(products);

    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";
      productDiv.innerHTML = `
        <img src="${product.imageUrl}" alt="Product Image" 
        style="
        width: 100%; 
        height: auto; 
        object-fit: cover; 
        max-height: 150px; 
        border-radius: 8px 8px 0 0;
      " 
        >
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>Price: Rs. ${product.price}</p>
        <button onclick="addToCart('${product._id}')">Add to Cart</button>
      `;
      productList.appendChild(productDiv);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Add product to cart
async function addToCart(productId) {
  try {
    const res = await axios.post(
      `${BASE_URL}/cart`,
      { productId, quantity: 1 },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    alert("Product added to cart!");
    fetchCart();
  } catch (err) {
    alert(err.response ? err.response.data.message : "Error adding product to cart.");
  }
}

// Fetch and render cart
async function fetchCart() {
  try {
    const res = await axios.get(`${BASE_URL}/cart/lists`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    const cartItems = res.data.cart.items;

    const cartList = document.getElementById("cartList");
    cartList.innerHTML = ""; 

    cartItems.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.className = "cart-item";
      cartItemDiv.innerHTML = `
        <img src="${item.product.imageUrl}" alt="Product Image" 
        style="
        width: 100%; 
        height: auto; 
        object-fit: cover; 
        max-height: 150px; 
        border-radius: 8px 8px 0 0;
      " 
        >
        <h3>${item.product.title}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: Rs. ${item.product.price}</p>
      `;
      cartList.appendChild(cartItemDiv);
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}

async function checkout() {
  const shippingAddress = prompt("Please enter your shipping address:");
  if (!shippingAddress) return alert("Shipping address is required!");

  try {
    await axios.post(
      `${BASE_URL}/checkout`,
      { shippingAddress },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    fetchCart();
    await axios.get(
      `${BASE_URL}/send-email`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    alert("Checkout successful and also email has been sent!");
  } catch (error) {
    alert(error.response ? error.response.data.message : "Error during checkout.");
  }
}

const form = document.getElementById("addProductForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("productTitle").value;
    const description = document.getElementById("productDescription").value;
    const price = document.getElementById("productPrice").value;
    const image = document.getElementById("productImage").files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      await axios.post(`${BASE_URL}/product`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");
      form.reset();
      fetchProducts();
    } catch (error) {
      alert(error.response ? error.response.data.message : "Error adding product.");
    }
  });

// Check if user is admin
async function checkAdmin() {
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const user = res.data.user;
    if (user.role === 'admin') {
      document.getElementById("adminAddProductMenu").style.display = "block";
    }

  } catch (error) {
    console.error("Error checking admin status:", error);
  }
}

// Logout function
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    localStorage.removeItem('token');
    window.location.href = '/views/index.html';
  } catch (error) {
    console.error('Error during logout:', error);
    alert('Failed to log out. Please try again.');
  }
});

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  fetchCart();
  checkAdmin();
});
