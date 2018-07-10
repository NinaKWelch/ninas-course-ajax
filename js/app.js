
(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

		/* UNSPLASH */
	    // instialize the XMLHttpRequest (must be called before any other method calls)
		const unsplashRequest = new XMLHttpRequest();

		// load the request if successful
		unsplashRequest.onload = addImage;

		// show error message if request unsuccessful
		unsplashRequest.onerror = function(err) {
			requestedError(err, 'image');
		};

		// call the open method to get a photo that relates to the search term
		unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);

		// setRequestHeader method, needed for unsplash requests
		unsplashRequest.setRequestHeader('Authorization', 'Client-ID c2527a62971ea8d537f44eac3b6397bf9e88ea4ada8400131d3bcfd22481c0c7');

		// send the request (must have an onload method to handle the suuceesful response)
		unsplashRequest.send();

		/* NYT */
		// instialize the XMLHttpRequest (must be called before any other method calls)
		const articleRequest = new XMLHttpRequest();

		// load the request if successful
		articleRequest.onload = addArticles;

		// show error message if request unsuccessful
		articleRequest.onerror = function(err) {
			requestedError(err, 'articles');
		};

		// call the open method to get an article that relates to the search term
		articleRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=68bec75cdab74728b85e1e916a9ba0c5`);

		// send the request (must have an onload method to handle the suuceesful response)
		articleRequest.send();


		// Function for adding images
		function addImage(){
			let htmlContent = '';
			const data = JSON.parse(this.responseText);

			if (data && data.results && data.results[0]) {
			    const firstImage = data.results[0];
			    htmlContent = '<figure><img src="${firstImage.urls.regular}" alt="${searchedForText}"><figcaption>${searchedForText} by ${firstImage.user.name}</figcaption></figure>';
			} else {
				htmlContent = '<div class="error-no-image">No images available</div>'
			}
			responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
		}


		// Function for adding articles
		function addArticles () {
			let htmlContent = '';
			const data = JSON.parse(this.responseText);

			if (data.response && data.response.docs && data.response.docs.length > 1) {
				htmlContent = '<ul>' + data.response.docs.map(article => '<li class="article"><h2><a href="${article.web_url}">${article.headline.main}</a></h2><p>${article.snippet}</p></li>').join('') + '</ul>';
			} else {
				htmlContent = '<div class="error-no-articles">No articles available</div>'
			}
			responseContainer.insertAdjacentHTML('beforeend', htmlContent);
		}
	});
})();


/*



*/