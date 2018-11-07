
$(document).ready(function (){
  let searchTerm = document.getElementById('searchTerms').value
  let searchUrl = `https://api.github.com/search/repositories?q=${searchTerm}`
  $.get(searchUrl, searchRepositories()).fail(displayError())
});

function displayError() {

  document.getElementById('errors').innerHTML = "I'm sorry, there's been an error. Please try again."
}

function searchRepositories() {
  let searchTerms = document.getElementById('searchTerms').value
  console.log(searchTerms)
  const req = new XMLHttpRequest()
  req.addEventListener('load', displayRepositories)
  req.open('GET', `https://api.github.com/search/repositories?q=${searchTerms}`)
  req.send()
}

function displayRepositories() {

  const repos = JSON.parse(this.responseText)
  console.log(repos)
  repoList = `<ul>${repos.items.map(
    r=> '<li>' +
    '<h2><a href="'+r.html_url+'">'+ r.name + '</a></h2>'+
    '<section>'+
      '<header><h4>Created By: '+ r.owner.login +'</h4></header>'+
      '<img src="'+ r.owner.avatar_url + '" height="32" width="32">'+
    '</section>'+
    '<p>' + r.description + '</p>'+
    '<p><a href="#" data-repository="'+r.name + '" data-owner="'+r.owner.login+'" onclick="showCommits(this)">Show Commits</a></p>'+
    '</li>'
  ).join('')}</ul>`

  document.getElementById('results').innerHTML = repoList
}

function showCommits(element) {
  let repository = element.dataset.repository
  let owner = element.dataset.owner

  const req = new XMLHttpRequest()
  req.addEventListener('load', displayCommits)
  req.open('GET', `https://api.github.com/repos/${owner}/${repository}/commits`)
  req.send()
}

function displayCommits() {
  const commits = JSON.parse(this.responseText)

  const commitsList = `<ul>${commits.map(c=>
    '<li>'+
      '<h3>'+c.author.login+ ' - '+c.commit.author.name+'</h3>'+
      '<h4>SHA: '+c.sha+'</h4>'+
      '<img src="'+c.author.avatar_url + '" height="30" width="30">'+
    '</li>'
  ).join('')}</ul>`

  document.getElementById('details').innerHTML= commitsList
}
