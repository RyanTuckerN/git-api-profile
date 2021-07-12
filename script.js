const content = document.querySelectorAll("div")[0]
const profile = document.querySelector("#profile")
const avatar = profile.querySelector("img")
const name = profile.querySelector("h4")
const link = profile.querySelector("a")
const statsList = document.querySelector("#stats")
const stats = statsList.querySelectorAll("li")
const cardContainer = document.querySelector(".card-container")
const showAll = document.querySelector("#show-all")

content.style.display = "none"
showAll.style.display = "none"
const titleMassage = (str) =>
  str
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
const copyCloneLink = (e) => {
  console.log(e)
}

const userNamePrompt = prompt("Please enter your GitHub profile name")

const fetchAndDisplay = (userName) => {
  fetch(`https://api.github.com/users/${userName}`)
    .then((data) => data.json())
    .then((data) => {
      content.style.display = "block"
      console.log(data)
      avatar.src = data.avatar_url
      avatar.alt = `Profile avatar for ${data.login}`
      name.innerText = `${data.name ? data.name : data.login}`
      link.href = data.html_url
      link.innerText = "GitHub Profile"
      stats[0].childNodes[1].innerText = data.public_repos
      stats[1].childNodes[1].innerText = data.followers
      stats[1].childNodes[3].innerHTML =
        data.followers === 1 ? "Follower" : "Followers"
      stats[2].childNodes[1].innerText = data.following
    })

  fetch(`https://api.github.com/users/${userName}/repos`)
    .then((data) => data.json())
    .then((data) => {
      console.log(data)
      if (data.length > 4) showAll.style.display = "block"

      //first 4 cards :
      for (let i = 0; i < (data.length < 4 ? data.length : 4); i++) {
        const card = document.createElement("div")
        card.setAttribute(
          "style",
          "width: 14rem; height: 15rem; margin: 15px; overflow: auto"
        )
        card.classList.add("card")
        card.innerHTML = `<div
            class="card-body d-flex flex-column align-items-center justify-content-center"
          >
            <h5 class="card-title">${titleMassage(data[i].name)}</h5>
            <h6 class="card-subtitle mb-2 text-muted"  >${
              data[i].description ? data[i].description : ""
            }</h6>
            <div class="card-links d-flex" style="margin-top: 2rem">
              <p class="card-link"  data-clone="${
                data[i].clone_url
              }">Clone HTTPS</p>
              <a href="${
                data[i].html_url
              }" class="card-link" target = "_blank">Repo Link</a>
            </div>
          </div>`
        cardContainer.appendChild(card)
      }
      const displayRest = () => {
        for (let i = 4; i < data.length; i++) {
          const card = document.createElement("div")
          card.setAttribute(
            "style",
            "width: 14rem; height: 15rem; margin: 15px; overflow: auto"
          )
          card.classList.add("card")
          card.innerHTML = `<div
            class="card-body d-flex flex-column align-items-center justify-content-center"
          >
            <h5 class="card-title">${titleMassage(data[i].name)}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${
              data[i].description ? data[i].description : ""
            }</h6>
            <div class="card-links d-flex" style="margin-top: 2rem">
              <p class="card-link" data-clone="${
                data[i].clone_url
              }">Clone HTTPS</p>
              <a href="${
                data[i].html_url
              }" class="card-link" target = "_blank">Repo Link</a>
            </div>
          </div>`
          cardContainer.appendChild(card)
        }
      }

      showAll.addEventListener("click", displayRest)
      document.addEventListener("click", (e) => {
        if (e.target.outerText === "Clone HTTPS") {
          document.execCommand("copy")
        }
      })
      document.addEventListener("copy", (e) => {
        e.preventDefault()
        if (e.target.outerText === "Clone HTTPS" && e) {
          event.clipboardData.setData(
            "text/plain",
            e.path[0].dataset.clone
          )
        }
      })
    })
}

fetchAndDisplay(userNamePrompt)