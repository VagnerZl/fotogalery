let maxImageCount = 9;

function categoryList() {
  var categoryListRef = firebase.database().ref();

  categoryListRef.on("value", (snapshot) => {
    const data = snapshot.val();
    let categoryList;
    categoryList = Object.keys(data);

    let select = document.querySelector(".select");
    categoryList.forEach((item) => {
      let option = document.createElement("option");
      option.value = `${item}`;
      option.innerHTML = `${item}`;
      select.append(option);
    });
  });
}

categoryList();

let selected;

function select() {
  let select = document.querySelector(".select");
  select.addEventListener("change", function (value) {
    selected = select.value;

    console.log(selected);
    createArr(selected, maxImageCount);
    return selected;
  });
  return selected;
}
console.log("выьрана", selected);
select();

function createArr(selected, maxImageCount, pageNumber = 1) {
  var ListRef = firebase
    .database()
    .ref(`${selected}/`)
    .orderByKey()
    .startAt(`${maxImageCount * pageNumber - maxImageCount}`)
    .endAt(`${maxImageCount * pageNumber - 1}`);

  ListRef.on("value", (snapshot) => {
    const dataList = snapshot.val();
    let List;
    List = dataList;

    showImage(Object.values(List));
    console.log(selected);
    pagination(selected);
  });
}

function showImage(arr) {
  let main = document.querySelector("main");
  main.innerHTML = "";
  console.log("items", Object.values(arr));
  arr.forEach((item, id) => {
    let div = document.createElement("div");
    div.className = "image";
    div.id = id;
    div.innerHTML = `<img src="${item}"  alt="альтернативный текст">`;
    main.append(div);
    div.addEventListener("click", function (event) {
      ModalWindow(event.currentTarget.id, arr);
    });
  });
}

function ModalWindow(i, arr) {
  let modalOverview = document.createElement("div");
  modalOverview.className = "modal-overview";
  document.body.append(modalOverview);

  let modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `<img src="${arr[i]}"  alt="альтернативный текст">`;
  modalOverview.append(modal);

  let close = document.createElement("div");
  close.innerHTML = `<img src="1.png"  alt="альтернативный текст">`;
  close.className = "modal-close";
  modal.append(close);

  close.addEventListener("click", function (event) {
    modal.remove();
    modalOverview.remove();
  });
}

async function pagination(nameCategory) {
  let url = `https://new-galery-db13c-default-rtdb.firebaseio.com/${nameCategory}.json?shallow=true`;
  let response = await fetch(url);

  let json = await response.json();
  let count = Object.keys(json).length;
  console.log(count);
  function createPages(count, maxImageCount) {
    let footer = document.querySelector("footer");
    footer.innerHTML = ``;
    let numberOfPage;
    if (count % maxImageCount > 0) {
      numberOfPage = count / maxImageCount + 1;
    } else {
      numberOfPage = count / maxImageCount;
    }
    for (let i = 1; i <= numberOfPage; i++) {
      let page = document.createElement("button");
      page.className = "page";
      page.id = `${i}`;
      page.textContent = `${i}`;
      footer.append(page);
      console.log(i, footer, page);
      page.addEventListener("click", function () {
        console.log("page", typeof +page.id);
        createArr(selected, maxImageCount, +page.id);
      });
    }
  }
  createPages(count, maxImageCount);
}
