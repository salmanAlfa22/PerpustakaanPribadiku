const KEY = 'rak-bukuku';
const LABEL = { want: 'Ingin dibaca', reading: 'Sedang dibaca', done: 'Selesai' };
let books = [];
let filter = 'all';

try { books = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { books = []; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(books)); } catch (e) {} };
const $ = s => document.querySelector(s);

function render() {
  ['all', 'reading', 'want', 'done'].forEach(s => {
    $('#c-' + s).textContent = s === 'all' ? books.length : books.filter(b => b.status === s).length;
  });
  const shown = filter === 'all' ? books : books.filter(b => b.status === filter);
  const list = $('#list');
  list.innerHTML = '';
  if (!shown.length) {
    list.innerHTML = '<p class="empty">' + (books.length ? 'Belum ada buku di rak ini.' : 'Rakmu masih kosong. Tambahkan buku pertamamu di atas!') + '</p>';
    return;
  }
  shown.forEach(b => {
    const li = document.createElement('li');
    li.className = b.status;

    const info = document.createElement('div');
    info.className = 'info';
    const t = document.createElement('b'); t.textContent = b.judul;
    const a = document.createElement('span'); a.textContent = b.penulis || 'Penulis tidak diketahui';
    info.append(t, a);
    if (b.catatan) { const n = document.createElement('em'); n.textContent = b.catatan; info.append(n); }

    const sel = document.createElement('select');
    Object.entries(LABEL).forEach(([k, v]) => {
      const o = new Option(v, k, false, b.status === k);
      sel.add(o);
    });
    sel.onchange = () => { b.status = sel.value; save(); render(); };

    const del = document.createElement('button');
    del.className = 'del'; del.title = 'Hapus'; del.textContent = '🗑️';
    del.onclick = () => {
      if (confirm('Hapus "' + b.judul + '" dari rak?')) {
        books = books.filter(x => x.id !== b.id); save(); render();
      }
    };

    li.append(info, sel, del);
    list.append(li);
  });
}

$('#form').onsubmit = e => {
  e.preventDefault();
  const judul = $('#judul').value.trim();
  if (!judul) return;
  books.unshift({
    id: Date.now(),
    judul,
    penulis: $('#penulis').value.trim(),
    status: $('#status').value,
    catatan: $('#catatan').value.trim()
  });
  save();
  e.target.reset();
  $('#judul').focus();
  render();
};

$('#tabs').onclick = e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  filter = btn.dataset.s;
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b === btn));
  render();
};

render();