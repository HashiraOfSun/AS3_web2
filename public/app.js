const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const refreshBtn = document.getElementById("refreshBtn");

const createForm = document.getElementById("createForm");
const titleEl = document.getElementById("title");
const authorEl = document.getElementById("author");
const bodyEl = document.getElementById("body");
const createMsg = document.getElementById("createMsg");

const editDialog = document.getElementById("editDialog");
const editId = document.getElementById("editId");
const editTitle = document.getElementById("editTitle");
const editAuthor = document.getElementById("editAuthor");
const editBody = document.getElementById("editBody");
const saveBtn = document.getElementById("saveBtn");
const editMsg = document.getElementById("editMsg");

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data && data.error ? data.error : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function setMsg(el, text, ok = true) {
  el.textContent = text || "";
  el.style.color = ok ? "#cfd3d8" : "#ff6b6b";
  if (text) setTimeout(() => (el.textContent = ""), 2500);
}

function render(blogs) {
  listEl.innerHTML = "";
  if (!blogs || blogs.length === 0) {
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";

  for (const b of blogs) {
    const item = document.createElement("div");
    item.className = "item";

    const h3 = document.createElement("h3");
    h3.textContent = b.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `by ${b.author || "Anonymous"} • created ${formatDate(b.createdAt)} • updated ${formatDate(b.updatedAt)}`;

    const body = document.createElement("div");
    body.className = "body";
    body.textContent = b.body;

    const btns = document.createElement("div");
    btns.className = "btns";

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.addEventListener("click", () => openEdit(b));

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "secondary";
    del.addEventListener("click", () => remove(b._id));

    btns.appendChild(edit);
    btns.appendChild(del);

    item.appendChild(h3);
    item.appendChild(meta);
    item.appendChild(body);
    item.appendChild(btns);

    listEl.appendChild(item);
  }
}

async function load() {
  const blogs = await api("/blogs");
  render(blogs);
}

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const payload = {
      title: titleEl.value.trim(),
      body: bodyEl.value.trim(),
    };
    const a = authorEl.value.trim();
    if (a) payload.author = a;

    await api("/blogs", { method: "POST", body: JSON.stringify(payload) });

    titleEl.value = "";
    bodyEl.value = "";
    authorEl.value = "";
    setMsg(createMsg, "Created ✅");
    await load();
  } catch (err) {
    setMsg(createMsg, err.message, false);
  }
});

refreshBtn.addEventListener("click", async () => {
  try {
    await load();
  } catch (err) {
    alert(err.message);
  }
});

function openEdit(blog) {
  editMsg.textContent = "";
  editId.value = blog._id;
  editTitle.value = blog.title || "";
  editAuthor.value = blog.author || "";
  editBody.value = blog.body || "";
  editDialog.showModal();
}

saveBtn.addEventListener("click", async () => {
  try {
    const id = editId.value;
    const payload = {
      title: editTitle.value.trim(),
      body: editBody.value.trim(),
      author: editAuthor.value.trim() || "Anonymous",
    };
    await api(`/blogs/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    setMsg(editMsg, "Saved ✅");
    setTimeout(() => editDialog.close(), 400);
    await load();
  } catch (err) {
    setMsg(editMsg, err.message, false);
  }
});

async function remove(id) {
  const ok = confirm("Delete this post?");
  if (!ok) return;
  try {
    await api(`/blogs/${id}`, { method: "DELETE" });
    await load();
  } catch (err) {
    alert(err.message);
  }
}

load().catch((err) => alert(err.message));
