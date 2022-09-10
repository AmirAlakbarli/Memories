const list = document.querySelector(".cards");
const createBtn = document.querySelector(".create");
const deleteBtns = document.querySelectorAll(".delete");
const delModal = document.querySelector(".delModal");
const yesBtn = document.querySelector(".yes");
const noBtn = document.querySelector(".no");
const addModal = document.querySelector(".addModal");
const form = document.querySelector(".addCard form");
const okBtn = form.querySelector(".ok");
const inputs = form.querySelectorAll("div>input");
const genders = form["gender"];
const story = form["story"];
const confirmDel = document.querySelector(".confirmDel");
let cards = [];
let newCard = {};

const url = "https://card-memories.herokuapp.com/memories/cards";


// common changes toggling modal elements
function tglModal() {
  createBtn.classList.toggle("clsBackcol");

  const cards = document.querySelectorAll(".card");
  const deleteBtns = document.querySelectorAll(".delete");

  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.classList.toggle("clsBackcol");
  });
  cards.forEach((card) => {
    card.classList.toggle("clsCardShdw");
  });
}

// events when click yesBtn or noBtn
yesBtn.addEventListener("click", () => {
  tglModal();
  delModal.classList.toggle("tglModal");
});
noBtn.addEventListener("click", () => {
  tglModal();
  delModal.classList.toggle("tglModal");
});


//add cards to DOM
function card(el) {
  return `<li class="card ${el.gender}col" data-id="${el._id}">
  <p class="name">Name:${el.name}</p>
  <p class="surname">Surname:${el.surname}</p>
  <p class="title">Title:${el.title}</p>
  <p class="story">Story:${el.story}</p>
  <button class="delete">Delete</button>
  </li>`;
}

const getCards = async () => {
  let response = await fetch(url);
  cards = await response.json();
  try {
    cards.forEach((el) => {
      list.innerHTML += card(el);
    });
    Delete();
  } catch (error) {
    console.log(error);
  }
};
getCards();


let selectedElement; //take instance of deleted item

//remove Card from memory and DOM
async function remove() {
  try {
    await fetch(
      `${url}/${selectedElement.parentElement.getAttribute("data-id")}`,
      {
        method: "DELETE",
      }
    );
    selectedElement.parentElement.remove();
  } catch (err) {
    console.log(err);
  }
}

// add function to all delete buttons
function Delete() {
  const deleteBtns = document.querySelectorAll(".delete");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", function () {
      tglModal();
      delModal.classList.toggle("tglModal");
      selectedElement = deleteBtn;
      yesBtn.removeEventListener("click", remove);
      yesBtn.addEventListener("click", remove);
    });
  });
}



createBtn.onclick = () => {
  addModal.classList.toggle("tglModal");
  tglModal();
};

window.onclick = function (event) {
  if (event.target == addModal || event.target == delModal) {
    addModal.classList.remove("tglModal");
    delModal.classList.remove("tglModal");
    tglModal();
  }
};

// radio buttons for genders
genders.forEach((gender) => {
  gender.addEventListener("click", (e) => {
    let radio = e.target;
    if (radio.getAttribute("data-waschecked") == "true") {
      radio.checked = false;
      radio.setAttribute("data-waschecked", false);
    } else radio.setAttribute("data-waschecked", true);

    const genders1 = form["gender"];
    genders1.forEach((gender) => {
      if (gender != e.target) {
        gender.setAttribute("data-waschecked", false);
      }
    });
  });
});



// validate inside of inputs of form
function validateForm() {
  if (
    Array.from(genders).find((gender) => gender.checked) &&
    Array.from(inputs).every((input) => input.value) &&
    story.value
  )
    return true;
  else return false;
}

// validate for OK button with validateForm
function commonValidate() {
  if (validateForm()) okBtn.classList.add("activeOk");
  else okBtn.classList.remove("activeOk");
}

form.addEventListener("input", () => {
  commonValidate();
});

form.addEventListener("click", () => {
  commonValidate();
});

//find checked genders
function sendGender(genders) {
  return Array.from(genders).find((gender) => gender.checked);
}

//add card
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  addModal.classList.toggle("tglModal");
  tglModal();
  if (validateForm()) {
    newCard.name = form["name"].value;
    newCard.surname = form["surname"].value;
    newCard.gender = sendGender(genders).id;
    newCard.title = form["title"].value;
    newCard.story = story.value;
  }
  try {
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(newCard),
    });

    let newData = await data.json();
    list.innerHTML += card(newData);

    Delete();
  } catch (error) {
    console.log(error);
  }
});