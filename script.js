const postContainer = document.getElementById('post-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');

// clientHeight:

// returns the inner height of an element in pixels, including padding but not the horizontal scrollbar height, border, or margin

// offsetHeight:

// is a measurement which includes the element borders, the element vertical padding, the element horizontal scrollbar (if present, if rendered) and the element CSS height.

// scrollHeight:

// is a measurement of the height of an element's content including content not visible on the screen due to overflow

let limit = 5;
let page = 1;

async function getPosts() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );
  const data = await res.json();
  return data;
}

async function showPost() {
  const posts = await getPosts();
  posts.forEach((post) => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
    <div class="number">${post.id}</div>
    <div class="post-info">
    <h2 class="post-title">${post.title}</h2>
    <p class="post-body">${post.body}</p>
    </div>
    `;
    postContainer.appendChild(postEl);
  });
}

const showLoading = async () => {
  loading.classList.add('show');
  const timeout = setTimeout(async () => {
    loading.classList.remove('show');
    page++;
    await showPost();
  }, 1000);
};

showPost();


const debounce = (fn,delay) => {
  let timer = null;

  return () =>  {
    if(timer) {
      clearInterval(timer)
    }
   timer = setTimeout(() => fn(),delay)
  }
}

const scrollFunction = async () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
 
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    // clientHeight == window.innerHeight
    // scrollTop == window.scrollY
    // scrollHeight = document.body.offsetHeight
    // if(window.scrollY  + window.innerHeight  >= document.body.offsetHeight - 5)

    showLoading();
  
  }
}

const newFunction = debounce(scrollFunction,1000)
window.addEventListener('scroll', newFunction);

// document.querySelector("btn").addEventListener('click',newFunction)

filter.addEventListener('input', (e) => {
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll('.post');
  posts.forEach((post) => {
    const title = post.querySelector('.post-title').innerHTML.toUpperCase();
    const body = post.querySelector('.post-body').innerHTML.toUpperCase();
    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = 'flex';
    } else {
      post.style.display = 'none';
    }
  });
});
