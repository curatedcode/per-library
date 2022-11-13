
const addBook = document.getElementById('add-book')
addBook.addEventListener('click', e => {
    triggerBookForm(e)
})

const modal = document.getElementsByClassName('modal')
const modalContent = document.getElementsByClassName('modal-content')
const titleInput = document.getElementsByClassName('title-input')
const authorInput = document.getElementsByClassName('author-input')
const sumInput = document.getElementsByClassName('sum-input')
const readInput = document.getElementsByClassName('read-status')
const currPageInput = document.getElementsByClassName('curr-page-input')
const coverInput = document.getElementsByClassName('cover-input')
const submitNewBook = document.getElementById('submit-button')
submitNewBook.addEventListener('click', addBookToLibrary)
const closeForm = document.getElementsByClassName('close-button')
closeForm[0].addEventListener('click', e => {
    triggerBookForm(e)
})

const nextBook = document.getElementById('next-book')
nextBook.addEventListener('click', e => {
    switchBook(e)
})
const prevBook = document.getElementById('prev-book')
prevBook.addEventListener('click', e =>{
    switchBook(e)
})
const mainPage = document.getElementById('book-display')
const titleEl = document.getElementById('book-title')
const authEl = document.getElementById('book-auth')
const descEl = document.getElementById('book-desc')
const readEl = document.getElementById('book-read')
const pageEl = document.getElementById('book-page')

const editSumBtn = document.getElementById('edit-sum-btn')
editSumBtn.addEventListener('click', editSummary)
const saveSumBtn = document.getElementById('save-sum-btn')
saveSumBtn.addEventListener('click', updateSum)

const sumEl = document.getElementById('book-sum')
const coverEl = document.getElementById('book-cover')
const defaultSummary = 'Your summary is empty. Click the edit button the add your own thoughts on the book!'

let libNum = 0

async function getPicData (){
    const picResponse = await fetch('./library.json')
    const picData = await picResponse.json()
    const bookCover = picData[libNum].cover
    coverEl.src = bookCover
}

async function getData(){
    const response = await fetch('./library.json')
    const data = await response.json()
    const titleData = data[libNum].title
    titleEl.append(titleData)
    const authData = data[libNum].author
    authEl.append(authData)
    const descData = data[libNum].desc
    descEl.append(descData)
    const readData = data[libNum].read
    readEl.append(`Read: ${readData}`)
    const pageData = data[libNum].page
    if(readData == 'Yes'){
        pageEl.append(`Current Page: ${pageData}`)
    }
    const sumData = data[libNum].summary
    sumEl.append(sumData)
}

async function switchBook(e){
    const response = await fetch('./library.json')
    const data = await response.json()
    const dataLength = Object.keys(data).length
    if (e.target.id == 'prev-book'){
        libNum -= 1
    } else if (e.target.id == 'next-book'){
        libNum += 1
    }
    if (mainPage.classList == 'shake-on-click'){
        mainPage.classList.remove('shake-on-click')
    }
    if (libNum < 0) {
        libNum += 1
        mainPage.classList.add('shake-on-click')
    } else if (libNum >= dataLength){
        libNum -= 1
        mainPage.classList.add('shake-on-click')
    } else {
        titleEl.textContent = ''
        authEl.textContent= ''
        descEl.textContent= ''
        readEl.textContent= ''
        pageEl.textContent= ''
        sumEl.textContent= ''
        coverEl.src = ''
        getData()
        getPicData()
    }
}

function editSummary(){
    sumEl.removeAttribute('readonly')
    sumEl.classList.add('book-sum-editing')
    editSumBtn.classList.add('hide')
    saveSumBtn.classList.remove('hide')
}

function updateSum(){
    if (sumEl.classList == 'shake-on-click'){
        sumEl.classList.remove('shake-on-click')
    }
    saveSumBtn.classList.add('hide')
    editSumBtn.classList.remove('hide')
    sumEl.classList.remove('book-sum-editing')
    const sumSignal = true
    const summary = sumEl.value
    const data = {libNum,summary,sumSignal}
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch('./', options, (err) => {
        console.log(err)
    })   
}

function triggerBookForm(e){
    if (e.target == addBook){
        // modal[0].classList.remove('hide')
        modal[0].classList.add('show-modal')
    } else if (e.target == closeForm[0]){
        modal[0].classList.remove('show-modal')
        titleInput[0].value = ''
        authorInput[0].value = ''
        sumInput[0].value = ''
        readInput[0].value = 'Choose One'
        currPageInput[0].value = ''
        coverInput[0].value = ''
    }
}

async function addBookToLibrary(){
    const response = await fetch('./library.json')
    const data = await response.json()
    const id = Object.keys(data).length
    const title = titleInput[0].value
    const author = authorInput[0].value
    const desc = sumInput[0].value
    const read = readInput[0].value
    const page = currPageInput[0].value
    const cover = coverInput[0].value

    if (title == '' || author == '' || desc == '' || read == 'Choose One' || cover == ''){
        alert('Please fill out all required fields')
    } else {
        const sendData = {id,title,author,read,page,desc,cover}
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify(sendData)
        }
        await fetch('./',options, (err)=>{
            console.log(err)
        })
    }
    
}

window.onload = getData()
window.onload = getPicData()